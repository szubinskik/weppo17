module.exports = function(app){
    
    const Game = app.locals.Game
    const User = app.locals.User
    const Order = app.locals.Order
    const Op = app.locals.Op
  
    // ajax basket
    app.get('/_list', function(req, res) {
    
        var data = [];
        var title = req.query.title||"";
        var Game = app.locals.Game;
        Game.findAll({
            where : {
                title : {
                    [Op.iRegexp]: `.?${title}.?`
                }
            }
        }).then(games => {
            if(!games)
            {
                res.setHeader("Content-type", "text/html; charset=utf-8");
                res.end("");
            }
            for(game of games)
                data.push({
                    id : game.id,
                    title : game.title,
                    price : game.price / 100,
                    description : game.description,
                });

            var user = req.session.user||null;
            res.render("list/columnList.ejs", {
                games : data,
                user : user,
            });
        })
        .catch(err => {
            console.error(err);
            res.end("Error");
        })

    });

    app.get('/_game', function(req, res) {
        
        (async function handle(){
            var game = await get_elem_by_id(req.query.id);
            if (!game)
            {
                res.end("");
                return;
            }

            res.render("list/mainList.ejs", {game : game, images : get_file_list(game.images)} );
        })();
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

    function get_file_list(text)
    {
        if(!text)
            return [];

        return text.split(";");
    }
}

