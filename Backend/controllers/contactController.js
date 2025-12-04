const nodemailer = require("nodemailer");
const Message = require("../models/Message.js");

require('dotenv').config();

const submitMessage = async (req, res) => {

  const { fullName, email, phone, business, message } = req.body;

  try {
    // Save to MongoDB
    const newMessage = new Message({
      name: fullName,
      email,
      phone,
      business,
      message,
    });

    await newMessage.save();

    // Email setup using process.env
    const transporter = nodemailer.createTransport({
       host: 'smtp.sendgrid.net',
       port: 465,
      auth: {
        user: 'apikey',
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: process.env.TO_EMAIL,
        replyTo: email, 
        subject: '📨 New Contact Form Submission - ZM Infosoft',
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Business:</strong> ${business}</p>
          <p><strong>Message:</strong> ${message}</p>
        `
      };
      

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Message sent successfully!" });
      } else {
        return res.status(200).json({ message: "Message and Email Sent!" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { submitMessage };
