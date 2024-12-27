var express = require('express')
var mysqlDAO = require('./mySqlDao')
var app = express()

app.set('view engine', 'ejs') // after app variable



app.listen(3004, () => {
    console.log("Running on port 3004")
})

app.get("/", (req,res) => {
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