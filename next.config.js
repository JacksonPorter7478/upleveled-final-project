/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

const withPWA = require('next-pwa');
const runtimeCaching = require('./cache.js');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    runtimeCaching,
    disable: process.env.NODE_ENV === 'development',
    // register: true,
    // skipWaiting: true,
  },
});
