const mysql = require('mysql2')
const {DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME} = require("../helpers/env")

const connection = mysql.createConnection({
    host    : DB_HOST,
    user    : DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME 
})

connection.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("koneksi aman")
    }
})

module.exports = connection