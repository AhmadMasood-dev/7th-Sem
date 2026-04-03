const http = require('http');
const fs = require('fs');
const url = require('url');

// Function to get IP class based on first octet
function getIpClass(ipAddress) {
  const firstOctet = parseInt(ipAddress.split('.')[0]);

  if (firstOctet >= 1 && firstOctet <= 126) return 'A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'D';
  if (firstOctet >= 240 && firstOctet <= 255) return 'E';

  return null;
}

// Function to read and filter employees by IP class
function getEmployeesByClass(className) {
  try {
    const data = fs.readFileSync('./employees.json', 'utf8');
    const employees = JSON.parse(data);

    return employees.filter(employee => {
      if (employee.ipAddress) {
        return getIpClass(employee.ipAddress) === className;
      }
      return false;
    });
  } catch (error) {
    console.error('Error reading employees.json:', error);
    return [];
  }
}

// CRUD Operations Functions

// 1. Delete Class E Employees
function deleteClassEEmployees() {
  try {
    const data = fs.readFileSync('./employees.json', 'utf8');
    const employees = JSON.parse(data);

    const filteredEmployees = employees.filter(employee => {
      if (employee.ipAddress) {
        return getIpClass(employee.ipAddress) !== 'E';
      }
      return true;
    });

    fs.writeFileSync('./employees.json', JSON.stringify(filteredEmployees, null, 2));
    return { success: true, deletedCount: employees.length - filteredEmployees.length };
  } catch (error) {
    console.error('Error deleting Class E employees:', error);
    return { success: false, error: error.message };
  }
}

// 2. Update Class D Employees
function updateClassDEmployees() {
  try {
    const data = fs.readFileSync('./employees.json', 'utf8');
    const employees = JSON.parse(data);

    let updatedCount = 0;
    const updatedEmployees = employees.map(employee => {
      if (employee.ipAddress && getIpClass(employee.ipAddress) === 'D') {
        updatedCount++;
        return { ...employee, company: 'XYZ Corp' };
      }
      return employee;
    });

    fs.writeFileSync('./employees.json', JSON.stringify(updatedEmployees, null, 2));
    return { success: true, updatedCount };
  } catch (error) {
    console.error('Error updating Class D employees:', error);
    return { success: false, error: error.message };
  }
}

// 3. Insert New Employees
function insertNewEmployees() {
  try {
    // Read existing employees
    const existingData = fs.readFileSync('./employees.json', 'utf8');
    const existingEmployees = JSON.parse(existingData);

    // Read new employees
    const newData = fs.readFileSync('./new_employees.json', 'utf8');
    const newEmployees = JSON.parse(newData);

    // Get the highest existing ID
    const maxId = Math.max(...existingEmployees.map(emp => emp.id || 0));

    // Reassign IDs to new employees to avoid duplicates
    const newEmployeesWithUniqueIds = newEmployees.map((employee, index) => ({
      ...employee,
      id: maxId + index + 1
    }));

    // Combine arrays
    const combinedEmployees = [...existingEmployees, ...newEmployeesWithUniqueIds];

    // Save updated file
    fs.writeFileSync('./employees.json', JSON.stringify(combinedEmployees, null, 2));
    return { success: true, insertedCount: newEmployees.length };
  } catch (error) {
    console.error('Error inserting new employees:', error);
    return { success: false, error: error.message };
  }
}

// 4. Retrieve Class C Employees
function retrieveClassCEmployees() {
  try {
    const data = fs.readFileSync('./employees.json', 'utf8');
    const employees = JSON.parse(data);

    const classCEmployees = employees.filter(employee => {
      if (employee.ipAddress) {
        return getIpClass(employee.ipAddress) === 'C';
      }
      return false;
    });

    return { success: true, employees: classCEmployees };
  } catch (error) {
    console.error('Error retrieving Class C employees:', error);
    return { success: false, error: error.message };
  }
}

// Function to display IP class statistics
function displayIpClassStatistics() {
  const classA = getEmployeesByClass('A');
  const classB = getEmployeesByClass('B');
  const classC = getEmployeesByClass('C');
  const classD = getEmployeesByClass('D');
  const classE = getEmployeesByClass('E');

  return {
    classA: classA.length,
    classB: classB.length,
    classC: classC.length,
    classD: classD.length,
    classE: classE.length
  };
}

// Execute CRUD operations automatically when server starts
function executeCrudOperations() {
  // Display initial statistics
  displayIpClassStatistics();

  // 1. Insert new employees first
  insertNewEmployees();

  // 2. Update Class D employees
  updateClassDEmployees();

  // 3. Retrieve Class C employees
  retrieveClassCEmployees();

  // 4. Delete Class E employees
  deleteClassEEmployees();

}

// Simple HTTP server for basic IP class filtering (optional)
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  switch (pathname) {
    case '/api/employees/classA':
      const classAEmployees = getEmployeesByClass('A');
      res.writeHead(200);
      res.end(JSON.stringify({
        class: 'A',
        description: 'IP addresses 1-126',
        employees: classAEmployees,
        count: classAEmployees.length
      }, null, 2));
      break;

    case '/api/employees/classB':
      const classBEmployees = getEmployeesByClass('B');
      res.writeHead(200);
      res.end(JSON.stringify({
        class: 'B',
        description: 'IP addresses 128-191',
        employees: classBEmployees,
        count: classBEmployees.length
      }, null, 2));
      break;

    case '/api/employees/classC':
      const classCEmployees = getEmployeesByClass('C');
      res.writeHead(200);
      res.end(JSON.stringify({
        class: 'C',
        description: 'IP addresses 192-223',
        employees: classCEmployees,
        count: classCEmployees.length
      }, null, 2));
      break;

    case '/api/employees/classD':
      const classDEmployees = getEmployeesByClass('D');
      res.writeHead(200);
      res.end(JSON.stringify({
        class: 'D',
        description: 'IP addresses 224-239',
        employees: classDEmployees,
        count: classDEmployees.length
      }, null, 2));
      break;

    case '/api/employees/classE':
      const classEEmployees = getEmployeesByClass('E');
      res.writeHead(200);
      res.end(JSON.stringify({
        class: 'E',
        description: 'IP addresses 240-255',
        employees: classEEmployees,
        count: classEEmployees.length
      }, null, 2));
      break;

    default:
      res.writeHead(404);
      res.end(JSON.stringify({
        error: 'Route not found',
        message: 'CRUD operations are executed automatically on server start'
      }, null, 2));
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);

  // Execute all CRUD operations automatically
  executeCrudOperations();
});

