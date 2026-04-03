# Node.js Web Server

A simple HTTP web server built with Node.js that handles multiple routes and logs URL visits to files.

## Features

- **5 Routes**: `/`, `/users`, `/products`, `/books`, `/display`
- **File Logging**: Automatically logs all URL visits with timestamps
- **Data Storage**: Saves user, product, and book data to text files
- **Query Parameter Processing**: Extracts and validates URL parameters

## How to Run

1. **Start the server:**

   ```bash
   node web_server.js
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:3000/
   ```

## Example Usage

**Add a user with query parameters:**

```
http://localhost:3000/users?id=1&name=John&age=25&city=NewYork&university=NYU
```

This will:

- Add John's information to `users.txt`
- Log the visit to `log.txt` with timestamp and parameter count
- Display a success message in the browser

## File Structure

```
├── web_server.js      # Main server file
├── products.txt       # Product data storage (auto-created)
├── users.txt         # User data storage (auto-created)
├── books.txt         # Book data storage (auto-created)
└── log.txt           # URL visit logs (auto-created)
```

## Available Routes

| Route       | Parameters                      | Description               |
| ----------- | ------------------------------- | ------------------------- |
| `/`         | None                            | Home page with navigation |
| `/users`    | id, name, age, city, university | Add user data             |
| `/products` | id, title, price                | Add product data          |
| `/books`    | id, title, edition, year, press | Add book data             |
| `/display`  | None                            | View all stored data      |

## Requirements

- Node.js (any recent version)
- No additional dependencies required

---

**Port:** 3000 (default) | **Author:** Student Project
