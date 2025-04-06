import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <span className="text-2xl font-bold text-[#a65553]">SickleCellApp</span>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-8 items-center">
          <a
            href="#features"
            className="text-gray-600 hover:text-[#a65553] transition"
          >
            Features
          </a>
          <a
            href="#community"
            className="text-gray-600 hover:text-[#a65553] transition"
          >
            Community
          </a>
          <a
            href="#contact"
            className="text-gray-600 hover:text-[#a65553] transition"
          >
            Contact
          </a>
          <Link
            to="/register"
            className="bg-[#a65553] text-white px-4 py-2 rounded-lg hover:bg-[#923b39] transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile: Get Started + Hamburger */}
        <div className="flex items-center md:hidden gap-4">
          <Link
            to="/register"
            className="bg-[#a65553] text-white px-3 py-1.5 text-sm rounded-md hover:bg-[#923b39] transition"
          >
            Get Started
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <a
            href="#features"
            className="block text-gray-700 hover:text-[#a65553] transition"
          >
            Features
          </a>
          <a
            href="#community"
            className="block text-gray-700 hover:text-[#a65553] transition"
          >
            Community
          </a>
          <a
            href="#contact"
            className="block text-gray-700 hover:text-[#a65553] transition"
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
}
