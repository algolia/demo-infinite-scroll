/* global helper:true */
/* eslint-disable no-unused-vars */

var instantsearch = require('instantsearch.js');
var Mustache = require('mustache');
var _ = require('lodash');

var cursor;
var index;
var page;
var nbPages;
var loading;

var hitsDiv = document.getElementById('hits');

function renderTemplate(template, res) {
  var results = document.createElement('div');
  results.innerHTML = Mustache.render(template, res);
  return results;
}

function scrolledNearBottom(contentHeight, containerHeight, scrollTop, offset) {
  return (contentHeight - scrollTop - containerHeight) < offset;
}

function isSearchTriggered(offset) {
  var body = document.querySelector('body');
  return scrolledNearBottom(
    body.clientHeight,
    document.documentElement.clientHeight,
    body.scrollTop || document.documentElement.scrollTop,
    offset
  );
}

function searchNewRecords() {
  if (isSearchTriggered(this.offset)) {
    addSearchedRecords.call(this);
  }
}

function browseNewRecords() {
  if (isSearchTriggered(this.offset)) {
    addBrowsedRecords.call(this);
  }
}

function addSearchedRecords() {
  if (!loading && page < nbPages - 1) {
    loading = true;
    page += 1;
    helper.searchOnce({page: page}, appendSearchResults.bind(this));
  }
}

function appendSearchResults(err, res, state) {
  if (err) { throw err; }

  page = res.page;
  _.assign(res, {pageNo: page + 1});
  loading = false;

  var result = renderTemplate(this.templates.items, res);
  this.container.appendChild(result);

  if (page === nbPages - 1 && (this.args.results.nbHits > nbPages * this.args.results.hitsPerPage)) {
    index = helper.client.initIndex(this.args.state.index);
    window.removeEventListener('scroll', searchNewRecords.bind(this));
    window.addEventListener('scroll', browseNewRecords.bind(this));
    addBrowsedRecords.call(this);
  }
}

function addBrowsedRecords() {
  if (!loading) {
    loading = true;
    // Skip the 1000 first hits
    if (!cursor) {
      index.browse(this.args.state.query, {
        page: 1000 / 20 + 1,
        hitsPerPage: 20
      }, appendBrowsedResults.bind(this));
    } else {
      index.browseFrom(cursor, appendBrowsedResults.bind(this));
    }
  }
}

function appendBrowsedResults(err, res) {
  if (err) { throw err; }

  cursor = res.cursor;
  var result = renderTemplate(this.templates.items, res);
  this.container.appendChild(result);

  loading = false;
}

function initialRender(container, args, templates, parent) {
  var results;
  if (args.results.nbHits) {
    _.assign(args.results, {pageNo: page + 1});
    results = renderTemplate(templates.items, args.results);
  } else {
    results = renderTemplate(templates.empty, args.results);
    results.querySelector('.clear-all').addEventListener('click', function (e) {
      e.preventDefault();
      helper.clearRefinements().setQuery('').search();
    });
  }

  container.innerHTML = '';
  container.appendChild(results);
}

function infiniteScrollWidget(options) {
  var container = document.querySelector(options.container);
  var templates = options.templates;
  var offset = parseInt(options.offset, 10);

  if (!container) {
    throw new Error('infiniteScroll: cannot select \'' + options.container + '\'');
  }

  return {
    init: function () {
      page = undefined;
      nbPages = undefined;
    },

    render: function (args) {
      helper = args.helper;
      page = args.state.page;
      nbPages = args.results.nbPages;

      var scope = {
        templates: templates,
        container: container,
        args: args,
        offset: offset
      };

      initialRender(container, args, templates);

      if (args.results.nbHits) {
        var bodyHeight = document.querySelector('body').clientHeight;
        var pageHeight = document.documentElement.clientHeight;

        if (bodyHeight < pageHeight) {
          searchNewRecords.call(scope);
        }
        window.addEventListener('scroll', searchNewRecords.bind(scope));
      }
    }
  };
}

module.exports = instantsearch.widgets.infiniteScrollWidget = infiniteScrollWidget;
