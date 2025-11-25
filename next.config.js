/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'opshqmqagtfidynwftzk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/profile-picture/**',
      },
    ],
    domains: ["images.unsplash.com"], // add any external image host here

  },
}

module.exports = nextConfig