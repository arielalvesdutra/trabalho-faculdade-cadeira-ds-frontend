import { backendUrl } from './backend.js'
import handleErrors from './handle-errors.js'

const loginFormOnSubmit = () => {
    document.loginForm.onsubmit = async event => {
        event.preventDefault()

        const form = event.target
        const data = new FormData(form)

        let email = data.get('email')
        let password = data.get('password')

        try {
            validadeSignInFields(email, password)

            const httpMethod = {
                method: 'POST',
                body: data,
                mode: 'cors'
            }

            const url = backendUrl + 'signin'

            fetch(url, httpMethod)
                .then(handleErrors)
                .then(response => response.json())
                .then(json => {
                    localStorage.setItem('__hasApp__', JSON.stringify(json))
                    window.location.href = 'selecionar-perfil.html'
                }).catch(error => {
                    localStorage.removeItem('__hasApp__')
                })

        } catch (exception) {
            console.error(exception)
        }
    }
}

/**
 * SignIn ou LogIn
 */
const validadeSignInFields = (email, password) => {
    let hasErrors = ''

    if (email.length <= 0) {
        hasErrors += "<br> É necessário preencher o e-mail."
    }

    if (!isValidEmailFormat(email) && email.length > 0) {
        hasErrors += "<br> O formato do e-mail é inválido."
    }
    
    if (password.length <= 0) {
        hasErrors += "<br> É necessário preencher a senha."
    }   

    if (password.length < 6 && password.length > 0) {
        hasErrors += "<br> A senha precisa conter no mínimo 6 caracteres."
    }

    if (hasErrors) {
        let loginDiv = document.getElementById('login-fields-errors')
        loginDiv.style.display = 'block'
        loginDiv.innerHTML = hasErrors

        throw 'Erro de preenchimento de campos!'
    } else {
        let loginDiv = document.getElementById('login-fields-errors')
        loginDiv.style.display = 'none'
    }
}

const isValidEmailFormat = email => {
    const emailRegex = /^([a-z0-9.]{1,})([@])([a-z0-9]{1,})([.])([a-z0-9.]{1,})([a-z]{1})$/

    if (emailRegex.exec(email)) {
        return true
    }

    return false
}

const startUp = () => {
    loginFormOnSubmit()
}

startUp()
