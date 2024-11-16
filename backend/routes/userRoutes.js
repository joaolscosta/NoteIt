const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "-> User already exists!" });
    }

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const user = new User({
            email,
            password: hashedPassword,
        });
        await user.save();

        res.status(201).json({ message: "-> User Registred!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "-> Error." });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "-> User not found." });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "-> Incorrect password." });
    }

    res.status(200).json({ message: "-> Login successfull!" });
});

module.exports = router;
