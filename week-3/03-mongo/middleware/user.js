const z = require("zod");
const { User } = require("../db");

const userSchema = z.object({
    username: z.string().email(),
    password: z.string().min(6),
  });

async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const username = req.headers.username;
    const password = req.headers.password;
    const validInput = userSchema.safeParse({ username, password });
    if (!validInput.success) {
      res.status(400).json({ message: validInput.error });
      return;
    }
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      res.status(400).json({ message: "User doesn't exists" });
      return;
    }
    next();
}

module.exports = userMiddleware;