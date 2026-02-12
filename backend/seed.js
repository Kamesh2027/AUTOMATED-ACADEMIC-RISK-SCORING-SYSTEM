const mongoose = require("mongoose");
const User = require("./models/User");
const Student = require("./models/Student");
const RiskSettings = require("./models/RiskSettings");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await RiskSettings.deleteMany({});

    // Create demo users
    const admin = await User.create({
      name: "Admin User",
      email: "admin@email.com",
      password: "password",
      role: "admin"
    });

    const faculty = await User.create({
      name: "Faculty Member",
      email: "faculty@email.com",
      password: "password",
      role: "faculty"
    });

    const student = await User.create({
      name: "Student User",
      email: "student@email.com",
      password: "password",
      role: "student"
    });

    // Create demo students
    const students = await Student.insertMany([
      {
        name: "John Doe",
        email: "john.doe@email.com",
        regNo: "REG001",
        attendance: 85,
        marks: 78,
        assignments: 82,
        score: 81,
        riskLevel: "Low"
      },
      {
        name: "Jane Smith",
        email: "jane.smith@email.com",
        regNo: "REG002",
        attendance: 72,
        marks: 65,
        assignments: 70,
        score: 68,
        riskLevel: "Medium"
      },
      {
        name: "Bob Johnson",
        email: "bob.johnson@email.com",
        regNo: "REG003",
        attendance: 55,
        marks: 48,
        assignments: 52,
        score: 50,
        riskLevel: "High"
      },
      {
        name: "Alice Williams",
        email: "alice.williams@email.com",
        regNo: "REG004",
        attendance: 90,
        marks: 88,
        assignments: 85,
        score: 87,
        riskLevel: "Low"
      },
      {
        name: "Charlie Brown",
        email: "charlie.brown@email.com",
        regNo: "REG005",
        attendance: 68,
        marks: 72,
        assignments: 75,
        score: 71,
        riskLevel: "Medium"
      }
    ]);

    // Create default risk settings
    const riskSettings = await RiskSettings.create({
      attendanceWeight: 40,
      internalWeight: 30,
      assignmentWeight: 30,
      lowRiskMin: 85,
      mediumRiskMin: 70
    });

    console.log("✓ Admin user created: admin@email.com / password");
    console.log("✓ Faculty user created: faculty@email.com / password");
    console.log("✓ Student user created: student@email.com / password");
    console.log(`✓ ${students.length} demo students created`);
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
