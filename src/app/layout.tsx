import React, { type ReactNode } from "react";
import AppLayout from "~/components/AppLayout";

type RootLayoutProps = {
  children: ReactNode,
};

const RootLayout = ({
  children,
}: RootLayoutProps) => (
  <html lang="en">
    <body>
      <AppLayout>
        {children}
      </AppLayout>
    </body>
  </html>
);

export default RootLayout;
