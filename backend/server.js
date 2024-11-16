const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("-> Backend server is running");
});

// Routes
app.use("/routes/userRoutes", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`);
});
