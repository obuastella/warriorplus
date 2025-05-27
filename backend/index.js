require("dotenv").config();
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.post("/send-sms", async (req, res) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) {
      return res
        .status(400)
        .json({ error: "Missing 'to' or 'message' in request body" });
    }

    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    res.json({ success: true, sid: sms.sid });
  } catch (error) {
    console.error("Failed to send SMS:", error);
    res.status(500).json({ error: "Failed to send SMS" });
  }
});

app.listen(port, () => {
  console.log(`SMS backend running on http://localhost:${port}`);
});
console.log("TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN);
console.log("TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER);
