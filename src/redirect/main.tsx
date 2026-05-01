import React from "react";
import { createRoot } from "react-dom/client";
import "../styles/reset.css";
import "../styles/tokens.css";
import Redirect from "./Redirect";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Redirect />
  </React.StrictMode>
);
