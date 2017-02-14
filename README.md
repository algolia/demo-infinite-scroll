# Infinite Scroll Demo

This is a sample project implementing a full page search with infinite scroll
in results using [Algolia](https://www.algolia.com).

![Infinite Scroll](./screencast.gif)

You can try the [live demo](https://community.algolia.com/demo-infinite-scroll/) or follow the
[guide](https://www.algolia.com/doc/guides/search/infinite-scroll) to build your own.


## Features

* Full-JavaScript/frontend implementation based on [instantsearch.js](https://community.algolia.com/instantsearch.js/)
* Results page refreshed as you type
* Hits
* Facets
* Pagination
* Relevant results from the first keystroke
* Typo-tolerance
* Multiple sort orders
* By Relevance
* By Highest Price
* By Lowest Price
* Backup search parameters in the URL

## Usage

### Build the project

To build the application, you need NPM which comes with [Node.js](https://nodejs.org).

In the command line do:
  - `yarn`
  - `yarn start`

Then open your browser and go to http://localhost:8080.

We've included some credentials in the code allowing you to test the demo without any Algolia account.

### Import the data on your Algolia account

If you want to replicate this demo using your own Algolia credentials, you can use the `tasks/import.js` script to send the data and configure the indices.

```
$ ./import.js YourApplicationID YourAPIKey YourIndexName
```

Then, you'll need to replace the demo credentials with your own:
- in `src/js/app.js`, set your own `APPLICATION_ID` instead of `"latency"` (which is our demo `APPLICATION_ID`),
- in `src/js/app.js`, set your own `SEARCH_ONLY_API_KEY` instead of `"6be0576ff61c053d5f9a3225e2a90f76"`,
- in `src/js/app.js`, set your own `index` name instead of `"instant_search"`
