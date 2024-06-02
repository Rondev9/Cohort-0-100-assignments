const z = require("zod");
const { Admin } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret_key#$%";

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const existingUser = await Admin.findOne({ username: decoded.username });
    if(!existingUser) {
      res.status(400).json({ message: "User doesn't exists" });
      return;
    }
    next();
}

module.exports = adminMiddleware;