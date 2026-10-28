const winston = require("winston");
const mongoose = require("mongoose");

let connectionPromise;

module.exports = function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose);
  }

  if (!process.env.MONGODB_URI) {
    return Promise.reject(
      new Error("MONGODB_URI environment variable is required.")
    );
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((connection) => {
        winston.info("Connected to MongoDB...");
        return connection;
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
};