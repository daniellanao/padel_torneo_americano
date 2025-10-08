'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTrophy, faTable,faLayerGroup, faArrowRightArrowLeft, faChartBar } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  const footerLinks = [
    { name: 'Standings', href: '/standings', icon: faChartBar },
    { name: 'Players', href: '/players', icon: faUsers },
    { name: 'Teams', href: '/teams', icon: faTrophy },
    { name: 'Groups', href: '/groups', icon: faLayerGroup },
    { name: 'Group Stage', href: '/group-stage', icon: faTable },
    { name: 'Assignments', href: '/assignments', icon: faArrowRightArrowLeft },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo */}
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-6 w-6 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
              <FontAwesomeIcon icon={faTrophy} className="text-white text-xs" />
            </div>
            <span className="text-lg font-bold text-white">
              Torneo La Caja
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
              >
                <FontAwesomeIcon icon={link.icon} className="mr-2 text-xs" />
                <span className="text-sm font-medium">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <p className="text-xs text-gray-400">
              © 2025 <a href="https://sportchain.io" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-400 hover:text-blue-300 transition-colors">Sportchain</a>. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
