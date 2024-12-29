import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "onemg.gumlet.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
