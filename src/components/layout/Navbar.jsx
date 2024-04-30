import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Search, Bell } from 'lucide-react';
import { useScroll } from '../../hooks/useScroll';
import { useUIStore } from '../../store/useUIStore';
import { ROUTES } from '../../constants/routes';
import MobileMenu from './MobileMenu';
import ProfileDropdown from './ProfileDropdown';

const NAV_LINKS = [
  { label: 'Home',          to: ROUTES.BROWSE },
  { label: 'TV Shows',      to: ROUTES.TV },
  { label: 'Movies',        to: ROUTES.MOVIES },
  { label: 'New & Popular', to: ROUTES.BROWSE },
  { label: 'My List',       to: ROUTES.MY_LIST },
  { label: 'Browse by Genre', to: ROUTES.BROWSE },
];

export const Navbar = ({ profiles = [], activeProfile, onSelectProfile, onManage, onSignOut }) => {
  useScroll(80);
  const isScrolled = useUIStore((s) => s.isNavScrolled);
  const isMobileMenuOpen = useUIStore((s) => s.isMobileMenuOpen);
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);

  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <motion.header
        role="banner"
        animate={{ backgroundColor: isScrolled ? '#141414' : 'transparent' }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-navbar shadow-navbar"
      >
        <nav
          aria-label="Main navigation"
          className="flex items-center justify-between px-4 sm:px-8 lg:px-12 h-14 lg:h-[68px]"
        >
          {/* ── LEFT ── */}
          <div className="flex items-center gap-6">
            {/* Hamburger (mobile only) */}
            <button
              onClick={toggleMobileMenu}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden p-1 text-nethero-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white rounded"
            >
              <Menu size={24} aria-hidden="true" />
            </button>

            {/* Logo */}
            <Link
              to={ROUTES.BROWSE}
              aria-label="NetHero — go to browse"
              className="text-nethero-red font-bold text-2xl lg:text-3xl tracking-tight flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white rounded"
            >
              NetHero
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden lg:flex items-center gap-5" role="list">
              {NAV_LINKS.map(({ label, to }) => (
                <li key={label} role="listitem">
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      [
                        'text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white rounded',
                        isActive
                          ? 'text-nethero-white font-semibold'
                          : 'text-nethero-grayLight hover:text-nethero-white',
                      ].join(' ')
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ── RIGHT ── */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Search */}
            <button
              onClick={() => navigate(ROUTES.SEARCH)}
              aria-label="Search"
              className="p-1 text-nethero-grayLight hover:text-nethero-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white rounded"
            >
              <Search size={20} aria-hidden="true" />
            </button>

            {/* Bell (placeholder) */}
            <button
              aria-label="Notifications"
              className="p-1 text-nethero-grayLight hover:text-nethero-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white rounded"
            >
              <Bell size={20} aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <ProfileDropdown
              isOpen={profileOpen}
              onToggle={() => setProfileOpen((v) => !v)}
              onClose={() => setProfileOpen(false)}
              profiles={profiles}
              activeProfile={activeProfile}
              onSelectProfile={onSelectProfile}
              onManage={onManage}
              onSignOut={onSignOut}
            />
          </div>
        </nav>
      </motion.header>

      {/* Mobile slide-in menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} />
    </>
  );
};

export default Navbar;
