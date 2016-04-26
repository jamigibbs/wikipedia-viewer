(function() {
  'use strict';

  var WikiViewer = {
    searchHistory: [],

    init: function(){
      var that = this;
      that.wikiRandom();
      that.wikiResults();
    },

    /**
     * Our method to call the Wikipedia API
     * @param {string} generator - The way data is created (ie. 'random', 'allpages' ).
     * @param {string} prop - Elements of the data returned (ie. 'images|extracts').
     * @param {string} list - (ie. 'search').
     * @param {string} srsearch - The search term (ie. 'cats').
     */
    wikiGenerator: function(generator, prop, list, srsearch){
      var that = this;
      $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
          format: 'json',
          action: 'query',
          generator: generator,
          grnnamespace: 0, // For the 'search' generator
          prop: prop,
          list: list,
          srsearch: srsearch,
          rvprop: 'content',
          explaintext: '', // Plain text instead of limited HTML.
          exintro: '' // Return only the content before the first section.
          //grnlimit: 1
        },
        success: function(data){
          that.wikiDisplay(data, srsearch);
        },
        error: function (errorMessage) {
          console.error('Error: ', errorMessage);
        }
      });
    },

    /**
     * Will display content returned from Wikipedia
     * @param {Object} data - The data object returned.
     * @param {string} searchItem - (optional) String to search for.
     */
    wikiDisplay: function(data, searchItem){
      // Search results
      if(data.query.search){
        $('#results').prepend($('<h2>').text('Results for: ' + searchItem));

        for(var i = 0; i < data.query.search.length; i++){
          var title = data.query.search[i].title;
          var snippet = data.query.search[i].snippet;

          $("#results").append("<li><h3><a target='_blank' href='http://en.wikipedia.org/wiki/" + title + "'>" + title + "</a></h3><p>" + snippet +  "...</p></li>");
        }
      // Random article
      } else {
        var pages = data.query.pages;
        var page = pages[Object.keys(pages)[0]];
        var titleRandom = page.title;
        var link = "http://en.wikipedia.org/wiki/" + titleRandom;
        var extract = page.extract;

        $('#results').append("<h2><a target='_blank' href='" + link + "'>" + titleRandom + "</a></h2>");
        $('#results').append("<p>" + extract + " <a class='read-more' target='_blank'  href='" + link + "'>read more</a></p>");
      }
    },

    // Generate our random wiki article
    wikiRandom: function(){
      var that = this;
      $('#random-btn').on('click', function () {
        //$('#display').empty();
        $('#results').empty();

        that.wikiGenerator('random', 'revisions|images|extracts');
      });
    },

    // Generate our wiki search results
    wikiResults: function(){
      var that = this;
      $('#get-results').on('click', function () {
        var searchItem = document.getElementById('search-text').value;
        that.searchHistory.push(searchItem);

        $('#results').empty();
        $('#search-text').val('');
        //$('#display').empty();

        that.wikiGenerator('allpages', null, 'search', searchItem);
      });
    },

    // Generate a search history list
    // TODO: Apply to the frontend display
    wikiSearches: function(){
      $('#get-results').on('click', function () {
        for(var i = 0; i < searchHistory.length; i++){
          $("#results").append("<li>" + searchHistory[i] + "</li>");
        }
      });
    },

  };

  $(document).ready(function(){
    WikiViewer.init();
  });

})();
