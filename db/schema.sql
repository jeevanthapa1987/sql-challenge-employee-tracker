-- Create Department table
CREATE TABLE Department (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30)
);

-- Create Role table
CREATE TABLE Role (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL(10, 2),
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES Department(id)
);

-- Create Employee table
CREATE TABLE Employee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES Role(id),
  FOREIGN KEY (manager_id) REFERENCES Employee(id)
);
