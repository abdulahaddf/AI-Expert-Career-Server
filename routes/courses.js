const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { coursesCollection } = require("../index");

//get all courses
router.get("/courses", async (req, res) => {
  const result = await coursesCollection
    .find()
    .sort({ createAt: -1 })
    .toArray();
  res.send(result);
});
//get courses by ID
router.get("/singlecourse/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };

    const result = await coursesCollection.findOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error getting Course:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});


//get courses by Title
router.get("/single-course/:title", async (req, res) => {
  try {
    const title = req.params.title;
    // console.log(title);
    const query = { title: title };

    const result = await coursesCollection.findOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error getting Course:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

//adding courses
router.post("/courses", async (req, res) => {
  const newcourses = req.body;
  newcourses.createAt = new Date();
  console.log(newcourses);
  const result = await coursesCollection.insertOne(newcourses);
  res.send(result);
});


// delete courses
router.delete("/singlecourses/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await coursesCollection.deleteOne(query);
  res.send(result);
});

// update course
router.patch("/update-course/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const option = { upsert: true };
    const updatedCourse = req.body;
    console.log(updatedCourse);

    const course = {
      $set: {
        title: updatedCourse.title,
        description: updatedCourse.description,
        subtitle: updatedCourse.subtitle,
        cover: updatedCourse.cover,
        coverVideo: updatedCourse.coverVideo,
        courseType: updatedCourse.courseType,
        liveInstruction: updatedCourse.liveInstruction,
        courseModel: updatedCourse.courseModel,
        courseFee: updatedCourse.courseFee,
        discount: updatedCourse.discount,
        duration: updatedCourse.duration,
        features: updatedCourse.features,
        Collaborators: updatedCourse.Collaborators,
        category: updatedCourse.category,
        mainCategory: updatedCourse.mainCategory,
        instructor: updatedCourse.instructor,
        insDesignation: updatedCourse.insDesignation,
        insDescription: updatedCourse.insDescription,
        insImage: updatedCourse.insImage,
        modules: updatedCourse.modules,
        startDate: updatedCourse.startDate,
        endDate: updatedCourse.endDate,
        courseDate: updatedCourse.courseDate,
        faqItems: updatedCourse.faqItems,
        goals: updatedCourse.goals,
        preRequisites: updatedCourse.preRequisites,
        eligibleUsers: updatedCourse.eligibleUsers,
      },
    };
    const result = await coursesCollection.updateOne(filter, course, option);
    res.send(result);
  } catch (error) {
    console.error("Error updating Course:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
