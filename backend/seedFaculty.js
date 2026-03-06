
const mongoose = require("mongoose");
const Faculty = require("./models/Faculty");

require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aarss";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

async function seedFaculty() {
  try {
    await Faculty.deleteMany({}); // Clear existing data (optional)
    await Faculty.create([
      { name: "Kabilan R", facultyRegNo: "FEC001", email: "kabilanr.ec23@bitsathy.ac.in" },
      { name: "Steve Smith", facultyRegNo: "FEC002", email: "steve.smith@bitsathy.ac.in" }
    ]);
    console.log("Faculty seeded successfully");
  } catch (err) {
    console.error("Error seeding faculty:", err);
  } finally {
    mongoose.disconnect();
  }
}

seedFaculty();
