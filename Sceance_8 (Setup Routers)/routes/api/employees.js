const express = require('express')
const router = express.Router()
const path = require('path')

const data = {}
data.employees = require('../../data/employees.json')

router.route('/')
    .get((req, res) => {
        res.json(data.employees)
        console.log(data.employees)
    })
    .post((req, res) => {
        res.json({
            'FirstName': req.body.FirstName,
            'LastName': req.body.LastName
        })
    })
    .put((req, res) => {
        res.json({
            'msg': 'It s A put Method',
            'FirstName': req.body.FirstName,
            'LastName': req.body.LastName
        })
    })
    .delete((req, res) => {
        res.json({
            'msg': 'Delete it succesfully',
            'id': req.body.id,
        })
    })
router.route('/:id')
    .get((req, res) => {
        const id = parseInt(req.params.id);
        const user = data.employees.find(u => u.id === id);
        if (user) {
            res.json(data.employees[req.params.id - 1])
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    })

module.exports = router