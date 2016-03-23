/* global require, HtmlParser */
require('../public/javascripts/htmlparser.js');
describe('htmlParser', function() {
  it('should parse and escape simple html', function() {
    var basicHtml = '<div class="bobby"></div>';
    var parsedHtml = HtmlParser.parseHtml(basicHtml);
    expect(parsedHtml.html).toEqual('<div class="div-tag">&lt;div class="bobby"&gt;</div><div class="div-tag">&lt;/div&gt;</div>');
  });
  it('should handle self-closing tags', function() {
    var selfCloser = '<input />';
    var parsedHtml = HtmlParser.parseHtml(selfCloser);
    expect(parsedHtml.html).toEqual('<div class="input-tag">&lt;input /&gt;</div>');
    expect(parsedHtml.tags.input).not.toBeUndefined();
    expect(parsedHtml.tags.input).toEqual(1);
  });
  it('should handle tags after tags', function(){
    var tagBuddies = '<div></div><span></span>';
    var parsedHtml = HtmlParser.parseHtml(tagBuddies);
    expect(parsedHtml.tags.span).toEqual(1);
    expect(parsedHtml.tags.div).toEqual(1);
  });

  it ('should not try to close tags when quotes are in effect', function () {
    var basicHtml = '<div class="bo>bby"></div>';
    var parsedHtml = HtmlParser.parseHtml(basicHtml);
    expect(parsedHtml.html).toEqual('<div class="div-tag">&lt;div class="bo&gt;bby"&gt;</div><div class="div-tag">&lt;/div&gt;</div>');
  });

  it('should ignore comments when parsing for tags', function() {
    var htmlWithTagsInComments = '<!-- <div></div> -->';
    var parsedHtml = HtmlParser.parseHtml(htmlWithTagsInComments);
    expect(parsedHtml.tags.div).toBeUndefined();
  });

  it('should ignore tags when in a string in another tag', function() {
    var xzibitTag = '<div class="<div>" />';
    var parsedHtml = HtmlParser.parseHtml(xzibitTag);
    expect(parsedHtml.tags.div).toEqual(1);
  });

  it('should not count the DTD as a tag', function() {
    var basicDtd = '<!doctype html>';
    var parsedHtml = HtmlParser.parseHtml(basicDtd);
    expect(Object.keys(parsedHtml.tags).length).toEqual(0);
  });

  it('should ignore xml directives', function() {
    var xmlDirectiveBlock = '<?xml other stuff <div></div> ?>';
    var parsedHtml = HtmlParser.parseHtml(xmlDirectiveBlock);
    expect(Object.keys(parsedHtml.tags).length).toEqual(0);
  });

  it('should ignore content inside of script tags', function() {
    var xzscribitHtml = '<script type="text/javascript">//<div><!-- <span></span>--></div></script>';
    var parsedHtml = HtmlParser.parseHtml(xzscribitHtml);
    expect(Object.keys(parsedHtml.tags).length).toEqual(1);
    expect(parsedHtml.tags.script).toEqual(1);
  });
  it('should handle tags after comments', function() {
    var thefollowUp = '<!-- MapleTop --><style type="text/css">.C-hover:hover{color:#fff!important}</style>';
    var parsedHtml = HtmlParser.parseHtml(thefollowUp);
    expect(parsedHtml.tags.style).toEqual(1);
  });
});

