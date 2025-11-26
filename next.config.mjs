/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
   async rewrites() {
    return [
      {
        source: '/public/documents/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_OK}/public/documents/:path*`, // Chuyển /public/header.png -> /header.png
      },
      {
        source: '/public/:path*',
        destination: '/:path*', // Chuyển /public/header.png -> /header.png
      },
       {
        source: '/api/vip/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_OK}/:path*`, // Chuyển /public/header.png -> /header.png
      }
    ];
  },
}

export default nextConfig
