const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { blogsCollection } = require("../index");

//get all blogs
router.get("/blogs", async (req, res) => {
  const result = await blogsCollection.find().sort({ createAt: -1 }).toArray();
  res.send(result);
});
//get blogs by Name
// router.get("/singleblog/:name", async (req, res) => {
//   try {
//     const name = req.params.name;
//     const query = { blogName: name };

//     const result = await blogsCollection.findOne(query);
//     res.send(result);
//   } catch (error) {
//     console.error("Error getting blog:", error);
//     res.status(500).json({ message: "An error occurred" });
//   }
// });

router.get("/blog/:name", async (req, res) => {
  try {
    const encodedName = req.params.name;
    const decodedName = decodeURIComponent(encodedName);

    const query = { blogName: decodedName };
    
    const result = await blogsCollection.findOne(query);
    
    if (!result) {
      // If the blog with the decoded name is not found, you can handle it accordingly
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error("Error getting blog:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});







//get blogs by ID
router.get("/singleblogs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };

    const result = await blogsCollection.findOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error getting blog:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});





// update blog
router.patch("/update-blog/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const option = { upsert: true };
    const updatedBlog = req.body;
    console.log(updatedBlog);

    const blog = {
      $set: {
        blogName: updatedBlog.blogName,
        min: updatedBlog.min,
        category: updatedBlog.category,
        subcategory: updatedBlog.subcategory,
        selectedTags: updatedBlog.selectedTags,
        imageURL: updatedBlog.imageURL,
        description: updatedBlog.description,
        descriptionBN: updatedBlog.descriptionBN,
      },
    };
    const result = await blogsCollection.updateOne(filter, blog, option);
    res.send(result);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});
// update blog
router.patch("/update-comment/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const commentData = req.body;
    // console.log(commentData)
    // Use ObjectId to create a filter for finding the blog post by ID
    const filter = { _id: new ObjectId(id) };

    // Use the $push operator to add a comment to the comments array
    const update = { $push: { comments: commentData } };

    // Set the options to return the updated document
    const options = { new: true };

    const updatedBlog = await blogsCollection.findOneAndUpdate(
      filter,
      update,
      options
    );
    //   console.log(updatedBlog);
    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});



// api for like

router.patch("/like/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const { email, status } = data;
console.log(data);
    const filter = { _id: new ObjectId(id), 'likes.email': email };

    // Check if the user already exists in the 'likes' array
    const userExists = await blogsCollection.findOne(filter);

    const update = {
      // Use $set to update the status for the user
      $set: { 'likes.$.status': status },
    };

    const options = { new: true };

    if (userExists) {
      // If the user exists, update their status
      const updatedBlog = await blogsCollection.findOneAndUpdate(
        filter,
        update,
        options
      );
      res.json(updatedBlog);
    } else {
      // If the user doesn't exist, add a new entry
      const addToSetUpdate = {
        $addToSet: { 'likes': { email, status } },
      };
      const newBlog = await blogsCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        addToSetUpdate,
        options
      );
      res.json(newBlog)
    }
    // console.log(newBlog)
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});





//adding blogs
router.post("/blogs", async (req, res) => {
  const newblogs = req.body;
  newblogs.createAt = new Date();
  console.log(newblogs);
  const result = await blogsCollection.insertOne(newblogs);
  res.send(result);
});

// delete blogs
router.delete("/singleblogs/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await blogsCollection.deleteOne(query);
  res.send(result);
});

// Increment the view of blog view
router.put("/increment-view-count/:blogId", async (req, res) => {
  const { blogId } = req.params;

  try {
    // Find the blog by its _id and update the view count
    const result = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(blogId) },
      { $inc: { view: 1 } }
    );
    console.log(result);
    if (!result.value) {
      return res.status(404).json({ error: "Blog not found" });
    }

    return res.json({ message: "View count incremented successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
