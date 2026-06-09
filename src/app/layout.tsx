import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 自然卷护理助手",
  description: "上传头发照片并完成问卷，获得自然卷护理参考建议。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
