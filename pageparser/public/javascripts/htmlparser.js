/**
 * This is the html parser. It runs through documents and checks out what's inside of them and can mark-up data
 *
 */
HtmlParser = {
    /**
     * This will actually parse html.
     * Assumes valid html, beginning with (maybe) a <!doctype [stuff]> tag
     * new algo:
     *   look for <
     *    are we in a script/style tag? if so, only look for script and/or style closing tags respectively
     *    is it an xml tag? <? if so, ignore til ?>
     *    is it a comment tag? <!-- if so, find ignore til -->
     *    is it an html tag? (</?[a-zA-Z0-9-]+ ), if so, insert start-wrap
     *   look for >
     *     if we're in a relevant tag, insert closing div tag
     *
     * @param {string} body some html document or document portion
     * @return {Object} an object with marked-up html in .html and an object of [tagName]: count in .tags
     */
    parseHtml: function(body) {
      // this maintains a count of tagName => tagCount
      var tagMap = {};

      /**
       * Adds a tag to the collection of found tags.
       *
       * @param {string} tagName the tag to add
       */
      var addTag = function(tagName) {
        if (tagMap[tagName]) {
          tagMap[tagName]++;
        } else {
          tagMap[tagName] = 1;
        }
      };

      /**
       * This is a one char convenience escape function - it makes the code later a little easier to read
       *
       * @param {String} c a character to escape
       * @returns {String} either the character or an escaped version of it if it is < or >
       */
      var escape = function (c) {
        if (c === '<') {
          return '&lt;';
        } else if (c === '>') {
          return '&gt;';
        } else {
          return c;
        }
      };

      // various state variables:
      var htmlBuilder = '';
      var state = null;
      // whether or not we're traversing a quoted piece of code
      var inQuotes = false;
      // javascript/html support ' and " as quotes
      var quoteType = '';
      // we need this to see if we're traversing through a script or style tag
      var lastTag = '';

      for (var i = 0 ; i < body.length; i++) {
        var char = body[i];
        var afterEffect = '';
        switch(char) {
          // we're starting either a tag, or a comment, or a directive (or we're in a place which doesn't use tags like js
          case '<':
            if (!inQuotes && !(state === 'comment' || state === 'directive')) {
              if (body.charAt(i + 1) === '/') {
                var tagEndName = new RegExp('/([a-zA-Z0-9-]+)').exec(body.substr(i))[1].toLowerCase();
                if (tagEndName) {
                  state = 'tagEnd';
                  lastTag = '';
                  htmlBuilder += '<div class="' + tagEndName + '-tag">';
                }
              } else {
                if (lastTag !== 'script' && lastTag !== 'style') {
                  if (body.substr(i, 4) === '<!--') {
                    state = 'comment';
                  } else if (body.substr(i+1, 1) === '?') {
                    state = 'directive';
                  } else if (body.charAt(i + 1) === '!' && body.substr(i + 1, 8) === '!doctype') {
                    state = 'easyclose';
                  } else if (body.charAt(i + 1).match(new RegExp('[a-z]', 'i'))) {
                    // we're in a start tag
                    var tagName = new RegExp('([a-zA-Z0-9-]+)').exec(body.substr(i))[1].toLowerCase();
                    if (tagName) {
                      addTag(tagName);
                      state = 'tag';
                      lastTag = tagName;
                      htmlBuilder += '<div class="' + tagName + '-tag">';
                    }
                  }
                }
              }
            }
            break;
          // we're hitting a quotation mark, which we only care about if we're looking at a tag
          case '"':
          case "'":
            if (state === 'tag') {
              if (!inQuotes) {
                inQuotes = true;
                quoteType = char;
              } else if (inQuotes && char === quoteType) {
                inQuotes = false;
              }
            }
            break;
          // we're closing a tag of some sort
          case '>':
            if (!inQuotes) {
              if (state === 'comment' && body.substr(i - 2 , 3) === '-->') {
                state = null;
              } else if (state === 'directive' && body.substr(i - 1, 2) === '?>') {
                state = null;
              } else if (state === 'tagEnd') {
                state = null;
                afterEffect = '</div>';
              } else if (state === 'tag') {
                state = null;
                afterEffect = '</div>';
                if (body.charAt(i -1) === '/') { // easy close <div />
                  lastTag = '';
                }
              } else if (state === 'easyclose') { // <!doctype html ... >
                state = null;
              }
            }
            break;
        }
        htmlBuilder += escape(char) + afterEffect;
      }
      return {
        html: htmlBuilder,
        tags: tagMap
      };
    }
  };