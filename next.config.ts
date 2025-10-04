import { createJiti } from 'jiti';
import type { NextConfig } from 'next';
import { fileURLToPath } from 'node:url';

const jiti = createJiti(fileURLToPath(import.meta.url));
jiti.esmResolve("./src/lib/env")

const nextConfig: NextConfig = {
  typedRoutes: true
};

export default nextConfig;
