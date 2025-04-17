import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-lg py-2"
          : "bg-white/95 backdrop-blur-sm py-3"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <img
              className="w-10 h-10 object-contain"
              src="/images/logo.png"
              alt="Warrior+ Logo"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-[#a65553] to-[#7e3e3d] bg-clip-text text-transparent">
              Warrior+
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.a
              href="#features"
              className="text-gray-700 hover:text-[#a65553] transition-colors relative group"
              whileHover={{ scale: 1.05 }}
            >
              Features
              <span className="absolute left-0 bottom-0 h-0.5 bg-[#a65553] w-0 group-hover:w-full transition-all duration-300" />
            </motion.a>

            <motion.a
              href="#community"
              className="text-gray-700 hover:text-[#a65553] transition-colors relative group"
              whileHover={{ scale: 1.05 }}
            >
              Community
              <span className="absolute left-0 bottom-0 h-0.5 bg-[#a65553] w-0 group-hover:w-full transition-all duration-300" />
            </motion.a>

            <motion.a
              href="#contact"
              className="text-gray-700 hover:text-[#a65553] transition-colors relative group"
              whileHover={{ scale: 1.05 }}
            >
              Contact
              <span className="absolute left-0 bottom-0 h-0.5 bg-[#a65553] w-0 group-hover:w-full transition-all duration-300" />
            </motion.a>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/register"
                className="bg-gradient-to-r from-[#a65553] to-[#7e3e3d] text-white px-5 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <span>Get Started</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.div whileHover={{ scale: 1.1 }} className="mr-4">
              <Link
                to="/register"
                className="bg-[#a65553] text-white px-3 py-1.5 text-sm rounded-md hover:bg-[#7e3e3d] transition"
              >
                Get Started
              </Link>
            </motion.div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-[#a65553] focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </Link>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <motion.a
                href="#features"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-[#a65553] hover:bg-gray-50 transition"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => setMenuOpen(false)}
              >
                Features
              </motion.a>

              <motion.a
                href="#community"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-[#a65553] hover:bg-gray-50 transition"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.15 }}
                onClick={() => setMenuOpen(false)}
              >
                Community
              </motion.a>

              <motion.a
                href="#contact"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-[#a65553] hover:bg-gray-50 transition"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </motion.a>

              <motion.div
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.25 }}
                className="pt-2"
              >
                <Link
                  to="/register"
                  className="block w-full text-center bg-gradient-to-r from-[#a65553] to-[#7e3e3d] text-white px-4 py-2 rounded-lg hover:shadow-md transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
