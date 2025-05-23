/** @type {import('next').NextConfig} */
// next.config.mjs
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination:
          "https://geenee-pro-dev-tf-146970343451.asia-south1.run.app/:path*",
      },
    ];
  },
};

export default nextConfig;
