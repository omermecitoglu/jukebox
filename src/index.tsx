import "./styles/custom-bootstrap.scss";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import ReduxProvider from "./redux/provider";

const rootDiv = document.createElement("div");
rootDiv.id = "app";
document.body.appendChild(rootDiv);
const root = createRoot(rootDiv);
root.render(<ReduxProvider><App /></ReduxProvider>);

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

declare global {
  interface Window { injectToken?: (hash: string) => void }
}

if (window.opener?.injectToken) {
  window.opener.injectToken(window.location.hash);
}
