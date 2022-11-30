const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

// create connectin to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employees_db',
  },
  console.log(`Connected to the employees_db.`)
);

//create function to invoke and view or add employees

function start() {
  inquirer
    .prompt({
      name: 'office',
      type: 'list',
      message: 'Are you adding or viewing employees?',
      choices: [
        'View all employees',
        'Add an employee',
        'Update an employee',
        'View all roles',
        'Add a role',
        'View all departments',
        'Add a department',
        'Quit',
      ],
    })
    .then(function (selection) {
      console.log(selection);
      if (selection.office === 'View all employees') {
        showAllEmployees();
      } else if (selection.office === 'Add an employee') {
        addEmployee();
      } else if (selection.office === 'Update an employee') {
        updateRole();
      } else if (selection.office === 'View all roles') {
        allRoles();
      } else if (selection.office === 'Add a role') {
        addRole();
      } else if (selection.office === 'View all departments') {
        viewAllDepartments();
      } else if (selection.office === 'Add a department') {
        addDepartment();
      } else {
        quit();
      }
    });
}

//function to add an employee

function addEmployee() {
  const sql = 'SELECT * FROM roles';
  db.query(sql, (err, result) => {
    if (err) console.log(err);
    result = result.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });
    inquirer
      .prompt([
        {
          name: 'first_name',
          type: 'input',
          message: 'What is your first name?',
        },
        {
          name: 'last_name',
          type: 'input',
          message: 'What is your last name?',
        },
        {
          name: 'role_id',
          type: 'list',
          message: 'role id?',
          choices: result,
        },
        {
          name: 'manager_id',
          type: 'list',
          message: 'select a manager id...',
          choices: [1, 3, 5, 7],
        },
      ])
      .then((data) => {
        db.query(
          'INSERT INTO employee SET ?',
          {
            first_name: data.first_name,
            last_name: data.last_name,
            role_id: data.role_id,
            manager_id: data.manager_id,
          },
          (err) => {
            if (err) {
              console.log(err);
              console.log('Employee has not been added\n');
            }
            console.log('Employee has now been added\n');
            start();
          }
        );
      });
  });
}

//function to update an employee

function updateRole() {
  db.query('SELECT * FROM employee', (err, result) => {
    if (err) {
      console.log(err);
    }
    result = result.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    db.query('SELECT * FROM roles', (err, list) => {
      if (err) {
        console.log(err);
      }
      list = list.map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      });
      inquirer
        .prompt([
          {
            name: 'id',
            type: 'list',
            message: 'Please select your name',
            choices: result,
          },
          {
            name: 'title',
            type: 'list',
            message: 'Please select your new name',
            choices: list,
          },
        ])
        .then((data) => {
          db.query(
            'UPDATE employee SET ? WHERE ?',
            [
              {
                role_id: data.title,
              },
              {
                id: data.id,
              },
            ],
            function (err) {
              if (err) {
                console.log('Role has not updated\n');
                console.log(err);
              }
            }
          );
          console.log('Role has now been updated\n');
          start();
        });
    });
  });
}

//function to view the roles

function allRoles() {
  const sql = `SELECT id, title, salary, department_id FROM roles`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log('Cannot view roles');
      console.log(err);
    }
    console.log('View roles\n');
    console.table(rows);
    start();
  });
}

// function to add a role

function addRole() {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, departments) => {
    if (err) {
      console.log(err);
    }
    departments = departments.map((department) => {
      return {
        name: department.department_name,
        value: department.id,
      };
    });
    inquirer
      .prompt([
        {
          name: 'title',
          type: 'input',
          message: 'Add new Role title:',
        },
        {
          name: 'salary',
          type: 'input',
          message: 'How much is the salary for this role?',
        },
        {
          name: 'department_id',
          type: 'list',
          message: 'Which department does the role belong to?',
          choices: departments,
        },
      ])
      .then((ans) => {
        db.query(
          'INSERT INTO roles SET ?',
          {
            title: ans.title,
            salary: ans.salary,
            department_id: ans.department_id,
          },
          function (err) {
            if (err) {
              console.log(err);
              console.log('No new employee role!');
            }
          }
        );
        console.log('added new employee role!');
        start();
      });
  });
}

// function to view the departments

function viewAllDepartments() {
  console.log('THIS FUNCTION IS RETURNING WHAT I WANT');
  const sql = `SELECT id, department_name title FROM department`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log({ error: err.message });
    }
    console.log('View Departments\n');
    console.table(rows);
    start();
  });
}

// function to add a department

function addDepartment() {
  inquirer
    .prompt([
      {
        name: 'department_name',
        type: 'input',
        message: 'Add new department name:',
      },
    ])

    .then(function (ans) {
      const department_name = ans.department_name;

      const sql = `INSERT INTO department (department_name)
      VALUES (?)`;
      const params = [department_name];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log('Department has not been added\n');
          console.log(err);
        }
        console.log('New Department has now been added\n');
        result;
      });
      start();
    });
}

function quit() {
  process.exit();
}

start();
