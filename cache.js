module.exports = [
  {
    urlPattern: 'https://final-project-upleveled.herokuapp.com',
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'users',
      expiration: {
        // maxEntries: 4,
        maxAgeSeconds: 30, // 60 seconds
      },
    },
  },
];
