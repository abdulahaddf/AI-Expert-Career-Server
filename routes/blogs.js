const express = require("express");
const router = express.Router();
const { ObjectId } = require('mongodb');
 const { blogsCollection  } = require("../index");

   //get all blogs
   router.get("/blogs", async (req, res) => {
    const result = await blogsCollection
      .find()
      .sort({ createAt: -1 })
      .toArray();
    res.send(result);
  });
  //get blogs by ID
  router.get("/singleblogs/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        
        const result = await blogsCollection.findOne(query);
        res.send(result);
    }
    catch (error) {
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
        console.log(updatedBlog)
    
        const blog = {
          $set: {
            blogName: updatedBlog.blogName,
            category: updatedBlog.category,
            subcategory: updatedBlog.subcategory,
            selectedTags: updatedBlog.selectedTags,
            imageURL: updatedBlog.imageURL,
            description: updatedBlog.description,
            descriptionBN: updatedBlog.descriptionBN
          }
        }
        const result = await blogsCollection.updateOne(filter, blog, option);
        res.send(result);
    }
    catch (error) {
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
        
        const updatedBlog = await blogsCollection.findOneAndUpdate(filter, update, options);
    //   console.log(updatedBlog);
        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog post not found' });
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
      const { email } = data;
  
      // Use ObjectId to create a filter for finding the blog post by ID
      const filter = { _id: new ObjectId(id), 'likes.email': { $ne: email } };
  
      // Use the $push operator to add a like to the likes array
      const update = { $push: { likes: data } };
  
      // Set the options to return the updated document
      const options = { new: true };
  
      // Find and update the blog post, checking if the user's email is not already in the likes array
      const updatedBlog = await blogsCollection.findOneAndUpdate(filter, update, options);
  
      if (!updatedBlog) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
  
      res.json(updatedBlog);
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













 module.exports = router;