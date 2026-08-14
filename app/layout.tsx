import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://eaconhi.github.io/eacon.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "江奕坤 / Eacon Jing - AI 应用落地与内容运营",
  description:
    "江奕坤（Eacon Jing / Eacon）的中英双语简历网站，展示业务场景理解、AI Agent 协作交付、多源信息核验、内容运营与反馈闭环经验。",
  icons: {
    icon: `${siteUrl}/eacon-portrait.jpg`
  },
  openGraph: {
    title: "江奕坤 / Eacon Jing - AI 应用落地与内容运营",
    description:
      "个人简历网站：业务场景理解、AI 协作交付、多源信息核验、内容运营与信息质量控制。",
    url: siteUrl,
    type: "website",
    images: [
      {
        url: `${siteUrl}/eacon-portrait.jpg`,
        width: 1086,
        height: 1448,
        alt: "Eacon Jing portrait"
      }
    ]
  }
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
