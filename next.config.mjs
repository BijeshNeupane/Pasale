// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images:{
//         unoptimized: true
//     }
// };

// export default nextConfig;

import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default withPWA(nextConfig);
