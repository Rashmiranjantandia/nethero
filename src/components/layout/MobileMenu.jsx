import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Tv, Film, Zap, Bookmark, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const NAV_LINKS = [
  { label: 'Home',            to: ROUTES.BROWSE,  icon: Home },
  { label: 'TV Shows',        to: ROUTES.TV,      icon: Tv },
  { label: 'Movies',          to: ROUTES.MOVIES,  icon: Film },
  { label: 'New & Popular',   to: ROUTES.BROWSE,  icon: Zap },
  { label: 'My List',         to: ROUTES.MY_LIST, icon: Bookmark },
  { label: 'Search',          to: ROUTES.SEARCH,  icon: Search },
];

const drawerVariant = {
  initial: { x: '-100%' },
  animate: { x: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  exit:    { x: '-100%', transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
};

const backdropVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.25 } },
};

export const MobileMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLinkClick = (to) => {
    navigate(to);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="mobile-backdrop"
            variants={backdropVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-modal bg-black/70"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.nav
            key="mobile-drawer"
            variants={drawerVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            role="navigation"
            aria-label="Mobile navigation"
            className="fixed top-0 left-0 h-full w-72 z-toast bg-nethero-bg border-r border-nethero-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-nethero-border">
              <span className="text-nethero-red font-bold text-2xl tracking-tight">NetHero</span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-1.5 rounded-full hover:bg-nethero-bgHover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            {/* Links */}
            <ul className="flex flex-col py-4 flex-1 overflow-y-auto" role="list">
              {NAV_LINKS.map(({ label, to, icon: Icon }) => (
                <li key={label} role="listitem">
                  <button
                    onClick={() => handleLinkClick(to)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-nethero-grayLight hover:text-nethero-white hover:bg-nethero-bgHover transition-colors text-left text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white"
                  >
                    <Icon size={20} aria-hidden="true" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
