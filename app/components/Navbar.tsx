'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faTrophy, faTable, faMedal, faHome } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Inicio', href: '/', icon: faHome }, 
    { name: 'Partidos', href: '/matches', icon: faTable },    
    { name: 'Final', href: '/finals', icon: faMedal },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black shadow-lg border-b border-gray-800 w-full">
      <div className="w-full lg:w-full">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8 w-full">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img src="/favicon.ico" alt="Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-white">
                Torneo Padel
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block flex-1">
            <div className="ml-10 flex items-baseline space-x-4 justify-end">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={link.icon} className="mr-2 text-xs" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FontAwesomeIcon icon={faTimes} className="block h-6 w-6" />
              ) : (
                <FontAwesomeIcon icon={faBars} className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black border-t border-gray-800 w-full">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <FontAwesomeIcon icon={link.icon} className="mr-3 text-sm" />
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
