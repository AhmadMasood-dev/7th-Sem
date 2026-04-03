const http = require('http');
const fs = require('fs');
const url = require('url');

// Initialize request counter for logging
let requestCounter = 0;

// Function to initialize required text files
function initializeFiles() {
  const files = {
    'products.txt': 'ID\t\tProduct Title\t\tPrice\n',
    'users.txt': 'ID\t\tName\t\tAge\t\tCity\t\tUniversity\n',
    'books.txt': 'ID\t\tBook Title\t\tEdition\t\tYear\t\tPress Name\n',
    'log.txt': 'Serial No.\t\tTime\t\tDate\t\tURL\t\tQuery Parameters Count\n'
  };

  Object.entries(files).forEach(([file, header]) => {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, header);
    }
  });
}

// Function to log URL visits
function logUrlVisit(url, queryParamsCount) {
  requestCounter++;
  const now = new Date();
  const time = now.toTimeString().split(' ')[0];
  const date = now.toDateString();

  const logEntry = `${requestCounter}\t\t${time}\t\t${date}\t\t${url}\t\t${queryParamsCount}\n`;

  fs.appendFile('log.txt', logEntry, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
}

// Function to append product data
function appendProductData(query) {
  if (query.id && query.title && query.price) {
    const productEntry = `${query.id}\t\t${query.title}\t\t${query.price}\n`;
    fs.appendFile('products.txt', productEntry, (err) => {
      if (err) console.error('Error writing to products.txt:', err);
    });
    return true;
  }
  return false;
}

// Function to append user data
function appendUserData(query) {
  if (query.id && query.name && query.age && query.city && query.university) {
    const userEntry = `${query.id}\t\t${query.name}\t\t${query.age}\t\t${query.city}\t\t${query.university}\n`;
    fs.appendFile('users.txt', userEntry, (err) => {
      if (err) console.error('Error writing to users.txt:', err);
    });
    return true;
  }
  return false;
}

// Function to append book data
function appendBookData(query) {
  if (query.id && query.title && query.edition && query.year && query.press) {
    const bookEntry = `${query.id}\t\t${query.title}\t\t${query.edition}\t\t${query.year}\t\t${query.press}\n`;
    fs.appendFile('books.txt', bookEntry, (err) => {
      if (err) console.error('Error writing to books.txt:', err);
    });
    return true;
  }
  return false;
}

// Function to read file content
function readFileContent(filename) {
  try {
    if (fs.existsSync(filename)) {
      return fs.readFileSync(filename, 'utf8');
    } else {
      return `File ${filename} not found.`;
    }
  } catch (error) {
    return `Error reading file ${filename}: ${error.message}`;
  }
}

// Create HTTP server with all routes
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query || {};
  const queryParamsCount = Object.keys(query).length;

  // Log the URL visit
  logUrlVisit(req.url, queryParamsCount);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  switch (pathname) {
    case '/':
      res.writeHead(200);
      res.end(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Web Server - Home</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
              .container { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
              h2 { color: #555; margin-top: 30px; }
              ul { line-height: 1.8; }
              a { color: #007acc; text-decoration: none; }
              a:hover { text-decoration: underline; }
              .example { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007acc; margin: 10px 0; }
              .stats { background-color: #e7f3ff; padding: 10px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Web Server - Home</h1>
              
              <div class="stats">
                <strong>Request Information:</strong> Query parameters count: ${queryParamsCount} | Request #${requestCounter}
              </div>

              <h2>Available Routes:</h2>
              <ul>
                <li><strong><a href="/users">/users</a></strong> - Manage users with query parameters (id, name, age, city, university)</li>
                <li><strong><a href="/products">/products</a></strong> - Manage products with query parameters (id, title, price)</li>
                <li><strong><a href="/books">/books</a></strong> - Manage books with query parameters (id, title, edition, year, press)</li>
                <li><strong><a href="/display">/display</a></strong> - View all stored data and logs</li>
              </ul>

              <h2>Test URLs with Query Parameters:</h2>
              
              <div class="example">
                <h3>Users Examples:</h3>
                <ul>
                  <li><a href="/users?id=1&name=Alice&age=28&city=Boston&university=MIT">Add Alice from MIT</a></li>
                  <li><a href="/users?id=2&name=Bob&age=22&city=Chicago&university=Northwestern">Add Bob from Northwestern</a></li>
                  <li><a href="/users?id=3&name=Carol&age=24&city=Seattle&university=UW">Add Carol from UW</a></li>
                </ul>
              </div>

              <div class="example">
                <h3>Products Examples:</h3>
                <ul>
                  <li><a href="/products?id=101&title=Smartphone&price=799">Add Smartphone ($799)</a></li>
                  <li><a href="/products?id=102&title=Laptop&price=1299">Add Laptop ($1299)</a></li>
                  <li><a href="/products?id=103&title=Headphones&price=199">Add Headphones ($199)</a></li>
                </ul>
              </div>

              <div class="example">
                <h3>Books Examples:</h3>
                <ul>
                  <li><a href="/books?id=201&title=NodeJS-Guide&edition=2nd&year=2024&press=WebPress">Add Node.js Guide</a></li>
                  <li><a href="/books?id=202&title=React-Handbook&edition=1st&year=2023&press=DevBooks">Add React Handbook</a></li>
                  <li><a href="/books?id=203&title=JavaScript-Bible&edition=5th&year=2023&press=TechPublish">Add JavaScript Bible</a></li>
                </ul>
              </div>
            </div>
          </body>
        </html>
      `);
      break;

    case '/users':
      res.writeHead(200);
      let userMessage = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Users Management</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
              .container { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
              .success { color: #28a745; background-color: #d4edda; padding: 10px; border-radius: 5px; margin: 10px 0; }
              .error { color: #dc3545; background-color: #f8d7da; padding: 10px; border-radius: 5px; margin: 10px 0; }
              .info { background-color: #e7f3ff; padding: 10px; border-radius: 5px; margin: 10px 0; }
              pre { background-color: #f8f9fa; padding: 15px; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Users Route</h1>`;

      if (queryParamsCount > 0) {
        const success = appendUserData(query);
        userMessage += `<div class="info"><strong>Query parameters received:</strong><pre>${JSON.stringify(query, null, 2)}</pre></div>`;
        if (success) {
          userMessage += '<div class="success">User data successfully added to users.txt!</div>';
        } else {
          userMessage += '<div class="error">Missing required parameters. Need: id, name, age, city, university</div>';
        }
      } else {
        userMessage += '<div class="info">No query parameters provided.<br><strong>Expected parameters:</strong> id, name, age, city, university</div>';
      }

      userMessage += `
              <div class="info">Total query parameters: ${queryParamsCount}</div>
              <p><a href="/">← Back to Home</a> | <a href="/display">View All Data →</a></p>
            </div>
          </body>
        </html>
      `;

      res.end(userMessage);
      break;

    case '/products':
      res.writeHead(200);
      let productMessage = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Products Management</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
              .container { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
              .success { color: #28a745; background-color: #d4edda; padding: 10px; border-radius: 5px; margin: 10px 0; }
              .error { color: #dc3545; background-color: #f8d7da; padding: 10px; border-radius: 5px; margin: 10px 0; }
              .info { background-color: #e7f3ff; padding: 10px; border-radius: 5px; margin: 10px 0; }
              pre { background-color: #f8f9fa; padding: 15px; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Products Route</h1>`;

      if (queryParamsCount > 0) {
        const success = appendProductData(query);
        productMessage += `<div class="info"><strong>Query parameters received:</strong><pre>${JSON.stringify(query, null, 2)}</pre></div>`;
        if (success) {
          productMessage += '<div class="success">Product data successfully added to products.txt!</div>';
        } else {
          productMessage += '<div class="error">Missing required parameters. Need: id, title, price</div>';
        }
      } else {
        productMessage += '<div class="info">No query parameters provided.<br><strong>Expected parameters:</strong> id, title, price</div>';
      }

      productMessage += `
              <div class="info">Total query parameters: ${queryParamsCount}</div>
              <p><a href="/">← Back to Home</a> | <a href="/display">View All Data →</a></p>
            </div>
          </body>
        </html>
      `;

      res.end(productMessage);
      break;

    case '/books':
      res.writeHead(200);
      let bookMessage = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Books Management</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
              .container { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
              .success { color: #28a745; background-color: #d4edda; padding: 10px; border-radius: 5px; margin: 10px 0; }
              .error { color: #dc3545; background-color: #f8d7da; padding: 10px; border-radius: 5px; margin: 10px 0; }
              .info { background-color: #e7f3ff; padding: 10px; border-radius: 5px; margin: 10px 0; }
              pre { background-color: #f8f9fa; padding: 15px; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Books Route</h1>`;

      if (queryParamsCount > 0) {
        const success = appendBookData(query);
        bookMessage += `<div class="info"><strong>Query parameters received:</strong><pre>${JSON.stringify(query, null, 2)}</pre></div>`;
        if (success) {
          bookMessage += '<div class="success">Book data successfully added to books.txt!</div>';
        } else {
          bookMessage += '<div class="error">Missing required parameters. Need: id, title, edition, year, press</div>';
        }
      } else {
        bookMessage += '<div class="info">No query parameters provided.<br><strong>Expected parameters:</strong> id, title, edition, year, press</div>';
      }

      bookMessage += `
              <div class="info">Total query parameters: ${queryParamsCount}</div>
              <p><a href="/">← Back to Home</a> | <a href="/display">View All Data →</a></p>
            </div>
          </body>
        </html>
      `;

      res.end(bookMessage);
      break;

    case '/display':
      res.writeHead(200);
      const productsContent = readFileContent('products.txt');
      const usersContent = readFileContent('users.txt');
      const booksContent = readFileContent('books.txt');
      const logContent = readFileContent('log.txt');

      res.end(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Display All Files</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
              .container { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
              h2 { color: #555; margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
              pre { background-color: #f8f9fa; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; }
              .file-section { margin-bottom: 30px; }
              .stats { background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>File Contents Display</h1>
              
              <div class="stats">
                <strong>Server Statistics:</strong> Total requests processed: ${requestCounter}
              </div>
              
              <div class="file-section">
                <h2>Products.txt</h2>
                <pre>${productsContent}</pre>
              </div>
              
              <div class="file-section">
                <h2>Users.txt</h2>
                <pre>${usersContent}</pre>
              </div>
              
              <div class="file-section">
                <h2>Books.txt</h2>
                <pre>${booksContent}</pre>
              </div>
              
              <div class="file-section">
                <h2>Log.txt</h2>
                <pre>${logContent}</pre>
              </div>
              
              <p><a href="/">← Back to Home</a></p>
            </div>
          </body>
        </html>
      `);
      break;

    default:
      res.writeHead(404);
      res.end(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>404 - Not Found</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
              .container { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
              h1 { color: #dc3545; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>404 - Page Not Found</h1>
              <p>The requested route "${pathname}" was not found.</p>
              <p><a href="/">Go back to Home</a></p>
            </div>
          </body>
        </html>
      `);
  }
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  initializeFiles();
  console.log(`Server running on http://localhost:${port}`);
  console.log('Available routes: /, /users, /products, /books, /display');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(`\nServer stopped. Total requests processed: ${requestCounter}`);
  process.exit(0);
});
