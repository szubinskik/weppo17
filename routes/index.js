module.exports = function(app){

  require('./basket.js')(app);
  require('./admin.js')(app);
  require('./list.js')(app);
  require('./user.js')(app);

}