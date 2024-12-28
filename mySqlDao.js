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
const addStudent = function (name, age) {
    return new Promise((resolve, reject) => {
        // Generate a new sid (G + number, padded to 3 digits)
        pool.query('SELECT MAX(CAST(SUBSTRING(sid, 2) AS UNSIGNED)) as maxId FROM student')
            .then(result => {
                const nextId = (result[0].maxId || 0) + 1;
                const newSid = 'G' + String(nextId).padStart(3, '0');
                
                // Insert new student with generated sid
                return pool.query('INSERT INTO student (sid, name, age) VALUES (?, ?, ?)', 
                    [newSid, name || null, age || null]);
            })
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
const updateStudent = function (id, name, age) {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE student SET name = ?, age = ? WHERE sid = ?', [name, age, id])
            .then((result) => {
                console.log('Student updated:', result);
                resolve(result);
            })
            .catch((error) => {
                console.error('Error updating student:', error);
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