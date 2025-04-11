import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "../context/UserContext.jsx";
import { BlogProvider } from "../context/BlogContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BlogProvider>
    <UserProvider>
      <App />
    </UserProvider>
    </BlogProvider>

  </React.StrictMode>
);