// listen for the SW installation
self.addEventListener('install', event => {
  // this event happens before the SW is installed
  // caching occurs here using event.waitUntil()
});

// listen for the SW activation
self.addEventListener('activate', event => {
  // this event happens when the SW is instructed to take over a page
  // delete the old cache here using event.waitUntil()
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
