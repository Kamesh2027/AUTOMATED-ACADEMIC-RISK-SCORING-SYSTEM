const mongoose = require("mongoose");
const User = require("./models/User");
const Student = require("./models/Student");
const RiskSettings = require("./models/RiskSettings");
const Feedback = require("./models/Feedback");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await RiskSettings.deleteMany({});
    await Feedback.deleteMany({});

    // Create admin user only
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash("password", 10);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@email.com",
      password: "password", // Will be hashed by User model pre-save hook
      role: "admin"
    });
    // Print the admin user to verify
    console.log("Admin user in DB:", admin);

    // Create default risk settings
    const riskSettings = await RiskSettings.create({
      attendanceWeight: 40,
      internalWeight: 30,
      assignmentWeight: 30,
      lowRiskMin: 85,
      mediumRiskMin: 70
    });

    console.log("✓ Admin user created: admin@email.com / password");
    console.log("✓ Risk settings initialized");

    await mongoose.disconnect();
    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
