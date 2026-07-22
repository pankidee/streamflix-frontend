import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVJ } from '../context/VJContext';
import VJSelectorModal from './VJSelectorModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { selectedVj } = useVJ();
  const [showVjModal, setShowVjModal] = useState(false);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      closeMenu();
      setQuery('');
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/home" className="brand" onClick={closeMenu}>StreamFlix</Link>
        {user && <span className="navbar-user-inline">{user.name}</span>}

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </nav>

      {menuOpen && <div className="navbar-backdrop" onClick={closeMenu} />}

      <div className={`navbar-dropdown ${menuOpen ? 'open' : ''}`}>
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">🔍</button>
        </form>

        <button
          className="navbar-dropdown-item"
          onClick={() => { setShowVjModal(true); closeMenu(); }}
        >
          {selectedVj || 'Select VJ'} ▾
        </button>

        <Link to="/history" className="navbar-dropdown-item" onClick={closeMenu}>My List</Link>
        <Link to="/series" className="navbar-dropdown-item" onClick={closeMenu}>Series</Link>

        {user?.isAdmin && (
          <Link to="/admin" className="navbar-dropdown-item" onClick={closeMenu}>Admin</Link>
        )}

        {user && (
          <button className="navbar-dropdown-item navbar-logout" onClick={handleLogout}>
            Log out
          </button>
        )}
      </div>

      {showVjModal && <VJSelectorModal onClose={() => setShowVjModal(false)} />}
    </>
  );
}