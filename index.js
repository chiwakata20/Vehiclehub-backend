require("dotenv").config();

const winston = require("winston");
const express = require("express");

const app = express();

require("./startup/logging")();
require("./startup/config")();
require("./startup/validation")();

const connectDB = require("./startup/db");

// Wait for MongoDB before processing requests.
// Forward connection errors to your error-handling middleware.
app.use((req, res, next) => {
  connectDB().then(() => next()).catch(next);
});

require("./startup/routes")(app);

// Start the server when running locally.
if (require.main === module) {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    winston.info(`Listening on port ${port}...`);
  });
}

// Allow Vercel to load the Express application.
module.exports = app;