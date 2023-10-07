"use client";
import "~/styles/custom-bootstrap.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import React, { type ReactNode } from "react";
import ReduxProvider from "~/redux/provider";

config.autoAddCss = false;

type AppLayoutProps = {
  children: ReactNode,
};

const AppLayout = ({
  children,
}: AppLayoutProps) => (
  <ReduxProvider>
    <div id="app">
      {children}
    </div>
  </ReduxProvider>
);

export default AppLayout;
