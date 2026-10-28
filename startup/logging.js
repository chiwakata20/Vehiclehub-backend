const winston = require("winston");

module.exports = function configureLogging() {
  winston.configure({
    level: "info",

    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),

    transports: [
      new winston.transports.Console(),
    ],

    exceptionHandlers: [
      new winston.transports.Console(),
    ],

    rejectionHandlers: [
      new winston.transports.Console(),
    ],
  });
};