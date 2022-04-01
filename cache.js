module.exports = [
  {
    urlPattern: 'https://final-project-upleveled.herokuapp.com',
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'users',
      expiration: {
        maxAgeSeconds: 30, // 30 seconds
      },
    },
  },
];

// https://github.com/shadowwalker/next-pwa/issues/304
