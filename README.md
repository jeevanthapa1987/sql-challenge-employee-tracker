# Employee Manager

Employee Manager is a command-line application that allows users to manage a company's departments, roles, and employees using Node.js and MySQL.

## Features

- View all departments, roles, and employees
- Add new departments, roles, and employees
- Update employee roles
- Interactive CLI for easy management

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed on your machine (https://nodejs.org/)
- MySQL installed and running on your machine (https://www.mysql.com/downloads/)

## Installation

Follow these steps to get your development environment running:

1. Clone the repository:
   ```bash
   git clone https://example.com/employee-manager.git
   cd employee-manager


1.  Install NPM packages:
npm install

2. Create the MySQL database and tables:
-- Run these commands in your MySQL client
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2),
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT NULL,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

Configuration
Update the database connection settings in index.js with your MySQL user and password:

Usage
Run the application using Node.js:
node server.js

Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Contact
email:jeevanthapa1987@yahoo.com
Project Link: https://github.com/jeevanthapa1987/sql-challenge-employee-tracker
