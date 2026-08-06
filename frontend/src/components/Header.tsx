import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900';

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">DocAI</h1>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden text-gray-600 hover:text-gray-900"
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
        <nav className="hidden md:flex gap-6" aria-label="Main navigation">
          <NavLink to="/" className={linkClass} end>
            Upload
          </NavLink>
          <NavLink to="/history" className={linkClass}>
            History
          </NavLink>
        </nav>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden mt-2 flex flex-col gap-2" aria-label="Main navigation">
          <NavLink to="/" className={linkClass} end onClick={() => setMenuOpen(false)}>
            Upload
          </NavLink>
          <NavLink to="/history" className={linkClass} onClick={() => setMenuOpen(false)}>
            History
          </NavLink>
        </nav>
      )}
    </header>
  );
}
