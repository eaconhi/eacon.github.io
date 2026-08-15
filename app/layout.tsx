import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://eaconhi.github.io/eacon.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "江奕坤 / Eacon Jing - AI 应用运营与交付",
  description:
    "江奕坤（Eacon Jing / Eacon）的中英双语简历网站，展示需求分析、AI Agent 协作、信息治理、项目推进与交付经验。",
  icons: {
    icon: `${siteUrl}/eacon-portrait.jpg`
  },
  openGraph: {
    title: "江奕坤 / Eacon Jing - AI 应用运营与交付",
    description:
      "个人简历网站：需求分析、AI Agent 协作、信息治理、项目推进与交付。",
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
