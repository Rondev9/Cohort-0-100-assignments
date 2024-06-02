const jwt = require("jsonwebtoken");
const { User } = require("../db");

const JWT_SECRET = "secret_key#$%";

async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const existingUser = await User.findOne({ username: decoded.username });
    if(!existingUser) {
      res.status(400).json({ message: "User doesn't exists" });
      return;
    }
    next();
}

module.exports = userMiddleware;