const mysql = require('mysql2');
const inquirer = require('inquirer');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

connection.connect(function(error){
    if (error){
        console.error(error.message);
        return;
    } else {
        console.log('connected with id ' + connection.threadId);
    }

});