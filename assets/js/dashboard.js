import { backendUrl } from './backend.js';
import { validadeProfileSelection, validateToken } from './auth.js'

const loadUserHourAdjustments = () => {

}

const startUp = () => {
    validateToken()
    validadeProfileSelection()

    loadUserHourAdjustments()
}

startUp()
