const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "academicdb"
})

connection.connect((error) => {
    if(!!error){
        console.log('Error! can not connect database: ' + error);
    } else {
        console.log('Connected database....');
    }
})

module.exports = connection;