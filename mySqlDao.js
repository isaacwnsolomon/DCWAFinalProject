var promisemysql = require('promise-mysql')

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
  // Add a new student
const addStudent = function (name, age) {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO student (name, age) VALUES (?, ?)', [name, age])
            .then((result) => {
                console.log('Student added:', result);
                resolve(result);
            })
            .catch((error) => {
                console.error('Error adding student:', error);
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


module.exports = { getStudents, addStudent, getStudentById, updateStudent}