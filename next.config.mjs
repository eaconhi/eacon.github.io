/** @type {import('next').NextConfig} */
const [ownerName = "", repoName = ""] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isUserOrOrgPage = repoName === `${ownerName}.github.io`;
const basePath = isGitHubPages && repoName && !isUserOrOrgPage ? `/${repoName}` : "";

const nextConfig = {
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
