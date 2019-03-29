
const getSelectedProfile = () => {
    return JSON.parse(localStorage.getItem('__selectedProfile__'))
}

const getUserPayload = () => {

    const tokenStoreage = JSON.parse(localStorage.getItem('__hasApp__'))

    return tokenStoreage.payload
}

const getUserToken = () => {
    const tokenStoreage = JSON.parse(localStorage.getItem('__hasApp__'))

    return tokenStoreage.token
}

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

export { 
    getSelectedProfile, 
    getUserPayload, 
    getUserToken,
    validadeProfileSelection, 
    validateToken 
}
