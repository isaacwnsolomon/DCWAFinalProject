var express = require('express')
var mysqlDAO = require('./mySqlDao')
var app = express()
const router = express.Router();





router.get("/", (req,res) => {
    mysqlDAO.getStudents()
    .then((data) => {
        //res.send(data)
        console.log(JSON.stringify(data))
        res.render("student", {"studentsList": data})
    })
    .catch((error) => {
        console.log(error)
    })
})
module.exports = router;