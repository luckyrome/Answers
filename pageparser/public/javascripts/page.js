/* global $ */
Page = {
  /**
   * Creates a message for the user to look at
   *
   * @param {string} msg the message to show
   */
  message: function (msg) {
    var messageEl = $('#message');
    messageEl.html(msg);
    if (msg) {
      messageEl.addClass('active');
    } else {
      messageEl.removeClass('active');
    }
  },

  /**
   * Accessor for the input url - mostly so other js doesn't have to reach into the dom directly
   *
   * @returns {String} the value of the control input at the time of calling
   */
  getInputUrl: function(){
    return $('.controls input').val();
  },

  /**
   * Renders a results object with html markup as well as a tag-count
   *
   * @param {Object} results an object which contains markup in .html and a hash of tags and tag counts in .tags
   */
  renderResults: function (results) {
    if (results.tags) {
      var dynamicStyles = this.generateDynamicStyleTag(results.tags);
      $('#tags').html(this.generateTagsListHtml(results.tags));
      $('#dynamicstyles').remove();
      $('head').append($('<style id="dynamicStyles" type="text/css">' + dynamicStyles + '</style>'));
    }
    $('#source').html(results.html);
  },
  setActiveTag: function(tagName) {
    $('#stage')[0].className = tagName + '-active';
  },

  /**
   * The reason this exists is because we don't quite know what kind of tags the body could have. Well, there's always
   * the actual possible tags in HTML 5 but we want to be able to handle odd tag names too (I would hope). This code
   * will take the tags and create a style tag which will
   *
   * @param {Object} possibleTags a hash of tag type to anything
   * @returns {string} the contents of a style tag which will allow highlighting of inner tags when a tag type is selected
   */
  generateDynamicStyleTag: function(possibleTags) {
    var styleTags = [];
    $.each(possibleTags, function(i) {
      styleTags.push('#stage.' + i + '-active .' + i + '-tag');
    });
    return styleTags.join(',') + '{ background-color:yellow; }';
  },

  /**
   * Renders a list of tags which also contains the count of the tags
   *
   * @param {Object} possibleTags a hash of tag type to count
   * return {String} an html representation of the possibleTags input
   */
  generateTagsListHtml: function(possibleTags) {
    var tagsList = '<div class="tag-selector-header"><p class="tag-header">Tag</p><p class="count-header">Count</p></div><ul class="tags-list">';
    var tagArray = [];
    $.each(possibleTags, function(i, count) {
      tagArray.push([i, count]);
    });
    // sort the results - mostly for aesthetics
    tagArray.sort(function(a, b) {
      if (a[0] < b[0]) {
        return -1;
      } else if (a[0] > b[0]) {
        return 1;
      } return 0;
    });
    $.each(tagArray, function(idx, i) {
      tagsList += '<li data-tag="' + i[0] + '" class="tag-selector ' + i[0] +'-tag"><p class="tag-name">'+ i[0] + '</p><p class="count">' + i[1] + '</p></li>';
    });
    tagsList+='</ul>';
    return tagsList;
  }
};