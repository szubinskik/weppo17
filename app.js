const express = require("express")
const http = require("http")
const session = require("express-session")
const csurf = require("csurf")

const bcrypt = require("bcrypt")
const saltRounds = 12

const models = require("./models.js")
const sequelize = models.sequelize
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

// na razie bez większego zastanowienia nad ustawieniami
app.use(session({
    secret: 'keyboard cat',
    cookie: { secure: false }
}))

app.locals.Game = Game
app.locals.User = User
app.locals.Order = Order
app.locals.Op = Op

require('./routes')(app);

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get("/login", (req, res) => {
    res.render("login.ejs", { wrong: false })
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
            res.end("Pomyślnie zalogowano")
        }
        else {
            res.render("login.ejs", { wrong: true })
        }
    }
    catch(err) {
        console.error(err)
        res.end("Error")
    }
})

app.get("/register", (req, res) => {
    res.render("register.ejs")
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

app.get("/checkExist", (req, res) => {
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

app.get("/orderDetails", (req, res) => {
    Order.findOne({
        where: { id: req.query.id },
        include: [{
            model: Game
        }, {
            model: User
        }]
    })
    .then(order => {
        order.total = 0
        order.games.forEach(game => {
            game.count = game.gameOrders.count
            game.total = game.count * game.price / 100
            order.total += game.total
        })
        res.render("orderDetails.ejs", { order: order })
    })
    .catch(err => {
        console.error(err)
        res.setHeader("Content-type", "text/html; charset=utf-8")
        res.end("Wystąpił błąd")
    })
})

http.createServer(app).listen(3000)
