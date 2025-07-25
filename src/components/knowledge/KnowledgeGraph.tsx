'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize2, RefreshCw } from "lucide-react"
import { useChatStore } from "@/stores/chatStore"
import type { Document } from "@/types"

interface Node extends d3.SimulationNodeDatum {
  id: string
  type: 'document' | 'tag' | 'connection'
  label: string
  size: number
  color: string
  document?: Document
}

interface Link extends d3.SimulationLinkDatum<Node> {
  id: string
  strength: number
}

export default function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const { documents } = useChatStore()

  useEffect(() => {
    if (!svgRef.current || documents.length === 0) return

    // 그래프 데이터 생성
    const { nodes, links } = generateGraphData(documents)
    
    // SVG 설정
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const g = svg.append("g")

    // 줌 기능
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
      })

    svg.call(zoom)

    // 시뮬레이션 설정
    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).strength(d => d.strength))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("collision", d3.forceCollide().radius(d => (d as Node).size + 5))

    // 링크 그리기
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.strength * 10))

    // 노드 그룹 생성
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call((d3.drag() as any)
        .on("start", (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on("drag", (event: any, d: any) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on("end", (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        })
      )

    // 노드 원 그리기
    node.append("circle")
      .attr("r", d => d.size)
      .attr("fill", d => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)

    // 노드 텍스트 추가
    node.append("text")
      .text(d => d.label)
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .attr("dy", d => d.size + 15)
      .attr("fill", "#374151")
      .style("pointer-events", "none")

    // 툴팁
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("padding", "8px")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)

    node
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(getTooltipContent(d))
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px")
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0)
      })

    // 시뮬레이션 업데이트
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!)

      node.attr("transform", d => `translate(${d.x},${d.y})`)
    })

    return () => {
      tooltip.remove()
      simulation.stop()
    }
  }, [documents, dimensions])

  const generateGraphData = (documents: Document[]): { nodes: Node[], links: Link[] } => {
    const nodes: Node[] = []
    const links: Link[] = []
    const tagNodes = new Map<string, Node>()

    // 문서 노드 생성
    documents.forEach(doc => {
      nodes.push({
        id: `doc-${doc.id}`,
        type: 'document',
        label: doc.title.length > 20 ? doc.title.substring(0, 20) + '...' : doc.title,
        size: Math.max(15, Math.min(30, doc.content.length / 100)),
        color: getDocumentColor(doc.type),
        document: doc
      })

      // 태그 노드 생성 및 링크
      doc.tags.forEach(tag => {
        const tagId = `tag-${tag}`
        
        if (!tagNodes.has(tagId)) {
          const tagNode: Node = {
            id: tagId,
            type: 'tag',
            label: tag,
            size: 10,
            color: '#8B5CF6'
          }
          tagNodes.set(tagId, tagNode)
          nodes.push(tagNode)
        }

        // 문서-태그 링크
        links.push({
          id: `${doc.id}-${tag}`,
          source: `doc-${doc.id}`,
          target: tagId,
          strength: 0.5
        })

        // 태그 노드 크기 증가
        const tagNode = tagNodes.get(tagId)!
        tagNode.size += 2
      })
    })

    // 공통 태그를 가진 문서들 간 연결
    for (let i = 0; i < documents.length; i++) {
      for (let j = i + 1; j < documents.length; j++) {
        const commonTags = documents[i].tags.filter(tag => 
          documents[j].tags.includes(tag)
        )
        
        if (commonTags.length > 0) {
          links.push({
            id: `${documents[i].id}-${documents[j].id}`,
            source: `doc-${documents[i].id}`,
            target: `doc-${documents[j].id}`,
            strength: commonTags.length * 0.3
          })
        }
      }
    }

    return { nodes, links }
  }

  const getDocumentColor = (type: Document['type']): string => {
    const colors = {
      pdf: '#EF4444',
      docx: '#3B82F6',
      txt: '#10B981',
      md: '#F59E0B',
      hwp: '#8B5CF6'
    }
    return colors[type] || '#6B7280'
  }

  const getTooltipContent = (node: Node): string => {
    if (node.type === 'document' && node.document) {
      const doc = node.document
      return `
        <strong>${doc.title}</strong><br/>
        타입: ${doc.type.toUpperCase()}<br/>
        크기: ${Math.round(doc.fileSize / 1024)}KB<br/>
        태그: ${doc.tags.join(', ')}<br/>
        업로드: ${doc.uploadDate.toLocaleDateString('ko-KR')}
      `
    } else if (node.type === 'tag') {
      return `태그: ${node.label}`
    }
    return ''
  }

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().duration(300).call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.5
    )
  }

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().duration(300).call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 0.67
    )
  }

  const handleReset = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().duration(500).call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity
    )
  }

  const handleResize = () => {
    setDimensions({ width: 1000, height: 800 })
  }

  if (documents.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-center">
        <div>
          <div className="text-4xl mb-4">🕸️</div>
          <h3 className="text-lg font-semibold mb-2">지식 그래프가 비어있습니다</h3>
          <p className="text-muted-foreground">
            문서를 업로드하면 지식 간의 연관관계를 시각화해드립니다
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-background border rounded-lg overflow-hidden">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <Button variant="outline" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleResize}>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 bg-background/90 p-3 rounded-lg border text-sm">
        <div className="font-semibold mb-2">범례</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>PDF</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Word</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>텍스트</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>태그</span>
          </div>
        </div>
      </div>

      {/* Graph */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
    </div>
  )
}