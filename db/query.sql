SELECT employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, employees.manager_id,
CONCAT(manager.first_name,' ',manager.last_name) AS manager
FROM employees
LEFT JOIN roles
ON employees.role_id=roles.id
LEFT JOIN departments
ON roles.department_id=departments.id
LEFT JOIN employees manager 
ON manager.id =employees.manager_id
ORDER BY departments.id;