import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="container">{children}</div>;
}
