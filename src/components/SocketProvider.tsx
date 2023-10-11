import React, { type ReactNode, useEffect, useState } from "react";
import { type JukeSocket, SocketContext, createConnection } from "~/core/socket";
import useNavigatorOnLine from "~/hooks/useNavigatorOnLine";

type SocketProviderProps = {
  children: ReactNode,
};

const SocketProvider = ({
  children,
}: SocketProviderProps) => {
  const isOnline = useNavigatorOnLine();
  const [socket, setSocket] = useState<JukeSocket | null>(null);

  useEffect(() => {
    if (!isOnline) return;
    fetch("/api/socket");
    const connection = createConnection();
    setSocket(connection);
    return () => {
      connection.disconnect();
      setSocket(null);
    };
  }, [isOnline]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
