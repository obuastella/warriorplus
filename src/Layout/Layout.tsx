import { ReactNode, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import Sidebar, { SidebarItem } from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

export default function Layout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // For mobile only

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar for large screens - collapses by default, expands on hover */}
      <div
        className={`hidden md:block transition-all duration-300 group ${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-primary text-white hover:w-64`}
      >
        <Sidebar isCollapsed={!isSidebarOpen} />
      </div>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-14">
        <button
          className="m-4 text-primary absolute left-0"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/50"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-64 h-full bg-primary text-white p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-4">
              <button onClick={() => setSidebarOpen(false)}>
                <X />
              </button>
            </div>

            {/* Sidebar Items */}
            <div className="flex flex-col space-y-4 flex-grow">
              <Sidebar isCollapsed={!isSidebarOpen} />
            </div>

            {/* Logout Button at the bottom of the sidebar */}
            <div className="mt-auto">
              <SidebarItem
                icon={<LogOut size={20} />}
                label="Logout"
                to="#"
                isCollapsed={!isSidebarOpen}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto pt-14 md:pt-0">
        <div className="p-4">{children}</div>

        {/* Bottom Navigation - visible only on mobile */}
        <div className="block md:hidden fixed bottom-0 w-full z-40">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
