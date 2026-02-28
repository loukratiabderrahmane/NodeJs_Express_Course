const db = require('../config/db');
const employeesModel = require('../model/employeesModel')

const parseId = (value) => Number(value);

const isValidId = (id) => Number.isInteger(id) && id > 0;

const getAllEmployees = async (req, res, next) => {
    try {
        const employees = await employeesModel.getEmployees()
        return res.json(employees);
    } catch (err) {
        next(err);
    }
};

const createNewEmployee = async (req, res, next) => {
    try {
        const firstname = req.body?.firstname?.trim(); // trim(): elimine les espaces a droit et gauche
        const lastname = req.body?.lastname?.trim(); // ?. chaining operator : ne laisse pas le programme planter si une valeur n est pas definie

        if (!firstname || !lastname) {
            return res.status(400).json({ message: 'Missing data' });
        }
        // Reset la valeur de l id Auto-Increment si la table est vide
        const employees = await employeesModel.getEmployees();
        if (employees.length == 0) {
            await employeesModel.renitializeId()
        }

        const employee = await employeesModel.createEmployee(firstname, lastname)

        return res.status(201).json({ id: employee.insertId, firstname, lastname });
    } catch (err) {
        next(err);
    }
};

const updateEmployee = async (req, res, next) => {
    try {
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

        const result = await employeesModel.updateAnEmployee(fields, values)

        if (!result.affectedRows) { // result.affectedRows = nombre de lignes modifiées/supprimées par la requête
            return res.status(404).json({ message: 'User not found' });
        }

        const employee = await employeesModel.getEmployee(id)
        return res.json(employee);
    } catch (err) {
        next(err);
    }
};

const deleteEmployee = async (req, res, next) => {
    try {
        const id = parseId(req.body?.id);
        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }

        const result = await employeesModel.deleteAnEmployee(id);
        if (!result.affectedRows) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ message: 'Deleted successfully' });
    } catch (err) {
        next(err);
    }
};

const getSpecificEmployee = async (req, res, next) => {
    try {
        const id = parseId(req.params?.id);
        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }

        const employee = await employeesModel.getEmployee(id)
        if (!employee) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(employee);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getSpecificEmployee
};
