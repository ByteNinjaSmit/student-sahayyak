/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['media.istockphoto.com', 'images.unsplash.com', 'images.freeimages.com'], // Add both domains here
  },

  // Adding custom headers to prevent caching for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',  // Apply for all API routes
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',  // Prevent caching at Vercel edge
          },
        ],
      },
    ];
  },
};

export default nextConfig;
