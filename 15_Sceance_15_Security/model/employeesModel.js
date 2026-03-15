const db = require('../config/db')

const getEmployees = async () => {
    const [rows] = await db.query('SELECT * FROM employees')
    return rows
}

const getEmployee = async (id) => {
    const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [id])
    return rows[0]
}

const reinitializeId = async () => {
    await db.query('ALTER TABLE employees AUTO_INCREMENT = 1')
}

const createEmployee = async (firstname, lastname) => {
    const [result] = await db.query(
        'INSERT INTO employees (firstname, lastname) VALUES (?, ?)',
        [firstname, lastname]
    )
    return result
}

const updateAnEmployee = async (fields, values) => {
    const [result] = await db.query(
        `UPDATE employees SET ${fields.join(', ')} WHERE id = ?`,
        values
    )
    return result
}

const deleteAnEmployee = async (id) => {
    const [result] = await db.query('DELETE FROM employees WHERE id = ?', [id])
    return result
}

module.exports = { getEmployees, getEmployee, reinitializeId, createEmployee, updateAnEmployee, deleteAnEmployee }
