
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

const logOut = message => {

    if (message) {
        alert(message)
    }

    localStorage.removeItem('__hasApp__')
    localStorage.removeItem('__selectedProfile__')

    window.location.href = 'index.html'
}

const validateEmployeeProfile = () => {
    let selectedProfile = getSelectedProfile()

    if (selectedProfile.code != 'employee') {
        alert('Você não tem permissão para acessar esta página.')
        window.location.href = 'dashboard.html'
    }
}

const validateProfileSelection = () => {
    if (!hasUserSelectedProfile()) {
        window.location.href = 'selecionar-perfil.html'
    }
}

const validateToken = () => {
    if (!isLogged()) {
        logOut()
    }
}

export {
    getSelectedProfile,
    getUserPayload,
    getUserToken,
    isLogged,
    logOut,
    validateEmployeeProfile,
    validateProfileSelection,
    validateToken
}
