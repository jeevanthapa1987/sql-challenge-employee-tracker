-- Populate Department table
INSERT INTO Department (name) VALUES ('Engineering');
INSERT INTO Department (name) VALUES ('Marketing');
INSERT INTO Department (name) VALUES ('Sales');

-- Populate Role table
INSERT INTO Role (title, salary, department_id) VALUES ('Software Engineer', 80000, 1);
INSERT INTO Role (title, salary, department_id) VALUES ('Product Manager', 100000, 1);
INSERT INTO Role (title, salary, department_id) VALUES ('Marketing Coordinator', 60000, 2);
INSERT INTO Role (title, salary, department_id) VALUES ('Sales Representative', 70000, 3);

-- Populate Employee table
INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Smith', 2, 1);
INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ('David', 'Johnson', 3, 1);
INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ('Emily', 'Williams', 4, NULL);
