import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /*
   * Let a verification build write somewhere other than the dev server's
   * output directory.
   *
   * `next dev` and `next build` both default to `.next`. Running a production
   * build while the dev server is live replaces the chunks it is serving, and
   * the running process then dies on "Cannot find module './58.js'" - which
   * looks like a code fault and is not one. It cost real time three times
   * during this build.
   *
   * Vercel sets nothing, so deployments keep using `.next`.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
