/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'www.parohiasfteodoradelasihla.ro' },
      { protocol: 'https', hostname: 'parohiasfteodoradelasihla.ro' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  // ===== Preserve all WordPress URLs (301 redirects) =====
  async redirects() {
    return [
      // Trailing-slash variants of the old WP URLs
      { source: '/about/', destination: '/despre', permanent: true },
      { source: '/about', destination: '/despre', permanent: true },

      { source: '/redirectioneaza-35/', destination: '/redirectioneaza-3-5', permanent: true },
      { source: '/redirectioneaza-35', destination: '/redirectioneaza-3-5', permanent: true },

      { source: '/directioneza-20/', destination: '/directioneaza-20', permanent: true },
      { source: '/directioneza-20', destination: '/directioneaza-20', permanent: true },

      { source: '/volunariat/', destination: '/voluntariat', permanent: true },
      { source: '/volunariat', destination: '/voluntariat', permanent: true },

      // Donations / campaigns
      { source: '/donations/', destination: '/campanii', permanent: true },
      { source: '/campanii/', destination: '/campanii', permanent: true },

      // Generic trailing slashes — keep at the end so they don't shadow specific ones
      { source: '/despre/', destination: '/despre', permanent: true },
      { source: '/misiune/', destination: '/misiune', permanent: true },
      { source: '/contact/', destination: '/contact', permanent: true },
      { source: '/blog/', destination: '/blog', permanent: true },
      { source: '/redirectioneaza-3-5/', destination: '/redirectioneaza-3-5', permanent: true },
    ];
  },
};

module.exports = nextConfig;
