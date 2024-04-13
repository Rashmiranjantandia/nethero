import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Tv, Download, MonitorSmartphone, Users } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import Footer from '../components/layout/Footer';

// ─── FAQ data ────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  { q: 'What is NetHero?', a: 'NetHero is an educational Netflix clone built with React, Supabase and TMDB. It demonstrates streaming UI patterns including browse rows, hero billboards, modals and video playback.' },
  { q: 'How much does NetHero cost?', a: 'NetHero is completely free. It is an educational project and is not a commercial product.' },
  { q: 'Where can I watch?', a: 'Watch anywhere, anytime. Sign in with your NetHero account to watch instantly on the web from your personal computer or any internet-connected device that offers the NetHero app.' },
  { q: 'How do I cancel?', a: 'NetHero is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks.' },
  { q: 'What can I watch on NetHero?', a: 'NetHero has an extensive library of feature films, documentaries, TV shows, anime, award-winning NetHero originals, and more. Watch as much as you want, anytime you want.' },
  { q: 'Is NetHero good for kids?', a: 'The NetHero Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and films in their own space.' },
  { q: 'Why does NetHero use TMDB?', a: 'NetHero is powered by The Movie Database (TMDB) API for metadata. This is an educational project demonstrating how a streaming service UI can be built using a public movie database.' },
  { q: 'What is the video quality?', a: 'For demo purposes, NetHero plays public-domain films (Big Buck Bunny, Sintel etc.) and YouTube trailers in whatever quality your connection supports.' },
];

// ─── Feature sections ─────────────────────────────────────────────────────────
// Images attempt the real CDN URL; onError in the renderer swaps to the icon fallback.
const TRANSPARENT_PX = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const FEATURES = [
  {
    title: 'Enjoy on your TV',
    body: 'Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.',
    icon: Tv,
    img: TRANSPARENT_PX,
    reverse: false,
  },
  {
    title: 'Download your shows to watch offline',
    body: 'Save your favourites easily and always have something to watch.',
    icon: Download,
    img: TRANSPARENT_PX,
    reverse: true,
  },
  {
    title: 'Watch everywhere',
    body: 'Stream unlimited movies and TV shows on your phone, tablet, laptop and TV.',
    icon: MonitorSmartphone,
    img: TRANSPARENT_PX,
    reverse: false,
  },
  {
    title: 'Create profiles for kids',
    body: 'Send kids on adventures with their favourite characters in a space made just for them — free with your membership.',
    icon: Users,
    img: TRANSPARENT_PX,
    reverse: true,
  },
];


// ─── FAQAccordion ─────────────────────────────────────────────────────────────
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b-4 border-nethero-bg">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between bg-nethero-bgHover text-nethero-white px-6 py-5 text-left text-lg font-medium hover:bg-[#3d3d3d] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white"
      >
        <span>{q}</span>
        {open
          ? <ChevronUp size={24} aria-hidden="true" />
          : <ChevronDown size={24} aria-hidden="true" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-nethero-bgHover px-6 py-5 text-nethero-white text-base border-t-4 border-nethero-bg">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Landing page ─────────────────────────────────────────────────────────────
const Landing = () => {
  const [heroEmail, setHeroEmail] = useState('');
  const navigate = useNavigate();

  const handleGetStarted = (e) => {
    e.preventDefault();
    const params = heroEmail ? `?email=${encodeURIComponent(heroEmail)}` : '';
    navigate(`${ROUTES.SIGNUP}${params}`);
  };

  return (
    <div className="bg-nethero-black text-nethero-white">

      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-28 sm:py-36 overflow-hidden border-b-8 border-nethero-grayDark">
        {/* Background gradient (replaces external CDN image) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a0a0a 100%)',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-nethero-black/50" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-16 gradient-bottom" aria-hidden="true" />

        {/* Header bar */}
        <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 sm:px-12 py-5 z-10">
          <span className="text-nethero-red font-bold text-3xl tracking-tight">NetHero</span>
          <a
            href={ROUTES.LOGIN}
            className="text-sm font-semibold text-nethero-white bg-nethero-red px-4 py-1.5 rounded hover:bg-nethero-redHover transition-colors"
          >
            Sign In
          </a>
        </header>

        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-h1 font-bold mb-4 text-shadow">
            Unlimited movies, TV shows, and more.
          </h1>
          <p className="text-xl sm:text-2xl text-nethero-white mb-2 text-shadow">
            Starts at ₹149. Cancel anytime.
          </p>
          <p className="text-lg text-nethero-white mb-8 text-shadow">
            Ready to watch? Enter your email to create or restart your membership.
          </p>

          <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Email address"
              value={heroEmail}
              onChange={(e) => setHeroEmail(e.target.value)}
              aria-label="Email address"
              className="flex-1 bg-white/10 border border-white/30 rounded text-white placeholder-white/60 px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-nethero-white backdrop-blur-sm"
            />
            <button
              type="submit"
              className="bg-nethero-red hover:bg-nethero-redHover text-white font-bold text-xl px-8 py-4 rounded transition-colors flex items-center gap-2 justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white"
            >
              Get Started <span aria-hidden="true">›</span>
            </button>
          </form>
        </div>
      </section>

      {/* ── FEATURE SECTIONS ────────────────────────────── */}
      {FEATURES.map(({ title, body, icon: Icon, img, reverse }) => (
        <section
          key={title}
          className="flex flex-col md:flex-row items-center gap-8 px-6 sm:px-12 py-16 border-b-8 border-nethero-grayDark"
          style={{ flexDirection: reverse ? 'row-reverse' : 'row' }}
        >
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-h2 font-bold mb-4">{title}</h2>
            <p className="text-xl text-nethero-grayLight">{body}</p>
          </div>
          <div className="flex-1 flex justify-center">
            <div
              className="max-w-sm w-full h-48 flex items-center justify-center rounded-modal bg-nethero-bgLight border border-nethero-border"
              aria-hidden="true"
            >
              <Icon size={80} className="text-nethero-gray" />
            </div>
          </div>
        </section>

      ))}


      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className="px-6 sm:px-12 py-16 border-b-8 border-nethero-grayDark max-w-4xl mx-auto w-full">
        <h2 className="text-h2 font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-2">
          {FAQ_ITEMS.map((item) => (
            <FAQItem key={item.q} {...item} />
          ))}
        </div>

        {/* CTA below FAQ */}
        <p className="text-center text-lg mt-10 mb-4 text-nethero-grayLight">
          Ready to watch? Enter your email to create or restart your membership.
        </p>
        <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Email address"
            value={heroEmail}
            onChange={(e) => setHeroEmail(e.target.value)}
            aria-label="Email address"
            className="flex-1 bg-nethero-bgHover border border-nethero-border rounded text-white placeholder-nethero-gray px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-nethero-white"
          />
          <button
            type="submit"
            className="bg-nethero-red hover:bg-nethero-redHover text-white font-bold text-xl px-8 py-4 rounded transition-colors flex items-center gap-2 justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white"
          >
            Get Started <span aria-hidden="true">›</span>
          </button>
        </form>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <Footer />
    </div>
  );
};

export default Landing;
