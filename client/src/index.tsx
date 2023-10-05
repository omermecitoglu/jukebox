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

declare global {
  interface Window { injectToken?: (token: string) => void }
}

if (window.opener?.injectToken) {
  const match = window.location.hash.match(/#access_token=([^&]+)&.*expires_in=(\d+)/);
  if (match && match[1]) {
    window.opener.injectToken(match[1]);
    window.close();
  }
}
