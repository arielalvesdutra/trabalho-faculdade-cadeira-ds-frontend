const handleErrors = (response) => {
    if (!response.ok) {
        throw response
    }
    return response;
}

export default handleErrors
