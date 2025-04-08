import { LayoutDashboard, User, BookHeart, TriangleAlert } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
    { to: "#", icon: <BookHeart />, label: "Journal" },
    { to: "#", icon: <User />, label: "Profile" },
    { to: "#", icon: <TriangleAlert />, label: "SOS" },
  ];

  return (
    <div className="bg-white shadow border-t flex justify-around py-2">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`flex flex-col items-center text-sm ${
            location.pathname === item.to ? "text-primary" : "text-gray-600"
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
