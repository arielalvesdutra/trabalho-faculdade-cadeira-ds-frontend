
import { getSelectedProfile, getUserPayload, validadeProfileSelection, validateToken } from './auth.js'
import HourAdjustmentService from './hour-adjustment-service.js'
import JustificationService from './justification-service.js'


const buildNotificationOptions = (notifications) => {
    let notificationOptions = '<option value="0">Favor selecionar a justificativa...</option>'

    let notificationsArray = Object.values(notifications)

    notificationsArray.forEach(notifications => {

        notificationOptions += `<option value="${notifications['id']}">${notifications['title']}</option >`
    
    });

    return notificationOptions
}

const fillJustificationOptions = (justifications) => {
    let justificationOptions = document.getElementById('justification-options')
    let optionsElements = buildNotificationOptions(justifications)

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
    
    let justifications = await getJustifications()

    fillJustificationOptions(justifications)
    
    /**
     * setarOTituloDoNomeDoUsuario()
     * 
     * setarOTituloDoGrupoDoUsuario()
     * 
     * carregar&ListarAsHorasDoUsuario()
     * 
     * inserirHoras&CarregarNovaLista()
     */
}

startUp()