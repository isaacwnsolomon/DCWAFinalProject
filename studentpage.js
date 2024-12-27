var express = require('express')
var mysqlDAO = require('./mySqlDao')
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
});
        // Route to display Add Student
    router.get('/add', (req, res) => {
        res.render('addStudent');
    });

    // route to hadnle add student
    router.post('/add',(req,res) => {
        const {name, age} = req.body;
        mysqlDAO.addStudent(name,age)
        .then(() => {
            res.redirect('/students');
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error adding student');
        })
    })

// Route to display Update Student
router.get('/update/:id', (req, res) => {
    const studentId = req.params.id;
    mysqlDAO.getStudentById(studentId)
        .then((student) => {
            res.render('updateStudent', { student });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error fetching student details');
        });
});

// Route to handle Update Student
router.post('/update/:id', (req, res) => {
    const studentId = req.params.id;
    const { name, age } = req.body;
    mysqlDAO.updateStudent(studentId, name, age)
        .then(() => {
            res.redirect('/students'); // Redirect to the students list
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error updating student');
        });
});

module.exports = router;