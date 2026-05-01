import React from "react";
import { createRoot } from "react-dom/client";
import "../styles/reset.css";
import "../styles/tokens.css";
import Complete from "./Complete";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Complete />
  </React.StrictMode>
);
