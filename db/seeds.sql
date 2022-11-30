INSERT INTO department (department_name)
VALUES ("Marketing"), ("Accounting"), ("Engineering"),("Legal"), ("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES ("Salesman", 60000, 5), ("Lawyer", 210000, 5), ("Front-end Engineer", 130000, 3), ("Accountant", 80000, 2), ("Marketer", 760000, 1), ("Lead Engineer", 400000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Johnson", 1),("Randy", "Johnson", 2), ("Bob", "Scott", 3),("Cindy", "Barton", 6), ("Chris", "Taylor", 3, 4);