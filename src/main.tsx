import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { MovaApp } from "./mova/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MovaApp />
  </StrictMode>,
);
