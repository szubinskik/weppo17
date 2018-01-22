window.addEventListener("load", event => {
    var form = document.getElementById("gameForm")

    var titleInput = document.getElementById("title")
    var priceInput = document.getElementById("price")

    var titleOutput = document.getElementById("titleMes")
    var priceOutput = document.getElementById("priceMes")

    // Title validation
    function titleCheck() {
        var title = titleInput.value

        if(title.length > 0 && title.length <= 100) {
            titleOutput.innerHTML = ""
            return true
        }
        else {
            titleOutput.innerHTML = "Tytuł gry musi mieć od 1 do 100 znaków"
            return false
        }
    }

    // Price validation
    function priceCheck() {
        var price = priceInput.value

        if(price.match(/^[1-9]\d*([\.,]\d\d?)?$/)) {
            priceOutput.innerHTML = ""
            return true
        }
        else {
            priceOutput.innerHTML = "Niepoprawna cena"
            return false
        }
    }

    // Input events
    titleInput.addEventListener("change", event => {
        titleCheck()
    })

    priceInput.addEventListener("change", event => {
        priceCheck()
    })

    // Form validation
    document.getElementById("gameForm").addEventListener("submit", event => {
        if(!titleCheck() || !priceCheck()) {
            event.preventDefault()
        }
    })
})
