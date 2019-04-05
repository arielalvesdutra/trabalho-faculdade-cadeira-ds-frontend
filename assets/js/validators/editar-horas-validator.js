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

export {
    validateFilterFormFields
}