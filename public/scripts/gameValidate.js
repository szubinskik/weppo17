window.addEventListener("load", event => {
    // Form validation
    document.getElementById("gameForm").addEventListener("submit", event => {
        event.preventDefault()

        var title = document.getElementById("title").value
        var price = document.getElementById("price").value
                
        var titleOk = false
        var priceOk = false

        if(title.length > 0 && title.length <= 100) {
            document.getElementById("titleMes").innerHTML = ""
            priceOk = true
        }
        else {
            document.getElementById("titleMes").innerHTML = "Tytuł gry musi mieć od 1 do 100 znaków"
        }

        if(price.match(/^[1-9]\d*([\.,]\d\d)?$/)) {
            document.getElementById("priceMes").innerHTML = ""
            priceOk = true
        }
        else {
            document.getElementById("priceMes").innerHTML = "Niepoprawna cena"
        }

        if(titleOk && priceOk) {
            document.getElementById("gameForm").submit()
        }
    })
})
