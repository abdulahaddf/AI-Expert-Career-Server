const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

// Replace with your Gmail API credentials (use environment variables)
const oauth2Client = new OAuth2Client({
    clientId: process.env.client_id,
    clientSecret: process.env.client_secret,
    // redirectUri: "YOUR_REDIRECT_URI",
});

// Generate an OAuth URL for user consent
router.get("/auth-url", (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline", // Enables a refresh token
        scope: ["https://www.googleapis.com/auth/gmail.send"],
    });

    res.json({ authUrl });
});

// Handle the OAuth callback and send the email
router.post("/send-email", async (req, res) => {
    const { from, to, subject, text } = req.body;

    // Use your access token to send the email
    const accessToken = req.body.accessToken; // Make sure you send the access token from the frontend

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            type: "OAuth2",
            user: "developer.aiec@gmail.com",
            clientId: process.env.client_id,
            clientSecret: process.env.client_secret,
            accessToken: accessToken,
        },
    });

    // Define the email content
    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text,
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
