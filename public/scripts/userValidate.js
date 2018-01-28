window.addEventListener("load", event => {
    var form = document.getElementById("userForm")

    var nameInput = document.getElementById("username")
    var passInput = document.getElementById("password")
    var rePassInput = document.getElementById("rePassword")

    var nameOutput = document.getElementById("nameMes")
    var passOutput = document.getElementById("passMes")
    var rePassOutput = document.getElementById("rePassMes")

    // username validation (asychronous)
    function nameCheck(handler) {
        var name = nameInput.value

        if(name.length > 0 && name.length <= 30) {
            var req = new XMLHttpRequest()
            req.open("get", `/_checkExist?user=${name}`, true)
            req.onreadystatechange = function() {
                if(req.readyState == XMLHttpRequest.DONE)
                {
                    if(req.responseText == "Error") {
                        nameOutput.innerHTML = "Błąd bazy danych"
                        if(handler) {
                            handler(false)
                        }    
                    }
                    else if(req.responseText == "1") {
                        nameOutput.innerHTML = "Ta nazwa jest już zajęta"
                        if(handler) {
                            handler(false)
                        }
                    }  
                    else {
                        nameOutput.innerHTML = ""
                        if(handler) {
                            handler(true)
                        }
                    }
                }
            }
            req.send()
        }
        else {
            nameOutput.innerHTML = "Nazwa użytkownika musi mieć od 1 do 30 znaków"
            if(handler) {
                handler(false)
            }
        }
    }

    //password validation
    function passCheck() {
        var password = passInput.value

        if(password.length >= 6) {
            passOutput.innerHTML = ""
            return true
        }
        else {
            passOutput.innerHTML = "Hasło musi mieć co najmniej 6 znaków"
            return false
        }
    }

    //repeated password validation
    function rePassCheck() {
        var password = passInput.value
        var rePassword = rePassInput.value

        if(password == rePassword) {
            rePassOutput.innerHTML = ""
            return true
        }
        else {
            rePassOutput.innerHTML = "Hasła nie są identyczne"
            return false 
        }
    }

    // Input events
    nameInput.addEventListener("change", event => {
        nameCheck()
    })

    passInput.addEventListener("change", event => {
        passCheck()
    })

    rePassInput.addEventListener("change", event => {
        rePassCheck()
    })

    // Form validation
    form.addEventListener("submit", event => {
        event.preventDefault()

        var passOk = passCheck()
        var rePassOk = rePassCheck()
        nameCheck(nameOk => {
            if(nameOk && passOk && rePassOk) {
                form.submit()
            }
        })
    })
})