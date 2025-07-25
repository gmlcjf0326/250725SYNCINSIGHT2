"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "framer-motion";
import {
	Maximize2,
	Minimize2,
	RotateCcw,
	Search,
	Filter,
	Settings,
	ZoomIn,
	ZoomOut,
	Play,
	Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/chatStore";
import type { Document } from "@/types";

interface GraphNode extends d3.SimulationNodeDatum {
	id: string;
	name: string;
	type: "document" | "tag" | "folder";
	size: number;
	color: string;
	group: number;
	metadata?: any;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
	source: string | GraphNode;
	target: string | GraphNode;
	strength: number;
	type: "contains" | "tagged" | "related";
}

interface GraphData {
	nodes: GraphNode[];
	links: GraphLink[];
}

const nodeColors = {
	document: "#3B82F6",
	tag: "#10B981",
	folder: "#F59E0B",
};

const linkColors = {
	contains: "#6B7280",
	tagged: "#10B981",
	related: "#8B5CF6",
};

export default function AdvancedKnowledgeGraph({
	height = 600,
	className = "",
}: {
	height?: number;
	className?: string;
}) {
	const svgRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 800, height });
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedNodeType, setSelectedNodeType] = useState<string>("all");
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [zoomLevel, setZoomLevel] = useState(1);
	const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
	const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

	const { documents, folders, tags, getDocumentConnections } = useChatStore();

	// 그래프 데이터 생성
	const generateGraphData = (): GraphData => {
		const nodes: GraphNode[] = [];
		const links: GraphLink[] = [];

		// 문서 노드 추가
		documents.forEach((doc: Document, index) => {
			nodes.push({
				id: `doc-${doc.id}`,
				name: doc.title,
				type: "document",
				size: Math.max(20, Math.min(40, (doc.metadata?.accessCount || 0) * 2)),
				color: nodeColors.document,
				group: 1,
				metadata: doc,
			});

			// 문서-폴더 링크
			if (doc.folderId) {
				links.push({
					source: `folder-${doc.folderId}`,
					target: `doc-${doc.id}`,
					strength: 0.8,
					type: "contains",
				});
			}

			// 문서-태그 링크
			doc.tags.forEach((tagId) => {
				links.push({
					source: `tag-${tagId}`,
					target: `doc-${doc.id}`,
					strength: 0.6,
					type: "tagged",
				});
			});

			// 문서 간 관계 링크
			doc.relationships.forEach((rel) => {
				links.push({
					source: `doc-${doc.id}`,
					target: `doc-${rel.targetDocumentId}`,
					strength: rel.strength,
					type: "related",
				});
			});
		});

		// 폴더 노드 추가
		folders.forEach((folder) => {
			nodes.push({
				id: `folder-${folder.id}`,
				name: folder.name,
				type: "folder",
				size: 30,
				color: folder.color,
				group: 2,
				metadata: folder,
			});
		});

		// 태그 노드 추가
		tags.forEach((tag) => {
			nodes.push({
				id: `tag-${tag.id}`,
				name: tag.name,
				type: "tag",
				size: Math.max(15, Math.min(35, tag.count * 3)),
				color: tag.color,
				group: 3,
				metadata: tag,
			});
		});

		return { nodes, links };
	};

	// 필터링된 데이터
	const getFilteredData = (): GraphData => {
		const data = generateGraphData();

		if (searchQuery || selectedNodeType !== "all") {
			const filteredNodes = data.nodes.filter((node) => {
				const matchesSearch =
					!searchQuery ||
					node.name.toLowerCase().includes(searchQuery.toLowerCase());
				const matchesType =
					selectedNodeType === "all" || node.type === selectedNodeType;
				return matchesSearch && matchesType;
			});

			const nodeIds = new Set(filteredNodes.map((n) => n.id));

			// 필터링 시 선택된 노드가 필터 결과에 없으면 초기화
			if (selectedNode && !nodeIds.has(selectedNode.id)) {
				setSelectedNode(null);
			}
			if (hoveredNode && !nodeIds.has(hoveredNode.id)) {
				setHoveredNode(null);
			}

			const filteredLinks = data.links.filter(
				(link) =>
					nodeIds.has(
						typeof link.source === "string" ? link.source : link.source.id!
					) &&
					nodeIds.has(
						typeof link.target === "string" ? link.target : link.target.id!
					)
			);

			return { nodes: filteredNodes, links: filteredLinks };
		}

		return data;
	};

	// D3 시뮬레이션 설정
	useEffect(() => {
		if (!svgRef.current) return;

		const svg = d3.select(svgRef.current);
		const container = d3.select(containerRef.current);

		// 컨테이너 크기 업데이트
		const updateDimensions = () => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				setDimensions({
					width: rect.width,
					height: isFullscreen ? window.innerHeight - 100 : height,
				});
			}
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);

		return () => window.removeEventListener("resize", updateDimensions);
	}, [height, isFullscreen]);

	// 그래프 렌더링
	useEffect(() => {
		if (!svgRef.current) return;

		const svg = d3.select(svgRef.current);
		const { width, height } = dimensions;

		// SVG 크기 설정
		svg.attr("width", width).attr("height", height);

		// 기존 내용 제거
		svg.selectAll("*").remove();

		const data = getFilteredData();
		if (data.nodes.length === 0) return;

		// 줌 동작 설정
		const zoom = d3
			.zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.1, 4])
			.on("zoom", (event) => {
				g.attr("transform", event.transform);
				setZoomLevel(event.transform.k);
			});

		svg.call(zoom);

		// 메인 그룹
		const g = svg.append("g");

		// 시뮬레이션 설정
		const simulation = d3
			.forceSimulation<GraphNode>(data.nodes)
			.force(
				"link",
				d3
					.forceLink<GraphNode, GraphLink>(data.links)
					.id((d) => d.id!)
					.distance((d) => 120 + (1 - d.strength) * 20) // Reduced from 80 + 40
					.strength((d) => d.strength * 0.9) // Increased strength
			)
			.force("charge", d3.forceManyBody().strength(-150)) // Reduced repulsion from -300
			.force("center", d3.forceCenter(width / 2, height / 2).strength(0.1)) // Added strength to center force
			.force(
				"collision",
				d3.forceCollide().radius((d) => (d as any).size + 3)
			) // Reduced collision radius
			.force("x", d3.forceX(width / 2).strength(0.05)) // Added x-axis force to prevent spreading
			.force("y", d3.forceY(height / 2).strength(0.05)); // Added y-axis force to prevent spreading

		// 링크 렌더링
		const links = g
			.append("g")
			.attr("class", "links")
			.selectAll("line")
			.data(data.links)
			.enter()
			.append("line")
			.attr("stroke", (d) => linkColors[d.type])
			.attr("stroke-opacity", 0.6)
			.attr("stroke-width", (d) => Math.max(1, d.strength * 3))
			.attr("stroke-dasharray", (d) => (d.type === "related" ? "5,5" : "none"));

		// 노드 그룹
		const nodeGroups = g
			.append("g")
			.attr("class", "nodes")
			.selectAll("g")
			.data(data.nodes)
			.enter()
			.append("g")
			.attr("class", "node-group")
			.style("cursor", "pointer");

		// 노드 원형
		const nodes = nodeGroups
			.append("circle")
			.attr("r", (d) => d.size)
			.attr("fill", (d) => d.color)
			.attr("stroke", "#fff")
			.attr("stroke-width", 2)
			.style("filter", "drop-shadow(0px 2px 4px rgba(0,0,0,0.2))");

		// 노드 아이콘 (문서, 폴더, 태그별로 다른 모양)
		nodeGroups
			.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", "0.3em")
			.attr("font-size", (d) => Math.max(8, d.size * 0.4))
			.attr("fill", "white")
			.attr("font-weight", "bold")
			.text((d) => {
				switch (d.type) {
					case "document":
						return "📄";
					case "folder":
						return "📁";
					case "tag":
						return "#";
					default:
						return "?";
				}
			});

		// 노드 라벨
		const labels = nodeGroups
			.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", (d) => d.size + 15)
			.attr("font-size", "10px")
			.attr("fill", "#374151")
			.attr("font-weight", "500")
			.text((d) => (d.name.length > 15 ? d.name.slice(0, 15) + "..." : d.name));

		// 드래그 동작
		const drag = d3
			.drag<SVGGElement, GraphNode>()
			.on("start", (event, d) => {
				if (!event.active) simulation.alphaTarget(0.3).restart();
				d.fx = d.x;
				d.fy = d.y;
			})
			.on("drag", (event, d) => {
				d.fx = event.x;
				d.fy = event.y;
			})
			.on("end", (event, d) => {
				if (!event.active) simulation.alphaTarget(0);
				d.fx = null;
				d.fy = null;
			});

		nodeGroups.call(drag);

		// 노드 상호작용
		nodeGroups
			.on("mouseover", function (event, d) {
				setHoveredNode(d);

				// 연결된 노드와 링크 하이라이트
				const connectedNodes = new Set<string>();
				data.links.forEach((link) => {
					const sourceId =
						typeof link.source === "string" ? link.source : link.source.id!;
					const targetId =
						typeof link.target === "string" ? link.target : link.target.id!;

					if (sourceId === d.id) connectedNodes.add(targetId);
					if (targetId === d.id) connectedNodes.add(sourceId);
				});

				nodes.style("opacity", (node) =>
					node.id === d.id || connectedNodes.has(node.id) ? 1 : 0.3
				);
				links.style("opacity", (link) => {
					const sourceId =
						typeof link.source === "string" ? link.source : link.source.id!;
					const targetId =
						typeof link.target === "string" ? link.target : link.target.id!;
					return sourceId === d.id || targetId === d.id ? 1 : 0.1;
				});
			})
			.on("mouseout", function () {
				setHoveredNode(null);
				nodes.style("opacity", 1);
				links.style("opacity", 0.6);
			})
			.on("click", function (event, d) {
				setSelectedNode(d);
			});

		// 시뮬레이션 틱 이벤트
		simulation.on("tick", () => {
			links
				.attr("x1", (d) => (d.source as GraphNode).x!)
				.attr("y1", (d) => (d.source as GraphNode).y!)
				.attr("x2", (d) => (d.target as GraphNode).x!)
				.attr("y2", (d) => (d.target as GraphNode).y!);

			nodeGroups.attr("transform", (d) => `translate(${d.x},${d.y})`);
		});

		// 시뮬레이션 일시정지/재생
		if (isPaused) {
			simulation.stop();
		} else {
			simulation.restart();
		}

		return () => {
			simulation.stop();
		};
	}, [dimensions, searchQuery, selectedNodeType, isPaused]);

	const handleZoomIn = () => {
		const svg = d3.select(svgRef.current);
		const newZoom = Math.min(zoomLevel * 1.5, 4);
		setZoomLevel(newZoom);
		svg
			.transition()
			.call(d3.zoom<SVGSVGElement, unknown>().scaleTo as any, newZoom);
	};

	const handleZoomOut = () => {
		const svg = d3.select(svgRef.current);
		const newZoom = Math.max(zoomLevel / 1.5, 0.1);
		setZoomLevel(newZoom);
		svg
			.transition()
			.call(d3.zoom<SVGSVGElement, unknown>().scaleTo as any, newZoom);
	};

	const handleReset = () => {
		const svg = d3.select(svgRef.current);
		svg
			.transition()
			.call(
				d3.zoom<SVGSVGElement, unknown>().transform as any,
				d3.zoomIdentity
			);
		setZoomLevel(1);
	};

	const nodeTypeOptions = [
		{ label: "전체", value: "all" },
		{ label: "문서", value: "document" },
		{ label: "폴더", value: "folder" },
		{ label: "태그", value: "tag" },
	];

	return (
		<div
			ref={containerRef}
			className={`relative bg-white rounded-xl border shadow-sm overflow-hidden ${className} ${
				isFullscreen ? "fixed inset-4 z-50" : ""
			}`}>
			{/* 컨트롤 패널 */}
			<div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
				<div className="flex items-center space-x-3">
					{/* 검색 */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							placeholder="노드 검색..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 w-48 bg-white/90 backdrop-blur-sm"
						/>
					</div>

					{/* 타입 필터 */}
					<select
						value={selectedNodeType}
						onChange={(e) => setSelectedNodeType(e.target.value)}
						className="px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-sm">
						{nodeTypeOptions.map((option) => (
							<option
								key={option.value}
								value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				<div className="flex items-center space-x-2">
					{/* 줌 컨트롤 */}
					<div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md p-1">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleZoomOut}
							className="h-8 w-8 p-0">
							<ZoomOut className="h-4 w-4" />
						</Button>
						<span className="text-xs font-medium px-2 min-w-12 text-center">
							{Math.round(zoomLevel * 100)}%
						</span>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleZoomIn}
							className="h-8 w-8 p-0">
							<ZoomIn className="h-4 w-4" />
						</Button>
					</div>

					{/* 시뮬레이션 컨트롤 */}
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsPaused(!isPaused)}
						className="bg-white/90 backdrop-blur-sm">
						{isPaused ? (
							<Play className="h-4 w-4" />
						) : (
							<Pause className="h-4 w-4" />
						)}
					</Button>

					{/* 리셋 */}
					<Button
						variant="outline"
						size="sm"
						onClick={handleReset}
						className="bg-white/90 backdrop-blur-sm">
						<RotateCcw className="h-4 w-4" />
					</Button>

					{/* 전체화면 토글 */}
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsFullscreen(!isFullscreen)}
						className="bg-white/90 backdrop-blur-sm">
						{isFullscreen ? (
							<Minimize2 className="h-4 w-4" />
						) : (
							<Maximize2 className="h-4 w-4" />
						)}
					</Button>
				</div>
			</div>

			{/* SVG 그래프 */}
			<svg
				ref={svgRef}
				className="w-full h-full"
				style={{
					background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
				}}
			/>

			{/* 범례 */}
			<div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3">
				<h4 className="text-sm font-semibold mb-2">범례</h4>
				<div className="space-y-1">
					<div className="flex items-center space-x-2">
						<div className="w-3 h-3 rounded-full bg-blue-500"></div>
						<span className="text-xs">문서</span>
					</div>
					<div className="flex items-center space-x-2">
						<div className="w-3 h-3 rounded-full bg-green-500"></div>
						<span className="text-xs">태그</span>
					</div>
					<div className="flex items-center space-x-2">
						<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
						<span className="text-xs">폴더</span>
					</div>
				</div>
			</div>

			{/* 노드 정보 패널 */}
			<AnimatePresence>
				{(hoveredNode || selectedNode) && (
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						className="absolute top-16 right-4 w-80 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg max-h-[calc(100vh-120px)] overflow-y-auto">
						<div className="p-4 space-y-3">
							<div>
								<h3 className="font-semibold text-gray-900">
									{(selectedNode || hoveredNode)?.name}
								</h3>
								<p className="text-sm text-gray-500 capitalize">
									{(selectedNode || hoveredNode)?.type}
								</p>
							</div>

							{(selectedNode || hoveredNode)?.metadata && (
								<div className="text-sm space-y-2">
									{(selectedNode || hoveredNode)?.type === "document" && (
										<>
											<div className="space-y-1">
												<p>
													<span className="font-medium">조회수:</span>{" "}
													{(selectedNode || hoveredNode)?.metadata?.metadata
														?.accessCount || 0}
												</p>
												<p>
													<span className="font-medium">카테고리:</span>{" "}
													{(selectedNode || hoveredNode)?.metadata?.category
														?.name || "미분류"}
												</p>
												<p>
													<span className="font-medium">작성자:</span>{" "}
													{(selectedNode || hoveredNode)?.metadata?.metadata
														?.author || "작성자 없음"}
												</p>
											</div>
											
											{/* 내용 미리보기 */}
											<div className="mt-3 pt-3 border-t">
												<p className="font-medium mb-1">내용 미리보기</p>
												<p className="text-xs text-gray-600 line-clamp-3">
													{(selectedNode || hoveredNode)?.metadata?.content?.substring(0, 150)}...
												</p>
											</div>
											
											{/* 관련 문서 */}
											{(selectedNode || hoveredNode)?.metadata?.relationships?.length > 0 && (
												<div className="mt-3 pt-3 border-t">
													<p className="font-medium mb-1">관련 문서</p>
													<div className="space-y-1">
														{(selectedNode || hoveredNode)?.metadata.relationships
															.slice(0, 3)
															.map((rel: any) => {
																const relatedDoc = documents.find(d => d.id === rel.targetDocumentId)
																return relatedDoc ? (
																	<div key={rel.targetDocumentId} className="text-xs">
																		<span className="text-blue-600">→</span> {relatedDoc.title}
																		<span className="text-gray-400 ml-1">({Math.round(rel.strength * 100)}%)</span>
																	</div>
																) : null
															})}
													</div>
												</div>
											)}
										</>
									)}
									{(selectedNode || hoveredNode)?.type === "tag" && (
										<>
											<p>
												<span className="font-medium">사용 횟수:</span>{" "}
												{(selectedNode || hoveredNode)?.metadata.count}
											</p>
											{/* 이 태그를 사용하는 문서 */}
											<div className="mt-3 pt-3 border-t">
												<p className="font-medium mb-1">관련 문서</p>
												<div className="space-y-1">
													{documents
														.filter(doc => doc.tags.includes((selectedNode || hoveredNode)?.metadata.id))
														.slice(0, 3)
														.map(doc => (
															<div key={doc.id} className="text-xs">
																<span className="text-green-600">→</span> {doc.title}
															</div>
														))}
												</div>
											</div>
										</>
									)}
									{(selectedNode || hoveredNode)?.type === "folder" && (
										<>
											<p>
												<span className="font-medium">문서 수:</span>{" "}
												{documents.filter(doc => doc.folderId === (selectedNode || hoveredNode)?.metadata.id).length}
											</p>
											{/* 폴더 내 문서 목록 */}
											<div className="mt-3 pt-3 border-t">
												<p className="font-medium mb-1">폴더 내 문서</p>
												<div className="space-y-1">
													{documents
														.filter(doc => doc.folderId === (selectedNode || hoveredNode)?.metadata.id)
														.slice(0, 3)
														.map(doc => (
															<div key={doc.id} className="text-xs">
																<span className="text-yellow-600">→</span> {doc.title}
															</div>
														))}
												</div>
											</div>
										</>
									)}
								</div>
							)}

							{selectedNode && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => setSelectedNode(null)}
									className="w-full">
									닫기
								</Button>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
