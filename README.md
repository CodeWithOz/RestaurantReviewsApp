# Restaurant Reviews Web App
This web app is the final project of the Udacity Front End Nanodegree
program. It is a simple webapp that displays restaurants within a specified
geographical area and provides additional information about those
restaurants. See the original repository
[here](https://github.com/udacity/mws-restaurant-stage-1/tree/google-maps).
_**Note**_ that this is the Google Maps branch.

## Using the Web App
- The app allows you to filter results based on location and type of
cuisine.
- For each displayed result, you can view more information about
the restaurant including hours of operation and reviews.
- The app is offline-capable 🙌; you will be able to view
previously-visited pages even without an internet connection.
  - However, map displays are only available when connected
to the internet.
  - Also note that offline capability is only possible
in browsers that support the Service Worker API. [Click here](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/serviceWorker#Browser_compatibility)
to see if your
browser is compatible.

## Developer Set Up
First, copy the app's files to your local environment by opening
your terminal program and running:
```
git clone https://github.com/CodeWithOz/RestaurantReviewsApp.git
```
Alternatively, you can download the zip files and unzip them
into your chosen destination folder. If you are new to git, check out
[this cool tutorial](https://www.atlassian.com/git/tutorials/learn-git-with-bitbucket-cloud).

Next, the dependencies need to be installed. Run
```
npm install
```
followed by
```
bower install
```
If you use a Unix system, the above commands can be condensed into
```
npm install && bower install
```
On Windows systems running PowerShell, the
[correct condensed form](https://stackoverflow.com/a/41816341/7987987) is
```
npm install; if ($?) { bower install }
```
If you are new to package management, read more about
[npm](https://www.sitepoint.com/beginners-guide-node-package-manager/)
and [bower](https://bower.io/) (though Bower is being phased out).

After installing the dependencies, start the local server by running
```
gulp serve
```
Visit `localhost:9000` in your browser to view and use the web app.
That's it! 😄

#### Options for `gulp serve`
[Gulp](https://gulpjs.com/) is the build tool of choice for this project.
The app was scaffolded using [Yeoman's](http://yeoman.io/)
`generator-webapp`.
[Check out](https://github.com/yeoman/generator-webapp#getting-started)
the other `gulp serve` options available with this generator.

## Contributing
I will be happy to accept improvements to this project once it has
been graded and accepted. Thank you in advance for your efforts! 🙌👏
