import React, { type ReactNode, useEffect, useState } from "react";
import { type JukeSocket, SocketContext, createConnection } from "~/core/socket";

type SocketProviderProps = {
  children: ReactNode,
};

const SocketProvider = ({
  children,
}: SocketProviderProps) => {
  const [socket, setSocket] = useState<JukeSocket | null>(null);

  useEffect(() => {
    const connection = createConnection();
    setSocket(connection);
    return () => {
      connection.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
