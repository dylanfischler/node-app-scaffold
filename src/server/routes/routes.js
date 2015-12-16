module.exports = function (app) {
  app.get('/', function (req, res) {
    res.render('index', { title: 'The Main Page' });
  });

  require('./api.js')(app);

  //HTML5 locationProvider support
  app.all('/*', function(req, res) {
    res.render('index', { title: 'The Main Page' });
  });
};