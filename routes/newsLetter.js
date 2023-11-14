const express = require("express");
const router = express.Router();
const {
  newsletterCollection,
  seminarCollection,
  bookedCourseCollection,
} = require("../index");

//adding
router.post("/newsletter", async (req, res) => {
  const mail = req.body;
  console.log(mail);
  mail.createAt = new Date();
  const result = await newsletterCollection.insertOne(mail);
  res.send(result);
});

//get all
router.get("/newsletters", async (req, res) => {
  const result = await newsletterCollection
    .find()
    .sort({ createAt: -1 })
    .toArray();
  res.send(result);
});
// delete if needed
router.delete("/newsletter/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await newsletterCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error deleting code:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// Seminar API

//adding
router.post("/seminar", async (req, res) => {
  const data = req.body;
  // console.log(data);
  data.createAt = new Date();
  const result = await seminarCollection.insertOne(data);
  res.send(result);
});

//get all
router.get("/seminars", async (req, res) => {
  const result = await seminarCollection
    .find()
    .sort({ createAt: -1 })
    .toArray();
  res.send(result);
});




//get all bookedCourse
router.get("/bookedCourse", async (req, res) => {
  const result = await bookedCourseCollection
    .find()
    .sort({ createAt: -1 })
    .toArray();
  res.send(result);
});

//adding bookedCourse
router.post("/bookCourse", async (req, res) => {
  const newbookedCourse = req.body;
  newbookedCourse.createAt = new Date();
  console.log(newbookedCourse);
  const result = await bookedCourseCollection.insertOne(newbookedCourse);
  res.send(result);
});

// delete bookedCourse
router.delete("/singlebookedCourse/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await bookedCourseCollection.deleteOne(query);
  res.send(result);
});

module.exports = router;
