const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '..', 'logs');
const logFilePath = path.join(logDirectory, 'request_logs.txt');
const errorLogFilePath = path.join(logDirectory, 'error_logs.txt');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const logger = (req, res, next) => {
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`;
    console.log(logMessage);

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });

    next();
};

module.exports = logger;
