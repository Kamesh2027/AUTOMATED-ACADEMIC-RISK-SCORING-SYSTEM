const RiskSettings = require("../models/RiskSettings");

exports.calculateRisk = async (
  attendance,
  internal,
  assignments
) => {

  let settings = await RiskSettings.findOne();

  if (!settings) {
    settings = {
      attendanceWeight: 40,
      internalWeight: 30,
      assignmentWeight: 30,
      lowRiskMin: 85,
      mediumRiskMin: 70
    };
  }

  const score =
    (attendance * settings.attendanceWeight) / 100 +
    (internal * settings.internalWeight) / 100 +
    (assignments * settings.assignmentWeight) / 100;

  let riskLevel = "High";

  if (score >= settings.mediumRiskMin && score < settings.lowRiskMin) {
    riskLevel = "Medium";
  } else if (score >= settings.lowRiskMin) {
    riskLevel = "Low";
  }

  return {
    score: Math.round(score),
    riskLevel
  };
};
