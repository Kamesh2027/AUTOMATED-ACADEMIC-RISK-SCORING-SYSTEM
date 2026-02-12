const mongoose = require("mongoose");

const riskSchema = new mongoose.Schema({
  attendanceWeight: Number,
  internalWeight: Number,
  assignmentWeight: Number,
  lowRiskMin: Number,
  mediumRiskMin: Number
});

module.exports = mongoose.model("RiskSettings", riskSchema);
