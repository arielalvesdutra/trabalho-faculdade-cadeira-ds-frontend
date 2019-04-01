import { isLogged, logOut } from './auth.js'

const handleErrors = (response) => {
    if (!response.ok) {

        if (response.status === 401) {

            if (isLogged) {
                logOut('Sessão expirou. Favor fazer login novamente!')
            } else {
                logOut('Usuário não logado!')
            }
        }

        throw response
    }
    return response;
}

export default handleErrors
