module.exports = function(app) {
    const Game = app.locals.Game
    const User = app.locals.User
    const Order = app.locals.Order
    const Op = app.locals.Op

    const csrfProtection = app.locals.csrfProtection

    function authorizeAdmin(req, res, next) {
        console.log(req.session.user)
        if(req.session.user && req.session.user.admin) {
            next()
        }
        else {
            res.render("user/denied.ejs")
        }
    }

    app.get("/admin", authorizeAdmin, (req, res) => {
        res.render("admin/admin.ejs")
    })

    app.get("/add", authorizeAdmin, csrfProtection, (req, res) => {
        res.render("admin/add.ejs", { csrfToken: req.csrfToken() })
    })
    
    app.post("/add", authorizeAdmin, csrfProtection, (req, res) => {
        req.body.price = req.body.price.replace(",", ".") * 100
        Game.create(req.body)
        .then(game => {
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end(
                `Pomyślnie dodano grę.<br>
                Jej id to: ${game.id}<br>
                <a href = '/admin'>Wróc do panelu administratora</a><br>
                <a href = '/add'>Dodaj kolejną grę</a><br>
                <a href = '/list'>Przejdź do listy gier</a>`
            )
        })
        .catch(err => {
            console.error(err)
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end(
                "Wystąpił błąd<br>\
                <a href = '/add'>Wróc do panelu dodawania gier</a><br>\
                <a href = '/admin'>Przejdź do panelu administratora</a>"
            )
        })
    })
    
    app.get("/edit", authorizeAdmin, csrfProtection, (req, res) => {
        Game.findOne({
            where: { id: req.query.id }
        })
        .then(game => {
            if(game) {
                game.price = (game.price / 100).toFixed(2)
                res.render("admin/edit.ejs", { game: game, csrfToken: req.csrfToken() })
            }
            else {
                res.setHeader("Content-type", "text/html; charset=utf-8")
                res.end("Nie można odnaleźć żądanej gry<br><a href='/list'>Wróć do listy gier</a>")
            }
        })
        .catch(err => {
            console.error(err)
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Wystąpił błąd<br><a href='/list'>Wróć do listy gier</a>")
        })
    })
    
    app.post("/edit", authorizeAdmin, csrfProtection, (req, res) => {
        Game.findOne({
            where: { id: req.body.id }
        })
        .then(game => {
            if(game) {
                req.body.price = req.body.price.replace(",", ".") * 100
                game.update(req.body)
                res.setHeader("Content-type", "text/html; charset=utf-8")
                res.end("Pomyślnie zmieniono dane gry<br><a href='/list'>Wróć do listy gier</a>")
            }
            else {
                res.setHeader("Content-type", "text/html; charset=utf-8")
                res.end("Nie można odnaleźć żądanej gry<br><a href='/list'>Wróć do listy gier</a>")
            }
        })
        .catch(err => {
            console.error(err)
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Wystąpił błąd<br><a href='/list'>Wróć do listy gier</a>")
        })
    })
    
    app.get("/delete", authorizeAdmin, csrfProtection, (req, res) => {
        Game.findOne({
            where: { id: req.query.id }
        })
        .then(game => {
            if(game) {
                game.price = (game.price / 100).toFixed(2)
                res.render("admin/delete.ejs", { game: game, csrfToken: req.csrfToken() })
            }
            else {
                res.setHeader("Content-type", "text/html; charset=utf-8")
                res.end("Nie można odnaleźć żądanej gry<br><a href='/list'>Wróć do listy gier</a>")
            }
        })
        .catch(err => {
            console.error(err)
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Wystąpił błąd<br><a href='/list'>Wróć do listy gier</a>")
        })
    })
    
    app.post("/delete", authorizeAdmin, csrfProtection, (req, res) => {
        Game.destroy({
            where: { id: req.body.id }
        })
        .then(count => {
            if(count > 0) {
                res.setHeader("Content-type", "text/html; charset=utf-8")
                res.end("Pomyślnie usunięto grę<br><a href='/list'>Wróć do listy gier</a>")
            }
            else {
                res.setHeader("Content-type", "text/html; charset=utf-8")
                res.end("Nie można odnaleźć żądanej gry<br><a href='/list'>Wróć do listy gier</a>")
            }
        })
        .catch(err => {
            console.error(err)
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Wystąpił błąd<br><a href='/list'>Wróć do listy gier</a>")
        })
    })

    app.get("/userList", authorizeAdmin, (req, res) => {
        var query = req.query.name || ""
        User.findAll({
            where: {
                username: { [Op.iLike]: `%${query}%` }
            }
        })
        .then(users => {
            res.render("admin/userList.ejs", {
                users: users,
                query: query
            })
        })
        .catch(err => {
            console.error(err)
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Wystąpił błąd")
        })
    })

    app.get("/orderHistory", authorizeAdmin, (req, res) => {
        var query = req.query.name || ""
        Order.findAll({
            include: {
                model: User,
                where: {
                    username: { [Op.iLike]: `%${query}%`}
                }
            }
        })
        .then(orders => {
            res.render("admin/orderHistory.ejs", {
                orders: orders,
                query: query
            })
        })
        .catch(err => {
            console.error(err)
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Wystąpił błąd")
        })
    })
}