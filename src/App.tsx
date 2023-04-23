import InventoryPage from "./inventory/InventoryPage";
import { io } from "socket.io-client";
import { useEffect } from "react";

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  path: "/socket",
  transports: ["websocket"],
});

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className={"min-w-screen min-h-screen dark:bg-slate-950"}>
      <InventoryPage />
    </div>
  );
}

export default App;
