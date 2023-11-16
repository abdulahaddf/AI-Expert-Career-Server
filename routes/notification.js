const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { notificationCollection } = require("../index");

//get all notifications
router.get("/notifications", async (req, res) => {
  const result = await notificationCollection
    .find()
    .sort({ createAt: -1 })
    .toArray();
  res.send(result);
});

//post notification
router.post("/notification", async (req, res) => {
  const notif = req.body;
  notif.createAt = new Date();
  const result = await notificationCollection.insertOne(notif);
  res.send(result);
});
// delete notification
router.delete("/notifi/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await notificationCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error deleting notifications:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

module.exports = router;
