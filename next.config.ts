import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { dev, isServer }) => {
    // Restrict webpack's file system access
    config.resolve.symlinks = false;
    config.resolve.cache = false;
    
    // Add some debugging info
    console.log('Webpack mode:', config.mode);
    console.log('Is server:', isServer);
    console.log('Is dev:', dev);
    
    return config;
  }
};

export default nextConfig;