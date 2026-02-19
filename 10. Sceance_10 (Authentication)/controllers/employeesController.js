const data = {
    employees: require('../model/employees.json'),
    setEmployees: function (data) { this.employees = data }
}

const getAllEmployees = (req, res) => {
    res.json(data.employees)
}

const createNewEmployee = (req, res) => {
    const newEmployee = {
        id: data.employees.length + 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }

    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ message: 'First and last name are required' })
    }

    data.setEmployees([...data.employees, newEmployee])
    res.status(201).json(data.employees)
}

const updateEmployee = (req, res) => {
    const employee = data.employees.find(u => u.id === parseInt(req.body.id))
    if (!employee) return res.status(404).json({ message: 'User not found' })
    if (req.body.firstname) employee.firstname = req.body.firstname
    if (req.body.lastname) employee.lastname = req.body.lastname
    const filtredArray = data.employees.filter(emp => emp.id !== employee.id)
    const unsortedArray = [...filtredArray,employee]
    data.setEmployees(unsortedArray.sort((a,b) => a.id - b.id))
    res.json(data.employees)
}

const deleteEmployee = (req, res) => {
    const employee = data.employees.find(u => u.id === parseInt(req.body.id))
    if (!employee) return res.status(404).json({ message: 'User not found' })
    const filtredArray = data.employees.filter(emp => emp.id !== employee.id)
    data.setEmployees(filtredArray)
    res.json({
        message: "Deleted Succesfully",
    })
}

const getSpecificEmployee = (req, res) => {
    const employee = data.employees.find(u => u.id === parseInt(req.params.id))
    if (employee) {
        res.json(employee)
    } else {
        return res.status(404).json({ message: "User not found" });
    }
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getSpecificEmployee
}