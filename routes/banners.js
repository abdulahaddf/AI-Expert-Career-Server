const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { bannersCollection } = require("../index");

//get all banners
router.get("/banners", async (req, res) => {
  const result = await bannersCollection
    .find()
    .sort({ createAt: -1 })
    .toArray();
  res.send(result);
});

//adding banners
router.post("/banners", async (req, res) => {
  const newbanners = req.body;
  newbanners.createAt = new Date();
  console.log(newbanners);
  const result = await bannersCollection.insertOne(newbanners);
  res.send(result);
});

// delete banners
router.delete("/singlebanners/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await bannersCollection.deleteOne(query);
  res.send(result);
});

module.exports = router;
