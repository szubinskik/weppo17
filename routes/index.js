module.exports = function(app){

  require('./basket.js')(app);
  require('./admin.js')(app);

}