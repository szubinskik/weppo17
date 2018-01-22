module.exports = function(app) {
    const Game = app.locals.Game
    const User = app.locals.User

    app.get("/admin", (req, res) => {
        res.render("admin/admin.ejs")
    })

    app.get("/add", (req, res) => {
        res.render("admin/add.ejs")
    })
    
    app.post("/add", (req, res) => {
        req.body.price = req.body.price.replace(",", ".") * 100
        Game.create(req.body)
        .then(game => {
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end(
                `Pomyślnie dodano grę.<br>
                Jej id to: ${game.id}<br>
                <a href = '/admin'>Wróc do panelu administratora</a>
                <a href = '/add'>Dodaj kolejną grę</a>
                <a href = '/list'>Przejdź do listy gier</a>`
            )
        })
        .catch(err => {
            console.error(err)
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end(
                `Błąd bazy danych<br>
                <a href = '/add'>Wróc do panelu dodawania gier</a><br>
                <a href = '/admin'>Przejdź do panelu administratora</a>`
            )
        })
    })
    
    app.get("/edit", (req, res) => {
        Game.findOne({
            where: { id: req.query.id }
        })
        .then(game => {
            if(game) {
                game.price = (game.price / 100).toFixed(2)
                res.render("admin/edit.ejs", { game: game })
            }
            else {
                res.setHeader("Content-type", "text/html; charset=utf-8")
                res.end("Nie można odnaleźć żądanej gry<br><a href='/list'>Wróć do listy gier</a>")
            }
        })
        .catch(err => {
            console.error(err)
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Błąd bazy danych<br><a href='/list'>Wróć do listy gier</a>")
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
            res.end("Błąd bazy danych<br><a href='/list'>Wróć do listy gier</a>")
        })
    })
    
    app.get("/delete", (req, res) => {
        Game.findOne({
            where: { id: req.query.id }
        })
        .then(game => {
            if(game) {
                game.price = (game.price / 100).toFixed(2)
                res.render("admin/delete.ejs", { game: game })
            }
            else {
                res.setHeader("Content-type", "text/html; charset=utf-8")
                res.end("Nie można odnaleźć żądanej gry<br><a href='/list'>Wróć do listy gier</a>")
            }
        })
        .catch(err => {
            console.error(err)
            res.setHeader("Content-type", "text/html; charset=utf-8")
            res.end("Błąd bazy danych<br><a href='/list'>Wróć do listy gier</a>")
        })
    })
    
    app.post("/delete", (req, res) => {
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
            res.end("Błąd bazy danych<br><a href='/list'>Wróć do listy gier</a>")
        })
    })
}