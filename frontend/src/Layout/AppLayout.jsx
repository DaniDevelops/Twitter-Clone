import { Outlet } from "react-router-dom";
import RightPanel from "../Components/Common/RightPanel";
import Sidebar from "../Components/Common/Sidebar";

export default function AppLayout() {
  return (
    <main className="flex max-w-6xl mx-auto">
      <Sidebar />
      <Outlet />
      <RightPanel />
    </main>
  );
}
