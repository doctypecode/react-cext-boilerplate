import React from "react";
import CSApp from "./csApp";
import ReactDOM from "react-dom/client";
import "../assets/css/common.css";

// Create Entry Point For React App
const ContentScriptInsertionPoint = document.createElement("div");
ContentScriptInsertionPoint.id = "contentScriptInsertionPoint";

// Add the entry point to dom
document.body.insertBefore(
  ContentScriptInsertionPoint,
  document.body.firstElementChild
);

const root = ReactDOM.createRoot(ContentScriptInsertionPoint);

// Render App in the entry point
root.render(
  <React.StrictMode>
    <CSApp />
  </React.StrictMode>
);
