import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { MovaApp } from "../mova/App";

export const Route = createFileRoute("/")({
  component: Index,
});

// The app is driven by the device's clock and per-device storage, so it
// renders client-side only; SSR ships the paper-colored shell and the app
// mounts immediately after hydration.
function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ minHeight: "100vh", background: "#FDFDFB" }} />;
  return <MovaApp />;
}
