import { getUserPayload, getUserToken } from '../auth.js'
import { backendUrl } from '../backend.js'
import handleErrors from '../handle-errors.js'

export default class HourAdjustmentService {
    constructor() {
    }

    async deleteHourAdjustment(id) {
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
    };

    async getEmployeeAdjustments() {

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

    };

    async getEmployeeAdjusmentsStatus() {
        const userPayload = getUserPayload()
        const userToken = getUserToken()
        let headers = new Headers()

        headers.append('Authorization', 'bearer ' + userToken)

        const httpMethod = {
            method: 'GET',
            mode: 'cors',
            headers: headers
        }

        const url = backendUrl + 'hours-adjustments/employee/' + userPayload.id + '/status'

        let employeeAdjustments = await fetch(url, httpMethod)
            .then(handleErrors)
            .then(response => response.json())
            .then(json => json)
            .catch(error => {
                throw 'error'
            })

        return employeeAdjustments
    };

    async insertHourAdjustment(date, entryHour, exitHour, justificationId) {
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
    };

    async searchEmployeeAdjustments(initDate, endDate, justificationId) {
        const userPayload = getUserPayload()
        const userToken = getUserToken()
        let headers = new Headers()
        headers.append('Authorization', 'bearer ' + userToken)

        let filters = []

        if (initDate) {
            filters.push(`initDate=${initDate}`)
        }

        if (endDate) {
            filters.push(`endDate=${endDate}`)
        }

        if (justificationId > 0) {
            filters.push(`justificationId=${justificationId}`)
        }

        let filtersParams = filters.reduce((url, filter) => {
            if (url) {
                return url += `&${filter}`
            }

            return url += `${filter}`

        }, '')

        const url =
            backendUrl + 'search/hours-adjustments/employee/' + userPayload.id + '/filters?' + filtersParams

        let httpMethod = {
            method: 'GET',
            mode: 'cors',
            headers: headers
        }

        let employeeAdjustments = await fetch(url, httpMethod)
            .then(handleErrors)
            .then(response => response.json())
            .then(json => json)
            .catch(error => {
                throw 'error'
            })

        return employeeAdjustments
    };

    async sendAdjustmentApprovalRequest() {
        const userToken = getUserToken()
        let headers = new Headers()

        headers.set('Content-Type', 'application/json')
        headers.append('Authorization', 'bearer ' + userToken)

        const url = backendUrl + 'hours-adjustments/approval-request'

        let httpMethod = {
            method: 'POST',
            mode: 'cors',
            headers: headers
        }

        fetch(url, httpMethod)
            .then(handleErrors)
            .catch(error => {

            })
    };

    async updateHourAdjustment(id, date, entryHour, exitHour, justificationId) {
        const userToken = getUserToken()
        let headers = new Headers()

        headers.set('Content-Type', 'application/json')
        headers.append('Authorization', 'bearer ' + userToken)

        const url = backendUrl + 'hours-adjustments/' + id

        let httpMethod = {
            method: 'PUT',
            mode: 'cors',
            headers: headers,
            body: `{ 
                    "date": "${date}" ,
                    "entryHour": "${entryHour}",
                    "exitHour": "${exitHour}",
                    "justification": {
                        "id": "${justificationId}"
                    }
                }`
        }

        fetch(url, httpMethod)
            .then(handleErrors)
            .catch(error => {

            })
    };
}
