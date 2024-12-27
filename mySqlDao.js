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
module.exports = { getStudents}