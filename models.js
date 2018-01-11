const Sequelize = require("sequelize")

const sequelize = new Sequelize({
    database: "gamestore",
    username: "gamestore",
    password: "abc",
    dialect: "postgres"
})

module.exports.Op = Sequelize.Op

module.exports.Game = sequelize.define("games", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true, 
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    description: Sequelize.TEXT
})
