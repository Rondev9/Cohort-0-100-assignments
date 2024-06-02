const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const z = require("zod");
const jwt = require("jsonwebtoken");
const router = Router();

const secret_key = "secret_key#$%";

const courseSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  imageLink: z.string(),
});

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    await Admin.create({
        username: username,
        password: password
    });
    res.json({
        message: 'Admin created successfully'
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const user = await Admin.findOne({
        username,
        password
    });
    if (!user) {
        res.status(411).json({
            message: "Incorrect username and password"
        });
        return;
    }
    const jwtToken = jwt.sign({username, password}, secret_key)
    res.json({
        token: jwtToken
    })
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const validInput = courseSchema.safeParse(req.body);
    if (!validInput.success) {
      res.status(400).json({ message: validInput.error });
      return;
    }

    const { title, description, price, imageLink } = validInput.data;
    const newCourse = await Course.create({
        title,
        description,
        price,
        imageLink
    });
    res.json({
        message: "Course created successfully",
        courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const courses = await Course.find({});
    res.json({
        courses: courses
    })
});

module.exports = router;