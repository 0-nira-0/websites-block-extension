import React from "react";
import { createRoot } from "react-dom/client";
import Redirect from "./Redirect";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Redirect />
  </React.StrictMode>
);
