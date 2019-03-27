import { validateToken } from './auth.js'

const buildUserProfileOptions = (userProfiles) => {
    let profileOptions = '<option value="0">Selecione o perfil desejado...</option>'

    let userProfilesArray = Object.values(userProfiles)

    userProfilesArray.forEach(profile => {

        profileOptions += `<option value="${profile['code']}">${profile['name']}</option >`
    
    });

    return profileOptions
}

const fillUserProfileOptions = (userProfiles) => {

    let selectElement = document.getElementById('profile-options')
    let optionsElements = buildUserProfileOptions(userProfiles)

    selectElement.innerHTML = optionsElements
}

const loadUserProfileOptions  = () => {

    let tokenStorage = JSON.parse(localStorage.getItem('__hasApp__'))

    let userProfiles = tokenStorage.payload.userProfiles

    fillUserProfileOptions(userProfiles)
}

const selectProfile = () => {
    document.querySelector('#select-profile-button').addEventListener('click', () => {

        try {
            const selectedOption = document.getElementById('profile-options').selectedOptions[0]

            validateSelectedOption(selectedOption)
            
            const localSelectedProfile = {
                code: selectedOption.value,
                name: selectedOption.label
            }
    
            localStorage.setItem('__selectedProfile__',JSON.stringify( localSelectedProfile))
    
            window.location.href = 'dashboard.html'
        } catch(exception) {
            console.log(exception)
        }
    })
}

const startUp = () => {

    validateToken()
    
    loadUserProfileOptions()
    selectProfile()
}

const validateSelectedOption = selectedOption => {
    let hasErrors = ''

    if (selectedOption.value == 0) {
        hasErrors += '<br> É necessário selecionar o perfil de usuário.'
    }

    if (hasErrors) {
        let loginDiv = document.getElementById('select-profile-fields-errors')
        loginDiv.style.display = 'flex'
        loginDiv.innerHTML = hasErrors

        throw 'Perfil de usuário não selecionado!'
    }
}

/**
 * StartUp da página
 */
startUp()
