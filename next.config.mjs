/** @type {import('next').NextConfig} */
// next.config.mjs
const nextConfig = {
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const apiProxyPath = process.env.NEXT_PUBLIC_API_PROXY_PATH || "/api/proxy";

    return [
      {
        source: `${apiProxyPath}/:path*`,
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
  images: {
    domains: [
      "play-lh.googleusercontent.com",
      "icon.url",
      "lh3.googleusercontent.com",
      "play.google.com",
      "*.googleusercontent.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
