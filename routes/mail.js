const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
// const { OAuth2Client } = require("google-auth-library");

// Replace with your Gmail API credentials (use environment variables)
// const oauth2Client = new OAuth2Client({
//   clientId: process.env.CLIENT_ID,
//   clientSecret: process.env.CLIENT_SECRET,
// });


// Generate an OAuth URL for user consent
// router.get("/auth-url", (req, res) => {
//   const authUrl = oauth2Client.generateAuthUrl({
//     access_type: "offline", // Enables a refresh token
//     scope: ["https://www.googleapis.com/auth/gmail.send"],
//   });

//   res.json({ authUrl });
// });

// Handle the OAuth callback and send the email
router.post("/send-email", async (req, res) => {
    console.log(req.body);
    const { toEmail1, toEmail2, subject, message } = req.body;
  
    // Use your access token to send the email
    // const accessToken = req.body.accessToken; // Make sure you send the access token from the frontend
  
    // const transporter = nodemailer.createTransport({
    //   service: "Gmail",
    //   auth: {
    //     type: "OAuth2",
    //     user: "developer.aiec@gmail.com",
    //     clientId: process.env.CLIENT_ID,
    //     clientSecret: process.env.CLIENT_SECRET,
    //     accessToken: accessToken,
    //   },
    // });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });


    // Define the email content with an array of recipient email addresses
    const mailOptions = {
      from: "developer.aiec@gmail.com", 
      to: [toEmail1, toEmail2], 
      subject: subject,
      text: message,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        res.status(500).json({ error: "Failed to send the email." });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({ message: "Email sent successfully!" });
      }
    });
  });
  


module.exports = router;
