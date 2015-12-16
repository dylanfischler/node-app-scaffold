module.exports = function (app) {
  app.get('/', function (req, res) {
    res.render('index', { title: 'TEDxAmherst' });
  });

  require('./api.js')(app);

  //HTML5 locationProvider support
  app.all('/*', function(req, res) {
    res.render('index', { title: 'TEDxAmherst' });
  });
};