var express = require('express')
var mysqlDAO = require('./mySqlDao')
var mongoDao = require('./mongoDao')
var app = express()
const studentpage = require('./studentpage'); // Import the students route
const gradepage = require('./gradepage');
const lecturerpage = require('./lecturerpage');
app.set('view engine', 'ejs') // after app variable
var bodyParser = require('body-parser') 
app.use(bodyParser.urlencoded({extended: false})) // Middleware to parse POST form data
const { check, validationResult } = require('express-validator');



// Route for the home page
app.get("/", (req, res) => {
    res.render("index"); // Render the index.ejs view
});

app.use("/students", studentpage);

app.use("/grades", gradepage);

app.use("/lecturers", lecturerpage);


app.listen(3004, () => {
    console.log("Running on port 3004")

})