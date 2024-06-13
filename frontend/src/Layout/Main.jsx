import React from "react";
import { Outlet } from "react-router-dom";

export default function Main() {
  return (
    <main className="flex max-w-6xl mx-auto">
      <Outlet />
    </main>
  );
}
