import React from "react";
import "./RiskLevelCircle.css";


const getRiskColor = (label) => {
  if (!label) return '#5bff1a';
  const l = label.trim().toLowerCase();
  if (l === 'low') return '#4caf50'; // green
  if (l === 'moderate' || l === 'medium') return '#ff9800'; // orange
  if (l === 'high') return '#f44336'; // redzzz
  return '#1aff8d'; // default colour
};

const RiskLevelCircle = ({ value = 65, label = "MODERATE", increase = 5 }) => {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  const riskColor = getRiskColor(label);

  return (
    <div className="risk-circle-container">
      <div className="risk-circle-header">CURRENT SAFETY SCORE</div>
      <div className="risk-circle-svg-wrapper">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            className="risk-circle-bg"
            stroke="#f2f4f8"
            fill="none"
            strokeWidth={stroke}
            cx={radius}
            cy={radius}
            r={normalizedRadius}
          />
          <circle
            className="risk-circle-bar"
            stroke={riskColor}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="risk-circle-center">
          <div className="risk-circle-value">{value}</div>
          <div className="risk-circle-label">{label}</div>
        </div>
        {/* <div className="risk-circle-badge">↗ {increase}% increase</div> */}
      </div>
    </div>
  );
};

const AttendanceCircle = ({ value = 65, label = "MODERATE", increase = 5 }) => {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  const riskColor = getRiskColor(label);

  return (
    <div className="risk-circle-container">
      <div className="risk-circle-header3">ATTENDANCE PERCENTAGE</div>
      <div className="risk-circle-svg-wrapper">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            className="risk-circle-bg"
            stroke="#f2f4f8"
            fill="none"
            strokeWidth={stroke}
            cx={radius}
            cy={radius}
            r={normalizedRadius}
          />
          <circle
            className="risk-circle-bar"
            stroke="#a042f9b9"
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="risk-circle-center">
          <div className="risk-circle-value">{value}</div>
          <div className="risk-circle-label">{label}</div>
        </div>
        {/* <div className="risk-circle-badge">↗ {increase}% increase</div> */}
      </div>
    </div>
  );
};
const CgpaCircle = ({ value = 65, label = "MODERATE", increase = 5 }) => {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  const riskColor = getRiskColor(label);

  return (
    <div className="risk-circle-container">
      <div className="risk-circle-header1">CGPA PERCENTAGE</div>
      <div className="risk-circle-svg-wrapper">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            className="risk-circle-bg"
            stroke="#f2f4f8"
            fill="none"
            strokeWidth={stroke}
            cx={radius}
            cy={radius}
            r={normalizedRadius}
          />
          <circle
            className="risk-circle-bar"
            stroke="#ff1a48a1"
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="risk-circle-center">
          <div className="risk-circle-value">{value}</div>
          <div className="risk-circle-label">{label}</div>
        </div>
        {/* <div className="risk-circle-badge">↗ {increase}% increase</div> */}
      </div>
    </div>
  );
};
const AssignmentCircle = ({ value = 65, label = "MODERATE", increase = 5 }) => {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  const riskColor = getRiskColor(label);

  return (
    <div className="risk-circle-container">
      <div className="risk-circle-header2">ASSIGNMENT PERCENTAGE</div>
      <div className="risk-circle-svg-wrapper">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            className="risk-circle-bg"
            stroke="#f2f4f8"
            fill="none"
            strokeWidth={stroke}
            cx={radius}
            cy={radius}
            r={normalizedRadius}
          />
          <circle
            className="risk-circle-bar"
            stroke="#45f889"
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="risk-circle-center">
          <div className="risk-circle-value">{value}</div>
          <div className="risk-circle-label">{label}</div>
        </div>
        {/* <div className="risk-circle-badge">↗ {increase}% increase</div> */}
      </div>
    </div>
  );
};

export { RiskLevelCircle, AttendanceCircle, CgpaCircle, AssignmentCircle };
