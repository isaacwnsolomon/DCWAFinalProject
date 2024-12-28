var express = require('express')
var mongoDao = require('./mongoDao')
var mysqlDAO = require('./mySqlDao') 
const router = express.Router();

router.get("/", (req,res) => {
    mongoDao.findAll()
    .then((data) => {
        console.log("OK=" + JSON.stringify(data))
        res.render("lecturer", { lecturersList: data });
    })
    .catch((error) => {
        console.log("Err=" + JSON.stringify(error))
        res.send(err)
    })
})

// Updated delete route
router.get("/delete/:lid", (req, res) => {
    const lecturerId = req.params.lid;
    
    // First check if lecturer teaches any modules
    mysqlDAO.getModulesByLecturerId(lecturerId)
        .then((modules) => {
            if (modules.length > 0) {
                // Lecturer teaches modules, send error message
                res.render("lecturer", { 
                    error: `Cannot delete Lecturer ${lecturerId}. They are teaching ${modules.length} module(s).`,
                    lecturersList: [] 
                });
                
                // Get lecturers list again to rerender the page
                return mongoDao.findAll()
                    .then((data) => {
                        res.render("lecturer", { 
                            error: `Cannot delete Lecturer ${lecturerId}. They are teaching ${modules.length} module(s).`,
                            lecturersList: data 
                        });
                    });
            } else {
                // No modules = safe to delete
                return mongoDao.deleteLecturer(lecturerId)
                    .then(() => {
                        res.redirect("/lecturers");
                    });
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            res.status(500).send("Error processing request: " + error);
        });
});
        
       


module.exports = router;
