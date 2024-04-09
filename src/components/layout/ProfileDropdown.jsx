import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ChevronDown } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

const dropdownVariant = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export const ProfileDropdown = ({ isOpen, onClose, profiles = [], activeProfile, onSelectProfile, onManage, onSignOut }) => {
  const ref = useRef(null);
  useOnClickOutside(ref, onClose);

  return (
    <div className="relative" ref={ref}>
      {/* Avatar trigger */}
      <button
        onClick={onClose}
        aria-label="Profile menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white rounded-card"
      >
        <div className="w-8 h-8 rounded-card overflow-hidden bg-nethero-bgHover flex items-center justify-center">
          {activeProfile?.avatar_url ? (
            <img
              src={activeProfile.avatar_url}
              alt={activeProfile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={18} className="text-nethero-grayLight" aria-hidden="true" />
          )}
        </div>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`text-nethero-grayLight transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="profile-dropdown"
            variants={dropdownVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            role="menu"
            aria-label="Profile options"
            className="absolute right-0 top-full mt-2 w-56 bg-nethero-bgLight border border-nethero-border rounded-card shadow-modal z-dropdown overflow-hidden"
          >
            {/* Profile list */}
            {profiles.length > 0 && (
              <div className="py-2 border-b border-nethero-border">
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    role="menuitem"
                    onClick={() => { onSelectProfile?.(profile); onClose(); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-nethero-white hover:bg-nethero-bgHover transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-card overflow-hidden bg-nethero-bgHover flex-shrink-0">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={14} className="text-nethero-grayLight m-auto mt-1" aria-hidden="true" />
                      )}
                    </div>
                    <span className={profile.id === activeProfile?.id ? 'text-nethero-white font-semibold' : 'text-nethero-grayLight'}>
                      {profile.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="py-2">
              {[
                { label: 'Manage Profiles', action: () => { onManage?.(); onClose(); } },
                { label: 'Account',          action: onClose },
                { label: 'Help',             action: onClose },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  role="menuitem"
                  onClick={action}
                  className="w-full text-left px-4 py-2 text-sm text-nethero-grayLight hover:text-nethero-white hover:bg-nethero-bgHover transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="border-t border-nethero-border py-2">
              <button
                role="menuitem"
                onClick={() => { onSignOut?.(); onClose(); }}
                className="w-full text-left px-4 py-2 text-sm text-nethero-grayLight hover:text-nethero-white hover:bg-nethero-bgHover transition-colors"
              >
                Sign out of NetHero
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
