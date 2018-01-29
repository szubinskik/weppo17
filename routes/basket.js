module.exports = function(app){
  const Game = app.locals.Game
  const User = app.locals.User
  const Order = app.locals.Order
  const Op = app.locals.Op

  const csrfProtection = app.locals.csrfProtection

  // basket view
  app.get('/basket', csrfProtection, function(req, res) {
    if (!req.session.user)
    {
      res.render('basket/loggedoutBasket.ejs');
      return;
    }
  
    res.render("basket/basket.ejs", { user : req.session.user, csrfToken : req.csrfToken() });
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

  app.get('/_blist', function(req, res) {
    (async function handle(){
      if (!req.session.user)
      {
        res.render('basket/loggedoutBasket.ejs');
        return;
      }
      
      var basket = req.session.basket;
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

      res.render("basket/listBasket.ejs", {
        items : items,
        price : basket.price,
        user : req.session.user
      });
    })();
  });

  app.put('/_basket', csrfProtection, function(req, res) {

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

  app.delete('/_basket', csrfProtection, function(req, res) {
    
    (async function handle(){
      if (!req.session.user)
      {
        res.render('basket/loggedoutBasket.ejs');
        return;
      }
      var basket = req.session.basket;

      var elem = await get_elem_by_id(req.query.id);
      if (!elem)
      {
        res.end();
        return;
      }

      for ([index, item] of basket.items.entries())
      {
        if (item.id == elem.id)
        {
          item.count--;
          basket.price -= elem.price/100;
          if (item.count <= 0)
          {
            basket.items.splice(index, 1);
          }
          break;
        }
      }
      res.end();
    })();
  });

  app.delete('/_rbasket', function(req, res) {
    if (!req.session.user)
    {
      res.render('basket/loggedoutBasket.ejs');
      return;
    }

    var basket = req.session.basket;
    basket.items = [];
    basket.price = 0;
    res.end();
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

