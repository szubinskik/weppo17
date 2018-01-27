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
                    description : game.description
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

}

