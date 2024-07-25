// middleware/errorHandler.js
const fs = require('fs');
const path = require('path');

const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] Error: ${err.message}\nStack: ${err.stack}\n`;

  console.error(logMessage);

  // Append error message to a file
  fs.appendFile(path.join(__dirname, '../logs/error_logs.txt'), logMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;