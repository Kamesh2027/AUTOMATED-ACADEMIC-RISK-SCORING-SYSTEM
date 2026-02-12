const RiskSettings = require("../models/RiskSettings");

exports.getSettings = async (req, res) => {
  try {
    let settings = await RiskSettings.findOne();

    if (!settings) {
      settings = await RiskSettings.create({
        attendanceWeight: 40,
        internalWeight: 30,
        assignmentWeight: 30,
        lowRiskMin: 85,
        mediumRiskMin: 70
      });
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings", error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { attendanceWeight, internalWeight, assignmentWeight, lowRiskMin, mediumRiskMin } = req.body;

    if (!attendanceWeight || !internalWeight || !assignmentWeight || lowRiskMin === undefined || mediumRiskMin === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const totalWeight = attendanceWeight + internalWeight + assignmentWeight;
    if (totalWeight !== 100) {
      return res.status(400).json({ message: "Weight percentages must sum to 100" });
    }

    if (mediumRiskMin >= lowRiskMin) {
      return res.status(400).json({ message: "Medium risk min must be less than low risk min" });
    }

    let settings = await RiskSettings.findOne();

    if (!settings) {
      settings = await RiskSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error updating settings", error: error.message });
  }
};
