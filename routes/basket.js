module.exports = function(app){
  const Game = app.locals.Game
  const User = app.locals.User
  const Order = app.locals.Order
  const Op = app.locals.Op

  // basket view
  app.get('/basket', function(req, res) {

    (async function handle(){
      if (!req.session.user)
      {
        res.render('basket/loggedoutBasket.ejs');
        return;
      }
      
      var basket = req.session.basket;
      if (basket.items.length == 0)
      {
        res.render('basket/basket.ejs', {
          items: [],
          user : req.session.user
        });
        return;
      }

      items = [];

      for (item of basket.items)
      {
        var db_item = await get_elem_by_id(item.id);
        if (db_item)
        {
          db_item.count = item.count;
          items.push(db_item);
        }
      }

      res.render("basket/basket.ejs", {
        items : items,
        user : req.session.user
      });
    })();

  });

  // ajax basket
  app.get('/_bnavbar', function(req, res) {
    if (!req.session.user)
    {
      res.render('basket/loggedoutBasket.ejs');
      return;
    }

    var basket = req.session.basket;
    var user = req.session.user;
    res.render('navbar/basketNavbar.ejs', {user : user, basket : basket});
  });

  app.put('/_basket', function(req, res) {

    (async function handle(){
      if (!req.session.user)
      {
        res.render('basket/loggedoutBasket.ejs');
        return;
      }
      var basket = req.session.basket;

      var elem = await get_elem_by_id(req.query.id);
      if (elem)
      {
        var set = false;
        for (item of basket.items)
        {
          if (item.id == elem.id)
          {
            item.count++;
            set = true;
            break;
          }
        }
        if (!set)
          basket.items.push({id : elem.id, count : 1});
        basket.price += elem.price/100;
      }
      res.end();
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

