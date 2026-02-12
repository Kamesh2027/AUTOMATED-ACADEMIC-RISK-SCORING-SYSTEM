import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

console.log("Main.jsx is loading...");
console.log("Root element:", document.getElementById("root"));

try {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("App rendered successfully");
} catch (error) {
  console.error("Error rendering app:", error);
  document.getElementById("root").innerHTML = `<h1>Error: ${error.message}</h1><p>${error.stack}</p>`;
}