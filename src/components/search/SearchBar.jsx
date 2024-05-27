/**
 * SearchBar — Netflix-style inline expandable search input.
 *
 * SPEC 19.6:
 *   - Click search icon → expands animated input (framer-motion width)
 *   - Debounced 400ms via useDebounce → updates URL ?q=
 *   - ESC or outside click → collapses
 *   - Preserves query on refresh (reads ?q= from URL on mount)
 *
 * Mounted in Navbar RIGHT section, BEFORE profile dropdown.
 * Does NOT navigate away — it pushes ?q= on the current /search route
 * and navigates to /search if the user is not already there.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useDebounce } from '../../hooks/useDebounce';
import { ROUTES } from '../../constants/routes';

const SearchBar = () => {
  const navigate       = useNavigate();
  const location       = useLocation();
  const [searchParams] = useSearchParams();

  // Initialise input from URL ?q= so refresh preserves the query
  const initialQuery = searchParams.get('q') || '';

  const [isExpanded, setIsExpanded] = useState(
    // Auto-expand on /search page so the bar is immediately usable
    location.pathname === ROUTES.SEARCH && !!initialQuery
  );
  const [inputValue, setInputValue] = useState(initialQuery);

  const containerRef = useRef(null);
  const inputRef     = useRef(null);

  // 400ms debounce per SPEC — prevents URL spam while typing
  const debouncedQuery = useDebounce(inputValue, 400);

  // ── Sync debounced query → URL ?q= ────────────────────────────────────────
  // IMPORTANT: only navigate when we actually have a query to show.
  // Expanding the bar with no text must NOT redirect to /search —
  // that was the "first click routes" bug.
  useEffect(() => {
    if (!isExpanded) return;
    const trimmed = debouncedQuery.trim();

    // Navigate to /search only when there is real query text.
    // If the user expanded but hasn't typed yet, stay on current page.
    if (!trimmed) return;

    const target = `${ROUTES.SEARCH}?q=${encodeURIComponent(trimmed)}`;
    const currentQ = new URLSearchParams(location.search).get('q') || '';

    // Skip if already showing the same query to avoid spurious history entries
    if (location.pathname === ROUTES.SEARCH && currentQ === trimmed) return;

    navigate(target, { replace: location.pathname === ROUTES.SEARCH });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, isExpanded]);

  // ── Expand: focus input ────────────────────────────────────────────────────
  const expand = useCallback(() => {
    setIsExpanded(true);
    // Focus after animation frame so the input is mounted
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  // ── Collapse: clear + shrink ───────────────────────────────────────────────
  const collapse = useCallback(() => {
    setIsExpanded(false);
    setInputValue('');
  }, []);

  // ── ESC key ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isExpanded) collapse();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isExpanded, collapse]);

  // ── Outside click → collapse ───────────────────────────────────────────────
  // useOnClickOutside only closes, never opens — same safe pattern as ProfileDropdown
  useOnClickOutside(containerRef, () => {
    if (isExpanded) collapse();
  });

  const handleClear = (e) => {
    e.stopPropagation();
    setInputValue('');
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center"
      aria-label="Search"
    >
      {/* ── Collapsed: just the icon button ─────────────────────────────── */}
      {!isExpanded && (
        <button
          type="button"
          onClick={expand}
          aria-label="Open search"
          aria-expanded={false}
          className="
            p-1 text-nethero-grayLight hover:text-nethero-white
            transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-nethero-white rounded
          "
        >
          <Search size={20} aria-hidden="true" />
        </button>
      )}

      {/* ── Expanded: animated search field ─────────────────────────────── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="search-field"
            className="
              flex items-center gap-1
              border border-nethero-white bg-nethero-black/80
              rounded-sm overflow-hidden
            "
            initial={{ width: 32, opacity: 0.5 }}
            animate={{ width: 'clamp(160px, 22vw, 280px)', opacity: 1 }}
            exit={{ width: 32, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Search icon inside the field */}
            <Search
              size={16}
              className="ml-2 flex-shrink-0 text-nethero-white"
              aria-hidden="true"
            />

            <input
              ref={inputRef}
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Titles, people, genres"
              aria-label="Search titles"
              autoComplete="off"
              spellCheck={false}
              className="
                flex-1 bg-transparent
                text-nethero-white text-sm
                placeholder:text-nethero-grayDark
                py-1.5 pr-1
                focus:outline-none
                min-w-0
              "
            />

            {/* Clear button — only when there is text */}
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                tabIndex={-1}
                className="
                  p-1 mr-0.5 flex-shrink-0
                  text-nethero-grayLight hover:text-nethero-white
                  transition-colors
                  focus-visible:outline-none
                "
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
