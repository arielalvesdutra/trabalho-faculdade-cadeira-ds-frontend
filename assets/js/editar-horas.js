import { getSelectedProfile, getUserPayload, validadeProfileSelection, validateToken } from './auth.js'
import HourAdjustmentService from './hour-adjustment-service.js'
import JustificationService from './justification-service.js'

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
                <td id="td_actions_${adjustment['id']}">
                    <button id="editButton" value="${adjustment['id']}" 
                            class="edit-button" title="Editar ajuste">
                        <i class="far fa fa-edit"></i>
                    </button>
                    <button id="deleteButton" value="${adjustment['id']}" 
                            class="delete-button" title="Excluir ajuste">
                        <i class="far fa fa-trash"></i>
                    </button>    
                </td>
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

const cancelAdjustmentEditOnClick = () => {
    let cancelButton = document.querySelector('#cancelButton')
    cancelButton.onclick = () => {
        cancelPreviusEditMode()
    }
}

const cancelPreviusEditMode = () => {
    let previusEditMode = document.querySelector('[edit-mode]')

    if (previusEditMode) {
        previusEditMode.removeAttribute('edit-mode')
        let editColumns = document.querySelectorAll('[edit-culumn]')
        
        for (let editColumn of editColumns) {
            editColumn.remove()
        }

       let normalColumns =  previusEditMode.children

       for (let normalColumn of normalColumns) {
           normalColumn.removeAttribute('hidden')
       }
    }
}

const deleteAdjustmentOnClick = () => {

    let deleteButtons = document.getElementsByClassName('delete-button')
    for (let deleteButton of deleteButtons) {
        deleteButton.onclick = async () => {

            let confirmDelete = confirm ("Deseja realmente excluir este registro?")

            if (confirmDelete) {

                try {
                    
                    let hourAdjustmentService = new HourAdjustmentService()
                    hourAdjustmentService.deleteHourAdjustment(deleteButton.value)
                    
                    loadHoursAdjustments()
                } catch (error) {
                    
                }
            }
        }
    }
}

const editAdjustmentOnClick = () => {
    let editButtons = document.getElementsByClassName('edit-button')
    for (let editButton of editButtons) {
        editButton.onclick = async () => {
                        
            cancelPreviusEditMode()
            showCurrentEditMode(editButton.value)
            cancelAdjustmentEditOnClick()
            updateAdjustmentOnClick()
        }
    }
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

const getJustifications = async () => {

    let justificationService = new JustificationService()

    let justifications = await justificationService.getJustifications()

    return justifications
}

const loadHoursAdjustments = async () => {
    try {

        let justifications = await getJustifications()
        let hoursAdjustments = await getHoursAdjustments()

        fillAdjustmentsListTable(hoursAdjustments, justifications)

        deleteAdjustmentOnClick()
        editAdjustmentOnClick()

    } catch (error) {
        fillAdjustmentsListTable(null, null)
    }
}

const sendAdjustmentApprovalRequestOnClick = () => {
    let sendApprovalRequestLink = document.querySelector("#sendApprovalRequest")

    sendApprovalRequestLink.onclick = ( )=> {
        let hourAdjustmentService = new HourAdjustmentService()
        hourAdjustmentService.sendAdjustmentApprovalRequest()

        alert("Ajustes enviados para aprovação!")

        window.location.href = 'dashboard.html'
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

const showCurrentEditMode = id => {
    let currentLine = document.querySelector('#tr_' + id) 
    let dateColumn = document.querySelector('#td_date_' + id)
    let entryColumn = document.querySelector('#td_entry_' + id)
    let exitColumn = document.querySelector('#td_exit_' + id)
    let durationColumn = document.querySelector('#td_duration_' + id)
    let justificationColumn = document.querySelector('#td_justification_' + id)
    let actionsColumn = document.querySelector('#td_actions_' + id)

    dateColumn.setAttribute('hidden', 'hidden')
    entryColumn.setAttribute('hidden', 'hidden')
    exitColumn.setAttribute('hidden', 'hidden')
    durationColumn.setAttribute('hidden', 'hidden')
    justificationColumn.setAttribute('hidden', 'hidden')
    justificationColumn.setAttribute('hidden', 'hidden')
    actionsColumn.setAttribute('hidden', 'hidden')

    currentLine.setAttribute('edit-mode', 1)

    let editDateColumn = document.createElement('td')
    let editEntryColumn = document.createElement('td')
    let editExitColumn = document.createElement('td')
    let editDurationColumn = document.createElement('td')
    let editJustificationColumn = document.createElement('td')
    let editActionsColumn = document.createElement('td')

    editDateColumn.innerHTML = 
            `<input type="date" class="admin-date-input" id="edit-date-input" 
                value="${dateColumn.innerHTML}"/>`

    editEntryColumn.innerHTML =
            `<input type="time" value="${entryColumn.innerHTML}" id="edit-entry-input"
                class="admin-time-input">`

    editExitColumn.innerHTML =
            `<input type="time" value="${exitColumn.innerHTML}" id="edit-exit-input"
                class="admin-time-input">`

    let options =  Object.values(document.querySelector('#justification-options').childNodes)

    let allOptions = options.reduce((allOptions, option) => allOptions + option.outerHTML , '')

    editJustificationColumn.innerHTML = 
            `<select id="edit-justification-select" class="admin-input">
                ${allOptions}
            </select>`

    editActionsColumn.innerHTML = 
            `<button id="updateButton" value="${id}"
                    class="update-button" title="Confirmar edição do ajuste">
                <i class="far fa fa-check"></i>
            </button>
             <button id="cancelButton"
                    class="cancel-button" title="Cancelar edição do ajuste">
                <i class="far fa fa-ban"></i>
            </button>`

    editDateColumn.setAttribute('edit-culumn', 1)
    editEntryColumn.setAttribute('edit-culumn', 1)
    editExitColumn.setAttribute('edit-culumn', 1)
    editDurationColumn.setAttribute('edit-culumn', 1)
    editJustificationColumn.setAttribute('edit-culumn', 1)
    editActionsColumn.setAttribute('edit-culumn', 1)

    currentLine.appendChild(editDateColumn)
    currentLine.appendChild(editEntryColumn)
    currentLine.appendChild(editExitColumn)
    currentLine.appendChild(editDurationColumn)
    currentLine.appendChild(editJustificationColumn)
    currentLine.appendChild(editActionsColumn)
}

const startUp = async () => {
    validateToken()
    validadeProfileSelection()

    let userPayload = getUserPayload()
    setUserNameTitle(userPayload.name)

    let selectedProfile = getSelectedProfile()
    setProfileTitle(selectedProfile.name)

    try {
        let justifications = await getJustifications()
        fillJustificationOptions(justifications)

        let hoursAdjustments = await getHoursAdjustments()
        fillAdjustmentsListTable(hoursAdjustments, justifications)
    } catch(error) {
        fillAdjustmentsListTable(null, null)
    }

    deleteAdjustmentOnClick()
    editAdjustmentOnClick()
    sendAdjustmentApprovalRequestOnClick()
}

const updateAdjustmentOnClick = () => {
    let updateButton =  document.querySelector('#updateButton')
    updateButton.onclick = () => {
        let id = updateButton.value
        let date = document.querySelector('#edit-date-input').value
        let entryHour = document.querySelector('#edit-entry-input').value
        let exitHour = document.querySelector('#edit-exit-input').value
        let justificationId = document.querySelector('#edit-justification-select').value
        
        try {
            
            validateUpdateFields(id, date, entryHour, exitHour, justificationId)

            const hourAdjustmentService = new HourAdjustmentService()
            hourAdjustmentService.updateHourAdjustment(id, date, entryHour, exitHour, justificationId)

            loadHoursAdjustments()
            
        } catch(error) {
            console.log(error)
        }
    }
}

const validateUpdateFields =  (id, date, entryHour, exitHour, justificationId) => {

    if (id <= 0) {
        throw 'preencher o id'
    }

    if (date.value <= 0) {
        throw 'preencher a data'
    }

    if (entryHour.value <= 0) {
        throw 'preencher a entrada'
    }

    if (exitHour.value <= 0) {
        throw 'preencher a saída'
    }

    if (justificationId <= 0) {
        throw 'preencher a justificativa'
    }
}

startUp()