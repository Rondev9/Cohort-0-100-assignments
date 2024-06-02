const z = require("zod");
const {Admin} = require("../db");

const adminSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
  const username = req.headers.username;
  const password = req.headers.password;
  const validInput = adminSchema.safeParse({ username, password });
  if (!validInput.success) {
    res.status(400).json({ message: validInput.error });
    return;
  }
  const existingUser = await Admin.findOne({ username: username });
  if (!existingUser) {
    res.status(400).json({ message: "User doesn't exists" });
    return;
  }
  next();
}

module.exports = adminMiddleware;
