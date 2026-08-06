import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] flex items-center ${
      isActive
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900 truncate">DocuExtract</h1>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-600 hover:text-gray-900"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex gap-4" aria-label="Main navigation">
              <NavLink to="/" end className={navLinkClass}>
                Upload
              </NavLink>
              <NavLink to="/history" className={navLinkClass}>
                History
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-gray-100 px-4 py-2 flex flex-col gap-1" aria-label="Main navigation">
            <NavLink to="/" end className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Upload
            </NavLink>
            <NavLink to="/history" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              History
            </NavLink>
          </nav>
        )}
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
