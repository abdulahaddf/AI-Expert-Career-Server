const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

exports.verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .send({ error: true, message: "unauthorized access" });
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ error: true, message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

// Data-Base start
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.0iomqcc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version--------
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    //Exporting all mongoDB collections
    const database = client.db("AI-Expert");
    exports.usersCollection = database.collection("users");
    exports.blogsCollection = database.collection("Blogs");
    exports.coursesCollection = database.collection("Courses");
    exports.promoCodesCollection = database.collection("promoCodes");
    exports.enrollCollection = database.collection("Enrolls");
    exports.bannersCollection = database.collection("Banners");
    exports.appointmentsCollection = database.collection("Appointments");
    exports.newsletterCollection = database.collection("Newsletter");
    exports.seminarCollection = database.collection("Seminar");
    exports.bookedCourseCollection = database.collection("BookedCourse");
    exports.feedbackCollection = database.collection("OurFeedback");
    exports.reviewCollection = database.collection("ConsultantReviews");
    exports.partnerCollection = database.collection("Partners");
    exports.notificationCollection = database.collection("Notifications");

    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    });

    //All routes
    const userRoutes = require("./routes/users");
    const blogRoutes = require("./routes/blogs");
    const coursesRoutes = require("./routes/courses");
    const promoRoutes = require("./routes/promoCodes");
    const enrollRoutes = require("./routes/enroll");
    const bannerRoutes = require("./routes/banners");
    const appointmentsRoutes = require("./routes/appointments");
    const mailRoutes = require("./routes/mail");
    const newsLetterRoutes = require("./routes/newsLetter");
    const reviewRoutes = require("./routes/review");
    const notificationRoutes = require("./routes/notification");

    //middlewares
    app.use(userRoutes);
    app.use(blogRoutes);
    app.use(coursesRoutes);
    app.use(promoRoutes);
    app.use(enrollRoutes);
    app.use(bannerRoutes);
    app.use(appointmentsRoutes);
    app.use(mailRoutes);
    app.use(newsLetterRoutes);
    app.use(reviewRoutes);
    app.use(notificationRoutes);

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// Data-Base end

app.get("/", (req, res) => {
  res.send("AI Expert server is running");
});

app.listen(port, () => {
  console.log(`AI Expert Server is running on port: ${port}`);
});
