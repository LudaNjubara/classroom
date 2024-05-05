"use client";

import { useSocket } from "@/providers/socket-provider";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  return (
    <div className="absolute top-0 right-0">
      <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-600" : "bg-orange-600"}`}></div>
    </div>
  );
};
