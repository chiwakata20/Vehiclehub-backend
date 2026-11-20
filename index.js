require("dotenv").config();

const express = require("express");
const winston = require("winston");
const corsMiddleware = require("./middleware/cors");
const connectDB = require("./startup/db");

const app = express();

require("./startup/logging")();
require("./startup/config")();
require("./startup/validation")();

app.use(corsMiddleware);

app.use(async (req, res, next) => {
  try {
    await connectDB();
    winston.error("MongoDB connection failed", {
  errorName: error.name,
  errorMessage: error.message,
});
  } catch (error) {
    return next(error);
  }

  next();
});

require("./startup/routes")(app);

if (require.main === module) {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    winston.info(`Listening on port ${port}...`);
  });
}

module.exports = app;