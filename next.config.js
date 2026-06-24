/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Smaller bundles, faster mobile loads
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'www.parohiasfteodoradelasihla.ro' },
      { protocol: 'https', hostname: 'parohiasfteodoradelasihla.ro' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 3600,
  },

  // ===== Preserve all WordPress URLs (301 redirects) =====
  async redirects() {
    return [
      // Trailing-slash variants of the old WP URLs
      { source: '/about/', destination: '/despre', permanent: true },
      { source: '/about', destination: '/despre', permanent: true },

      { source: '/redirectioneaza-35/', destination: '/redirectioneaza-3-5', permanent: true },
      { source: '/redirectioneaza-35', destination: '/redirectioneaza-3-5', permanent: true },

      // /directioneaza-20 doesn't exist yet (corporate 20% form). Route any
      // legacy WP misspellings to the contact page so firms reach us anyway.
      { source: '/directioneza-20/', destination: '/contact', permanent: false },
      { source: '/directioneza-20', destination: '/contact', permanent: false },
      { source: '/directioneaza-20/', destination: '/contact', permanent: false },
      { source: '/directioneaza-20', destination: '/contact', permanent: false },

      // No standalone /voluntariat page; volunteering = contact the parish.
      { source: '/volunariat/', destination: '/contact', permanent: false },
      { source: '/volunariat', destination: '/contact', permanent: false },
      { source: '/voluntariat/', destination: '/contact', permanent: false },
      { source: '/voluntariat', destination: '/contact', permanent: false },

      // /evenimente isn't a separate page; we surface events on /blog and
      // the homepage news ticker.
      { source: '/evenimente/', destination: '/blog', permanent: false },
      { source: '/evenimente', destination: '/blog', permanent: false },

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
