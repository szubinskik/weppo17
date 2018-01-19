const express = require("express")
const http = require("http")
const session = require("express-session")

const bcrypt = require("bcrypt")
const saltRounds = 11

const models = require("./models.js")
const Op = models.Op
const Game = models.Game
const User = models.User

Game.sync()
User.sync()

const app = express()
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.get("/list", (req, res) => {
    var data = [];
    var title = req.query.title||"";
    Game.findAll({
        where : {
            title : {
                [Op.iRegexp]: `.?${title}.?`
            }
        }
    }).then(games => {
        if(!games)
        {
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Baza gier jest pusta")
        }
        for(game of games)
            data.push({
                id : game.id,
                title : game.title,
                price : game.price / 100,
                description : game.description
            });
        res.render("list.ejs", {games : data});
    })
    .catch(err => {
        console.error(err)
        res.end("Error")
    })
})

app.get("/add", (req, res) => {
    res.render("add.ejs")
})

app.post("/add", (req, res) => {
    req.body.price = req.body.price.replace(",", ".") * 100
    Game.build(req.body)
    .then(game => {
        res.setHeader("Content-type", "text/html; charset=utf-8")
        res.end("Pomyślnie dodano grę.<br>Jej id to: " + game.id)
    })
    .catch(err => {
        console.error(err)
        res.end("Error")
    })
})

app.get("/edit", (req, res) => {
    Game.findOne({
        where: { id: req.query.id }
    })
    .then(game => {
        if(game) {
            game.price = (game.price / 100).toFixed(2)
            res.render("edit.ejs", { game: game })
        }
        else {
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Nie można odnaleźć żądanej gry")
        }
    })
    .catch(err => {
        console.error(err)
        res.end("Error")
    })
})

app.post("/edit", (req, res) => {
    Game.findOne({
        where: { id: req.body.id }
    })
    .then(game => {
        if(game) {
            req.body.price = req.body.price.replace(",", ".") * 100
            game.update(req.body)
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Pomyślnie zmieniono dane gry")
        }
        else {
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Nie można odnaleźć żądanej gry")
        }
    })
    .catch(err => {
        console.error(err)
        res.end("Error")
    })
})

app.get("/delete", (req, res) => {
    Game.findOne({
        where: { id: req.query.id }
    })
    .then(game => {
        if(game) {
            game.price = (game.price / 100).toFixed(2)
            res.render("delete.ejs", { game: game })
        }
        else {
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Nie można odnaleźć żądanej gry")
        }
    })
    .catch(err => {
        console.error(err)
        res.end("Error")
    })
})

app.post("/delete", (req, res) => {
    Game.destroy({
        where: { id: req.body.id }
    })
    .then(count => {
        if(count > 0) {
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Pomyślnie usunięto grę")
        }
        else {
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Nie można odnaleźć żądanej gry")
        }
    })
    .catch(err => {
        console.error(err)
        res.end("Error")
    })
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
        res.end("Pomyślnie zalogowano")
    }
    catch(err) {
        console.error(err)
        res.end("Error")
    }
})

app.post("/checkExist", (req, res) => {
    User.findOne({
        where: { user: req.body.user }
    })
    .then(user => {
        if(user) {
            res.end(true)
        }
        else {
            res.end(false)
        }
    })
    .catch(err => {
        console.error(err)
        res.end("Error")
    })
})

http.createServer(app).listen(3000)
