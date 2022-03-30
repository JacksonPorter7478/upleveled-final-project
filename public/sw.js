if (!self.define) {
  let e,
    s = {};
  const n = (n, c) => (
    (n = new URL(n + '.js', c).href),
    s[n] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = n), (e.onload = s), document.head.appendChild(e);
        } else (e = n), importScripts(n), s();
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, a) => {
    const i =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href;
    if (s[i]) return;
    let t = {};
    const r = (e) => n(e, i),
      o = { module: { uri: i }, exports: t, require: r };
    s[i] = Promise.all(c.map((e) => o[e] || r(e))).then((e) => (a(...e), t));
  };
}
define(['./workbox-5afaf374'], function (e) {
  'use strict';
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/static/IIc43pK4wN66jlYjbCuAa/_buildManifest.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/IIc43pK4wN66jlYjbCuAa/_middlewareManifest.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/IIc43pK4wN66jlYjbCuAa/_ssgManifest.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/161f6d26.63dc88d7f243229b.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/415.2473aefef8f724f2.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/479-b64976ac4b0c4042.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/61-a59ef73b35c33559.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/651.243d23442247d286.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/90.f058e1e2a0ec837c.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/932-44bf1b62b4e91f8c.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/959-78678504e788cde4.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/framework-5f4595e5518b5600.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/main-01157a903e3a8de8.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/pages/_app-ac1551a7388a001a.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/pages/_error-8022dacb1937fc7a.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/pages/chats/%5BchatId%5D-d329ddd83b7a32dc.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/pages/goodbye-954d6dd629beb98b.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/pages/index-28c0d8b24b692946.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/pages/login-f1e6ad483b0fed5b.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/pages/logout-fec1d78c2706915b.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/pages/matches-954989795e17f907.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/pages/profile-dfc19a7d596c2caa.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/pages/register-fda39fb3093206c6.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/pages/users/%5BuserId%5D-67e977478987c15b.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/polyfills-5cd94c89d3acac5f.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/chunks/webpack-9708e1263338cbeb.js',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/_next/static/css/2e4e9a8a9d7ea674.css',
          revision: 'IIc43pK4wN66jlYjbCuAa',
        },
        {
          url: '/bowlingIcon.png',
          revision: 'dccdbb8ecbd6dbcdbf2c45a4274d674c',
        },
        { url: '/chatIcon.png', revision: '6d5b6cbd989377ef010ac2988b509540' },
        {
          url: '/closeMenuIcon.png',
          revision: 'b39dbdad2769729131edbd5662cb95a6',
        },
        {
          url: '/coffeeIcon.png',
          revision: '4e72e4412a9cb5f22d88cd8049b0451d',
        },
        { url: '/duck.jpg', revision: 'de365ba9df917aedb102dbe78ab08a16' },
        { url: '/editIcon.png', revision: 'aef9fc6e472a20607ea6ca4ce13c3529' },
        { url: '/favicon.ico', revision: '34fdc63f7a50cc80d8584654aa3f55eb' },
        { url: '/favicon.svg', revision: '989d96c480e4655138016c7686236099' },
        { url: '/homeIcon.png', revision: '5ace84a322a054aa0a33127e15d0c35c' },
        { url: '/icon-192.png', revision: '8338705696d8aa8c185c0f1bb32b5581' },
        { url: '/icon-512.png', revision: '3884a0b34d52310de66f627f2765678e' },
        {
          url: '/icon-apple-touch.png',
          revision: '19ff859d61dec1be164b48b3c6c2cdfe',
        },
        { url: '/kitten.jpg', revision: '7ff1647e9d7ab4524c50852e38527beb' },
        {
          url: '/logoutIcon.png',
          revision: '962d94d341d8f0cd488e1a23c9172c07',
        },
        { url: '/manifest.json', revision: '5ad6c82bc99b136f0aa0c1ffe4517c2d' },
        { url: '/menuIcon.png', revision: '5727acf41e0265cd8643e75e81d1b20b' },
        { url: '/musicIcon.png', revision: '29a433ca639b80382f3f9f3c9325713d' },
        { url: '/paperIcon.png', revision: '5379636df1ed1f63255a91dc4c9c3d0b' },
        {
          url: '/peopleIcon.png',
          revision: 'dd83f393dd267a00dbffd8a376ed3028',
        },
        { url: '/picknick.jpg', revision: '858d97ae9d4f44f02c3b0f9328f61b29' },
        { url: '/picknickL.jpg', revision: 'e607c2058bae7cfed70a7b5d41f264fa' },
        { url: '/picknickM.jpg', revision: '75bb7a7a1930d2fad058334b5156ab76' },
        { url: '/puppy.jpg', revision: 'b2d19418ee59556802fb5f1d30496138' },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: n,
              state: c,
            }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      'GET',
    );
});
