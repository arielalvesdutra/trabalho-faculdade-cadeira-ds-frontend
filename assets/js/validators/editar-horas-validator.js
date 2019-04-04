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

export {
    validateFilterFormFields, validateUpdateFields
}