const db = require('../config/db');

const parseId = (value) => Number(value);

const isValidId = (id) => Number.isInteger(id) && id > 0;

const getAllEmployees = async (req, res) => {
    const [employees] = await db.query('SELECT * FROM employees');
    return res.json(employees);
};

const createNewEmployee = async (req, res) => {
    const firstname = req.body?.firstname?.trim(); // trim(): elimine les espaces a droit et gauche
    const lastname = req.body?.lastname?.trim(); // ?. chaining operator : ne laisse pas le programme planter si une valeur n est pas definie

    if (!firstname || !lastname) {
        return res.status(400).json({ message: 'Missing data' });
    }
    // Reset la valeur de l id Auto-Increment si la table est vide
    const [employees] = await db.query('SELECT * FROM employees');
    if (employees.length == 0) {
        await db.query('ALTER TABLE employees AUTO_INCREMENT = 1;')
    }

    const [employee] = await db.query(
        'INSERT INTO employees (firstname, lastname) VALUES (?, ?)',
        [firstname, lastname]
    );

    return res.status(201).json({ id: employee.insertId, firstname, lastname });
};

const updateEmployee = async (req, res) => {
    const id = parseId(req.body?.id);
    if (!isValidId(id)) {
        return res.status(400).json({ message: 'Invalid id' });
    }

    const fields = [];
    const values = [];

    if (typeof req.body?.firstname === 'string' && req.body.firstname.trim()) {
        fields.push('firstname = ?');
        values.push(req.body.firstname.trim());
    }
    if (typeof req.body?.lastname === 'string' && req.body.lastname.trim()) {
        fields.push('lastname = ?');
        values.push(req.body.lastname.trim());
    }

    if (!fields.length) {
        return res.status(400).json({ message: 'No update fields provided' });
    }

    values.push(id);
    const [result] = await db.query(
        `UPDATE employees SET ${fields.join(', ')} WHERE id = ?`,
        values
    );

    if (!result.affectedRows) { // result.affectedRows = nombre de lignes modifiées/supprimées par la requête
        return res.status(404).json({ message: 'User not found' });
    }

    const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
    return res.json(rows[0]);
};

const deleteEmployee = async (req, res) => {
    const id = parseId(req.body?.id);
    if (!isValidId(id)) {
        return res.status(400).json({ message: 'Invalid id' });
    }

    const [result] = await db.query('DELETE FROM employees WHERE id = ?', [id]);
    if (!result.affectedRows) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'Deleted successfully' });
};

const getSpecificEmployee = async (req, res) => {
    const id = parseId(req.params?.id);
    if (!isValidId(id)) {
        return res.status(400).json({ message: 'Invalid id' });
    }

    const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
    if (!rows.length) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.json(rows[0]);
};

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getSpecificEmployee
};
