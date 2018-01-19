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

module.exports.User = sequelize.define("users", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true, 
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false
    }
})
