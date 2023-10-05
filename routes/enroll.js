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














 module.exports = router;