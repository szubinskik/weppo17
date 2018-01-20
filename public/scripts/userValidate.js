window.addEventListener("load", event => {
    // Form validation
    document.getElementById("userForm").addEventListener("submit", event => {
        event.preventDefault()

        var passOk = false
        var rePassOk = false

        var name = document.getElementById("username").value

        if(name.length > 0 && name.length <= 30) {
            var req = new XMLHttpRequest()
            req.open("post", "/checkExist", true)
            req.onreadystatechange = function() {
                if(req.readyState == XMLHttpRequest.DONE)
                {
                    if(req.responseText == "Error")
                        document.getElementById("nameMes").innerHTML = "Error"
                    else if(req.responseText == true)
                        document.getElementById("nameMes").innerHTML = "Ta nazwa jest już zajęta"
                    else {
                        document.getElementById("nameMes").innerHTML = ""

                        var password = document.getElementById("password").value

                        if(password.length >= 6 && password.length <= 30) {
                            document.getElementById("passMes").innerHTML = ""
                            passOk = true
                        }
                        else {
                            document.getElementById("passMes").innerHTML = "Hasło musi mieć od 6 do 30 znaków"
                        }
                    
                        var rePassword = document.getElementById("rePassword").value
                    
                        if(password == rePassword) {
                            document.getElementById("rePassMes").innerHTML = ""
                            rePassOk = true
                        }
                        else {
                            document.getElementById("rePassMes").innerHTML = "Hasła nie są takie same"   
                        }

                        if(passOk && rePassOk) {
                            document.getElementById("userForm").submit()
                        }
                    }
                }
            }
            var form = new FormData()
            form.append('user', name)
            req.send(form)
        }
        else {
            document.getElementById("nameMes").innerHTML = "Nazwa użytkownika musi mieć od 1 do 30 znaków"
        }

    })
})