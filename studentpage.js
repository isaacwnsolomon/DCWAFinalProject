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

   // Route to handle add student with validation
router.post('/add', (req, res) => {
    const { sid, name, age } = req.body;
    const errors = [];

    // Validate Student ID
    if (!sid || sid.length !== 4) {
        errors.push("Student ID must be exactly 4 characters");
    }

    // Validate Name
    if (!name || name.length < 2) {
        errors.push("Name must be at least 2 characters");
    }

    // Validate Age 
    if (!age || parseInt(age) < 18) {
        errors.push("Age must be 18 or older");
    }

    // If there are validation errors, render form again with errors
    if (errors.length > 0) {
        return res.render('addStudent', {
            errors,
            sid,
            name,
            age
        });
    }

    // If validation passes add student
    mysqlDAO.addStudent(sid, name, parseInt(age))
        .then(() => {
            res.redirect('/students');
        })
        .catch((error) => {
            console.error(error);
            errors.push("Error adding student: " + error.message);
            res.render('addStudent', {
                errors,
                sid,
                name,
                age
            });
        });
});
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