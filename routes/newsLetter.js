const express = require("express");
const router = express.Router();
const { newsletterCollection } = require("../index");

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
  const result = await newsletterCollection.find().sort({ createAt: -1 }).toArray();
  res.send(result);
});
// delete
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

module.exports = router;