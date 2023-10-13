import React, { type ReactNode } from "react";
import ReduxProvider from "~/redux/provider";
import SocketProvider from "./SocketProvider";
import Updater from "./Updater";

type ProvidersProps = {
  children: ReactNode,
};

const Providers = ({
  children,
}: ProvidersProps) => (
  <ReduxProvider>
    <Updater />
    <SocketProvider>
      {children}
    </SocketProvider>
  </ReduxProvider>
);

export default Providers;
