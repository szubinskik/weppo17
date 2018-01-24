const Sequelize = require("sequelize")

const sequelize = new Sequelize({
    database: "gamestore",
    username: "gamestore",
    password: "abc",
    dialect: "postgres"
})

const Game = sequelize.define("games", {
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

const User = sequelize.define("users", {
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

const Order = sequelize.define("orders", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true, 
        primaryKey: true
    }
})

Order.belongsTo(User)
Game.belongsToMany(Order, { through: "gameOrders" })
Order.belongsToMany(Game, { through: "gameOrders" })

sequelize.sync()

module.exports.Op = Sequelize.Op
module.exports.Game = Game
module.exports.User = User
module.exports.Order = Order
