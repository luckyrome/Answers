var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Page Parser v0.0.0' });
});

/* GET some page on the internet requires ?u=something */
router.get('/api/proxy', function (req, res) {
  var url = req.query.u;
  if (!url) {
    res.status(400).render('error', {error: new Error('Bad request! Needs a url')});
    return;
  }
  // This is just a safeguard for systems that run this; it's essentially a web proxy and can therefore access any machine
  // relevant in the local ip space if this isn't here...
  if (!(url.substr(url.indexOf('://') + 3).startsWith('127.0.0.1')) &&
    url.substr(url.indexOf('://') + 3).match(new RegExp('^([0-9].?)+(\/.*)?$'))) {
    console.log('rest of url', url.substr(url.indexOf('://') + 3));
    res.status(403).render('error', {error: new Error('For security reasons, please do not use ipv4')});
    return;
  }
  // at this point url exists
  request.get(url, function(error, response, body) {
    if (error) {
      res.status(500).render('error', {error: new Error(error.type)});
    } else {
      if (!response.headers['content-type'] || response.headers['content-type'].indexOf('html') === -1) {
        res.status(400).render('error', {error: new Error('Url was not an HTML document')});
        return;
      }

      res.send({
        body: body
      });
    }
  });
});

module.exports = router;
