
import { getSelectedProfile, getUserPayload, validadeProfileSelection, validateToken } from './auth.js'
import HourAdjustmentService from './hour-adjustment-service.js'
import JustificationService from './justification-service.js'

const buildJustificationOptions = (justifications) => {
    let justificationOptions = '<option value="0">Favor selecionar a justificativa...</option>'

    let justificationsArray = Object.values(justifications)

    justificationsArray.forEach(justifications => {

        justificationOptions += `<option value="${justifications['id']}">${justifications['title']}</option >`

    });

    return justificationOptions
}

const fillJustificationOptions = (justifications) => {
    let justificationOptions = document.getElementById('justification-options')
    let optionsElements = buildJustificationOptions(justifications)

    justificationOptions.innerHTML = optionsElements
}

const getJustifications = async () => {

    let justificationService = new JustificationService()

    let justifications = await justificationService.getJustifications()

    return justifications
}

const startUp = async () => {
    validateToken()
    validadeProfileSelection()

    try {
        let justifications = await getJustifications()
        fillJustificationOptions(justifications)
    } catch(error) {

    }
}

startUp()