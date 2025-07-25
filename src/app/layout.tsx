import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreHydration from "@/components/StoreHydration";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SyncInsight - AI 기반 지식 관리 플랫폼",
  description: "RAG 기반 AI 챗봇으로 조직의 지식을 효율적으로 관리하고 활용하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <StoreHydration />
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}