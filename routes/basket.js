module.exports = function(app){
  const Game = app.locals.Game
  const User = app.locals.User
  const Order = app.locals.Order
  const Op = app.locals.Op

  // basket view
  app.get('/basket', function(req, res) {
    
    /*
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

    _fetch_games();
    */

    (async function handle(){

      if (!req.session.user)
      {
        res.render('basket/loggedoutBasket.ejs');
        return;
      }
      
      var basket = req.session.basket;
      if (basket.items.length == 0)
      {
        res.render('basket/basket.ejs', {items: []});
        return;
      }

      res.render("basket/basket.ejs", {items : basket.items});
    })();

  });

  // ajax basket
  app.put('/_basket', function(req, res) {

    (async function handle(){
      var elem = await get_elem_by_id(req.query.id);
      res.render("basket/dberrBasket.ejs");
    })();

  });

  app.delete('/_basket', function(req, res) {
    
    function handler(is_valid, nid)
    {
      if (false)
      //if (!req.session.user)
      {
        res.end('1');
        return;
      }

      if (!req.session.basket)
        req.session.basket = _basket_session(); 
      var basket = req.session.basket;

      if (req.query.all == 'yes')
      {
        delete basket.items[nid];
        res.end('0');
      }

      if (basket.items[nid] > 1)
        basket.items[nid]--;
      else
        delete basket.items[nid];

      res.end('0');
    }

    var id = req.query.id;
    _verify_id(id, handler);

  });

  // additional functions
  // verify id and pass result (true - OK, flase - wrong) to handler
  function _verify_id(id, handler)
  {
    var nid = parseInt(id);
    if (isNaN(nid))
        return handler(false, NaN);

    Game.findAll({
      where : { id : nid }
      
    }).then(ids => {
      if(!ids || ids.length == 0)
        return handler(false, NaN);
      else
        return handler(true, nid);
      
    }).catch(err => {
      console.error(err);
      return handler(false, NaN);
    });
  };

  async function get_elem_by_id(id)
  {
    id = parseInt(id);

    if (isNaN(id))
      return null;
      
    let ids;
    try
    {
      ids = await Game.findAll({where : { id : id }});
      return ids[0];
    }
    catch (e)
    {
        return null;
    }
  }
}

