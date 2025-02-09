/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    domains: [], // Add domains for next/image if needed
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Handle punycode deprecation
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      };
      // Ignore punycode warnings
      config.ignoreWarnings = [{ module: /node_modules\/punycode/ }];
    }
    return config;
  },
};

export default nextConfig;
