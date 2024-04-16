const inquirer = require('inquirer');
const mysql = require('mysql2');

// Create connection to the MySQL database
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: ''
});

// Function to display main menu
function mainMenu() {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'View Employees by Manager',
      'View Employees by Department',
      'Add a Department',
      'Add a Role',
      'Add an Employee',
      'Update Employee Role',
      'Update Employee Manager',
      'Delete Department',
      'Delete Role',
      'Delete Employee',
      'View Total Utilized Budget of a Department',
      'Exit'
    ]
  }).then(answer => {
    switch (answer.action) {
      case 'View All Departments':
        viewDepartments();
        break;
      case 'View All Roles':
        viewRoles();
        break;
      case 'View All Employees':
        viewEmployees();
        break;
      case 'View Employees by Manager':
        viewEmployeesByManager();
        break;
      case 'View Employees by Department':
        viewEmployeesByDepartment();
        break;
      case 'Add a Department':
        addDepartment();
        break;
      case 'Add a Role':
        addRole();
        break;
      case 'Add an Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'Update Employee Manager':
        updateEmployeeManager();
        break;
      case 'Delete Department':
        deleteDepartment();
        break;
      case 'Delete Role':
        deleteRole();
        break;
      case 'Delete Employee':
        deleteEmployee();
        break;
      case 'View Total Utilized Budget of a Department':
        viewBudget();
        break;
      case 'Exit':
        connection.end();
        console.log('Goodbye!');
        break;
    }
  });
}

// Function to view all departments
function viewDepartments() {
  connection.query('SELECT * FROM Department', (err, results) => {
    if (err) throw err;
    console.table(results);
    mainMenu();
  });
}

// Function to view all roles
function viewRoles() {
  connection.query('SELECT * FROM Role', (err, results) => {
    if (err) throw err;
    console.table(results);
    mainMenu();
  });
}

// Function to view all employees
function viewEmployees() {
  connection.query('SELECT * FROM Employee', (err, results) => {
    if (err) throw err;
    console.table(results);
    mainMenu();
  });
}

// Function to view employees by manager
function viewEmployeesByManager() {
  connection.query('SELECT DISTINCT manager_id FROM Employee', (err, results) => {
    if (err) throw err;
    inquirer.prompt({
      name: 'manager',
      type: 'list',
      message: 'Select manager to view employees:',
      choices: results.map(manager => manager.manager_id)
    }).then(answer => {
      connection.query('SELECT * FROM Employee WHERE manager_id = ?', [answer.manager], (err, results) => {
        if (err) throw err;
        console.table(results);
        mainMenu();
      });
    });
  });
}

// Function to view employees by department
function viewEmployeesByDepartment() {
  connection.query('SELECT * FROM Department', (err, results) => {
    if (err) throw err;
    inquirer.prompt({
      name: 'department',
      type: 'list',
      message: 'Select department to view employees:',
      choices: results.map(department => department.id)
    }).then(answer => {
      connection.query('SELECT * FROM Employee WHERE role_id IN (SELECT id FROM Role WHERE department_id = ?)', [answer.department], (err, results) => {
        if (err) throw err;
        console.table(results);
        mainMenu();
      });
    });
  });
}

// Function to add a department
function addDepartment() {
  inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'Enter department name:'
  }).then(answer => {
    connection.query('INSERT INTO Department SET ?', { name: answer.name }, (err, result) => {
      if (err) throw err;
      console.log('Department added successfully!');
      mainMenu();
    });
  });
}

// Function to add a role
function addRole() {
  // Query departments to display for selection
  connection.query('SELECT * FROM Department', (err, departments) => {
    if (err) throw err;

    inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter role title:'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter role salary:'
      },
      {
        name: 'department_id',
        type: 'list',
        message: 'Select department for the role:',
        choices: departments.map(department => ({
          name: department.name,
          value: department.id
        }))
      }
    ]).then(answer => {
      // Insert the new role into the Role table
      connection.query('INSERT INTO Role SET ?', 
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id
        },
        (err, result) => {
          if (err) throw err;
          console.log('Role added successfully!');
          mainMenu(); // Return to the main menu
        }
      );
    });
  });
}

// Function to add an employee
function addEmployee() {
  // Query roles to display for selection
  connection.query('SELECT * FROM Role', (err, roles) => {
    if (err) throw err;

    // Query employees to display for selection as managers
    connection.query('SELECT * FROM Employee', (err, employees) => {
      if (err) throw err;

      inquirer.prompt([
        {
          name: 'first_name',
          type: 'input',
          message: "Enter employee's first name:"
        },
        {
          name: 'last_name',
          type: 'input',
          message: "Enter employee's last name:"
        },
        {
          name: 'role_id',
          type: 'list',
          message: 'Select employee role:',
          choices: roles.map(role => ({
            name: role.title,
            value: role.id
          }))
        },
        {
          name: 'manager_id',
          type: 'list',
          message: 'Select manager for the employee:',
          choices: employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
          })).concat({ name: 'None', value: null }) // Add option for no manager
        }
      ]).then(answer => {
        // Insert the new employee into the Employee table
        connection.query('INSERT INTO Employee SET ?', 
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.role_id,
            manager_id: answer.manager_id
          },
          (err, result) => {
            if (err) throw err;
            console.log('Employee added successfully!');
            mainMenu(); // Return to the main menu
          }
        );
      });
    });
  });
}




// Function to update an employee's role
function updateEmployeeRole() {
  // Query all employees to display for selection
  connection.query('SELECT * FROM Employee', (err, employees) => {
    if (err) throw err;

    inquirer.prompt([
      {
        name: 'employeeId',
        type: 'list',
        message: 'Select the employee whose role you want to update:',
        choices: employees.map(employee => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id
        }))
      },
      {
        name: 'roleId',
        type: 'input',
        message: 'Enter the new role ID:'
      }
    ]).then(answer => {
      // Update the employee's role in the Employee table
      connection.query(
        'UPDATE Employee SET role_id = ? WHERE id = ?',
        [answer.roleId, answer.employeeId],
        (err, result) => {
          if (err) throw err;
          console.log('Employee role updated successfully!');
          mainMenu(); // Return to the main menu
        }
      );
    });
  });
}

// Function to update an employee's manager
function updateEmployeeManager() {
  // Query all employees to display for selection
  connection.query('SELECT * FROM Employee', (err, employees) => {
    if (err) throw err;

    inquirer.prompt([
      {
        name: 'employeeId',
        type: 'list',
        message: 'Select the employee whose manager you want to update:',
        choices: employees.map(employee => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id
        }))
      },
      {
        name: 'managerId',
        type: 'input',
        message: 'Enter the new manager ID:'
      }
    ]).then(answer => {
      // Update the employee's manager in the Employee table
      connection.query(
        'UPDATE Employee SET manager_id = ? WHERE id = ?',
        [answer.managerId, answer.employeeId],
        (err, result) => {
          if (err) throw err;
          console.log('Employee manager updated successfully!');
          mainMenu(); // Return to the main menu
        }
      );
    });
  });
}

// Function to delete a department
function deleteDepartment() {
  // Query all departments to display for selection
  connection.query('SELECT * FROM Department', (err, departments) => {
    if (err) throw err;

    inquirer.prompt({
      name: 'departmentId',
      type: 'list',
      message: 'Select the department you want to delete:',
      choices: departments.map(department => ({
        name: department.name,
        value: department.id
      }))
    }).then(answer => {
      // Delete the selected department from the Department table
      connection.query(
        'DELETE FROM Department WHERE id = ?',
        [answer.departmentId],
        (err, result) => {
          if (err) throw err;
          console.log('Department deleted successfully!');
          mainMenu(); // Return to the main menu
        }
      );
    });
  });
}

// Function to delete a role
function deleteRole() {
  // Query all roles to display for selection
  connection.query('SELECT * FROM Role', (err, roles) => {
    if (err) throw err;

    inquirer.prompt({
      name: 'roleId',
      type: 'list',
      message: 'Select the role you want to delete:',
      choices: roles.map(role => ({
        name: role.title,
        value: role.id
      }))
    }).then(answer => {
      // Check if there are any employees associated with the selected role
      connection.query(
        'SELECT COUNT(*) AS count FROM Employee WHERE role_id = ?',
        [answer.roleId],
        (err, result) => {
          if (err) throw err;

          if (result[0].count > 0) {
            console.log('Cannot delete the role because there are employees associated with it.');
            mainMenu(); // Return to the main menu
          } else {
            // Delete the selected role from the Role table
            connection.query(
              'DELETE FROM Role WHERE id = ?',
              [answer.roleId],
              (err, result) => {
                if (err) throw err;
                console.log('Role deleted successfully!');
                mainMenu(); // Return to the main menu
              }
            );
          }
        }
      );
    });
  });
}

// Function to delete an employee
function deleteEmployee() {
  // Query all employees to display for selection
  connection.query('SELECT * FROM Employee', (err, employees) => {
    if (err) throw err;

    inquirer.prompt({
      name: 'employeeId',
      type: 'list',
      message: 'Select the employee you want to delete:',
      choices: employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }))
    }).then(answer => {
      // Delete the selected employee from the Employee table
      connection.query(
        'DELETE FROM Employee WHERE id = ?',
        [answer.employeeId],
        (err, result) => {
          if (err) throw err;
          console.log('Employee deleted successfully!');
          mainMenu(); // Return to the main menu
        }
      );
    });
  });
}

// Function to view the total utilized budget of a department
function viewBudget() {
  // Query all departments to display for selection
  connection.query('SELECT * FROM Department', (err, departments) => {
    if (err) throw err;

    inquirer.prompt({
      name: 'departmentId',
      type: 'list',
      message: 'Select the department to view the total utilized budget:',
      choices: departments.map(department => ({
        name: department.name,
        value: department.id
      }))
    }).then(answer => {
      // Query to calculate the total utilized budget of the selected department
      connection.query(
        'SELECT SUM(Role.salary) AS total_budget FROM Employee JOIN Role ON Employee.role_id = Role.id WHERE Role.department_id = ?',
        [answer.departmentId],
        (err, result) => {
          if (err) throw err;
          console.log(`Total utilized budget of ${departments.find(dep => dep.id === answer.departmentId).name}: $${result[0].total_budget}`);
          mainMenu(); // Return to the main menu
        }
      );
    });
  });
}
// Connect to MySQL database
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
  mainMenu();
});
