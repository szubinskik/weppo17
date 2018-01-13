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
            game.price /= 100
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

app.get("/delete", (req, res) => {
    Game.findAll({
        where: { id: req.query.id }
    })
    .then(() => {
        if(game) {
            game.price /= 100
            res.render("delete.ejs", game)
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
        where: { id: req.query.id }
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

http.createServer(app).listen(3000)
