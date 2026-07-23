import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { CeoApp } from "./App";
import type { Lang, Screen } from "./data";
import "./ceo.css";

// The briefing is deep-linkable so an email ("your approvals are ready") can
// open straight to a screen, and a client's Arabic preference can be carried
// in the link: /ceo.html?screen=approvals&lang=ar
const params = new URLSearchParams(location.search);
const SCREENS: Screen[] = ["overview", "approvals", "analytics", "calendar", "roadmap"];
const screenParam = params.get("screen");
const langParam = params.get("lang");
const initialScreen = SCREENS.includes(screenParam as Screen) ? (screenParam as Screen) : undefined;
const initialLang: Lang = langParam === "ar" ? "ar" : "en";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CeoApp initialLang={initialLang} initialScreen={initialScreen} />
  </StrictMode>,
);
