import {
  BookHeart,
  Home,
  LogOut,
  Settings,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { toast } from "react-toastify";

export default function Sidebar({ isCollapsed }: { isCollapsed: boolean }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error: any) {
      console.log("Error logging out: ", error?.message);
    }
  };
  return (
    <div
      className={`text-black h-full flex flex-col p-4 space-y-4 overflow-hidden transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } group hover:w-64`}
    >
      {/* Navigation Items */}
      <div className="text-black flex flex-col space-y-4">
        <SidebarItem
          icon={<Home size={20} />}
          label="Home"
          to="/dashboard"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={<BookHeart size={20} />}
          label="Journal"
          to="/journal"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={<Users size={20} />}
          label="Join a Community"
          to="#"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={<TriangleAlert size={20} />}
          label="SOS"
          to="/sos"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          to="/settings"
          isCollapsed={isCollapsed}
        />
      </div>

      {/* Logout Item at the bottom */}
      <button onClick={handleLogout} className="cursor-pointer mt-auto">
        <SidebarItem
          icon={<LogOut size={20} />}
          label="Logout"
          to="/"
          isCollapsed={isCollapsed}
        />
      </button>
    </div>
  );
}

export function SidebarItem({
  icon,
  label,
  to,
  isCollapsed,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  isCollapsed: boolean;
}) {
  return (
    <Link
      to={to}
      className="flex items-center text-white p-2 rounded hover:bg-secondary/40 transition-all"
    >
      <div className="w-6 flex justify-center">{icon}</div>
      <span
        className={`ml-4 text-sm font-medium transition-opacity duration-300 ${
          isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        } group-hover:opacity-100 group-hover:w-auto group-hover:overflow-visible`}
      >
        {label}
      </span>
    </Link>
  );
}
