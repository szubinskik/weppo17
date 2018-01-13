const express = require("express")
const http = require("http")

const models = require("./models.js")
const Op = models.Op
const Game = models.Game

Game.sync()

const app = express()
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.get("/add", (req, res) => {
    res.render("add.ejs")
})

app.post("/add", (req, res) => {
    req.body.price = req.body.price.replace(",", ".") * 100
    const game = Game.build(req.body)
    game.save()
    .then(() => {
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
            res.render("edit.ejs", {
                title: game.title,
                price: game.price / 100,
                description: game.description
            })
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
        where: { id: req.query.id }
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

http.createServer(app).listen(3000)
