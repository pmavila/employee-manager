const mysql = require("mysql2");
const inquirer = require("inquirer");
require("dotenv").config();
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// connection.connect(function (error) {
//   if (error) {
//     console.error(error.message);
//     return;
//   } else {
//     console.log("connected with id " + connection.threadId);
//     startEmployeeManager();
//   }
// });

startEmployeeManager();

function startEmployeeManager() {
  inquirer
    .prompt([
      {
        type: "list",
        message:
          "Please choose from the following list to add, view or update departments, roles or employees.",
        choices: [
          "Add Department",
          "Add Role",
          "Add Employee",
          "View Departments",
          "View Roles",
          "View Employees",
          "Update Roles",
          "Quit",
        ],
        name: "choice",
      },
    ])
    .then((answers) => {
      if (answers.choice === "Add Department") {
        addDepartment();
        console.log(answers);
      } else if (answers.choice === "Add Role") {
        //addRole();
        console.log(answers);
      } else if (answers.choice === "Add Employee") {
        //addEmployee();
        console.log(answers);
      } else if (answers.choice === "View Departments") {
        //viewDepartments();
        console.log(answers);
      } else if (answers.choice === "View Roles") {
        //viewRoles();
        console.log(answers);
      } else if (answers.choice === "View Employees") {
        //viewEmployees();
        console.log(answers);
      } else if (answers.choice === "Update Roles") {
        //updateRoles();
        console.log(answers);
      } else {
        connection.end();
      }
    });
}

function addDepartment() {
    connection.query(
        "SELECT * from departments",
        function (err, results, fields) {
            console.table(results);
            inquirer.prompt([
                {
                type: "input",
                message: "What is the name of the department you want to add.",
                name: "department",
                },
            ])
            .then((answers) => {
                console.log(answers);
                connection.query(
                    "INSERT into departments (`dept_name`) VALUES (?)",
                    [answers.department],
                    function (err, results, fields) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            connection.query(
                                "SELECT * from departments",
                                function (err, results, fields) {
                                    console.table(results);
                                    startEmployeeManager()
                                }
                            );
                        }
                    }
                )
            });
        }
    );
    
  
}
