const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'access.log');

function logger(req, res, next) {
  const logEntry = `[${new Date().toISOString()}] IP: ${req.ip} - ${req.method} ${req.originalUrl}\n`;

  process.stdout.write(logEntry);

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error('Failed to write log:', err);
  });

  next();
}

module.exports = logger;
