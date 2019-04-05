import { getSelectedProfile, getUserPayload, 
    validateEmployeeProfile, validateProfileSelection, 
    validateToken } from '../auth.js'
import HourAdjustmentService from '../services/hour-adjustment-service.js'
import JustificationService from '../services/justification-service.js'
import { validateFilterFormFields } from '../validators/editar-horas-validator.js'
import { appendElements, createColumn, hideChildELements } from '../pages-components.js'

let adjustments
let justific 

let filters = {
    initDate:  '',
    endDate: '',
    justificationId:  0
}

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

            filters.initDate = initDate
            filters.endDate = endDate
            filters.justificationId = justificationId

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

const getJustifications = async () => {

    let justificationService = new JustificationService()

    let justifications = await justificationService.getJustifications()

    return justifications
}

const hasFilters = () => {
    if (filters.initDate)  {
        return true
    }
    
    if (filters.endDate)  {
        return true
    }

    if (filters.justificationId)  {
        return true
    }

    return false
}

const loadHoursAdjustments = async (hoursAdjustments = null) => {
    try {

        justific = await getJustifications()
        
        if (!hoursAdjustments) {
            adjustments = await getHoursAdjustments()
        }
        
        if (hasFilters()) {
            
            let hourAdjustmentService = new HourAdjustmentService()

            adjustments = await hourAdjustmentService.searchEmployeeAdjustments(
                    filters.initDate, filters.endDate, filters.justificationId
            )
        }
                
        fillAdjustmentsListTable(adjustments, justific)

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

const getAdjustmentById = id => {
    let selectedAdjustment 
    
    adjustments.forEach(adjustment => {
        if (adjustment.id == id) {

            selectedAdjustment = adjustment
        }
    })
    
    return selectedAdjustment
}

const showCurrentEditMode = id => {

    let currentAdjustment = getAdjustmentById(id)

    let currentLine = document.querySelector('#tr_' + id) 
    currentLine.setAttribute('edit-mode', 1)

    hideChildELements(currentLine)

    let editDateColumn = createColumn('', '', [ ['edit-culumn', 1 ] ],
        `<input type="date" class="admin-date-input" id="edit-date-input" 
        value="${currentAdjustment.date}"/>
        <span id="edit-date-error" edit-errors class="fields-errors"></span>`
    )

    let editEntryColumn = createColumn('', '', [ ['edit-culumn', 1] ],
        `<input type="time" value="${currentAdjustment.entryHour}" id="edit-entry-input"
        class="admin-time-input">
        <span id="edit-entry-error" edit-errors class="fields-errors"></span>`
    )

    let editExitColumn = createColumn('', '', [ ['edit-culumn', 1 ] ],
        `<input type="time" value="${currentAdjustment.exitHour}" id="edit-exit-input"
        class="admin-time-input">
        <span id="edit-exit-error" edit-errors class="fields-errors"></span>`
    )

    let editDurationColumn = createColumn('', '', [ ['edit-culumn', 1 ] ], ``)

    
    let options = Object.values(document.querySelector('#justification-options').childNodes)
    
    let allOptions = options.reduce((allOptions, option) => allOptions + option.outerHTML , '')
    
    let editJustificationColumn = createColumn('', '', [ ['edit-culumn', 1 ] ], 
        `<select id="edit-justification-select" class="admin-input">
            ${allOptions}
        </select>
        <span id="edit-justification-error" edit-errors class="fields-errors"></span>`
    )

    let editActionsColumn = createColumn('', '', [ ['edit-culumn', 1 ] ], 
        `<button id="updateButton" value="${id}"
                class="update-button" title="Confirmar edição do ajuste">
            <i class="far fa fa-check"></i>
        </button>
            <button id="cancelButton"
                class="cancel-button" title="Cancelar edição do ajuste">
            <i class="far fa fa-ban"></i>
        </button>`
    )
    
    appendElements(currentLine, [
        editDateColumn,
        editEntryColumn,
        editExitColumn,
        editDurationColumn,
        editJustificationColumn,
        editActionsColumn
    ])
}

const startUp = async () => {
    validateToken()
    validateProfileSelection()
    validateEmployeeProfile()

    let userPayload = getUserPayload()
    setUserNameTitle(userPayload.name)

    let selectedProfile = getSelectedProfile()
    setProfileTitle(selectedProfile.name)

    try {
        justific = await getJustifications()
        fillJustificationOptions(justific)

        loadHoursAdjustments()

    } catch(error) {

    }
    
    deleteAdjustmentOnClick()
    editAdjustmentOnClick()
    
    sendAdjustmentApprovalRequestOnClick()
    filterAdjustmentFormOnSubmit()
}
const showError = (fieldId, errorMessages) => {
    let errorField = document.querySelector('#' + fieldId)

    errorField.innerHTML = errorMessages
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

    let hasErrors = false
    let dateErrorMessage = ''
    let entryErrorMessage = ''
    let exitErrorMessage = ''
    let justificationErrorMessage = ''

    if (id <= 0) {
        hasErrors = true
    }
    
    if (!date) {
        
        dateErrorMessage = "<br>Favor preencher a data."
        hasErrors = true
    }

    if (!entryHour) {
        entryErrorMessage ="<br>Favor preencher a entrada."
        hasErrors = true
    }
    
    if (!exitHour) {
        exitErrorMessage = "<br>Favor preencher a saída."
        hasErrors = true
    }
    
    if (new Date(date + ' ' + entryHour) > new Date(date + ' ' + exitHour) &&
        exitHour
    ) {
        entryErrorMessage = "<br>A data de entrada é maior que date de saída."
        
        hasErrors = true
    }
    
    if (justificationId <= 0) {
        justificationErrorMessage = "<br>Favor preencher a justificativa."
        hasErrors = true
    }
    
    showError('edit-date-error', dateErrorMessage )
    showError('edit-entry-error', entryErrorMessage)
    showError('edit-exit-error', exitErrorMessage)
    showError('edit-justification-error', justificationErrorMessage)

    if (hasErrors) {
        throw 'Erro de preenchimento de campos'
    }
}

window.onload = startUp()
