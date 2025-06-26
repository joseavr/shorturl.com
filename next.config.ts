import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'
import type { NextConfig } from "next";

/** Allow us to use bindings during local development */
if (process.env.NODE_ENV === 'development') setupDevPlatform();

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
