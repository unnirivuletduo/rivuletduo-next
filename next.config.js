/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/services.html', destination: '/services', permanent: true },
      { source: '/work.html', destination: '/work', permanent: true },
      { source: '/works.html', destination: '/work', permanent: true },
      { source: '/works', destination: '/work', permanent: true },
      { source: '/works/:slug', destination: '/work/:slug', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/service-detail.html', destination: '/services', permanent: true },
      { source: '/service-detail', destination: '/services', permanent: true },
      { source: '/work-detail.html', destination: '/work', permanent: true },
      { source: '/work-detail', destination: '/work', permanent: true },
    ];
  },
};
module.exports = nextConfig;
