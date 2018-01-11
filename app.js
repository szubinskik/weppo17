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
    Game.create(req.body)
    .then(() => {
        res.end("Ok")
    })
    .catch(err => {
        console.error(err)
        res.end("Error")
    })
})

http.createServer(app).listen(3000)
