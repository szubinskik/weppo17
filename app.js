const express = require("express")
const http = require("http")
const session = require("express-session")
const csurf = require("csurf")

const models = require("./models.js")
const Op = models.Op
const Game = models.Game
const User = models.User
const Order = models.Order

const app = express()
app.set("view engine", "ejs")
app.set('views', './views');
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.locals.csrfProtection = csurf()

// sesja wygasa po 10 minutach
app.use(session({
    secret: 'keyboard cat',
    cookie: { secure: false, maxAge: 10 * 60 * 1000 }, 
    rolling: true,
    saveUninitialized: false,
    resave: true
}))

app.locals.Game = Game
app.locals.User = User
app.locals.Order = Order
app.locals.Op = Op

require('./routes')(app);

app.get('/', (req, res) => {
    var user = req.session.user||null;
    var basket = req.session.basket||null;
    res.render('index.ejs', { user : user, basket : basket });
})

app.get('/list', (req, res) => {
    res.redirect('/');
})

app.get('/sendOrder', async (req, res) => {
    var games = [
        { id: 1, count: 3}, {id: 2, count: 5}
    ]

    if(req.session.user) {
        try {
            var order = await Order.create()

            var user = await User.findOne({
                where: { id: req.session.user.id }
            })

            order.setUser(user)
    
            for(gameData of games) {
                var game = await Game.findOne({
                    where: { id: gameData.id }
                })
    
                order.addGame(game, { through: { count: gameData.count }})
            }
    
            res.end("Ok")
        }
        catch(err) {
            console.log(err)
            res.end("Error")
        }
    }
    else {
        res.render("user/notLoggedIn.ejs")
    }
})

http.createServer(app).listen(3000)
