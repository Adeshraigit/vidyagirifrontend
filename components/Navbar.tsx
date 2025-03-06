'use client';
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Brain } from "lucide-react";
import { SignedIn, UserButton, useAuth } from "@clerk/nextjs";

function Navbar() {
  const { isSignedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-emerald-900 text-emerald-50 py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo with Brain Icon */}
        <Link href="/" className="flex items-center text-2xl font-bold tracking-wide space-x-2">
          <Brain size={32} className="text-white" />
          <span>Vidyagiri</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-lg">
          <Link href="/" className="hover:text-white transition-all duration-300">
            Home
          </Link>
          <Link href="/about" className="hover:text-white transition-all duration-300">
            About
          </Link>
          <Link href="/contact" className="hover:text-white transition-all duration-300">
            Contact
          </Link>
          {/* Enhanced "Ask AI" Button */}
          <Link
            href="/ask"
            className="block text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Ask AI
          </Link>
        </div>

        {/* Authentication & Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <SignedIn>
              <UserButton />
            </SignedIn>
          ) : (
            <Link
              href="/sign-in"
              className="hidden md:block text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-md transition duration-300"
            >
              Log In
            </Link>
          )}
          <button onClick={toggleMenu} className="md:hidden focus:outline-none">
            {isOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-emerald-800 py-4 transition-all duration-300 ease-in-out">
          <ul className="text-center space-y-4 text-lg">
            <li>
              <Link href="/" onClick={closeMenu} className="block hover:text-white transition-all duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={closeMenu} className="block hover:text-white transition-all duration-300">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={closeMenu} className="block hover:text-white transition-all duration-300">
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/ask"
                onClick={closeMenu}
                className="block text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Ask AI
              </Link>
            </li>
            {!isSignedIn && (
              <li>
                <Link
                  href="/sign-in"
                  onClick={closeMenu}
                  className="block text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-md transition duration-300"
                >
                  Log In
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
