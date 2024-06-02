const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const {Admin, Course} = require("../db");
const z = require("zod");
const router = Router();

const courseSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  imageLink: z.string(),
});

// Admin Routes
router.post("/signup", async (req, res) => {
  // Implement admin signup logic
  await Admin.create({
    username: req.body.username,
    password: req.body.password,
  });
  res.status(201).json({ message: "Admin created successfully" });
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageLink = req.body.imageLink;

  const validCourseInput = courseSchema.safeParse({
    title,
    description,
    price,
    imageLink,
  });
  
  if (!validCourseInput.success) {
    res.status(400).json({ message: validCourseInput.error });
    return;
  }

  const course = await Course.create({
    title,
    description,
    price,
    imageLink,
  });
  res.status(201).json({ message: "Course created successfully", courseId: course._id });
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic
  const courses = await Course.find();
  if (!courses) {
    res.status(404).json({ message: "No courses found" });
    return;
  }
  res.status(200).json({ courses: courses });
});

module.exports = router;
