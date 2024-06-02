const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const jwt = require("jsonwebtoken");
const { User, Course } = require("../db");

const secret_key = "secret_key#$%";
// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    await User.create({
        username: username,
        password: password
    });
    res.json({
        message: 'User created successfully'
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({
        username,
        password
    });
    if (!user) {
        res.status(411).json({
            message: "Incorrect username and password"
        });
        return;
    }
    res.status(201).json({
        token: jwt.sign({ username, password }, secret_key)
    })
});

router.get('/courses', (req, res) => {
    // Implement listing all courses logic
    Course.find().then(courses => {
        res.json(courses);
    });
});

router.post('/courses/:courseId', userMiddleware, async(req, res) => {
    // Implement course purchase logic
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secret_key);
    await User.updateOne({ username: decoded.username }, {
        '$push': {
            purchasedCourses: req.params.courseId
        }
    });
    res.json({
        message: 'Course purchased successfully'
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secret_key);
    const user = await User.findOne({ username: decoded.username });
    const courses = await Course.find({ _id: { '$in': user.purchasedCourses } });
    res.json({
        purchasedCourses: courses
    });
});

module.exports = router