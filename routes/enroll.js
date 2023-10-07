const express = require("express");
const router = express.Router();
const { ObjectId } = require('mongodb');
 const { enrollCollection  } = require("../index");




//adding blogs
router.post("/enroll", async (req, res) => {
    const course = req.body;
    course.createAt = new Date();
    console.log(course);
    const result = await enrollCollection.insertOne(course);
    res.send(result);
  });

//get all courses
router.get("/enrolled", async (req, res) => {
    const result = await enrollCollection
      .find()
      .sort({ createAt: -1 })
      .toArray();
    res.send(result);
  });

 //find enrolled courses

 router.get("/enrolled-course", async (req, res) => {
    try {
      const email = req?.query?.email;
    //   console.log(email);
      const query = { email: email };
      const result = await enrollCollection
        .find(query)
        .sort({ date: -1 })
        .toArray();
      res.send(result);
    //   console.log(result);   
    } catch (error) {
      // Handle any unexpected errors here
      console.error("Error fetching purchased items:", error);
      res.status(500).json({ message: "An error occurred" });
    }
  });







  router.post('/markComplete', async (req, res) => {
    try {
      const { userId, courseId, moduleName, contentName } = req.body;
  
      // Find the user's enrollment for the specified course
      const enrollment = await enrollCollection.findOne({ userId, courseId });
  
      if (!enrollment) {
        return res.status(404).json({ message: 'Enrollment not found' });
      }
  
      // Find the module within the course
      const moduleIndex = enrollment.course.modules.findIndex((module) => module.title.toString() === moduleName);
      if (moduleIndex === -1) {
        return res.status(404).json({ message: 'Module not found' });
      }
  
      // Find the content within the module based on contentName
      const moduleToUpdate = enrollment.course.modules[moduleIndex];
      const contentIndex = moduleToUpdate.contents.findIndex((content) => content.title.toString() === contentName);
  
      if (contentIndex === -1) {
        return res.status(404).json({ message: 'Content not found' });
      }
  
      // Mark the specific content as complete
      moduleToUpdate.contents[contentIndex].completed = true;
  
      // Update the enrollment document in the collection
      await enrollCollection.updateOne(
        { userId, courseId },
        { $set: { 'course.modules': enrollment.course.modules } }
      );
  
      return res.status(200).json({ message: 'Content marked as complete' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  


















 module.exports = router;