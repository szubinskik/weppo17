const express = require("express")
const http = require("http")

const models = require("./models.js")
const Game = models.Game

Game.sync()

// test
Game.findAll().then(arr => {
    arr.forEach(game => {
        console.log(game.title + ": " + game.price)
    })
})