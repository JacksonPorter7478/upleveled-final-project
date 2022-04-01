module.exports = [
  {
    urlPattern: 'https://final-project-upleveled.herokuapp.com',
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'users',
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 60, // 60 seconds
      },
    },
  },
];

// https://github.com/shadowwalker/next-pwa/issues/304
