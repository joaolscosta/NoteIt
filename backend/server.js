const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/userRoutes");
const cors = require("cors"); // we use this to connect the frontend and backend in case there are different origins (ports)

const app = express();

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("-> Backend server is running");
});

// Routes
app.use("/routes/userRoutes", authRoutes);

app.use(cors());

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`);
});
