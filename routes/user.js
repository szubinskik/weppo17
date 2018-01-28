module.exports = function(app) {
    const Game = app.locals.Game
    const User = app.locals.User
    const Order = app.locals.Order
    const Op = app.locals.Op

    const bcrypt = require("bcrypt")
    const saltRounds = 12;

    function authorize(options) {
        options.idField = options.idField || "id"

        return function(req, res, next) {
            if(req.session.user) {
                var ok =
                    req.query[options.idField] == req.session.user.id ||
                    (options.allowAdmin && req.session.user.admin)
                
                if(ok) {
                    next()
                }
                else {
                    res.render("user/denied.ejs")
                }
            }
            else {
                res.render("user/notLoggedIn.ejs")
            }
        }
    }

    app.locals.authorize = authorize

    app.get("/login", (req, res) => {
        res.render("user/login.ejs", { wrong: false })
    })
    
    app.post("/login", async (req, res) => {
        try {
            var user = await User.findOne({
                where: { username: req.body.username }
            })
            if(user && await bcrypt.compare(req.body.password, user.password)) {
                res.setHeader("Content-type", "text/html; charset=utf-8")
                // Tu jakieś dane do sesji
                req.session.user = user
                req.session.basket = {
                    items : [],
                    price : 0.0
                  };
                res.redirect('/');
            }
            else {
                res.render("user/login.ejs", { wrong: true })
            }
        }
        catch(err) {
            console.error(err)
            res.end("Error")
        }
    })
    
    app.get("/register", (req, res) => {
        res.render("user/register.ejs")
    })
    
    app.post("/register", async (req, res) => {
        try {
            var hash = await bcrypt.hash(req.body.password, saltRounds)
            var user = await User.create({
                username: req.body.username,
                password: hash
            })
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Pomyślnie zarejestrowano. <a href='/login'>Zaloguj się</a>")
        }
        catch(err) {
            console.error(err)
            res.end("Error")
        }
    })
    
    app.get("/_checkExist", (req, res) => {
        User.findOne({
            where: { username: req.query.user }
        })
        .then(user => {
            if(user) {
                res.end("1")
            }
            else {
                res.end("0")
            }
        })
        .catch(err => {
            console.error(err)
            res.end("Error")
        })
    })
    
    app.get("/orderDetails", authorize({ allowAdmin: true, idField: "userId" }), (req, res) => {
        Order.findOne({
            where: { id: req.query.id },
            include: [{
                model: Game
            }, {
                model: User,
                where: { id: req.query.userId }
            }]
        })
        .then(order => {
            if(order) {
                order.total = 0
                order.games.forEach(game => {
                    game.count = game.gameOrders.count
                    game.total = game.count * game.price / 100
                    order.total += game.total
                })
                res.render("user/orderDetails.ejs", { order: order })
            }
            else {
                res.setHeader("Content-type", "text/html; charset=utf-8")
                res.end("Nie można odnaleźć żądanego zamówienia")
            }
        })
        .catch(err => {
            console.error(err)
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Wystąpił błąd")
        })
    })
    
    app.get("/userOrderHistory", authorize({ allowAdmin: true }), (req, res) => {
        User.findOne({
            where: { id: req.query.id }
        })
        .then(user => {
            if(user) {
                Order.findAll({
                    include: [{
                        model: Game
                    }, {
                        model: User,
                        where: { id: req.query.id }
                    }]
                })
                .then(orders => {
                    orders.forEach(order => {
                        order.total = 0
                        order.games.forEach(game => {
                            order.total += game.gameOrders.count * game.price / 100
                        })
                    })
                    res.render("user/userOrderHistory.ejs", { orders: orders, username: user.username })
                })
            }
            else {
                res.setHeader("Content-type", "text/html; charset=utf-8")
                res.end("Nie znaleziono użytkownika")
            }
        })
        .catch(err => {
            console.error(err)
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Wystąpił błąd")
        })
    })
}