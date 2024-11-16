const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // ??? mongodb://localhost:27017/NoteIt
        await mongoose.connect("mongodb://localhost:27017/NoteIt", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("-> Connected to MongoDB");
    } catch (error) {
        console.error("-> Error connecting to DB: ", error);
        process.exit(1);
    }
};

module.exports = connectDB;
