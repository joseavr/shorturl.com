import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'
import type { NextConfig } from "next";

/** Allow us to use bindings during local development */
if (process.env.NODE_ENV === 'development') setupDevPlatform();

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  }
};

export default nextConfig;
