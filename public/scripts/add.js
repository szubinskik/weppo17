window.addEventListener("load", event => {
    // Form validation
    document.getElementById("gameForm").addEventListener("submit", event => {
        event.preventDefault()

        var title = document.getElementById("title").value
        var price = document.getElementById("price").value
                
        var titleOk = true
        var priceOk = true

        if(title.length > 0) {
            document.getElementById("titleMes").innerHTML = ""
            priceOk = true
        }
            else {
            document.getElementById("titleMes").innerHTML = "To pole nie może być puste"
            titleOk = false
        }

        if(price.match(/^[1-9]\d*([\.,]\d\d)?$/)) {
            document.getElementById("priceMes").innerHTML = ""
            priceOk = true
        }
        else {
            document.getElementById("priceMes").innerHTML = "Niepoprawna cena"
            priceOk = false
        }

        if(titleOk && priceOk) {
            document.getElementById("gameForm").submit()
        }
    })
})
