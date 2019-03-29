import { getUserPayload, getUserToken } from './auth.js'
import { backendUrl } from './backend.js'
import handleErrors from './handle-errors.js'

export default class HourAdjustmentService {
    constructor() {
    }

    getEmployeeAdjustments = async () => {

        const userPayload = getUserPayload()
        const userToken = getUserToken()
        let headers = new Headers()

        headers.append('Authorization', 'bearer ' + userToken)

        const httpMethod = {
            method: 'GET',
            mode: 'cors',
            headers: headers
        }

        const url = backendUrl + 'hours-adjustments/employee/' + userPayload.id

        let employeeAdjustments = await fetch(url, httpMethod)
            .then(handleErrors)
            .then(response => response.json())
            .then(json => json)
            .catch(error => {
            })

        return employeeAdjustments
    }
}