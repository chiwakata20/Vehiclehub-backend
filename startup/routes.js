const path = require("path");
const express = require("express");
const users = require("../routes/users");
const profiles = require("../routes/profiles");
const addresses = require("../routes/addresses");
const auth = require("../routes/auth");
const Joi = require("joi");
const vehicles = require("../routes/vehicles");
const carts = require("../routes/carts");
const cartItems = require("../routes/cartItems.js");
const orders = require("../routes/orders.js");
const orderItems = require("../routes/orderItems.js");
const payments = require("../routes/payments.js");
const vehicleListings = require("../routes/vehicleListings");
const spareParts = require("../routes/spareParts");
const vehicleHires = require("../routes/vehicleHires");
const vehicleHireBookings = require("../routes/vehicleHireBookings");
const categories = require("../routes/categories");
const reviews = require("../routes/reviews");
const error = require("../middleware/error");


module.exports = function (app) {
  app.use(express.json());
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  Joi.objectId = require("joi-objectid")(Joi);
  app.use(express.urlencoded({ extended: true }));
  // app.use("/uploads", express.static("uploads"));
  
  app.use("/api/users", users);
  app.use("/api/profiles", profiles);
  app.use("/api/addresses", addresses);
  app.use("/api/auth", auth);
  app.use("/api/spareParts", spareParts);
  app.use("/api/vehicles", vehicles);
  app.use("/api/carts", carts);
  app.use("/api/cartItems", cartItems);
  app.use("/api/orders", orders);
  app.use("/api/orderItems", orderItems);
  app.use("/api/payments", payments);
  app.use("/api/vehicleListings", vehicleListings);
  app.use("/api/vehicleHires", vehicleHires);
  app.use("/api/vehicleHireBookings", vehicleHireBookings);
  app.use("/api/categories", categories);
  app.use("/api/reviews", reviews);
  app.use(error);
};
