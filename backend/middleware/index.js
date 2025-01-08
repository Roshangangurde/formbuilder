const fs = require('fs');
const path = require('path');

// Middleware to log incoming requests to a file
const incomingRequestLogger = (req, res, next) => {
    // Extract IP address
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Prepare log message
    const logMessage = `${req.method} ${req.url} ${ip} ${new Date().toISOString()}\n`;
    
    // Define log file path (use an absolute path to avoid confusion)
    const logFilePath = path.join(__dirname, 'log.txt');
    
    // Asynchronous logging to log.txt file
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error("Failed to write to log file", err);
        }
    });

    // Call the next middleware function
    next();
};

module.exports = {incomingRequestLogger};
