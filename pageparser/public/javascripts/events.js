/* global document, $ */
$(document).ready(function() {
  var bodyElement = $('body');

  // let people select tags
  bodyElement.delegate('#tags .tag-selector', 'click', function(e) {
    if ($(e.target).data('tag')) {
      Page.setActiveTag($(e.target).data('tag'));
    } else {
      Page.setActiveTag($(e.target).parent().data('tag'));
    }
  });

  // lock for getting data
  var fetching = false;
  // button click - ask the server for the url's html, parse it, render results
  bodyElement.delegate('#urlForm', 'submit', function() {
    Page.message('Connecting...');
    var url = Page.getInputUrl();
    if(!url) {
      return;
    }
    if (fetching) {
      // boo
      Page.message('Waiting on previous request!');
      return;
    }

    fetching = true;
    $.ajax('/api/proxy?u=' + encodeURIComponent(url), {
      complete: function () {
        fetching = false;
      },
      success: function(data) {
        if (!data || !data.body) {
          // booo
          Page.message('Bad input! URL ' + url + ' has no body');
        } else {
          var parseResults = HtmlParser.parseHtml(data.body);
          Page.renderResults(parseResults);
          Page.message("");
        }
      },
      error: function(e) {
        if (e && e.statusCode && e.statusCode().status === 403) {
          Page.message('For security reasons, please try a non-ipv4 url');
        } else {
          Page.message('Could not get data from url: ' + url + ', please try again');
        }
      }
    });
  });
});