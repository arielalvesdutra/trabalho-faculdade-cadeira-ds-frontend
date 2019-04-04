import { getSelectedProfile, getUserPayload, validadeProfileSelection, validateToken } from '../auth.js'
import HourAdjustmentService from '../services/hour-adjustment-service.js'

const loadUserProfileHoursAdjustments = async () => {
    let selectedProfile = getSelectedProfile()

    setProfileTitle(selectedProfile.name)

    let hourAdjustmentService = new HourAdjustmentService()

    if (selectedProfile.code == 'employee') {

        try {

            let employeeAdjustments = await hourAdjustmentService.getEmployeeAdjustments()
    
            setEmployeeDashboardContainer(employeeAdjustments)
        } catch(error){

            setEmployeeDashboardContainer(null)
        }
    } else if (selectedProfile.code == 'course_coordinator') {
        setCoordinatorDashboardContainer()
    } else if (selectedProfile.code == 'coordinator_of_pedagogical_core') {
        setCoordinatorDashboardContainer()
    } else {
        throw 'Perfil de usuário inválido!'
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

const setCoordinatorDashboardContainer = () => {
    const employeeDashboardContainer = document.getElementById('admin-dashboard-container')

    employeeDashboardContainer.innerHTML =
        '<div class="row mt10 wrap justify-center align-items-center">' +
        '<i class="fas fa-2x fa-exclamation-circle"></i>' +
        '<h3>Você não possui Ajustes de Horas para assinar!</h3>' +
        '</div>'
}

const setEmployeeDashboardContainer = employeeAdjustments => {
    const employeeDashboardContainer = document.getElementById('admin-dashboard-container')

    if (employeeAdjustments) {

        employeeDashboardContainer.innerHTML =
            '<div class="row mt10 wrap justify-center align-items-center"> ' +
            '<strong>Você possui ' + employeeAdjustments.length + ' Reajuste(s) Iniciado(s)!</strong>' +
            '</div>' +
            '<div class="row mt25 wrap justify-around"> ' +
            '<a href="inserir-horas.html" class="admin-button">Adicionar Ajuste</a>' +
            '</div>'
    } else {
        employeeDashboardContainer.innerHTML =
            '<div class="row mt10 wrap justify-center align-items-center"> ' +
            '<i class="fas fa-2x fa-exclamation-circle"></i>' +
            '<strong>Sem Reajustes Iniciados</strong>' +
            '</div>' +
            '<div class="row mt25 wrap justify-around"> ' +
            '<a href="inserir-horas.html" class="admin-button">Inciar Ajuste</a>' +
            '</div>'
    }
}

const startUp = () => {
    validateToken()
    validadeProfileSelection()

    let userPayload = getUserPayload()
    setUserNameTitle(userPayload.name)

    loadUserProfileHoursAdjustments()
}

startUp()
