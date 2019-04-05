import { getUserToken } from '../auth.js'
import { backendUrl } from '../backend.js'
import handleErrors from '../handle-errors.js'

export default class JustificationService {
    constructor() {
    }

    async getJustifications() {

        const userToken = getUserToken()
        let headers = new Headers()

        headers.append('Authorization', 'bearer ' + userToken)

        const httpMethod = {
            method: 'GET',
            mode: 'cors',
            headers: headers
        }

        const url = backendUrl + 'justifications'

        let justifications = await fetch(url, httpMethod)
            .then(handleErrors)
            .then(response => response.json())
            .then(json => json)
            .catch(error => {
            })

        return justifications
    };
}