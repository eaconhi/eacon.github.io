import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://eaconhi.github.io/eacon.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "江奕坤 / Eacon Jing - International Project Operations",
  description:
    "江奕坤（Eacon Jing / Eacon）的中英双语个人主页，展示国际项目运营、学术与文化机构运营、奖项体系建设与教育内容经验。",
  icons: {
    icon: `${siteUrl}/eacon-portrait.jpg`
  },
  openGraph: {
    title: "江奕坤 / Eacon Jing - International Project Operations",
    description:
      "个人品牌官网与线上简历：国际项目运营、学术与文化机构运营、奖项体系与双语机构表达。",
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
