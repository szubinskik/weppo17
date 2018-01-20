module.exports = function(app){

  // basket view
  app.get('/basket', function(req, res) {
    
    function _fetch_games()
    {
      var ids = [];
      var games = [];
      var Game = app.locals.Game;

      for (var id in basket.items)
      {
        var nid = parseInt(id);
        if (isNaN(nid))
          continue;

          ids.push(nid);
      }

      if (ids.length == 0)
      {
        res.render('basket/emptyBasket.ejs');
        return;
      }

      Game.findAll({
        where : { id : ids }
      
      }).then(qres => {
        for (var game of qres)
        {
          games.push({
            id : game.id,
            title : game.title,
            price : game.price/100,
            count : basket.items[game.id]
          });
        }
        res.render('./basket.ejs', { items : games });
      
      }).catch(err => {
        console.error(err);
        return [00];
      
      });
    };

    if (false)
    //if (!req.session.user)
    {
      res.render('basket/loggedoutBasket.ejs');
      return;
    }

    if (!req.session.basket)
      req.session.basket = _basket_session();

    var basket = req.session.basket;
    if (basket.items.length == 0)
    {
      res.render('basket/emptyBasket.ejs');
      return;
    }

    _fetch_games();
  });

  // ajax basket
  app.get('/_basket', function(req, res) {
    
    function _verify_id()
    {
      var Game = app.locals.Game;
      var nid = parseInt(id);
      if (isNaN(nid))
        return false;

      Game.findAll({
        where : { id : nid }
      
      }).then(ids => {
        if(!ids || ids.length == 0)
          return false;
      
      }).catch(err => {
        console.error(err);
        return false;
      
      });

      return true;
    };

    var id = req.query.id;
    if (!_verify_id())
      res.end("1");

    if (false)
    //if (!req.session.user)
    {
      res.render('basket/loggedoutBasket.ejs');
      return;
    }

    if (!req.session.basket)
      req.session.basket = _basket_session(); 
    var basket = req.session.basket;

    if (basket.items[id])
      basket.items[id]++;
    else
    {
      basket.items[id] = 1;
    }
    res.end('0');
  });

}

function _basket_session()
{
  return {
    items : {}
  }
}