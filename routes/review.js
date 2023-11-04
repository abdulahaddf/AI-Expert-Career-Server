const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { feedbackCollection, reviewCollection,partnerCollection } = require("../index");

//get all feedback
router.get("/feedback", async (req, res) => {
  const result = await feedbackCollection
    .find()
    .sort({ createAt: -1 })
    .toArray();
  res.send(result);
});

//adding feedback
router.post("/feedback", async (req, res) => {
  const newfeedback = req.body;
  newfeedback.createAt = new Date();
  console.log(newfeedback);
  const result = await feedbackCollection.insertOne(newfeedback);
  res.send(result);
});

// delete feedback
router.delete("/singlefeedback/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await feedbackCollection.deleteOne(query);
  res.send(result);
});

//get all review
router.get("/review", async (req, res) => {
  const result = await reviewCollection.find().sort({ createAt: -1 }).toArray();
  res.send(result);
});

//adding review
router.post("/review", async (req, res) => {
  const newreview = req.body;
  newreview.createAt = new Date();
  console.log(newreview);
  const result = await reviewCollection.insertOne(newreview);
  res.send(result);
});

// delete review
router.delete("/singlereview/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await reviewCollection.deleteOne(query);
  res.send(result);
});



//get all partner
router.get("/partner", async (req, res) => {
  const result = await partnerCollection.find().sort({ createAt: -1 }).toArray();
  res.send(result);
});

//adding partner
router.post("/partner", async (req, res) => {
  const newpartner = req.body;
  newpartner.createAt = new Date();
  console.log(newpartner);
  const result = await partnerCollection.insertOne(newpartner);
  res.send(result);
});

// delete partner
router.delete("/singlepartner/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await partnerCollection.deleteOne(query);
  res.send(result);
});

module.exports = router;
