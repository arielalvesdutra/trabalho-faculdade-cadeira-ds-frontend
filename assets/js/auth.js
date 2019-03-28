
const hasUserSelectedProfile = () => {
    let selectedProfile = JSON.parse(localStorage.getItem('__selectedProfile__'))

    if (selectedProfile == null) {
        return false
    }

    return true
}

const isLogged = () => {
    let tokenStorage = JSON.parse(localStorage.getItem('__hasApp__'))

    if (tokenStorage == null) {
        return false
    }

    return true
}

const validadeProfileSelection = () => {
    if (!hasUserSelectedProfile()) {
        window.location.href = 'selecionar-perfil.html'
    }
}

const validateToken = () => {
    if(!isLogged()) {
        window.location.href = 'login.html'
    }
}

export { validadeProfileSelection, validateToken }
