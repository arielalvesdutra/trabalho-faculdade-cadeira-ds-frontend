import { getSelectedProfile, getUserPayload, validadeProfileSelection, validateToken } from '../auth.js'
import HourAdjustmentService from '../services/hour-adjustment-service.js'
import JustificationService from '../services/justification-service.js'

const buildAdjustmentsListTbody = (hoursAdjustments, justifications) => {

    let tbody = ''
    
    if (hoursAdjustments) {
        let justificationsArray = formatJusticationsIndexWithId(justifications)
        let hoursAdjustmentsArray = Object.values(hoursAdjustments)

        hoursAdjustmentsArray.forEach((adjustment) => {
            tbody +=
                `<tr id="tr_${adjustment['id']}">
                <td id="td_date_${adjustment['id']}">${adjustment["date"]}</td>
                <td id="td_entry_${adjustment['id']}">${adjustment["entryHour"]}</td>
                <td id="td_exit_${adjustment['id']}">${adjustment["exitHour"]}</td>
                <td id="td_duration_${adjustment['id']}">${adjustment["duration"]}</td>
                <td id="td_justification_${adjustment['id']}">${justificationsArray['id_' + adjustment["justification"]["id"]]}</td>
            </tr>`
        })
    } else {
        tbody =
            `<tr>
                <td colspan="6">
                    <b>Nenhum ajuste encontrado.</b>
                </td>
            </tr>`
    }

    return tbody
}

const buildJustificationOptions = (justifications) => {
    let justificationOptions = '<option value="0">Favor selecionar a justificativa...</option>'

    let justificationsArray = Object.values(justifications)

    justificationsArray.forEach(justifications => {

        justificationOptions += `<option value="${justifications['id']}">${justifications['title']}</option >`

    });

    return justificationOptions
}

const fillAdjustmentsListTable = (hoursAdjustments, justifications) => {

    let tbody
    let adjustmentsListTable = document.querySelector('#adjustments-list-table')
    let adjustmentsListTbody = adjustmentsListTable.querySelector('tbody')

    if (hoursAdjustments){
        tbody = buildAdjustmentsListTbody(hoursAdjustments, justifications)
    } else {
        tbody = buildAdjustmentsListTbody(null, null)
    }

    adjustmentsListTbody.innerHTML = tbody
}

const fillJustificationOptions = (justifications) => {
    let justificationOptions = document.getElementById('justification-options')
    let optionsElements = buildJustificationOptions(justifications)

    justificationOptions.innerHTML = optionsElements
}

const fillStatusArea = adjustmentsStatus => {

    let adjustmentStatusArea = document.querySelector("#adjustment-status-area")

    if (adjustmentsStatus) {

        adjustmentStatusArea.innerHTML = 
            `<strong>${adjustmentsStatus.name}</strong>`

    } else {
        adjustmentStatusArea.innerHTML = 
        `<strong>Ajustes ainda não enviados para análise.</strong>`
    }
}

const filterAdjustmentFormOnSubmit = () => {
    document.filterAdjustmentsForm.onsubmit = async event => {
        event.preventDefault()

        const form = event.target
        const data = new FormData(form)

        let initDate = data.get('initDate')
        let endDate = data.get('endDate')
        let justificationId = data.get('justification')

        try {
            let hourAdjustmentService = new HourAdjustmentService()

            validateFilterFormFields(initDate, endDate, justificationId)

            let adjustments = await hourAdjustmentService.searchEmployeeAdjustments(initDate, endDate, justificationId)

            loadHoursAdjustments(adjustments)
        } catch (exception) {
            fillAdjustmentsListTable(null)
        }
    }
}

const formatJusticationsIndexWithId = justifications => {

    let justificationsArray = []

    if (justifications) {
        for (let justification of justifications) {
            justificationsArray[`id_${justification.id}`] = justification.title
        }
    }

    return justificationsArray
}

const getHoursAdjustments = async () => {
    try {

        let hourAdjustmentService = new HourAdjustmentService()

        let hoursAdjustments = hourAdjustmentService.getEmployeeAdjustments()

        return hoursAdjustments

    } catch (error) {

    }
}

const getHoursAdjustmentsStatus = async () => {
    try  {
        let hourAdjustmentService = new HourAdjustmentService()
        let adjustmentsStatus = hourAdjustmentService.getEmployeeAdjusmentsStatus()

        return adjustmentsStatus

    } catch(error) {
        return "Ajustes não inciados"
    }
}

const getJustifications = async () => {

    let justificationService = new JustificationService()

    let justifications = await justificationService.getJustifications()

    return justifications
}

const loadHoursAdjustments = async (hoursAdjustments) => {
    try {

        let justifications = await getJustifications()

        if (!hoursAdjustments) {
            hoursAdjustments = await getHoursAdjustments()
        }

        fillAdjustmentsListTable(hoursAdjustments, justifications)

    } catch (error) {
        fillAdjustmentsListTable(null, null)
    }
}

const setProfileTitle = profileTitle => {
    const profileTitleDiv = document.getElementById('profile-title')
    profileTitleDiv.innerHTML = "Perfil: " + profileTitle
}

const setUserNameTitle = userName => {
    const profileTitleDiv = document.getElementById('user-name-title')
    profileTitleDiv.innerHTML = "Usuário: " + userName
}

const startUp = async () => {
    validateToken()
    validadeProfileSelection()


    let userPayload = getUserPayload()
    setUserNameTitle(userPayload.name)

    let selectedProfile = getSelectedProfile()
    setProfileTitle(selectedProfile.name)

    try {

        let employeeAdjusmentsStatus = await getHoursAdjustmentsStatus()
        fillStatusArea(employeeAdjusmentsStatus)
    } catch(erro) {
        fillStatusArea(null)
    }

    try {
        let justifications = await getJustifications()
        fillJustificationOptions(justifications)

        let hoursAdjustments = await getHoursAdjustments()
        fillAdjustmentsListTable(hoursAdjustments, justifications)
    } catch(error) {
        fillAdjustmentsListTable(null, null)
    }

    filterAdjustmentFormOnSubmit()
}

const validateFilterFormFields = (initDate, endDate, justificationId) => {

    if (initDate && (new Date(initDate)) == 'Invalid Date') {
        throw 'Data de inicio inválida'
    }

    if (endDate && (new Date(endDate)) == 'Invalid Date') {
        throw 'Data de limite inválida'
    }

    if (justificationId < 0) {
        throw 'Justificativa inválida.'
    }
}

startUp()
