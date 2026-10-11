/** @type {import('next').NextConfig} */
const [ownerName = "", repoName = ""] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const customDomain = process.env.GITHUB_PAGES_CUSTOM_DOMAIN?.trim();
const isUserOrOrgPage = repoName === `${ownerName}.github.io`;
const basePath = isGitHubPages && !customDomain && repoName && !isUserOrOrgPage ? `/${repoName}` : "";

const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;
