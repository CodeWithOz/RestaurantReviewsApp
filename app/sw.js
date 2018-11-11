// caches start with the same prefix
const cacheNamePrefix = 'RestRevsCache-';

// append a random string to the prefix
// see https://stackoverflow.com/a/8084248/7987987 for random string generator
const cacheNameSuffix = Math.random().toString(36).substring(2);
const cacheName = cacheNamePrefix + cacheNameSuffix;

// listen for the SW installation
self.addEventListener('install', event => {
  // this event happens before the SW is installed
  // caching occurs here using event.waitUntil()
  const assets = [
    '/',
    '/restaurant.html',
    'styles/main.css',
    'styles/index.css',
    'styles/restaurants.css',
    'scripts/dbhelper.js',
    'scripts/main.js',
    'scripts/restaurant_info.js',
    'data/restaurants.json'
  ];

  // add the images
  // see https://stackoverflow.com/a/29559488/7987987 for range generator
  Array.from({length: 10}, (_, i) => i + 1).forEach(num => {
    assets.push(`images/${num}.jpg`);
  });

  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        // cache the necessary assets
        return cache.addAll(assets);
      })
  );
});

// listen for the SW activation
self.addEventListener('activate', event => {
  // this event happens when the SW is instructed to take over a page
  // delete the old cache here using event.waitUntil()

  // STEPS:
  // get an array of all cache names
  // delete the prefixed ones that are not the current one
  event.waitUntil(
    caches.keys()
      .then(names => {
        return Promise.all(
          names.filter(name => {
            return name.startsWith(cacheNamePrefix) && name !== cacheName;
          }).map(name => caches.delete(name))
        );
      })
  );
});

// listen for requests
self.addEventListener('fetch', event => {
  // use event.respondWith to return cached items if necessary (eg. offline)
  // something like this
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// listen for cues from the page to activate the new SW
self.addEventListener('message', event => {
  // check for the contents of event.data
  // call self.skipWaiting() if it matches what's expected
});
