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
    description: Sequelize.TEXT,
    images: Sequelize.TEXT
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
    },
    admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
})

const Order = sequelize.define("orders", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true, 
        primaryKey: true
    }
})

const GameOrders = sequelize.define("gameOrders", {
    count: {
        type: Sequelize.SMALLINT,
        allowNull: false
    }
})

Order.belongsTo(User)
Game.belongsToMany(Order, { through: GameOrders })
Order.belongsToMany(Game, { through: GameOrders })

sequelize.sync()

module.exports.Op = Sequelize.Op
module.exports.Game = Game
module.exports.User = User
module.exports.Order = Order
