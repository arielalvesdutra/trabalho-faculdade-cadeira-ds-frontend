
import { getSelectedProfile, getUserPayload, validadeProfileSelection, validateToken } from './auth.js'
import HourAdjustmentService from './hour-adjustment-service.js'

const startUp = () => {
    validateToken()
    validadeProfileSelection()
}

startUp()