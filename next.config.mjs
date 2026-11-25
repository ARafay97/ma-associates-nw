/** @type {import('next').NextConfig} */
const nextConfig = {
  // Make sure the bookings JSON file is never served or bundled as a static asset
  outputFileTracingExcludes: {
    '*': ['./data/**'],
  },
}

export default nextConfig
