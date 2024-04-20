The "full spec" = all 3 messages combined (Foundation + Backend + Components/Build Order). I split it into 3 messages purely because of **message length limits in this chat** — not because it's incomplete. Think of it as Chapter 1, 2, 3 of the same document. You'll have the complete spec by the end.

**Plan:**
- **Message 1 (next)**: Foundation — design system, structure, setup
- **Message 2**: Backend — Supabase schema, TMDB layer, auth, state
- **Message 3**: Components, pages, and the **build-order prompts** for Claude Code

After Message 3, you'll have everything. Save all 3 messages as your master doc.

Let's go. Here's **Message 1**.

---

# 📘 NETHERO — MASTER SPEC DOCUMENT
## Message 1 of 3: FOUNDATION

---

## 1. PROJECT METADATA

| Field | Value |
|---|---|
| **Name** | NetHero |
| **Tagline** | Unlimited movies, TV shows, and more. |
| **Type** | SPA (Single Page App) |
| **Target** | Mobile, Tablet, Desktop, TV (4K) |
| **Min Browser** | Chrome 100+, Safari 15+, Firefox 100+ |

---

## 2. TECH STACK (LOCKED VERSIONS)

```json
{
  "react": "^18.3.1",
  "vite": "^5.4.0",
  "react-router-dom": "^6.26.0",
  "tailwindcss": "^3.4.10",
  "zustand": "^4.5.5",
  "axios": "^1.7.5",
  "framer-motion": "^11.3.0",
  "lucide-react": "^0.435.0",
  "react-player": "^2.16.0",
  "@supabase/supabase-js": "^2.45.0",
  "react-hot-toast": "^2.4.1",
  "react-intersection-observer": "^9.13.0",
  "swiper": "^11.1.0"
}
```

**Dev tools:** ESLint, Prettier, PostCSS, Autoprefixer

---

## 3. DESIGN SYSTEM

### 3.1 Color Palette

```js
// tailwind.config.js -> theme.extend.colors
colors: {
  nethero: {
    red:     '#E50914',  // primary brand
    redDark: '#B81D24',
    redHover:'#F40612',
    black:   '#000000',
    bg:      '#141414',  // main background
    bgLight: '#181818',  // card background
    bgHover: '#2F2F2F',  // hover state
    gray:    '#808080',
    grayLight: '#B3B3B3',
    grayDark: '#333333',
    white:   '#FFFFFF',
    border:  '#404040',
    success: '#46D369',
    warning: '#E87C03',
  }
}
```

### 3.2 Typography

**Font:** Inter (Netflix Sans alternative — free, Google Fonts)
**Fallback:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

```js
// tailwind.config.js -> theme.extend.fontFamily
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
}

// fontSize scale
fontSize: {
  'hero':    ['clamp(2rem, 5vw, 4rem)',     { lineHeight: '1.1', fontWeight: '700' }],
  'h1':      ['clamp(1.75rem, 4vw, 3rem)',  { lineHeight: '1.2', fontWeight: '700' }],
  'h2':      ['clamp(1.5rem, 3vw, 2.25rem)',{ lineHeight: '1.2', fontWeight: '600' }],
  'h3':      ['clamp(1.25rem, 2.5vw, 1.5rem)',{ lineHeight: '1.3', fontWeight: '600' }],
  'row-title': ['1.4vw', { lineHeight: '1.3', fontWeight: '600' }], // Netflix-style row titles
  'body':    ['1rem', { lineHeight: '1.5' }],
  'sm':      ['0.875rem', { lineHeight: '1.4' }],
  'xs':      ['0.75rem', { lineHeight: '1.3' }],
}
```

**Font weights used:** 400 (body), 500 (medium), 600 (semibold), 700 (bold)

### 3.3 Spacing Scale (use Tailwind defaults + extras)

```js
spacing: {
  '4.5': '1.125rem',
  '18':  '4.5rem',
  '22':  '5.5rem',
  '120': '30rem',
}
```

### 3.4 Shadows

```js
boxShadow: {
  'card':      '0 6px 20px rgba(0,0,0,0.5)',
  'card-hover':'0 10px 40px rgba(0,0,0,0.75)',
  'modal':     '0 25px 60px rgba(0,0,0,0.85)',
  'navbar':    '0 4px 6px rgba(0,0,0,0.3)',
}
```

### 3.5 Border Radius

```js
borderRadius: {
  'card':  '4px',
  'modal': '8px',
  'pill':  '9999px',
}
```

### 3.6 Z-Index Layers

```js
zIndex: {
  'base':    '1',
  'card':    '10',
  'card-hover':'20',
  'navbar':  '50',
  'dropdown':'60',
  'modal':   '100',
  'toast':   '200',
}
```

---

## 4. ANIMATION SYSTEM

### 4.1 Durations & Easings

```js
// constants/animations.js
export const DURATIONS = {
  fast:    0.15,
  normal:  0.3,
  slow:    0.5,
  hero:    0.8,
};

export const EASINGS = {
  smooth:  [0.4, 0, 0.2, 1],      // standard
  out:     [0, 0, 0.2, 1],         // ease-out
  in:      [0.4, 0, 1, 1],         // ease-in
  bounce:  [0.34, 1.56, 0.64, 1],  // playful
};
```

### 4.2 Standard Framer Motion Variants

```js
// constants/variants.js
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4,0,0.2,1] } },
};

export const cardHover = {
  rest:  { scale: 1, zIndex: 10, transition: { duration: 0.3 } },
  hover: { scale: 1.5, zIndex: 20, y: -50, transition: { duration: 0.3, delay: 0.3 } },
};

export const modalVariant = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};
```

### 4.3 Animation Rules (CRITICAL for smoothness)

✅ **DO:** Animate `transform`, `opacity`, `filter`
❌ **DON'T:** Animate `width`, `height`, `top`, `left`, `margin`
✅ **DO:** Use `will-change: transform` on hover-heavy elements
✅ **DO:** Use `layout` prop on Framer Motion for shared layout transitions
✅ **DO:** Debounce scroll handlers to 16ms (60fps)
✅ **DO:** `loading="lazy"` on all non-critical images

---

## 5. RESPONSIVE BREAKPOINTS

```js
// tailwind.config.js -> theme.screens
screens: {
  'xs':  '480px',   // small mobile
  'sm':  '640px',   // mobile
  'md':  '768px',   // tablet portrait
  'lg':  '1024px',  // tablet landscape / small laptop
  'xl':  '1280px',  // desktop
  '2xl': '1536px',  // large desktop
  '3xl': '1920px',  // TV / 4K
}
```

### 5.1 Layout Behavior per Breakpoint

| Element | Mobile (<640) | Tablet (640-1024) | Desktop (>1024) | TV (>1920) |
|---|---|---|---|---|
| Navbar | Hamburger menu | Compact nav | Full nav | Full nav (larger) |
| Hero height | 60vh | 75vh | 85vh | 90vh |
| Hero text | text-2xl | text-4xl | text-6xl | text-7xl |
| Cards/row | 2 visible | 3-4 visible | 6-7 visible | 8-9 visible |
| Card hover-expand | ❌ disabled (tap to modal) | ❌ disabled | ✅ enabled | ✅ enabled |
| Row padding | px-4 | px-8 | px-12 | px-16 |
| Modal width | 100vw | 90vw | 850px max | 1000px max |

---

## 6. FOLDER STRUCTURE

```
nethero/
├── public/
│   ├── favicon.svg
│   └── logo.svg
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── Image.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Toast.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   └── ProfileDropdown.jsx
│   │   ├── browse/
│   │   │   ├── Hero.jsx
│   │   │   ├── Row.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── MovieCardHover.jsx
│   │   │   └── BillboardControls.jsx
│   │   ├── modal/
│   │   │   ├── DetailModal.jsx
│   │   │   ├── ModalHeader.jsx
│   │   │   ├── EpisodeList.jsx
│   │   │   └── SimilarGrid.jsx
│   │   ├── player/
│   │   │   ├── VideoPlayer.jsx
│   │   │   ├── PlayerControls.jsx
│   │   │   └── PlayerOverlay.jsx
│   │   ├── search/
│   │   │   ├── SearchBar.jsx
│   │   │   └── SearchResults.jsx
│   │   └── auth/
│   │       ├── AuthForm.jsx
│   │       └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── ProfileSelect.jsx
│   │   ├── ProfileManage.jsx
│   │   ├── Browse.jsx
│   │   ├── Movies.jsx
│   │   ├── TVShows.jsx
│   │   ├── MyList.jsx
│   │   ├── Search.jsx
│   │   ├── Watch.jsx
│   │   └── NotFound.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFetch.js
│   │   ├── useMyList.js
│   │   ├── useDebounce.js
│   │   ├── useScroll.js
│   │   ├── useMediaQuery.js
│   │   └── useOnClickOutside.js
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── tmdb.js
│   │   ├── videoSources.js
│   │   └── helpers.js
│   ├── store/
│   │   ├── useAuthStore.js
│   │   ├── useProfileStore.js
│   │   ├── useModalStore.js
│   │   └── useUIStore.js
│   ├── constants/
│   │   ├── animations.js
│   │   ├── variants.js
│   │   ├── genres.js
│   │   └── routes.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx
├── .env.example
├── .env.local
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 7. ENVIRONMENT VARIABLES

`.env.local` (you create this, never commit):
```bash
VITE_TMDB_API_KEY=your_tmdb_v3_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMG_URL=https://image.tmdb.org/t/p
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 8. INITIAL SETUP COMMANDS

```bash
# 1. Create project
npm create vite@latest nethero -- --template react
cd nethero

# 2. Install all dependencies
npm install react-router-dom@^6.26.0 zustand@^4.5.5 axios@^1.7.5 \
  framer-motion@^11.3.0 lucide-react@^0.435.0 react-player@^2.16.0 \
  @supabase/supabase-js@^2.45.0 react-hot-toast@^2.4.1 \
  react-intersection-observer@^9.13.0 swiper@^11.1.0

# 3. Install dev dependencies
npm install -D tailwindcss@^3.4.10 postcss autoprefixer prettier eslint-config-prettier

# 4. Init Tailwind
npx tailwindcss init -p

# 5. Run
npm run dev
```

---

## 9. GLOBAL CSS (`src/styles/index.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { @apply box-border; }
  html { @apply scroll-smooth; }
  body {
    @apply bg-nethero-bg text-nethero-white font-sans antialiased overflow-x-hidden;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { @apply bg-nethero-bg; }
  ::-webkit-scrollbar-thumb { @apply bg-nethero-grayDark rounded-pill; }
  ::-webkit-scrollbar-thumb:hover { @apply bg-nethero-gray; }
}

@layer components {
  .row-scroll {
    @apply flex gap-2 overflow-x-scroll scrollbar-hide scroll-smooth snap-x;
  }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  .gradient-bottom {
    background: linear-gradient(180deg, transparent 0%, rgba(20,20,20,0.6) 50%, #141414 100%);
  }
  .gradient-left {
    background: linear-gradient(90deg, #141414 0%, rgba(20,20,20,0.6) 50%, transparent 100%);
  }
}

@layer utilities {
  .text-shadow { text-shadow: 2px 2px 4px rgba(0,0,0,0.75); }
  .will-change-transform { will-change: transform; }
}
```

---

## 10. TAILWIND CONFIG (`tailwind.config.js`) — COMPLETE

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      'xs': '480px', 'sm': '640px', 'md': '768px',
      'lg': '1024px', 'xl': '1280px', '2xl': '1536px', '3xl': '1920px',
    },
    extend: {
      colors: {
        nethero: {
          red: '#E50914', redDark: '#B81D24', redHover: '#F40612',
          black: '#000000', bg: '#141414', bgLight: '#181818',
          bgHover: '#2F2F2F', gray: '#808080', grayLight: '#B3B3B3',
          grayDark: '#333333', white: '#FFFFFF', border: '#404040',
          success: '#46D369', warning: '#E87C03',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      fontSize: {
        'hero': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.1', fontWeight: '700' }],
        'h1':   ['clamp(1.75rem, 4vw, 3rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'h2':   ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', fontWeight: '600' }],
        'h3':   ['clamp(1.25rem, 2.5vw, 1.5rem)', { lineHeight: '1.3', fontWeight: '600' }],
        'row-title': ['clamp(1rem, 1.4vw, 1.4rem)', { lineHeight: '1.3', fontWeight: '600' }],
      },
      spacing: { '4.5': '1.125rem', '18': '4.5rem', '22': '5.5rem', '120': '30rem' },
      boxShadow: {
        'card': '0 6px 20px rgba(0,0,0,0.5)',
        'card-hover': '0 10px 40px rgba(0,0,0,0.75)',
        'modal': '0 25px 60px rgba(0,0,0,0.85)',
        'navbar': '0 4px 6px rgba(0,0,0,0.3)',
      },
      borderRadius: { 'card': '4px', 'modal': '8px', 'pill': '9999px' },
      zIndex: {
        'base': '1', 'card': '10', 'card-hover': '20',
        'navbar': '50', 'dropdown': '60', 'modal': '100', 'toast': '200',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
```

---

## ✅ END OF MESSAGE 1

You now have:
- Locked tech stack
- Complete design system (colors, fonts, spacing, shadows, animations)
- Folder structure (every file location decided)
- Setup commands ready to run
- Global CSS + Tailwind config (copy-paste ready)



# 📘 NETHERO — MASTER SPEC DOCUMENT
## Message 2 of 3: BACKEND, DATA & STATE

---

## 11. SUPABASE SETUP

### 11.1 Create Project

1. Go to https://supabase.com → Sign up (free)
2. New Project → Name: `nethero` → Choose region closest to you
3. Save the **Project URL** and **anon public key** → paste into `.env.local`
4. Go to **Authentication → Providers** → Enable **Email** (default on)
5. Optional: Enable **Google** OAuth (Auth → Providers → Google → add credentials from Google Cloud Console)

### 11.2 Database Schema

Run this entire SQL block in **Supabase → SQL Editor → New Query → Run**:

```sql
-- =========================================================
-- NETHERO DATABASE SCHEMA
-- =========================================================

-- 1. PROFILES (Netflix-style sub-accounts under one user)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 30),
  avatar_url TEXT DEFAULT 'https://i.pravatar.cc/150?u=default',
  is_kids BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'en',
  maturity_rating TEXT DEFAULT 'all' CHECK (maturity_rating IN ('all', 'teen', 'adult')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- 2. MY LIST (saved/bookmarked titles per profile)
CREATE TABLE my_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tmdb_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  title TEXT NOT NULL,
  poster_path TEXT,
  backdrop_path TEXT,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, tmdb_id, media_type)
);

CREATE INDEX idx_mylist_profile ON my_list(profile_id);

-- 3. WATCH HISTORY (Continue Watching row)
CREATE TABLE watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tmdb_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  title TEXT NOT NULL,
  poster_path TEXT,
  backdrop_path TEXT,
  progress_seconds INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  last_watched_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, tmdb_id, media_type)
);

CREATE INDEX idx_history_profile_recent ON watch_history(profile_id, last_watched_at DESC);

-- 4. RATINGS (thumbs up/down)
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tmdb_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  rating TEXT NOT NULL CHECK (rating IN ('like', 'dislike', 'love')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, tmdb_id, media_type)
);

-- 5. AUTO-UPDATE updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY (CRITICAL — enables data privacy)
-- =========================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE my_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users view own profiles" ON profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profiles" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profiles" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own profiles" ON profiles
  FOR DELETE USING (auth.uid() = user_id);

-- MY_LIST policies (via profile ownership)
CREATE POLICY "Users access own list" ON my_list
  FOR ALL USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- WATCH_HISTORY policies
CREATE POLICY "Users access own history" ON watch_history
  FOR ALL USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- RATINGS policies
CREATE POLICY "Users access own ratings" ON ratings
  FOR ALL USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- =========================================================
-- AUTO-CREATE DEFAULT PROFILE ON SIGNUP
-- =========================================================
CREATE OR REPLACE FUNCTION create_default_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'https://i.pravatar.cc/150?u=' || NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_profile();
```

---

## 12. SUPABASE CLIENT (`src/lib/supabase.js`)

```js
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing Supabase env variables');
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
```

---

## 13. TMDB API LAYER (`src/lib/tmdb.js`)

### 13.1 Get Free TMDB Key

1. https://www.themoviedb.org/signup
2. Settings → API → Create → Developer → Free
3. Copy v3 API key → paste into `.env.local`

### 13.2 Full TMDB Helper

```js
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = import.meta.env.VITE_TMDB_BASE_URL;
const IMG = import.meta.env.VITE_TMDB_IMG_URL;

const tmdb = axios.create({
  baseURL: BASE,
  params: { api_key: API_KEY, language: 'en-US' },
  timeout: 10000,
});

// Retry once on network fail
tmdb.interceptors.response.use(
  (res) => res,
  async (err) => {
    const config = err.config;
    if (!config._retry && err.code !== 'ERR_CANCELED') {
      config._retry = true;
      return tmdb(config);
    }
    return Promise.reject(err);
  }
);

// ==== IMAGE HELPERS ====
export const img = {
  poster:    (path, size = 'w500') => path ? `${IMG}/${size}${path}` : '/placeholder-poster.jpg',
  backdrop:  (path, size = 'original') => path ? `${IMG}/${size}${path}` : '/placeholder-backdrop.jpg',
  profile:   (path, size = 'w185') => path ? `${IMG}/${size}${path}` : '/placeholder-avatar.jpg',
  logo:      (path, size = 'w300') => path ? `${IMG}/${size}${path}` : null,
};

// ==== ENDPOINTS ====
export const endpoints = {
  // Browse rows
  trending:        (type='all', window='week') => `/trending/${type}/${window}`,
  netflixOriginals:() => `/discover/tv?with_networks=213`,
  topRated:        (type='movie') => `/${type}/top_rated`,
  popular:         (type='movie') => `/${type}/popular`,
  upcoming:        () => `/movie/upcoming`,
  nowPlaying:      () => `/movie/now_playing`,
  byGenre:         (type, genreId) => `/discover/${type}?with_genres=${genreId}`,

  // Details
  details:         (type, id) => `/${type}/${id}?append_to_response=videos,credits,similar,recommendations,images`,
  videos:          (type, id) => `/${type}/${id}/videos`,
  credits:         (type, id) => `/${type}/${id}/credits`,
  similar:         (type, id) => `/${type}/${id}/similar`,

  // TV-specific
  season:          (tvId, seasonNum) => `/tv/${tvId}/season/${seasonNum}`,

  // Search
  searchMulti:     (q) => `/search/multi?query=${encodeURIComponent(q)}`,

  // Genres
  genres:          (type='movie') => `/genre/${type}/list`,
};

// ==== FETCH HELPERS ====
export const fetchTMDB = async (path, params = {}) => {
  try {
    const { data } = await tmdb.get(path, { params });
    return { data, error: null };
  } catch (err) {
    console.error('TMDB error:', path, err.message);
    return { data: null, error: err.message };
  }
};

// ==== ROW PRESETS (ready to consume in Browse page) ====
export const ROW_PRESETS = [
  { id: 'trending',  title: 'Trending Now',           path: endpoints.trending('all','week') },
  { id: 'originals', title: 'NetHero Originals',       path: endpoints.netflixOriginals() },
  { id: 'top-movies',title: 'Top Rated Movies',        path: endpoints.topRated('movie') },
  { id: 'top-tv',    title: 'Top Rated TV Shows',      path: endpoints.topRated('tv') },
  { id: 'action',    title: 'Action Movies',           path: endpoints.byGenre('movie', 28) },
  { id: 'comedy',    title: 'Comedy Movies',           path: endpoints.byGenre('movie', 35) },
  { id: 'horror',    title: 'Horror Movies',           path: endpoints.byGenre('movie', 27) },
  { id: 'romance',   title: 'Romance Movies',          path: endpoints.byGenre('movie', 10749) },
  { id: 'docs',      title: 'Documentaries',           path: endpoints.byGenre('movie', 99) },
  { id: 'sci-fi',    title: 'Sci-Fi Adventures',       path: endpoints.byGenre('movie', 878) },
];

// ==== UTILITIES ====
export const findTrailerKey = (videos) => {
  if (!videos?.results?.length) return null;
  const trailer = videos.results.find(v =>
    v.type === 'Trailer' && v.site === 'YouTube' && v.official
  ) || videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')
    || videos.results.find(v => v.site === 'YouTube');
  return trailer?.key || null;
};

export const formatRuntime = (mins) => {
  if (!mins) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

export const formatYear = (date) => date ? new Date(date).getFullYear() : '';
```

---

## 14. VIDEO SOURCES (`src/lib/videoSources.js`)

For the "play full movie" button (Option 2 — free public-domain films):

```js
// Royalty-free / public domain films mapped as fallback "full content"
// When user clicks Play on a movie without a real source, rotate through these
export const FREE_FILMS = [
  { id: 1, title: 'Big Buck Bunny',  url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: 596 },
  { id: 2, title: 'Sintel',          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',        duration: 888 },
  { id: 3, title: 'Tears of Steel',  url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',  duration: 734 },
  { id: 4, title: 'Elephants Dream', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',duration: 653 },
  { id: 5, title: 'For Bigger Blazes',url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',duration: 15 },
];

// Map TMDB id -> free film (deterministic so same movie always plays same demo)
export const getVideoSource = (tmdbId) => {
  const idx = tmdbId % FREE_FILMS.length;
  return FREE_FILMS[idx];
};

// YouTube trailer URL builder
export const getTrailerUrl = (key) => key ? `https://www.youtube.com/watch?v=${key}` : null;
```

---

## 15. ZUSTAND STORES

### 15.1 Auth Store (`src/store/useAuthStore.js`)

```js
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  loading: true,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },

  signUp: async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } },
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/profiles` },
    });
    return { data, error };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
```

### 15.2 Profile Store (`src/store/useProfileStore.js`)

```js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export const useProfileStore = create(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfile: null,

      fetchProfiles: async (userId) => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });
        if (!error) set({ profiles: data });
        return { data, error };
      },

      createProfile: async (userId, payload) => {
        const { data, error } = await supabase
          .from('profiles')
          .insert([{ user_id: userId, ...payload }])
          .select()
          .single();
        if (!error) set({ profiles: [...get().profiles, data] });
        return { data, error };
      },

      updateProfile: async (id, payload) => {
        const { data, error } = await supabase
          .from('profiles')
          .update(payload)
          .eq('id', id)
          .select()
          .single();
        if (!error) {
          set({
            profiles: get().profiles.map(p => p.id === id ? data : p),
            activeProfile: get().activeProfile?.id === id ? data : get().activeProfile,
          });
        }
        return { data, error };
      },

      deleteProfile: async (id) => {
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (!error) {
          set({ profiles: get().profiles.filter(p => p.id !== id) });
        }
        return { error };
      },

      setActiveProfile: (profile) => set({ activeProfile: profile }),
      clearProfiles: () => set({ profiles: [], activeProfile: null }),
    }),
    {
      name: 'nethero-profile',
      partialize: (state) => ({ activeProfile: state.activeProfile }),
    }
  )
);
```

### 15.3 Modal Store (`src/store/useModalStore.js`)

```js
import { create } from 'zustand';

export const useModalStore = create((set) => ({
  isOpen: false,
  mediaType: null,   // 'movie' | 'tv'
  mediaId: null,
  data: null,

  openModal: (mediaType, mediaId) => set({ isOpen: true, mediaType, mediaId, data: null }),
  setData: (data) => set({ data }),
  closeModal: () => set({ isOpen: false, mediaType: null, mediaId: null, data: null }),
}));
```

### 15.4 UI Store (`src/store/useUIStore.js`)

```js
import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isNavScrolled: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  toast: null,

  setNavScrolled: (v) => set({ isNavScrolled: v }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
  showToast: (toast) => set({ toast }),
  hideToast: () => set({ toast: null }),
}));
```

---

## 16. CUSTOM HOOKS

### 16.1 `src/hooks/useAuth.js`

```js
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const { user, session, loading, init } = useAuthStore();
  useEffect(() => { init(); }, []);
  return { user, session, loading, isAuthed: !!user };
};
```

### 16.2 `src/hooks/useFetch.js`

```js
import { useState, useEffect, useRef } from 'react';
import { fetchTMDB } from '../lib/tmdb';

export const useFetch = (path, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    if (!path) { setLoading(false); return; }
    setLoading(true);
    fetchTMDB(path).then(({ data, error }) => {
      if (cancelled.current) return;
      setData(data);
      setError(error);
      setLoading(false);
    });
    return () => { cancelled.current = true; };
  }, deps);

  return { data, loading, error };
};
```

### 16.3 `src/hooks/useMyList.js`

```js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useProfileStore } from '../store/useProfileStore';

export const useMyList = () => {
  const profile = useProfileStore((s) => s.activeProfile);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    const { data } = await supabase
      .from('my_list').select('*')
      .eq('profile_id', profile.id)
      .order('added_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  }, [profile?.id]);

  useEffect(() => { fetch(); }, [fetch]);

  const isInList = useCallback((tmdbId, mediaType) =>
    items.some(i => i.tmdb_id === tmdbId && i.media_type === mediaType),
    [items]
  );

  const addToList = async (item) => {
    if (!profile) return;
    const payload = {
      profile_id: profile.id,
      tmdb_id: item.id,
      media_type: item.media_type || (item.title ? 'movie' : 'tv'),
      title: item.title || item.name,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
    };
    const { data, error } = await supabase.from('my_list').insert([payload]).select().single();
    if (!error) setItems(prev => [data, ...prev]);
  };

  const removeFromList = async (tmdbId, mediaType) => {
    if (!profile) return;
    await supabase.from('my_list').delete()
      .eq('profile_id', profile.id)
      .eq('tmdb_id', tmdbId).eq('media_type', mediaType);
    setItems(prev => prev.filter(i => !(i.tmdb_id === tmdbId && i.media_type === mediaType)));
  };

  return { items, loading, isInList, addToList, removeFromList, refetch: fetch };
};
```

### 16.4 `src/hooks/useDebounce.js`

```js
import { useState, useEffect } from 'react';
export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};
```

### 16.5 `src/hooks/useScroll.js`

```js
import { useEffect } from 'react';
import { useUIStore } from '../store/useUIStore';

export const useScroll = (threshold = 80) => {
  const setScrolled = useUIStore((s) => s.setNavScrolled);
  useEffect(() => {
    let raf = null;
    const handler = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold);
        raf = null;
      });
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);
};
```

### 16.6 `src/hooks/useMediaQuery.js`

```js
import { useState, useEffect } from 'react';
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const m = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    m.addEventListener('change', handler);
    return () => m.removeEventListener('change', handler);
  }, [query]);
  return matches;
};
```

### 16.7 `src/hooks/useOnClickOutside.js`

```js
import { useEffect } from 'react';
export const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};
```

---

## 17. CONSTANTS

### 17.1 `src/constants/routes.js`

```js
export const ROUTES = {
  LANDING:         '/',
  LOGIN:           '/login',
  SIGNUP:          '/signup',
  PROFILES:        '/profiles',
  PROFILES_MANAGE: '/profiles/manage',
  BROWSE:          '/browse',
  MOVIES:          '/movies',
  TV:              '/tv',
  MY_LIST:         '/my-list',
  SEARCH:          '/search',
  WATCH:           '/watch/:type/:id',
  NOT_FOUND:       '*',
};
```

### 17.2 `src/constants/genres.js`

```js
export const MOVIE_GENRES = {
  28:'Action', 12:'Adventure', 16:'Animation', 35:'Comedy', 80:'Crime',
  99:'Documentary', 18:'Drama', 10751:'Family', 14:'Fantasy', 36:'History',
  27:'Horror', 10402:'Music', 9648:'Mystery', 10749:'Romance', 878:'Sci-Fi',
  10770:'TV Movie', 53:'Thriller', 10752:'War', 37:'Western',
};

export const TV_GENRES = {
  10759:'Action & Adventure', 16:'Animation', 35:'Comedy', 80:'Crime',
  99:'Documentary', 18:'Drama', 10751:'Family', 10762:'Kids', 9648:'Mystery',
  10763:'News', 10764:'Reality', 10765:'Sci-Fi & Fantasy', 10766:'Soap',
  10767:'Talk', 10768:'War & Politics', 37:'Western',
};

export const getGenreNames = (ids = [], type = 'movie') => {
  const map = type === 'tv' ? TV_GENRES : MOVIE_GENRES;
  return ids.map(id => map[id]).filter(Boolean);
};
```

---

## 18. ROUTER (`src/router.jsx`)

```jsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import App from './App';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSelect from './pages/ProfileSelect';
import ProfileManage from './pages/ProfileManage';
import Browse from './pages/Browse';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import MyList from './pages/MyList';
import Search from './pages/Search';
import Watch from './pages/Watch';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: ROUTES.LANDING, element: <Landing /> },
      { path: ROUTES.LOGIN, element: <Login /> },
      { path: ROUTES.SIGNUP, element: <Signup /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: ROUTES.PROFILES, element: <ProfileSelect /> },
          { path: ROUTES.PROFILES_MANAGE, element: <ProfileManage /> },
          { path: ROUTES.BROWSE, element: <Browse /> },
          { path: ROUTES.MOVIES, element: <Movies /> },
          { path: ROUTES.TV, element: <TVShows /> },
          { path: ROUTES.MY_LIST, element: <MyList /> },
          { path: ROUTES.SEARCH, element: <Search /> },
          { path: ROUTES.WATCH, element: <Watch /> },
        ],
      },
      { path: ROUTES.NOT_FOUND, element: <NotFound /> },
    ],
  },
]);
```

---

## ✅ END OF MESSAGE 2

You now have:
- Complete Supabase schema (5 tables, RLS policies, auto-triggers)
- TMDB integration layer (all endpoints, retry logic, helpers)
- Free video sources for "real playback"
- 4 Zustand stores (auth, profiles, modal, UI)
- 7 custom hooks (auth, fetch, list, debounce, scroll, media, click-outside)
- Constants & router configuration


# 📘 NETHERO — MASTER SPEC DOCUMENT
## Message 3 of 3: COMPONENTS, PAGES & BUILD-ORDER PROMPTS

---

## 19. COMPONENT SPECIFICATIONS

### 19.1 Common Components

#### `Button.jsx`
**Props:** `variant` (`primary` | `secondary` | `ghost` | `icon`), `size` (`sm` | `md` | `lg`), `icon`, `iconPosition`, `loading`, `fullWidth`, `onClick`, `children`
**Behavior:** Primary = white bg / black text. Secondary = gray translucent. Ghost = transparent w/ border. Hover: slight opacity drop + scale 1.02.

#### `Spinner.jsx`
**Props:** `size` (default 40), `color` (default red)
**Behavior:** Rotating circle, CSS-only animation, centered.

#### `Skeleton.jsx`
**Props:** `width`, `height`, `rounded`
**Behavior:** Shimmer effect (gradient sweep left→right, 1.5s loop), bg `#2a2a2a`.

#### `Image.jsx`
**Props:** `src`, `fallback`, `alt`, `className`, `loading` (default `lazy`)
**Behavior:** Shows skeleton while loading, fades in over 0.3s when loaded, falls back to placeholder on error.

#### `Modal.jsx` (generic shell — DetailModal extends this)
**Props:** `isOpen`, `onClose`, `children`, `size` (`sm`|`md`|`lg`|`full`)
**Behavior:** Backdrop blur + 70% black overlay. Click outside or Esc closes. Body scroll locked when open. Framer Motion `modalVariant`.

#### `Toast.jsx`
**Behavior:** Uses `react-hot-toast`, custom dark theme matching brand.

---

### 19.2 Layout Components

#### `Navbar.jsx`
**Behavior:**
- Fixed top, full width, height 68px desktop / 56px mobile
- Transparent at scrollY = 0, fades to `#141414` after 80px (use `useScroll`)
- **Left:** Logo "NetHero" (red, bold, click → /browse)
- **Center (desktop only ≥1024px):** Links — Home, TV Shows, Movies, New & Popular, My List, Search by Genre
- **Right:** Search icon, Bell (notifications placeholder), Profile avatar dropdown
- **Mobile (<1024px):** Hamburger left, logo center, profile right
- Active link: white. Inactive: `#B3B3B3`. Hover: white with 0.2s transition.

#### `Footer.jsx`
**Behavior:**
- Dark gray text on bg
- 4 columns of links (Audio, Help, Gift, Account, Media, Investor, Jobs, Terms, Privacy, etc.)
- "© 2025 NetHero Clone — Educational Project"
- Service code button (fake, just visual)

#### `MobileMenu.jsx`
**Behavior:** Slide-in from left, full height, dark overlay backdrop, animated with Framer Motion (`x: -100% → 0`). Close on link click.

#### `ProfileDropdown.jsx`
**Behavior:**
- Triggered by avatar hover (desktop) / tap (mobile)
- Dropdown: list of profiles + "Manage Profiles" + "Account" + "Help" + "Sign out"
- Animated fade + slide-down 8px
- Closes on click outside (`useOnClickOutside`)

---

### 19.3 Browse Components

#### `Hero.jsx` (Billboard)
**Behavior:**
- Full-bleed backdrop image (rotates between trending titles every 12s OR fixed featured)
- Height: 60vh mobile / 75vh tablet / 85vh desktop / 90vh TV
- Auto-plays trailer (muted) after 3s if available; fades from backdrop to YouTube embed
- **Left content (max-width 40%):**
  - Title (logo image if available, else text-hero)
  - Synopsis (line-clamp-3, text-shadow)
  - Buttons: ▶ Play (primary white), ⓘ More Info (secondary)
- **Right side:** Volume mute toggle + age rating badge (bottom-right)
- **Bottom:** Linear gradient `transparent → #141414` (gradient-bottom utility)
- Click Play → navigate to `/watch/:type/:id`
- Click More Info → open DetailModal

#### `Row.jsx`
**Props:** `title`, `path` (TMDB endpoint), `mediaType`, `isLarge` (for Originals row — taller posters)
**Behavior:**
- Section with title (text-row-title, padding px-4 sm:px-8 lg:px-12)
- Horizontal scrolling container (Swiper.js with breakpoints)
- Left/right arrow buttons (only visible on row hover, desktop only)
- Each item = `MovieCard`
- Lazy-loads via `react-intersection-observer` (only fetches when row scrolls into view)
- Skeleton row while loading
- Smooth scroll, snap-to-card

**Swiper breakpoints:**
```js
breakpoints: {
  0:    { slidesPerView: 2, spaceBetween: 4 },
  640:  { slidesPerView: 3, spaceBetween: 6 },
  768:  { slidesPerView: 4, spaceBetween: 6 },
  1024: { slidesPerView: 5, spaceBetween: 8 },
  1280: { slidesPerView: 6, spaceBetween: 8 },
  1536: { slidesPerView: 7, spaceBetween: 8 },
}
```

#### `MovieCard.jsx`
**Props:** `item`, `mediaType`, `isLarge`
**Behavior:**
- Aspect: 16:9 backdrop (default) or 2:3 poster (if `isLarge`)
- Rounded `card`, `will-change-transform`
- On hover (desktop only, `lg:`): trigger `MovieCardHover` overlay
- On click (mobile): open DetailModal
- Image lazy-loaded with skeleton

#### `MovieCardHover.jsx`
**Behavior — THE SIGNATURE NETFLIX MOVE:**
- Appears on parent card hover (desktop only)
- Scales card to 1.5x, lifts above siblings (z-index card-hover)
- Shifts laterally so left-most cards expand right, right-most expand left (based on index)
- Plays muted trailer preview after 800ms hover delay
- Bottom panel slides up with:
  - Action buttons row: ▶ Play (white circle), ➕ Add to List, 👍 Like, 👎 Dislike, ⌄ More Info (right)
  - Match % (e.g., "97% Match" in green)
  - Year • Maturity • Duration
  - Genre tags
- Framer Motion variant `cardHover`, transition 0.3s with 0.3s delay
- Disabled on mobile/tablet (`useMediaQuery('(min-width: 1024px)')`)

#### `BillboardControls.jsx`
**Behavior:** Mute/unmute toggle for hero trailer + age rating badge.

---

### 19.4 Modal Components

#### `DetailModal.jsx`
**Behavior — Netflix's expanded detail view:**
- Full overlay, centered, max-width 850px desktop / 100vw mobile
- Top: trailer auto-plays (or backdrop if none)
- Close button top-right
- Bottom of trailer: Play, Add to List, Like buttons
- **Body:**
  - Left column (60%): Match %, Year, Maturity, Duration. Synopsis.
  - Right column (40%): Cast (3 names), Genres, Available languages.
- **For TV:** Episode list with season selector dropdown (`EpisodeList.jsx`)
- **Bottom:** "More Like This" — `SimilarGrid.jsx` (3-col grid of similar titles)
- About section: full description, creators, tags
- Smooth open/close with `modalVariant`
- Locks body scroll
- Closes on ESC, backdrop click, X button

#### `ModalHeader.jsx`
Trailer player + action buttons overlay.

#### `EpisodeList.jsx`
Season dropdown + scrollable list of episodes (number, still image, title, runtime, synopsis).

#### `SimilarGrid.jsx`
Responsive grid of "More Like This" movies.

---

### 19.5 Player Components

#### `VideoPlayer.jsx`
**Behavior:**
- Full-screen black background
- Uses `react-player` for both YouTube (trailers) and MP4 (free films)
- Auto-fullscreen on mount (desktop)
- Custom controls overlay (auto-hide after 3s of no movement)
- Saves progress to `watch_history` every 10 seconds
- Back button top-left → exits to previous page
- Title + episode info top-left

#### `PlayerControls.jsx`
- Play/pause, skip ±10s, volume slider, progress bar (scrubbable), time display, fullscreen toggle, audio/subtitle picker (UI only)

#### `PlayerOverlay.jsx`
- Gradient overlays top + bottom for control visibility

---

### 19.6 Search Components

#### `SearchBar.jsx`
**Behavior:**
- Click search icon in navbar → expands input field with slide animation
- Debounced input (400ms via `useDebounce`)
- Updates URL `?q=...`
- ESC or click outside collapses

#### `SearchResults.jsx`
**Behavior:**
- Grid of cards (responsive: 2 mobile / 3 tablet / 5 desktop / 6 TV)
- Empty state: "Your search did not have any matches." with suggestions
- Loading: skeleton grid
- Filters out `media_type === 'person'`

---

### 19.7 Auth Components

#### `AuthForm.jsx`
**Props:** `mode` (`login` | `signup`)
**Behavior:**
- Centered card, max-width 450px, dark translucent bg over backdrop
- Fields: Email, Password (+ Name on signup)
- Validation: email regex, password min 6 chars
- Show/hide password toggle
- "Remember me" checkbox + "Need help?" link
- Google sign-in button
- Bottom: switch to other mode
- Loading state on button during submit
- Error toast on failure

#### `ProtectedRoute.jsx`
**Behavior:** Wrapper using `<Outlet />` from react-router. If `!user`, redirect to `/login`. If `user && !activeProfile`, redirect to `/profiles`. Else render children.

---

## 20. PAGE SPECIFICATIONS

### 20.1 `Landing.jsx`
- Public hero section with NetHero red BG image
- Centered: "Unlimited movies, TV shows, and more"
- Email input + "Get Started" button → /signup with email prefilled
- 4 feature sections (Enjoy on TV, Download, Watch Everywhere, Profiles for kids)
- FAQ accordion
- Footer

### 20.2 `Login.jsx` / `Signup.jsx`
- Backdrop image with dark overlay
- Header: NetHero logo top-left + "Sign In/Up" button top-right
- Center: `AuthForm`
- Footer: minimal

### 20.3 `ProfileSelect.jsx`
- Centered "Who's watching?"
- Grid of profile avatars (max 5)
- Hover: white border + slight scale
- Click → setActiveProfile + navigate `/browse`
- "Manage Profiles" button below
- "+ Add Profile" tile if < 5 profiles

### 20.4 `ProfileManage.jsx`
- Same grid but with edit icons overlay
- Click → form: avatar upload, name, kids toggle, language, maturity rating
- Delete button (with confirm)
- "Done" button → /profiles

### 20.5 `Browse.jsx`
- Navbar
- `Hero` (featured trending title)
- Stack of `Row` components (use `ROW_PRESETS` array)
- "Continue Watching" row appears at top if `watch_history` has items
- "My List" row appears if list has items
- Footer
- Modal mounted at root

### 20.6 `Movies.jsx` / `TVShows.jsx`
- Same as Browse but filtered to single media_type
- Hero shows trending of that type
- Genre filter dropdown at top of rows section

### 20.7 `MyList.jsx`
- Title: "My List"
- Grid layout (not rows) — responsive
- Empty state: "Your list is empty. Browse and add titles."

### 20.8 `Search.jsx`
- Reads URL `?q=` param
- Renders `SearchResults`
- Title: "Top Searches" if no query (shows trending)

### 20.9 `Watch.jsx`
- Full screen `VideoPlayer`
- Reads `:type` and `:id` from URL
- Fetches details, finds trailer key, gets free film fallback
- Logs to watch_history on play

### 20.10 `NotFound.jsx`
- "Lost your way?" centered
- Backdrop dim image
- "NetHero Home" button

---

## 21. PERFORMANCE CHECKLIST

✅ Lazy-load all routes via `React.lazy()` in router
✅ Lazy-load all images (`loading="lazy"`)
✅ Use Image component with skeleton placeholder
✅ Intersection Observer on Rows (only fetch when visible)
✅ Debounce search input (400ms)
✅ Throttle scroll handler with requestAnimationFrame
✅ Memoize MovieCard with `React.memo`
✅ Use `will-change: transform` only on hover-triggered elements (not always)
✅ Animate only `transform` and `opacity`
✅ Persist auth + active profile in localStorage (already in stores)
✅ Cache TMDB responses (consider react-query in future)
✅ Use `<picture>` with WebP for static images
✅ Code-split Swiper, ReactPlayer, Framer Motion (Vite handles automatically)
✅ Preconnect to image.tmdb.org and youtube.com in index.html
✅ Service worker for asset caching (optional, Phase 2)

Add to `index.html`:
```html
<link rel="preconnect" href="https://image.tmdb.org">
<link rel="preconnect" href="https://www.youtube.com">
<link rel="dns-prefetch" href="https://api.themoviedb.org">
```

---

## 22. 🚀 BUILD-ORDER PROMPTS FOR CLAUDE CODE

**This is the gold. Each prompt builds one chunk. Paste them into Claude Code IN ORDER. Don't skip.**

Each prompt assumes Claude Code has access to the project folder and the spec messages above are accessible (paste them into the chat once at the start of your Claude Code session, OR keep this doc open and reference it).

---

### 🟢 PHASE 1 — FOUNDATION

#### **PROMPT #1 — Project Init**
```
Create a new Vite + React project in the current directory called "nethero". Then:

1. Install these exact packages: react-router-dom@^6.26.0, zustand@^4.5.5, axios@^1.7.5, framer-motion@^11.3.0, lucide-react@^0.435.0, react-player@^2.16.0, @supabase/supabase-js@^2.45.0, react-hot-toast@^2.4.1, react-intersection-observer@^9.13.0, swiper@^11.1.0
2. Install dev: tailwindcss@^3.4.10, postcss, autoprefixer, prettier
3. Run `npx tailwindcss init -p`
4. Replace tailwind.config.js with the config from spec section 10
5. Replace src/index.css (or create src/styles/index.css) with spec section 9 global CSS
6. Create the entire folder structure from spec section 6 (all directories, empty .gitkeep files inside each)
7. Create .env.example with the 5 env vars from spec section 7
8. Update index.html to include preconnect tags from spec section 21 and set page title to "NetHero"

Do not build any components yet. Only setup.
```

---

#### **PROMPT #2 — Constants, Lib, Store Foundations**
```
Create these files exactly as specified in the NetHero spec:

1. src/constants/routes.js (spec 17.1)
2. src/constants/genres.js (spec 17.2)
3. src/constants/animations.js (spec 4.1)
4. src/constants/variants.js (spec 4.2)
5. src/lib/supabase.js (spec 12)
6. src/lib/tmdb.js (spec 13.2)
7. src/lib/videoSources.js (spec 14)
8. src/lib/helpers.js — empty file with only: export const cn = (...c) => c.filter(Boolean).join(' ');
9. src/store/useAuthStore.js (spec 15.1)
10. src/store/useProfileStore.js (spec 15.2)
11. src/store/useModalStore.js (spec 15.3)
12. src/store/useUIStore.js (spec 15.4)

No imports of components yet. Just these files.
```

---

#### **PROMPT #3 — Custom Hooks**
```
Create all 7 hooks in src/hooks/ from spec section 16:
- useAuth.js
- useFetch.js
- useMyList.js
- useDebounce.js
- useScroll.js
- useMediaQuery.js
- useOnClickOutside.js

Use the exact code from the spec.
```

---

### 🟢 PHASE 2 — COMMON & LAYOUT

#### **PROMPT #4 — Common Components**
```
Build these reusable components in src/components/common/ following spec section 19.1:

1. Button.jsx — variants (primary, secondary, ghost, icon), sizes, icon support, loading state, framer-motion whileHover/whileTap
2. Spinner.jsx — CSS-animated rotating circle, configurable size
3. Skeleton.jsx — shimmer effect with linear-gradient sweep animation
4. Image.jsx — lazy-loaded image with skeleton placeholder, fade-in on load, fallback on error
5. Modal.jsx — generic modal shell with backdrop blur, body scroll lock, ESC + outside click to close, framer-motion using modalVariant from constants
6. Toast.jsx — react-hot-toast configured with dark theme matching nethero colors

All components should use Tailwind classes from our config. Use lucide-react icons. Make everything fully accessible (aria labels, role attributes).
```

---

#### **PROMPT #5 — Layout Components**
```
Build the layout components in src/components/layout/ per spec 19.2:

1. Navbar.jsx — fixed top, transparent → solid #141414 on scroll using useScroll hook, responsive: full nav desktop / hamburger mobile, includes Logo (text "NetHero" in red), nav links from constants/routes, search icon, profile dropdown
2. Footer.jsx — 4-column grid of footer links, copyright, service code button
3. MobileMenu.jsx — slide-in from left with framer-motion, dark backdrop, full-height drawer
4. ProfileDropdown.jsx — avatar trigger, dropdown with profile list + Manage + Account + Sign Out, uses useOnClickOutside

Read spec section 19.2 for exact behavior. Keep components modular and reusable.
```

---

#### **PROMPT #6 — Auth Pages + Protected Route**
```
Build the auth flow:

1. src/components/auth/AuthForm.jsx — per spec 19.7. Reusable for both login and signup via mode prop.
2. src/components/auth/ProtectedRoute.jsx — per spec 19.7. Uses useAuth and useProfileStore. Redirects unauthenticated users to /login, authenticated users without active profile to /profiles.
3. src/pages/Login.jsx — per spec 20.2
4. src/pages/Signup.jsx — per spec 20.2
5. src/pages/Landing.jsx — per spec 20.1 (public marketing page)

Use react-hot-toast for error/success notifications. Form validation: email regex + password min 6 chars. Show/hide password toggle. Loading states on submit buttons.
```

---

#### **PROMPT #7 — App Shell + Router**
```
1. Create src/router.jsx exactly per spec section 18
2. Replace src/App.jsx with: a layout wrapper that renders <Outlet /> from react-router-dom, includes <Toaster /> from react-hot-toast at root level, calls useAuth() to initialize session on mount
3. Update src/main.jsx to use RouterProvider with the router from router.jsx
4. Use React.lazy() for all page imports in router.jsx for code-splitting, wrap with Suspense + Spinner fallback

Test that the app boots and routing works. Build should succeed with `npm run build`.
```

---

### 🟢 PHASE 3 — PROFILES

#### **PROMPT #8 — Profile Pages**
```
Build the Netflix-style profile selection flow:

1. src/pages/ProfileSelect.jsx — per spec 20.3. Centered "Who's watching?" headline. Grid of avatar tiles (max 5). Hover: scale 1.05 + white border using framer-motion. Click → setActiveProfile + navigate to /browse. "+ Add Profile" tile if profiles.length < 5. "Manage Profiles" button below grid.

2. src/pages/ProfileManage.jsx — per spec 20.4. Same grid with edit-pencil overlay on each tile. Click opens inline edit form: avatar URL input, name, isKids toggle, language select, maturity dropdown. Save + Delete (with confirm modal) + Cancel buttons. "Done" button returns to /profiles.

Use useProfileStore for all CRUD. Animate tile entrance with stagger using framer-motion.
```

---

### 🟢 PHASE 4 — THE BIG ONE: BROWSE

#### **PROMPT #9 — MovieCard + MovieCardHover**
```
This is the most important component — Netflix's signature card hover.

1. src/components/browse/MovieCard.jsx per spec 19.3:
   - Props: item, mediaType, isLarge
   - 16:9 backdrop or 2:3 poster (if isLarge)
   - Lazy-loaded image via Image component
   - On desktop hover (use useMediaQuery('(min-width: 1024px)')): show MovieCardHover overlay
   - On mobile click: dispatch openModal from useModalStore
   - Memoized with React.memo
   - Uses will-change-transform class

2. src/components/browse/MovieCardHover.jsx per spec 19.3 — THE SIGNATURE EFFECT:
   - Absolute positioned overlay extending the card
   - Scales parent to 1.5x with framer-motion cardHover variant (delay 0.3s)
   - Uses layout prop for smooth transitions
   - Plays muted YouTube trailer preview after 800ms via react-player (use findTrailerKey from tmdb.js)
   - Bottom panel: action buttons row (Play, Add/Remove List, Like, Dislike, More Info)
   - Match % (random 75-99 for now), year, maturity badge, runtime
   - Genre tags from getGenreNames helper
   - Add to list uses useMyList hook
   - More Info opens DetailModal via useModalStore

CRITICAL: animate only transform and opacity. Use will-change-transform. Disable entirely on screens < 1024px.
```

---

#### **PROMPT #10 — Row Component**
```
Build src/components/browse/Row.jsx per spec 19.3:

- Props: title, path (TMDB endpoint), mediaType, isLarge
- Uses useFetch hook to load data from path (only when row enters viewport — wrap with react-intersection-observer's useInView)
- Skeleton row while loading (use Skeleton component, 7 placeholders)
- Section title with row-title typography, padding responsive (px-4 sm:px-8 lg:px-12)
- Swiper.js horizontal carousel with breakpoints from spec 19.3
- Custom navigation arrows (left/right): only visible on row hover (group-hover), desktop only
- Each slide = MovieCard
- Snap to card, smooth scroll, no scrollbar
- Fade gradient on row edges (left and right) using gradient-left utility class

Use Swiper modules: Navigation, FreeMode. Make it feel buttery smooth.
```

---

#### **PROMPT #11 — Hero / Billboard**
```
Build src/components/browse/Hero.jsx per spec 19.3:

- Fetches a featured title (use trending TMDB endpoint, pick first item with backdrop)
- Full-bleed backdrop image (use Image component, large size)
- Height: h-[60vh] sm:h-[75vh] lg:h-[85vh] 3xl:h-[90vh]
- After 3 seconds, if a YouTube trailer key exists, fade backdrop to muted react-player YouTube embed playing trailer (autoplay, muted, loop, no controls). Use AnimatePresence for the fade.
- Left content (max-w-2xl, padding p-6 sm:p-12 lg:p-16):
  * Title (text-hero, text-shadow, font-bold, line-clamp-2)
  * Synopsis (text-lg, line-clamp-3, text-shadow, text-grayLight)
  * Buttons row: Play (primary white with PlayIcon) + More Info (secondary with InfoIcon)
- Right side bottom: mute toggle button + age rating badge
- Bottom: gradient-bottom utility for fade to page bg
- Click Play → navigate to /watch/{type}/{id}
- Click More Info → openModal from useModalStore

Also create src/components/browse/BillboardControls.jsx for the mute toggle and age badge.
```

---

#### **PROMPT #12 — Browse Page**
```
Build src/pages/Browse.jsx per spec 20.5:

- Layout: <Navbar /> + <Hero /> + stack of <Row /> components + <Footer />
- Iterate over ROW_PRESETS from tmdb.js to render rows
- Conditionally render "Continue Watching" row at top: query watch_history table for active profile, if items > 0 render a row of those items
- Conditionally render "My List" row: use useMyList items
- Mount <DetailModal /> at root level (modal state from useModalStore)

Then build src/components/modal/DetailModal.jsx per spec 19.4:
- Wraps generic Modal component
- Reads mediaId + mediaType from useModalStore
- Fetches full details via useFetch using endpoints.details
- Top: trailer auto-play (or backdrop fallback), close button overlay
- Action buttons: Play, Add/Remove List, Like
- Body: synopsis, cast (top 3), genres, year, maturity, runtime
- For TV: <EpisodeList /> (placeholder for now — render "Episodes coming soon")
- Bottom: <SimilarGrid /> showing similar/recommendations as 3-col grid of cards
- About section at bottom

Build src/components/modal/SimilarGrid.jsx as 3-column responsive grid (1-col mobile, 2-col tablet, 3-col desktop) of mini cards.

Build src/components/modal/EpisodeList.jsx as placeholder for now — accept tvId prop, fetch season 1, render list of episodes with still image + title + runtime + synopsis. Season selector dropdown above list.
```

---

### 🟢 PHASE 5 — REMAINING PAGES

#### **PROMPT #13 — Movies, TV Shows, My List Pages**
```
Build these three pages reusing existing Row and MovieCard:

1. src/pages/Movies.jsx per spec 20.6 — same structure as Browse but Hero pulls trending movies only, rows filtered to movie genres, add a genre filter dropdown above rows section that swaps which row is shown.

2. src/pages/TVShows.jsx per spec 20.6 — same as Movies but for TV (use tv genres, tv endpoints).

3. src/pages/MyList.jsx per spec 20.7 — Navbar + grid of MovieCards from useMyList items. Responsive grid: grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6. Empty state with illustration if no items.
```

---

#### **PROMPT #14 — Search**
```
Build the search experience:

1. src/components/search/SearchBar.jsx per spec 19.6:
   - Click search icon in Navbar expands an inline input (animate width with framer-motion)
   - Debounced input (400ms)
   - Updates URL search param ?q=
   - ESC or click outside collapses

2. src/components/search/SearchResults.jsx per spec 19.6:
   - Responsive grid of cards
   - Filters out media_type === 'person'
   - Empty state: "Your search did not have any matches."
   - Loading skeleton grid

3. src/pages/Search.jsx per spec 20.8:
   - Reads ?q= URL param
   - If query: useFetch with searchMulti endpoint, render SearchResults
   - If no query: render trending titles as "Top Searches"

Wire the SearchBar into Navbar (right side, before profile dropdown).
```

---

#### **PROMPT #15 — Watch / Video Player**
```
Build the full-screen video player:

1. src/components/player/VideoPlayer.jsx per spec 19.5:
   - Full-screen black bg
   - Uses react-player for both YouTube (trailers) and MP4 (free films)
   - Auto-fullscreen on mount (desktop only)
   - Custom controls overlay (auto-hide after 3s of mouse inactivity)
   - Saves progress to watch_history every 10 seconds via supabase upsert
   - Back button top-left → navigate(-1)
   - Title overlay top-left

2. src/components/player/PlayerControls.jsx per spec 19.5:
   - Play/pause, skip ±10s, volume slider, scrubbable progress bar with buffered range, time display, fullscreen toggle, audio/subtitle picker (UI placeholder)
   - All controls fade in/out with controls visibility

3. src/components/player/PlayerOverlay.jsx — gradient overlays for control readability

4. src/pages/Watch.jsx per spec 20.9:
   - Reads :type and :id from URL
   - Fetches details
   - Determines source: if trailer key exists use YouTube, OR getVideoSource(id) for MP4 fallback (per Option 2 strategy)
   - Renders VideoPlayer
   - Logs watch_history entry on first play
```

---

#### **PROMPT #16 — Landing Page Polish + 404**
```
1. Polish src/pages/Landing.jsx per spec 20.1:
   - Hero section with email capture form → /signup with email pre-filled
   - 4 feature blocks with images (use placeholder images): "Enjoy on your TV", "Download to watch offline", "Watch everywhere", "Create profiles for kids"
   - FAQ accordion (8 questions, animate height with framer-motion)
   - Footer with extensive link grid

2. Build src/pages/NotFound.jsx per spec 20.10:
   - Backdrop image with dim overlay
   - "Lost your way?" headline
   - Subtitle: "Sorry, we can't find that page..."
   - "NetHero Home" button → /browse
```

---

### 🟢 PHASE 6 — POLISH

#### **PROMPT #17 — Performance + Accessibility Pass**
```
Audit and fix the entire codebase for:

1. Wrap all page components in router.jsx with React.lazy() + Suspense (Spinner fallback)
2. Memoize MovieCard, Row, and any heavy list-rendering components with React.memo
3. Verify all images use Image component with lazy loading
4. Add aria-labels to all icon-only buttons
5. Ensure keyboard navigation works (Tab through nav, ESC closes modals/menus, Enter activates buttons)
6. Add focus-visible styles globally (white ring 2px on focus)
7. Verify scroll handlers use requestAnimationFrame
8. Check that animations use only transform + opacity
9. Add prefers-reduced-motion media query — disable framer-motion animations when user prefers reduced motion
10. Add skip-to-content link for screen readers
11. Verify all routes lazy-load (check network tab for code-splitting)

Do not change visual design, only optimize performance and accessibility.
```

---

#### **PROMPT #18 — Final Visual QA**
```
Do a final responsive QA pass:

1. Test mobile breakpoint (<640px): hamburger menu works, hero shrinks, cards 2-per-row, no hover-expand, modals are full-screen
2. Test tablet (640-1024px): nav transitions, 3-4 cards per row, modal is 90vw
3. Test desktop (1024-1536px): full nav, 5-6 cards per row, hover-expand active, modal max-width 850px
4. Test TV (>1920px): 7-8 cards per row, larger fonts, more spacing

Fix any layout breakage. Ensure smooth transitions between breakpoints. Test keyboard navigation across all pages. Test sign-up → profile creation → browse → modal → watch flow end to end.

Report any issues found with proposed fixes.
```

---

## 23. DEPLOYMENT GUIDE (FREE)

### 23.1 Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Follow prompts. Add env variables in Vercel dashboard (Settings → Environment Variables).
```

### 23.2 Netlify (Alternative)
```bash
npm run build
# Drag the dist/ folder to netlify.com/drop
# Or connect GitHub repo at app.netlify.com
# Add env vars in Site Settings → Environment Variables
```

### 23.3 Supabase URL Config
After deployment, in Supabase Dashboard:
- Authentication → URL Configuration
- Site URL: `https://your-domain.vercel.app`
- Redirect URLs: add `https://your-domain.vercel.app/**`

---

## 24. EXECUTION CHECKLIST

Before you start hitting Claude Code prompts:

- [ ] Node 18+ installed
- [ ] Claude Code CLI installed (`npm i -g @anthropic-ai/claude-code`)
- [ ] Supabase project created, SQL schema ran, env vars saved
- [ ] TMDB API key generated, env vars saved
- [ ] Empty project folder ready
- [ ] All 3 spec messages saved (this document)

---

## 25. TIPS FOR EXECUTING IN ANTIGRAVITY / CLAUDE CODE

1. **Start a fresh session.** Paste a brief context: *"I'm building NetHero, a Netflix clone using React + Vite + Tailwind + Supabase + TMDB. Spec is in this folder as SPEC.md. Build only what each prompt asks — nothing extra."*

2. **Save this entire 3-message spec as `SPEC.md` in your project root.** Reference it: *"See SPEC.md section 19.3 for MovieCard behavior."*

3. **Run prompts ONE AT A TIME.** Wait for completion. Test. Then next.

4. **After each prompt, run** `npm run dev` and visually verify before continuing.

5. **If a prompt fails**, don't re-run the whole thing. Ask Claude: *"In file X, fix Y. Don't touch other files."*

6. **Token-saving phrases:**
   - "Modify only file X"
   - "Don't refactor existing code"
   - "Just write the code, no explanation"
   - "Reference SPEC.md section N"

7. **When stuck**, paste the error + the relevant file + ask: *"Fix this specific error. Smallest possible change."*

8. **Commit to Git after each prompt completes successfully.** Easy rollback.

---

## ✅ SPEC COMPLETE

You now have, in this chat:

📘 **Message 1** — Foundation (design system, structure, configs)
📘 **Message 2** — Backend (Supabase schema, TMDB layer, stores, hooks)
📘 **Message 3** — Components, pages, **18 build-order prompts**, deployment

**Total executable prompts: 18.** Run them in order. Each is small, focused, debuggable.

---

## 🎯 YOUR NEXT STEPS

1. **Save all 3 messages** as `SPEC.md` in your project folder
2. **Set up accounts**: Supabase + TMDB (both free, ~10 min)
3. **Run the SQL schema** in Supabase
4. **Open Antigravity / Claude Code** in an empty folder
5. **Paste Prompt #1** from section 22
6. **Continue down the list** — one prompt at a time, test after each

When you hit issues during execution (you will — that's normal), come back here. I can debug specific files for free in this chat without burning your Claude Code tokens.

**Good luck building NetHero. You've got everything you need.** 🚀