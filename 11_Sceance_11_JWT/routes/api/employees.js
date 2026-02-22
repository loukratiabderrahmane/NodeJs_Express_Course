const express = require('express')
const router = express.Router()
const { getAllEmployees, createNewEmployee, updateEmployee, deleteEmployee, getSpecificEmployee } = require('../../controllers/employeesController')

router.route('/')
    .get(getAllEmployees)
    .post(createNewEmployee)
    .put(updateEmployee)
    .delete(deleteEmployee)

router.route('/:id')
    .get(getSpecificEmployee)

module.exports = router