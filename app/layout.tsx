import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 더빙 웹사이트",
  description: "오디오/비디오 업로드 후 원하는 언어로 더빙하는 AI 웹 서비스"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
