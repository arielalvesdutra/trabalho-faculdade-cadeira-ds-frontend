
import { getSelectedProfile, getUserPayload, validadeProfileSelection, validateToken } from './auth.js'
import HourAdjustmentService from './hour-adjustment-service.js'
import JustificationService from './justification-service.js'

const buildAdjustmentsListTbody = (hoursAdjustments, justifications) => {

    let tbody = ''
    let justificationsArray = formatJusticationsIndexWithId(justifications)
    let hoursAdjustmentsArray = Object.values(hoursAdjustments)

    if (hoursAdjustments.length > 0) {

        hoursAdjustmentsArray.forEach((adjustment) => {
            tbody +=
                `<tr>
                <td>${adjustment["date"]}</td>
                <td>${adjustment["entryHour"]}</td>
                <td>${adjustment["exitHour"]}</td>
                <td>${adjustment["duration"]}</td>
                <td>${justificationsArray['id_' + adjustment["justification"]["id"]]}</td>
                <td>
                    <button class="edit-button" title="Editar ajuste">
                        <i class="far fa fa-edit"></i>
                    </button>
                    <button class="delete-button" title="Excluir ajuste">
                        <i class="far fa fa-trash"></i>
                    </button>
                              
                </td>
            </tr>`
        })
    } else {
        tbody =
            `<tr>
                <td colspan="6"> <b>Nenhum ajuste de horas foi inserido.</b> <td/>
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
    let adjustmentsListTable = document.querySelector('#adjustments-list-table')
    let adjustmentsListTbody = adjustmentsListTable.querySelector('tbody')
    let tbody = buildAdjustmentsListTbody(hoursAdjustments, justifications)

    adjustmentsListTbody.innerHTML = tbody
}

const fillJustificationOptions = (justifications) => {
    let justificationOptions = document.getElementById('justification-options')
    let optionsElements = buildJustificationOptions(justifications)

    justificationOptions.innerHTML = optionsElements
}

const formatJusticationsIndexWithId = justifications => {
    let justificationsArray = []

    for (let justification of justifications) {
        justificationsArray[`id_${justification.id}`] = justification.title
    }

    return justificationsArray
}

const getHoursAdjustments = async () => {
    let hourAdjustmentService = new HourAdjustmentService()

    let hoursAdjustments = hourAdjustmentService.getEmployeeAdjustments()

    return hoursAdjustments
}

const getJustifications = async () => {

    let justificationService = new JustificationService()

    let justifications = await justificationService.getJustifications()

    return justifications
}

const hideErrors = (element) => {
    let errorField = document.querySelector('#' + element)
    errorField.style.display = 'none'
    errorField.innerHTML = ''
}

const hideAllErrors = () => {
    let errorsFields = document.querySelectorAll('.fields-errors')
    for (let errorField of errorsFields) {
        errorField.style.display = 'none'
        errorField.innerHTML = ''
    }
}

const insertAdjustmentFormOnSubmit = () => {
    document.insertAdjustmentForm.onsubmit = async event => {
        event.preventDefault()

        const form = event.target
        const data = new FormData(form)

        let date = data.get('date')
        let entryHour = data.get('entryHour')
        let exitHour = data.get('exitHour')
        let justificationId = data.get('justification')

        try {
            let hourAdjustmentService = new HourAdjustmentService()

            validateInsertFormFields(date, entryHour, exitHour, justificationId)

            hourAdjustmentService.insertHourAdjustment(
                date, entryHour, exitHour, justificationId)

            loadHoursAdjustments()
        } catch (exception) {

        }
    }
}

const loadHoursAdjustments = async () => {
    let justifications = await getJustifications()
    let hoursAdjustments = await getHoursAdjustments()

    fillAdjustmentsListTable(hoursAdjustments, justifications)

}

const setProfileTitle = profileTitle => {
    const profileTitleDiv = document.getElementById('profile-title')
    profileTitleDiv.innerHTML = "Perfil: " + profileTitle
}

const setUserNameTitle = userName => {
    const profileTitleDiv = document.getElementById('user-name-title')
    profileTitleDiv.innerHTML = "Usuário: " + userName
}

const showDateErrors = message => {
    let dateErrorsDiv = document.querySelector('#date-errors')
    dateErrorsDiv.style.display = 'block'

    let error = document.createElement('DIV')
    error.innerHTML = message

    dateErrorsDiv.appendChild(error)
}

const showEntryErrors = message => {
    let entryErrorsDiv = document.querySelector('#entry-errors')
    entryErrorsDiv.style.display = 'block'
    entryErrorsDiv.innerHTML = message
}

const showExitErrors = message => {
    let extiErrorsDiv = document.querySelector('#exit-errors')
    extiErrorsDiv.style.display = 'block'
    extiErrorsDiv.innerHTML = message
}

const showJustificationErrors = message => {
    let justificationErrorsDiv = document.querySelector('#justification-errors')
    justificationErrorsDiv.style.display = 'block'
    justificationErrorsDiv.innerHTML = message
}

const startUp = async () => {
    validateToken()
    validadeProfileSelection()

    let userPayload = getUserPayload()
    setUserNameTitle(userPayload.name)

    let selectedProfile = getSelectedProfile()
    setProfileTitle(selectedProfile.name)

    let justifications = await getJustifications()
    fillJustificationOptions(justifications)

    let hoursAdjustments = await getHoursAdjustments()
    fillAdjustmentsListTable(hoursAdjustments, justifications)

    insertAdjustmentFormOnSubmit()
}

const validateInsertFormFields = (date, entryHour, exitHour, justificationId) => {
    hideAllErrors()
    let hasDateErrors = false
    let hasEntryErrors = false
    let hasExitErrors = false
    let hasJustificationErrors = false

    if (date.length <= 0) {
        showDateErrors(`<br>Favor preencher a data.</br>`)
        hasDateErrors = true
    }

    if (entryHour.length <= 0) {
        showEntryErrors(`<br>Favor preencher a entrada.</br>`)
        hasEntryErrors = true
    }

    if (exitHour.length <= 0) {
        showExitErrors(`<br>Favor preencher a saída.</br>`)
        hasExitErrors = true
    }

    if (justificationId <= 0) {
        showJustificationErrors(`<br>Favor preencher a justificativa.</br>`)
        hasJustificationErrors = true
    }

    if (hasDateErrors || hasEntryErrors || hasExitErrors || hasJustificationErrors) {

        if (!hasDateErrors) {
            hideErrors('date-errors')
        }

        if (!hasEntryErrors) {
            hideErrors('entry-errors')
        }

        if (!hasExitErrors) {
            hideErrors('exit-errors')
        }

        if (!hasJustificationErrors) {
            hideErrors('justification-errors')
        }

        throw 'Erro no preenchimento de campos'
    } else {
        hideAllErrors()
    }
}

window.onload = startUp()
