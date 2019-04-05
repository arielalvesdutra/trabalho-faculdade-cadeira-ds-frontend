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

export { createColumn } 