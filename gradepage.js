var express = require('express')
var mysqlDAO = require('./mySqlDao')
const router = express.Router();

router.get("/", (req,res) => {
    mysqlDAO.getGrades()
    .then((data) => {
        //res.send(data)
        console.log(JSON.stringify(data))
        res.render("grade", {"gradesList": data})
    })
    .catch((error) => {
        console.log(error)
    })
});
    
module.exports = router;

