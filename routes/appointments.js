const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { appointmentsCollection } = require("../index");

//adding appointments
router.post("/appoint", async (req, res) => {
  const course = req.body;
  course.createAt = new Date();
  console.log(course);
  const result = await appointmentsCollection.insertOne(course);
  res.send(result);
});

//get all Appointments
router.get("/appointments", async (req, res) => {
  const result = await appointmentsCollection.find().sort({ createAt: -1 }).toArray();
  res.send(result);
});

//find appointed Appointments

router.get("/appoints", async (req, res) => {
  try {
    const email = req?.query?.email;
    //   console.log(email);
    const query = { email: email };
    const result = await appointmentsCollection
      .find(query)
      .sort({ createAt: -1 })
      .toArray();
    res.send(result);
    //   console.log(result);
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error fetching purchased items:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

//find appointed course by id

router.get("/single-appoint/:id", async (req, res) => {
  const id = req?.params?.id;

  try {
    const find = { _id: new ObjectId(id) };

    const result = await appointmentsCollection.findOne(find);

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

router.post("/markComplete", async (req, res) => {
  try {
    const { courseId, moduleName, contentName } = req.body;

    // Find the user's appointment for the specified course
    const appointment = await appointmentsCollection.findOne({ courseId });

    if (!appointment) {
      return res.status(404).json({ message: "appointment not found" });
    }

    // Find the module within the course
    const moduleIndex = appointment.course.modules.findIndex(
      (module) => module.title.toString() === moduleName
    );
    if (moduleIndex === -1) {
      return res.status(404).json({ message: "Module not found" });
    }

    // Find the content within the module based on contentName
    const moduleToUpdate = appointment.course.modules[moduleIndex];
    const contentIndex = moduleToUpdate.contents.findIndex(
      (content) => content.title.toString() === contentName
    );

    if (contentIndex === -1) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Mark the specific content as complete
    moduleToUpdate.contents[contentIndex].completed = true;

    // Update the appointment document in the collection
    await appointmentsCollection.updateOne(
      { courseId },
      { $set: { "course.modules": appointment.course.modules } }
    );

    return res.status(200).json({ message: "Content marked as complete" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Define a route to update the main course appointment collection
router.post("/completedtime", async (req, res) => {
  try {
    const { userId, courseId, completionTime } = req.body;
    console.log(courseId);

    // Check if the user is appointed in the course
    const appointment = await appointmentsCollection.findOne({
      userId: userId,
      courseId: courseId,
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ message: "User is not appointed in the course" });
    }

    // If neither completionTime nor isCompleted exists, update both
    if (!appointment.completionTime && !appointment.isCompleted) {
      appointment.completionTime = completionTime;
      appointment.isCompleted = true;

      // Save the updated appointment
      await appointmentsCollection.updateOne(
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

    console.log(appointment);
    res.status(200).json({ message: "Course completion status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// appoint initial request approved by admin
router.patch("/appointRequest/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    console.log(id);
    const filter = { _id: new ObjectId(id) };
    const statusdata = req?.body;
    // const options = { upsert: true };
    const updateDoc = {
      $set: {
        request: statusdata?.request,
      },
    };
    console.log(id, statusdata);
    const result = await appointmentsCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error updating payment status:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});
// appoint confirmation by admin
router.patch("/appointConfirmation/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    // console.log(id);
    const filter = { _id: new ObjectId(id) };
    const statusdata = req?.body;
    // console.log(statusdata)
    // const options = { upsert: true };
    const updateDoc = {
      $set: {
        confirmation: statusdata?.confirmation,
      },
    };
    console.log(id, statusdata);
    const result = await appointmentsCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error updating payment status:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});
// Payment Info submitted by user
router.patch("/payment/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    console.log(id);
    const filter = { _id: new ObjectId(id) };
    const data = req?.body;
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        tId : data.tId,
        senderNumber : data.senderNumber,
      },
    };
    // console.log(id, data);
    const result = await appointmentsCollection.updateOne(filter, updateDoc, options);
    res.send(result);
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error updating payment status:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

module.exports = router;
