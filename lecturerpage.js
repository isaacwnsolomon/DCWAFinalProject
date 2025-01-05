// Importing necessary imports
var express = require('express')
var mongoDao = require('./mongoDao')
var mysqlDAO = require('./mySqlDao') 
const router = express.Router();

// route to get and display all lecturers
router.get("/", (req,res) => {
    mongoDao.findAll() // fetch all lecturees from MongoDB
    .then((data) => {
        res.render("lecturer", { lecturersList: data }); // render lecturers list
    })
    .catch((error) => {
        res.send(err) // send error message
    })
})

// Updated delete route
router.get("/delete/:lid", (req, res) => {
    const lecturerId = req.params.lid; // get lecturer id from parameters
    
    // First check if lecturer teaches any modules
    mysqlDAO.getModulesByLecturerId(lecturerId)
        .then((modules) => {
            if (modules.length > 0) {
                // Lecturer teaches modules send error message
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
            // hadndel any erorrs during process
            console.error("Error:", error);
            res.status(500).send("Error processing request: " + error);
        });
});
        
       

// export so can be used in other parts of app
module.exports = router;
