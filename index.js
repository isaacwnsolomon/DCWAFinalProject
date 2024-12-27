var express = require('express')
var mysqlDAO = require('./mySqlDao')
var app = express()
const studentpage = require('./studentpage'); // Import the students route
app.set('view engine', 'ejs') // after app variable




// Route for the home page
app.get("/", (req, res) => {
    res.render("index"); // Render the index.ejs view
});

app.use("/students", studentpage);

app.listen(3004, () => {
    console.log("Running on port 3004")

})