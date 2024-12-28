var promisemysql = require('promise-mysql')
let pool;
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

   var getStudents = function(){
    return new Promise((resolve,reject) => {
        pool.query('SELECT * FROM student')
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
        pool.query('SELECT * FROM student WHERE sid = ?', [id])
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
var getGrades = function(){
    return new Promise((resolve,reject) => {
        pool.query('SELECT student.name AS Student, module.name AS Module, grade.grade AS Grade FROM student LEFT JOIN grade ON student.sid = grade.sid LEFT JOIN module ON grade.mid = module.mid order by student.name')
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
const getModulesByLecturerId = function(lecturerId) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM module WHERE lecturer = ?', [lecturerId])
            .then((results) => {
                resolve(results);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

module.exports = { getModulesByLecturerId, getStudents, addStudent, getStudentById, updateStudent, getGrades}