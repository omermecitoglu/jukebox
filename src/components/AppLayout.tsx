"use client";
import "~/styles/custom-bootstrap.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import React, { type ReactNode, useEffect } from "react";
import Providers from "./Providers";

config.autoAddCss = false;

type AppLayoutProps = {
  children: ReactNode,
};

const AppLayout = ({
  children,
}: AppLayoutProps) => {
  useEffect(() => {
    if (window.opener?.injectToken) {
      const match = window.location.hash.match(/#access_token=([^&]+)&.*expires_in=(\d+)/);
      if (match && match[1]) {
        window.opener.injectToken(match[1], parseInt(match[2]));
        window.close();
      }
    }
  }, []);

  return <Providers><div id="app">{children}</div></Providers>;
};

export default AppLayout;
