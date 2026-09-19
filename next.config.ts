import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        // gambar produk yang diunggah ke Vercel Blob
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      // default 1MB terlalu kecil untuk foto dari HP
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
