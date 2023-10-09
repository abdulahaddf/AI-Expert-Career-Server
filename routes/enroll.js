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


 //find enrolled course by id

 router.get("/singleEnrolledCourse/:id", async (req, res) => {
  const id = req?.params?.id;

  try {
    const find = { _id: new ObjectId(id) };

    const result = await enrollCollection.findOne(find);

    if (!result) {
      // If no course with the specified ID is found, send a 404 Not Found response
      return res.status(404).json({ message: "course not found" });
    }

    res.send(result);
  } catch (error) {
    // Handle the error here
    console.error("Error fetching single course:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});







  router.post('/markComplete', async (req, res) => {
    try {
      const { courseId, moduleName, contentName } = req.body;
  
      // Find the user's enrollment for the specified course
      const enrollment = await enrollCollection.findOne({   courseId });
  
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
        {    courseId },
        { $set: { 'course.modules': enrollment.course.modules } }
      );
  
      return res.status(200).json({ message: 'Content marked as complete' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  





// Define a route to update the main course enrollment collection
router.post('/completedtime', async (req, res) => {
  try {
    const { userId, courseId, completionTime } = req.body;
    console.log(courseId);

    // Check if the user is enrolled in the course
    const enrollment = await enrollCollection.findOne({
      userId: userId,
      courseId: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'User is not enrolled in the course' });
    }

    // If neither completionTime nor isCompleted exists, update both
    if (!enrollment.completionTime && !enrollment.isCompleted) {
      enrollment.completionTime = completionTime;
      enrollment.isCompleted = true;

      // Save the updated enrollment
      await enrollCollection.updateOne(
        {
          userId: userId,
          courseId: courseId,
        },
        {
          $set: {
            completionTime: completionTime,
            isCompleted: true,
          },
        }
      );
    }

    console.log(enrollment);
    res.status(200).json({ message: 'Course completion status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});













 module.exports = router;