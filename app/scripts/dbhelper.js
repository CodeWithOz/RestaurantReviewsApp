/* ============= Service Worker ============= */
registerServiceWorker();

function registerServiceWorker() {
  // exit if browser doesn't support SW
  // TODO: this needs to be negated when it's time to test
  if (navigator.serviceWorker) return;

  navigator.serviceWorker.register('/sw.js')
    .then(reg => {
      // registration worked!
      console.log('SW registration worked!');

      // exit if page was not loaded with a service worker
      if (!navigator.serviceWorker.controller) {
        console.log('No SW controls this page (first-ever registration)!');
        return
      };

      /* ========== notify user about updates ========== */
      if (reg.waiting) {
        // the new service worker is installed and ready to activate
        console.log('A new SW is installed and ready to activate!');
      }

      /**
      * Display the update notification to the user
      */
      function handleUpdateToSW(worker) {

        createNotificationHTML(worker);

        function createNotificationHTML(worker) {
          let currentFocus;

          const container = document.createElement('div');
          const title = document.createElement('h4');
          title.innerText = 'Updates Available';
          container.append(title);

          // buttons
          const btnParagraph = document.createElement('p');
          const updateBtn = createButton('Update');
          updateBtn.addEventListener('click', () => {
            // update the service worker
            worker.postMessage({action: 'update'});
          });
          btnParagraph.append(updateBtn);

          const dismissBtn = createButton('Dismiss');
          dismissBtn.addEventListener('click', () => {
            // first move the container offscreen
            notifSection.classList.remove('shown');

            // remove the content
            container.remove();

            // remove the section from the accesibility tree
            notifSection.classList.remove('accessible');

            // move focus back to the previously-focused element
            currentFocus.focus();
          });

          btnParagraph.append(dismissBtn);

          container.append(btnParagraph);

          // add the notification section to the accesibility tree
          // this ensures that the newly added content will be
          // announced
          const notifSection = document.querySelector('.notification');
          notifSection.classList.add('accessible');

          // now add the content
          notifSection.append(container);

          // display it
          notifSection.classList.add('shown');

          // save the currently focused item
          currentFocus = document.activeElement;

          // move focus to update button
          updateBtn.focus();

          // trap tab key
          notifSection.addEventListener('keydown', trapTabKey);

          function createButton(text) {
            const btn = document.createElement('button');
            btn.innerText = text;
            btn.setAttribute('type', 'button');
            btn.setAttribute('aria-labelledby', text.toLowerCase());
            return btn;
          }

          // see https://developers.google.com/web/fundamentals/accessibility/focus/using-tabindex#modals-and-keyboard-traps
          function trapTabKey(event) {
            // Check for TAB key press
            if (event.keyCode === 9) {
              event.preventDefault();

              if (document.activeElement === updateBtn) {
                dismissBtn.focus();
              } else {
                updateBtn.focus();
              }
            }

            // ESCAPE
            if (event.keyCode === 27) {
              // same as clicking dismiss button
              dismissBtn.click();
            }
          }
        }

      }

      if (reg.installing) {
        // the new service worker is installing
        // listen for when it's installed
        console.log('A new SW is installing...');
        notifyOnInstall(reg.installing);
      }

      function notifyOnInstall(worker) {
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed') {
            // notify the user
            console.log('A new SW has installed!');
          }
        });
      }

      reg.addEventListener('updatefound', () => {
        // reg.installing has become a new SW
        // so repeat the steps as if reg.installing is already present
        console.log('(updatefound) A new SW is installing...');
        notifyOnInstall(reg.installing);
      });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // navigator.serviceWorker.controller has changed
        // which means a new service worker now controls this page
        // so reload this page to start using the new SW
        window.location.reload();
      });
    })
    .catch(err => {
      // registration failed
      console.warn(`SW registration failed with message: ${err}`);
    });
}

/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    return '/data/restaurants.json';
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        const json = JSON.parse(xhr.responseText);
        const restaurants = json.restaurants;
        callback(null, restaurants);
      } else { // Oops!. Got an error from server.
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/images/${restaurant.photograph}`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
