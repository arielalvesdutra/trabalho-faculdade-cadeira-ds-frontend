const handleErrors = (response) => {
    if (!response.ok) {
        throw (response.json());
    }
    return response;
}

export default handleErrors
