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
// Route to display edit grade form
router.get('/edit/:sid/:mid', (req, res) => {
    const { sid, mid } = req.params;
    
    mysqlDAO.getGradeByIds(sid, mid)
        .then((grade) => {
            res.render('editGrade', { grade });
        })
        .catch((error) => {
            console.error(error);
            res.redirect('/grades');
        });
});

// Route to handle grade update
router.post('/edit/:sid/:mid', (req, res) => {
    const { sid, mid } = req.params;
    const { grade } = req.body;
    const errors = [];

    // Validate grade
    if (!grade || grade < 0 || grade > 100) {
        errors.push("Grade must be between 0 and 100");
    }

    // If there are validation errors re-render form with errors
    if (errors.length > 0) {
        mysqlDAO.getGradeByIds(sid, mid)
            .then((gradeData) => {
                res.render('editGrade', {
                    grade: gradeData,
                    errors
                });
            })
            .catch((error) => {
                res.redirect('/grades');
            });
        return;
    }

    // Update grade if validation passes
    mysqlDAO.updateGrade(sid, mid, grade)
        .then(() => {
            res.redirect('/grades');
        })
        .catch((error) => {
            console.error(error);
            mysqlDAO.getGradeByIds(sid, mid)
                .then((gradeData) => {
                    res.render('editGrade', {
                        grade: gradeData,
                        errors: [error.message]
                    });
                })
                .catch(() => {
                    res.redirect('/grades');
                });
        });
});    
module.exports = router;

