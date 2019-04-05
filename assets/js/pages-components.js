/**
 * @param {*} intendedElement 
 * @param {*} elements 
 */
const appendElements = (intendedElement, elements = []) => {

    if (intendedElement && elements) {
        for (let element of elements) {
            intendedElement.appendChild(element)
        }
    }
}

/**
 * @param {*} id 
 * @param {*} classNames 
 * @param {*} atributes 
 * @param {*} content 
 */
const createColumn = (id, classNames = [], atributes = [], content) => {
    let column = document.createElement('td')

    if (id) {
        column.setAttribute('id', id)
    }

    if (classNames) {
        for (let className of classNames) {
            column.className += ' ' + className
        }
    }

    if (atributes) {
        for (let [key, value] of atributes) {
            column.setAttribute(key, value)
        }
    }

    if (content) {
        column.innerHTML = content
    }

    return column
}

/**
 * @param {*} rootElement 
 */
const hideChildELements = rootElement => {
    let childElements = rootElement.children

    if (childElements) {

        for (let childElement of childElements) {
            childElement.setAttribute('hidden', 'hidden')
        }
    }
}

export { appendElements, createColumn, hideChildELements } 