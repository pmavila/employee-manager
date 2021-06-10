require("dotenv").config();
require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

startEmployeeManager();

function startEmployeeManager() {
  _sp();
  inquirer.prompt([
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
    } else if (answers.choice === "Add Role") {
      addRole();
    } else if (answers.choice === "Add Employee") {
      addEmployee();
    } else if (answers.choice === "View Departments") {
      listDepartments();
      setTimeout(function(){
        startEmployeeManager();
      }, 500);
    } else if (answers.choice === "View Roles") {
      listRoles();
      setTimeout(function(){
        startEmployeeManager();
      }, 500);
    } else if (answers.choice === "View Employees") {
      listEmployees();
      setTimeout(function(){
        startEmployeeManager();
      }, 500);
    } else if (answers.choice === "Update Roles") {
      //updateRoles();
      updateRoles();
    } else {
      conn.end();
    }
  });
}

async function listDepartments() {
  const [rows, fields] =  await conn.promise().query(
    "SELECT * FROM departments"
  );
  console.table(rows);
  return await rows;
}

async function listRoles() {
    const [rows, fields] = await conn.promise().query(
        "SELECT * from roles",
    );
    console.table(rows);
    return await rows;
}

async function listEmployees() {
  const [rows, fields] = await conn.promise().query(
    "SELECT * FROM employees"
  );
  console.table(rows);
  return await rows;
}

function addDepartment() {
  _sp();
  listDepartments().then((departments) => {
    inquirer.prompt([
      {
        type: "input",
        message: "What is the name of the department you want to add? Enter here:",
        name: "department",
      },
    ])
    .then((answer) => {
      if(answer.department == null || answer.department == ""){
        printError('Sorry, you did not enter any name');
        addDepartment();
      } else {
        conn.query(
          "INSERT into departments (`dept_name`) VALUES (?)",
          [answer.department],
          function (err, results, fields) {
            if (err) {
              console.error(err.message);
            } else {
              listDepartments().then((deps) => {
                console.log('Added department "%s"!', answer.department);
                restart();
              })
            }
          }
        )
      } 
    });  
  });
}

function addRole() {
  _sp();
  listEmployees().then((roles) => {

  });
}

function addEmployees() {
  _sp();
  listEmployees().then((employees) => {

  });
}

function updateRoles() {
  _sp();
  listRoles().then((roles) => {
    inquirer.prompt([
      {
        type: "input",
        message: "Choose the role_id of role you wish to update. Enter here:",
        name: "role_id"
      },
    ]).then((answer) => {
      //console.log(roles[answer.role_id].title);
      var role_id = answer.role_id;
      var oldvalues = roles[role_id - 1];
      inquirer.prompt([
        {
          type: "input",
          message: "Edit the title:",
          name: "title",
          default: oldvalues.title
        },
        {
          type: "input",
          message: "Edit the salary:",
          name: "salary",
          default: oldvalues.salary
        },
        {
          type: "input",
          message: "Edit the Department ID:",
          name: "department_id",
          default: oldvalues.department_id
        }
      ]).then((answers) => {
        var newvalues = answers;
        console.log('Old values:');
        console.table(oldvalues);
        console.log('New values:');
        console.table(newvalues);
        inquirer.prompt([
          {
            type: "confirm",
            message: "Are you sure you want to save the new values?",
            default: 0,
            name: "confirmation",
          }
        ]).then((answer) => {
          if(answer.confirmation){
            _sp();
            console.log('Values Saved!');
            conn.query(
              "UPDATE roles SET `title` = ?, `salary` = ?, `department_id` = ? WHERE `role_id` = ?", 
              [newvalues.title, newvalues.salary, newvalues.department_id, role_id]
            );
          }
          listRoles().then(restart);
        })
      });
    });
  });
}

// A helper for adding spaces in between prompts
function _sp(){
  console.log('');
  console.log('');
}

// A helper for printing errors 
// - just a kludge but errors are important and must be handled elegantly.
// consider adding colors 
// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
function printError(msg){
  console.log('Oops...', msg);
}

// Restarts the employee manager prompt
function restart() {
  startEmployeeManager()
}
