var promisemysql = require('promise-mysql') // import promise myswl
let pool;
// create connection pool 
promisemysql.createPool({
    connectionLimit : 3,
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'proj2024mysql'
    })
    .then(p => {
    pool = p
    })
    .catch(e => {
    console.log("pool error:" + e)
   })
// function to retrieve all students
   var getStudents = function(){
    return new Promise((resolve,reject) => {
        pool.query('SELECT * FROM student') // query to return all students
        .then((data) => {
            console.log(data)
            resolve(data)
        })
        .catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}
// function add new student
const addStudent = function (sid, name, age) {
    return new Promise((resolve, reject) => {
        //  validation
        if (!sid || sid.length !== 4) {
            reject(new Error("Invalid Student ID"));
            return;
        }
        if (!name || name.length < 2) {
            reject(new Error("Invalid Name"));
            return;
        }
        if (!age || age < 18) {
            reject(new Error("Invalid Age"));
            return;
        }
        // inserts student into the stuendt table
        pool.query('INSERT INTO student (sid, name, age) VALUES (?, ?, ?)', 
            [sid, name, age])
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
// Get a student by ID
const getStudentById = function (id) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM student WHERE sid = ?', [id]) // query student ID
            .then((results) => {
                if (results.length > 0) {
                    resolve(results[0]); // Return the first result
                } else {
                    reject('Student not found');
                }
            })
            .catch((error) => {
                console.error('Error fetching student by ID:', error);
                reject(error);
            });
    });
};

// Update a student by ID
const updateStudent = function (sid, name, age) {
    return new Promise((resolve, reject) => {
        // Basic validation
        if (!name || name.length < 2) {
            reject(new Error("Invalid Name"));
            return;
        }
        if (!age || age < 18) {
            reject(new Error("Invalid Age"));
            return;
        }
        // update student record in student table
        pool.query('UPDATE student SET name = ?, age = ? WHERE sid = ?', 
            [name, age, sid])
            .then((result) => {
                if (result.affectedRows === 0) {
                    reject(new Error("Student not found"));
                } else {
                    resolve(result);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};
// Function to retrieve grades for students
var getGrades = function(){
    return new Promise((resolve,reject) => {
        // Query to join student, grade, and module tables
        pool.query(' SELECT student.name AS Student, module.name AS Module, grade.grade AS Grade, grade.sid, grade.mid FROM student LEFT JOIN grade ON student.sid = grade.sid LEFT JOIN module ON grade.mid = module.mid ORDER BY student.name')
        .then((data) => {
            console.log(data)
            resolve(data)
        })
        .catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}
// Function to retrieve modules taught by a specific lecturer
const getModulesByLecturerId = function(lecturerId) {
    return new Promise((resolve, reject) => {
        // query to return lecturers by ID 
        pool.query('SELECT * FROM module WHERE lecturer = ?', [lecturerId])
            .then((results) => {
                resolve(results);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
// Function to search students by ID or name
const searchStudents = function(searchTerm) {
    return new Promise((resolve, reject) => {
        // query to search students based off id or name
        const query = `
            SELECT * FROM student 
            WHERE sid LIKE ? OR name LIKE ?
        `;
        const searchPattern = `%${searchTerm}%`;
        
        pool.query(query, [searchPattern, searchPattern])
            .then((results) => {
                resolve(results);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
// function to get grade by student ID or module ID 
const getGradeByIds = function(studentId, moduleId) {
    return new Promise((resolve, reject) => {
       // Query grade by student and module IDs
        const query = `
            SELECT student.name AS Student, module.name AS Module, 
                   grade.grade AS Grade, grade.sid, grade.mid
            FROM grade
            JOIN student ON grade.sid = student.sid
            JOIN module ON grade.mid = module.mid
            WHERE grade.sid = ? AND grade.mid = ?
        `;
        
        pool.query(query, [studentId, moduleId])
            .then((results) => {
                if (results.length > 0) {
                    resolve(results[0]);
                } else {
                    reject(new Error('Grade not found'));
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};
// function to update grade 
const updateGrade = function(studentId, moduleId, newGrade) {
    return new Promise((resolve, reject) => {
        // Validate grade
        if (newGrade < 0 || newGrade > 100) {
            reject(new Error('Grade must be between 0 and 100'));
            return;
        }
// update grade
        const query = `
            UPDATE grade 
            SET grade = ?
            WHERE sid = ? AND mid = ?
        `;
        
        pool.query(query, [newGrade, studentId, moduleId])
            .then((result) => {
                if (result.affectedRows === 0) {
                    reject(new Error('Grade not found'));
                } else {
                    resolve(result);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};
// export all functions to use in other modules
module.exports = { 
    getStudents, addStudent, getStudentById, updateStudent, getGrades, getModulesByLecturerId, searchStudents, getGradeByIds, updateGrade    
};