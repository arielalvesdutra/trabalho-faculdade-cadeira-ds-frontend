import { getUserPayload, getUserToken } from './auth.js'
import { backendUrl } from './backend.js'
import handleErrors from './handle-errors.js'

export default class HourAdjustmentService {
    constructor() {
    }

    deleteHourAdjustment = async (id) => {
        const userToken = getUserToken()
        let headers = new Headers()

        headers.append('Authorization', 'bearer ' + userToken)

        const httpMethod = {
            method: 'DELETE',
            mode: 'cors',
            headers: headers
        }

        const url = backendUrl + 'hours-adjustments/' + id

        fetch(url, httpMethod)
            .then(handleErrors)
            .catch(error => {

            })
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
                throw 'error'
            })

        return employeeAdjustments

    }

    insertHourAdjustment = async (date, entryHour, exitHour, justificationId) => {
        const userPayload = getUserPayload()
        const userToken = getUserToken()
        let headers = new Headers()

        headers.append('Authorization', 'bearer ' + userToken)

        const url = backendUrl + 'hours-adjustments'

        let data = new FormData()

        data.append('date', date)
        data.append('entryHour', entryHour)
        data.append('exitHour', exitHour)
        data.append('userId', userPayload.id)
        data.append('justification[id]', justificationId)

        let httpMethod = {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: data
        }

        fetch(url, httpMethod)
            .then(handleErrors)
            .catch(error => {

            })
    }

    updateHourAdjustment = async (id, date, entryHour, exitHour, justificationId) =>  {
        const userToken = getUserToken()
        let headers = new Headers()

        headers.append('Authorization', 'bearer ' + userToken)

        const url = backendUrl + 'hours-adjustments/' + id

        let data = new FormData()

        data.append('date', date)
        data.append('entryHour', entryHour)
        data.append('exitHour', exitHour)
        data.append('justification[id]', justificationId)

        let httpMethod = {
            method: 'PUT',
            mode: 'cors',
            headers: headers,
            body: data
        }

        fetch(url, httpMethod)
            .then(handleErrors)
            .catch(error => {

            })
    }
}
