var express = require('express')
var mongoDao = require('./mongoDao')
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

// Route to delete a lecturer
router.get("/delete/:lid", (req, res) => {
    const lecturerId = req.params.lid;

                // If no modules are taught delete the lecturer from MongoDB
                mongoDao.deleteLecturer(lecturerId)
                    .then(() => {
                        res.redirect("/lecturers"); 
                    })
                    .catch((error) => {
                        console.error("Error deleting lecturer:", error);
                        res.status(500).send("Error deleting lecturer.");
                    });
            })
        
       


module.exports = router;
