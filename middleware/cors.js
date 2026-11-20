const cors = require("cors");

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  process.env.NODE_ENV !== "production" ? "http://localhost:3000" : undefined,
].filter(Boolean);

module.exports = cors({
  origin(origin, callback) {
    callback(null, Boolean(origin && allowedOrigins.includes(origin)));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
});