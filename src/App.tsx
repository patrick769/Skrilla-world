import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, MapPin, Menu, Package, ShoppingBag, X } from 'lucide-react';
import { ShatterSphere } from './components/ShatterSphere';
import backgroundImage from './assets/background.jpg';

type PageName = 'home' | 'music' | 'videos' | 'tour' | 'merch';

const NAV_LINKS: { id: PageName; label: string; href: string }[] = [
  { id: 'home', label: 'HOME', href: './index.html' },
  { id: 'music', label: 'MUSIC', href: './music.html' },
  { id: 'videos', label: 'VIDEOS', href: './videos.html' },
  { id: 'tour', label: 'TOUR', href: './tour.html' },
  { id: 'merch', label: 'MERCH', href: './merch.html' }
];

const TOUR = [
  { date: 'MAR 14', city: 'ATLANTA, GA', venue: 'State Farm Arena' },
  { date: 'MAR 21', city: 'HOUSTON, TX', venue: 'Toyota Center' },
  { date: 'APR 02', city: 'LOS ANGELES, CA', venue: 'Crypto.com Arena' },
  { date: 'APR 18', city: 'NEW YORK, NY', venue: 'Barclays Center' },
  { date: 'MAY 09', city: 'LONDON, UK', venue: 'The O2' }
];

const VIDEOS = [
  { id: 'Yi8hiVukJ8w', title: 'Kata Kichwa — SKRILLA ft. Nuclear KE', meta: 'OFFICIAL MUSIC VIDEO' },
  { id: 'H4ukHUZkJ_4', title: 'Siku Hizi — SKRILLA', meta: 'OFFICIAL MUSIC VIDEO' },
  { id: 'zzKs1ozkZag', title: 'Lawama — SKRILLA', meta: 'OFFICIAL MUSIC VIDEO' }
];

const MERCH = [
  { name: '#itriedcallingyou TOUR JACKET', price: '$120', mark: 'WORLD TOUR 2026' },
  { name: 'QUANTUM CORE HOODIE', price: '$85', mark: 'BIG SKRILLA' },
  { name: 'NOIR SIGNAL TEE', price: '$45', mark: 'EST. 2099' }
];

const SPOTIFY_URL = 'https://open.spotify.com/artist/0jdv3ikqQ1AH0RWhgq5gPl';
const SPOTIFY_EMBED = 'https://open.spotify.com/embed/artist/0jdv3ikqQ1AH0RWhgq5gPl?utm_source=generator&theme=0';
const APPLE_URL = 'https://music.apple.com/ke/artist/skrilla/1448490073';
const APPLE_EMBED = 'https://embed.music.apple.com/ke/artist/skrilla/1448490073';

const SOCIAL_LINKS = [
  { label: 'SPOTIFY', href: SPOTIFY_URL },
  { label: 'APPLE MUSIC', href: APPLE_URL },
  { label: 'YOUTUBE', href: 'https://www.youtube.com/@jeshiyadago7380' },
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/_skrillagram/' },
  { label: 'FACEBOOK', href: 'https://www.facebook.com/prince.j.sinclair' },
  { label: 'WHATSAPP', href: 'https://wa.me/254703200940' },
  { label: 'TIKTOK', href: 'https://www.tiktok.com/@sinclairkahara?_r=1&_t=ZS-9965ZLGKel5' }
];

const HERO_SOCIALS = SOCIAL_LINKS.filter(s => ['SPOTIFY', 'APPLE MUSIC', 'YOUTUBE', 'INSTAGRAM'].includes(s.label));

const rd = (ms: number) => ({ '--rd': `${ms}ms` }) as CSSProperties;

const TriangleMark = ({ size = 44, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M8 14 L92 38 L30 92 Z" />
    <path d="M50 26 L61 62 L19 53 Z" />
    <path d="M29 20 L34 38 L13 33 Z" />
    <path d="M71 32 L76 50 L55 44 Z" />
    <path d="M40 58 L45 76 L24 71 Z" />
  </svg>
);

/** Reveals [data-reveal] elements as they enter the viewport. */
function useReveal(enabled: boolean, dep: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]:not(.reveal-in)');
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach(el => el.classList.add('reveal-in'));
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [enabled, dep]);
}

/** Elegant count-up for stats like "1.2B", "14", "05". */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value.replace(/^([\d.]+)/, m => (m.includes('.') ? '0' : m.replace(/[1-9]/g, '0'))));
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!on) return;
    const m = value.match(/^([\d.]+)(.*)$/);
    if (!m) return;
    const target = parseFloat(m[1]);
    const suffix = m[2];
    const decimals = (m[1].split('.')[1] || '').length;
    const pad = m[1].includes('.') ? 0 : m[1][0] === '0' ? m[1].length : 0;
    let raf = 0;
    const t0 = performance.now();
    const duration = 1800;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setText((target * eased).toFixed(decimals).padStart(decimals ? 0 : pad, '0') + suffix);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, value]);

  return <span ref={ref}>{text}</span>;
}

/** Soft brand intro: monogram draws itself, wordmark rises, hairline fills, fade out. */
function IntroLoader({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t1 = window.setTimeout(() => setExiting(true), 2500);
    const t2 = window.setTimeout(() => {
      setVisible(false);
      onDone();
    }, 3350);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`intro fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080706] px-6 ${exiting ? 'intro-exit' : ''}`}
      role="status"
      aria-label="Loading Big Skrilla World"
    >
      <TriangleMark size={62} className="intro-mark text-[#c9a45c]" />
      <p className="intro-word label mt-9 text-[#f2ede3]/90">Big Skrilla</p>
      <p className="intro-fade-word label mt-3 text-[9px] text-[#f2ede3]/35">World — Official</p>
      <div className="mt-11 h-px w-48 bg-[#f2ede3]/10">
        <div className="intro-bar h-px w-full bg-[#c9a45c]" />
      </div>
    </div>
  );
}

function Header({ page }: { page: PageName }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
          scrolled ? 'border-[#f2ede3]/10 bg-[#080706]/85 py-3 backdrop-blur-md' : 'border-transparent bg-transparent py-6'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8" aria-label="Main navigation">
          <a href="./index.html" className="group flex items-center gap-3.5">
            <TriangleMark size={34} className="text-[#c9a45c] transition-opacity group-hover:opacity-70" />
            <span className="leading-none">
              <span className="font-display block text-xl uppercase tracking-[0.22em]">Big Skrilla</span>
              <span className="label mt-1.5 block text-[8px] text-[#c9a45c]/80">Official World</span>
            </span>
          </a>

          <ul className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map(link => (
              <li key={link.id}>
                <a
                  href={link.href}
                  aria-current={page === link.id ? 'page' : undefined}
                  className={`label link-draw py-2 text-[10px] transition-colors ${
                    page === link.id ? 'link-draw is-active text-[#c9a45c]' : 'text-[#f2ede3]/60 hover:text-[#f2ede3]'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={SPOTIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="label hidden rounded-full border border-[#f2ede3]/30 px-7 py-3 text-[10px] text-[#f2ede3]/85 transition-all duration-500 hover:border-[#c9a45c] hover:bg-[#c9a45c] hover:text-[#080706] md:inline-flex"
          >
            Listen Now
          </a>

          <button className="p-2 text-[#f2ede3] md:hidden" onClick={() => setMenuOpen(true)} aria-label="Open navigation">
            <Menu className="h-6 w-6" strokeWidth={1.25} />
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-[#080706]/[0.985] backdrop-blur-sm">
          <div className="flex items-center justify-between px-5 py-6 md:px-8">
            <span className="flex items-center gap-3.5">
              <TriangleMark size={30} className="text-[#c9a45c]" />
              <span className="font-display text-lg uppercase tracking-[0.22em]">Big Skrilla</span>
            </span>
            <button className="p-2 text-[#f2ede3]" onClick={() => setMenuOpen(false)} aria-label="Close navigation">
              <X className="h-6 w-6" strokeWidth={1.25} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-6" aria-label="Mobile navigation">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`font-display fade-up text-4xl tracking-[0.06em] ${page === link.id ? 'text-[#c9a45c]' : 'text-[#f2ede3]/85'}`}
                style={{ animationDelay: `${0.08 + i * 0.07}s` }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="fade-up flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-6 pb-10" style={{ animationDelay: '0.5s' }}>
            {SOCIAL_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="label text-[9px] text-[#f2ede3]/45 transition-colors hover:text-[#c9a45c]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function PageHero({ eyebrow, title, accent, description }: { eyebrow: string; title: string; accent: string; description: string }) {
  return (
    <section className="relative flex min-h-[62vh] items-end overflow-hidden pt-32">
      <div className="absolute inset-0">
        <img src={backgroundImage} alt="" className="h-full w-full object-cover object-[center_32%] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-[#080706]/72 to-[#080706]/88" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 md:px-8 md:pb-20">
        <p className="label fade-up text-[#c9a45c]">{eyebrow}</p>
        <h1 className="font-display fade-up fade-up-1 mt-4 max-w-5xl text-5xl leading-[1.04] [overflow-wrap:anywhere] sm:text-7xl md:text-8xl">
          {title} <span className="font-display-italic text-[#c9a45c]">{accent}</span>
        </h1>
        <p className="fade-up fade-up-2 mt-6 max-w-2xl text-lg leading-relaxed text-[#f2ede3]/60">{description}</p>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      {/* ——— Hero ——— */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt="Big Skrilla portrait"
            className="h-full w-full object-cover object-[center_28%] opacity-55 md:object-[center_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080706] via-[#080706]/80 to-[#080706]/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-transparent to-[#080706]/70" />
          <div className="smoke-puff smoke-puff-1" aria-hidden="true" />
          <div className="smoke-puff smoke-puff-2" aria-hidden="true" />
          <div className="smoke-puff smoke-puff-3" aria-hidden="true" />
          <div className="smoke-puff smoke-puff-4" aria-hidden="true" />
          <div className="smoke-puff smoke-puff-5" aria-hidden="true" />
          <div className="smoke-puff smoke-puff-6" aria-hidden="true" />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-24 pt-36 md:px-8 lg:grid-cols-[1.12fr_0.88fr]">
          <div>
            <p className="label fade-up flex items-center gap-4 text-[#c9a45c]">
              <span className="inline-block h-px w-10 bg-[#c9a45c]/60" aria-hidden="true" />
              Rapper · Performer · Songwriter
            </p>

            <h1 className="font-display fade-up fade-up-1 mt-7 leading-[0.92]">
              <span className="block text-[19vw] font-medium uppercase tracking-[0.06em] sm:text-8xl md:text-9xl">Big</span>
              <span className="font-display-italic block text-[19vw] font-medium text-[#c9a45c] sm:text-8xl md:text-9xl">Skrilla</span>
            </h1>

            <div className="fade-up fade-up-2 mt-8 flex items-center gap-5">
              <span className="label text-[#f2ede3]/55">Est. 2099 — Street Quantum Sound</span>
            </div>

            <p className="fade-up fade-up-3 mt-7 max-w-md text-lg leading-relaxed text-[#f2ede3]/62">
              Fourteen tracks recorded in the dark. Cigar smoke, velvet curtains and bass heavy enough to bend the room — the boss era
              begins here.
            </p>

            <div className="fade-up fade-up-4 mt-10 flex flex-wrap items-center gap-6">
              <a
                href={SPOTIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="label bg-[#c9a45c] px-9 py-4.5 text-[10px] text-[#080706] transition-all duration-500 hover:bg-[#e7d6ab]"
              >
                Stream the Album
              </a>
              <a
                href="./tour.html"
                className="label group inline-flex items-center gap-3 border-b border-[#f2ede3]/25 pb-2 text-[10px] text-[#f2ede3]/80 transition-colors hover:border-[#c9a45c] hover:text-[#c9a45c]"
              >
                Tour Dates
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" strokeWidth={1.25} />
              </a>
            </div>

            <div className="fade-up fade-up-5 mt-12 flex flex-wrap items-center gap-x-7 gap-y-3">
              <span className="label text-[9px] text-[#f2ede3]/35">Follow</span>
              {HERO_SOCIALS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label link-draw text-[9px] text-[#f2ede3]/60 transition-colors hover:text-[#f2ede3]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="fade-up fade-up-3 relative h-[340px] sm:h-[440px] lg:h-[560px]">
            <ShatterSphere />
          </div>
        </div>

        <div className="absolute bottom-8 left-5 z-10 flex items-center gap-4 md:left-8">
          <span className="relative h-14 w-px overflow-hidden bg-[#f2ede3]/15" aria-hidden="true">
            <span className="scroll-cue-line absolute inset-0 bg-[#c9a45c]" />
          </span>
          <span className="label text-[9px] text-[#f2ede3]/40">Scroll</span>
        </div>
      </section>

      {/* ——— Marquee ——— */}
      <div className="hairline-t hairline-b overflow-hidden py-5">
        <div className="ticker flex w-max whitespace-nowrap">
          {[0, 1].map(k => (
            <div key={k} className="flex" aria-hidden={k === 1}>
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className="label mx-8 flex items-center gap-8 text-[#f2ede3]/70">
                  Big Skrilla <span className="text-[#c9a45c]">✦</span> #itriedcallingyou Out Now{' '}
                  <span className="text-[#c9a45c]">✦</span> World Tour 2026 <span className="text-[#c9a45c]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ——— Numbers ——— */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <p className="label text-center text-[#c9a45c]" data-reveal>
          By the numbers
        </p>
        <div className="mt-12 grid border-y border-[#f2ede3]/10 md:grid-cols-3 md:divide-x md:divide-[#f2ede3]/10">
          {(
            [
              ['1.2B', 'Global Streams'],
              ['14', 'New Tracks'],
              ['05', 'World Tours']
            ] as [string, string][]
          ).map(([n, l], i) => (
            <a
              href="./music.html"
              key={l}
              className="group px-6 py-12 text-center transition-colors hover:bg-[#f2ede3]/[0.025] md:py-16"
              data-reveal
              style={rd(i * 120)}
            >
              <div className="font-display text-6xl text-[#f2ede3] transition-colors duration-500 group-hover:text-[#c9a45c] md:text-7xl">
                <CountUp value={n} />
              </div>
              <div className="label mt-5 text-[#f2ede3]/45 transition-colors duration-500 group-hover:text-[#f2ede3]/75">{l}</div>
            </a>
          ))}
        </div>
      </section>

      {/* ——— Story ——— */}
      <section className="mx-auto max-w-4xl px-5 pb-28 pt-4 text-center md:px-8 md:pb-36">
        <p className="label text-[#c9a45c]" data-reveal>
          The Story
        </p>
        <h2 className="font-display mt-9 text-4xl leading-[1.18] sm:text-5xl md:text-6xl" data-reveal style={rd(120)}>
          “Recorded in the dark.
          <br />
          <span className="font-display-italic text-[#c9a45c]">Built to bend the room.”</span>
        </h2>
        <p className="mx-auto mt-9 max-w-xl text-lg leading-relaxed text-[#f2ede3]/60" data-reveal style={rd(240)}>
          Fourteen tracks recorded in the dark. Cigar smoke, velvet curtains and bass heavy enough to bend the room — the boss era
          begins here.
        </p>
        <div className="mt-11 flex flex-wrap items-center justify-center gap-x-8 gap-y-3" data-reveal style={rd(360)}>
          {['Rapper', 'Performer', 'Songwriter', 'Boss Era'].map(tag => (
            <span key={tag} className="label text-[9px] text-[#f2ede3]/45">
              {tag}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}

function StreamCard({
  tone,
  player,
  name,
  href,
  embedTitle,
  embedSrc,
  embedAllow,
  sandbox,
  bgClass
}: {
  tone: string;
  player: string;
  name: string;
  href: string;
  embedTitle: string;
  embedSrc: string;
  embedAllow: string;
  sandbox?: string;
  bgClass?: string;
}) {
  return (
    <section className="border border-[#f2ede3]/12 bg-[#0d0b09]" data-reveal>
      <header className="flex items-center justify-between border-b border-[#f2ede3]/10 px-6 py-5 md:px-8">
        <div>
          <p className="label text-[9px]" style={{ color: tone }}>
            {player}
          </p>
          <h2 className="font-display mt-2 text-2xl tracking-[0.08em]">{name}</h2>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="label link-draw text-[9px] text-[#f2ede3]/55 transition-colors hover:text-[#f2ede3]"
        >
          Open App ↗
        </a>
      </header>
      <iframe
        src={embedSrc}
        title={embedTitle}
        width="100%"
        height="500"
        loading="lazy"
        allow={embedAllow}
        sandbox={sandbox}
        className={`block w-full border-0 ${bgClass || ''}`}
      />
    </section>
  );
}

function MusicPage() {
  return (
    <>
      <PageHero
        eyebrow="Official Streams — 001"
        title="Stream"
        accent="#itriedcallingyou"
        description="Listen to SKRILLA directly from the official Spotify and Apple Music players."
      />
      <main className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <div className="grid gap-8 lg:grid-cols-2">
          <StreamCard
            tone="#c9a45c"
            player="Official Artist Player"
            name="Spotify"
            href={SPOTIFY_URL}
            embedTitle="SKRILLA on Spotify"
            embedSrc={SPOTIFY_EMBED}
            embedAllow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
          <StreamCard
            tone="#c9a45c"
            player="Official Artist Player"
            name="Apple Music"
            href={APPLE_URL}
            embedTitle="SKRILLA on Apple Music"
            embedSrc={APPLE_EMBED}
            embedAllow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
            bgClass="bg-white"
          />
        </div>
      </main>
    </>
  );
}

function VideosPage() {
  return (
    <>
      <PageHero
        eyebrow="Visual Archive — 002"
        title="Official"
        accent="Videos"
        description="Watch SKRILLA’s official music videos directly from the Jeshi ya Dago YouTube channel."
      />
      <main className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <div className="grid gap-8 md:grid-cols-2">
          {VIDEOS.map((v, i) => (
            <article
              key={v.id}
              className={`group border border-[#f2ede3]/12 bg-[#0d0b09] transition-colors duration-500 hover:border-[#c9a45c]/45 ${
                i === 0 ? 'md:col-span-2' : ''
              }`}
              data-reveal
              style={rd(i * 110)}
            >
              <div className="aspect-video bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.id}?rel=0`}
                  title={v.title}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-[#f2ede3]/10 p-6">
                <div>
                  <h2 className="font-display text-xl tracking-[0.04em] md:text-2xl">{v.title}</h2>
                  <p className="label mt-2.5 text-[9px] text-[#f2ede3]/45">{v.meta}</p>
                </div>
                <span className="label hidden shrink-0 text-[9px] text-[#c9a45c] sm:block">✦</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 text-center" data-reveal>
          <a
            href="https://www.youtube.com/@jeshiyadago7380"
            target="_blank"
            rel="noopener noreferrer"
            className="label inline-flex rounded-full border border-[#f2ede3]/25 px-9 py-4 text-[10px] text-[#f2ede3]/85 transition-all duration-500 hover:border-[#c9a45c] hover:bg-[#c9a45c] hover:text-[#080706]"
          >
            View Full YouTube Channel
          </a>
        </div>
      </main>
    </>
  );
}

function TourPage() {
  return (
    <>
      <PageHero
        eyebrow="On the Road — 003"
        title="World"
        accent="Tour"
        description="#itriedcallingyou comes alive. Select a city and secure your access before the signal moves on."
      />
      <main className="mx-auto max-w-5xl px-5 py-20 md:px-8 md:py-24">
        <div className="label mb-4 flex items-center gap-4 text-[#c9a45c]" data-reveal>
          <span className="inline-block h-px w-10 bg-[#c9a45c]/50" aria-hidden="true" />
          2026 Tour Schedule
        </div>

        <div>
          {TOUR.map((t, i) => (
            <div
              key={t.date + t.city}
              className="group grid grid-cols-1 gap-2 border-b border-[#f2ede3]/10 px-2 py-7 transition-colors duration-500 hover:bg-[#f2ede3]/[0.025] sm:grid-cols-[92px_1.1fr_1fr_auto] sm:items-center sm:gap-6"
              data-reveal
              style={rd(i * 80)}
            >
              <span className="font-display text-2xl text-[#c9a45c]">{t.date}</span>
              <span className="font-display flex items-center gap-2.5 text-xl tracking-[0.03em]">
                <MapPin className="h-4 w-4 shrink-0 text-[#f2ede3]/35" strokeWidth={1.25} />
                {t.city}
              </span>
              <span className="text-sm uppercase tracking-[0.14em] text-[#f2ede3]/50">{t.venue}</span>
              <span>
                <button className="label w-full border border-[#f2ede3]/25 px-7 py-3 text-[9px] transition-all duration-500 group-hover:border-[#c9a45c] group-hover:bg-[#c9a45c] group-hover:text-[#080706] sm:w-auto">
                  Tickets
                </button>
              </span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

function MerchPage() {
  return (
    <>
      <PageHero
        eyebrow="Supply Drop — 004"
        title="Official"
        accent="Merch"
        description="Limited-run pieces engineered for the #itriedcallingyou era. Built dark, marked in gold."
      />
      <main className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {MERCH.map((m, i) => (
            <article
              key={m.name}
              className="group border border-[#f2ede3]/12 bg-[#0d0b09] transition-colors duration-500 hover:border-[#c9a45c]/50"
              data-reveal
              style={rd(i * 110)}
            >
              <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,#1e1912_0,#0d0b09_65%)]">
                <div
                  className={`zoom-target absolute h-72 w-52 ${i === 0 ? 'rounded-t-[70px] bg-[#17130d]' : 'rounded-t-[90px] bg-[#131009]'}`}
                >
                  <div className="absolute left-1/2 top-24 w-max -translate-x-1/2 text-center">
                    <TriangleMark size={50} className="mx-auto text-[#c9a45c]" />
                    <div className="label mt-4 text-[8px] text-[#f2ede3]/55">{m.mark}</div>
                  </div>
                </div>
                <Package className="absolute right-5 top-5 h-4 w-4 text-[#f2ede3]/20" strokeWidth={1.25} />
              </div>
              <div className="flex items-center justify-between border-t border-[#f2ede3]/10 p-6">
                <div>
                  <h2 className="font-display text-lg tracking-[0.04em]">{m.name}</h2>
                  <p className="label mt-2.5 text-[10px] text-[#c9a45c]">{m.price}</p>
                </div>
                <button
                  aria-label={`Add ${m.name} to bag`}
                  className="border border-[#f2ede3]/20 p-3 transition-colors duration-500 hover:border-[#c9a45c] hover:text-[#c9a45c]"
                >
                  <ShoppingBag className="h-4.5 w-4.5" strokeWidth={1.25} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}

function Footer() {
  return (
    <footer className="hairline-t">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-5 py-16 text-center md:px-8 md:py-20">
        <TriangleMark size={38} className="text-[#c9a45c]" />

        <p className="font-display text-4xl tracking-[0.04em] md:text-5xl">
          Big <span className="font-display-italic text-[#c9a45c]">Skrilla</span>
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-x-9 gap-y-3" aria-label="Footer navigation">
          {[
            { label: 'MUSIC', href: './music.html' },
            { label: 'VIDEOS', href: './videos.html' },
            { label: 'TOUR', href: './tour.html' }
          ].map(link => (
            <a key={link.label} href={link.href} className="label link-draw text-[9px] text-[#f2ede3]/55 transition-colors hover:text-[#f2ede3]">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {SOCIAL_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="label text-[9px] text-[#f2ede3]/45 transition-colors duration-500 hover:text-[#c9a45c]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="label text-[8px] text-[#f2ede3]/30">© 2026 Big Skrilla World</p>
      </div>
    </footer>
  );
}

export function App() {
  const page = (document.body.dataset.page || 'home') as PageName;
  const [introDone, setIntroDone] = useState(false);
  useReveal(introDone, page);

  const pageContent = { home: <HomePage />, music: <MusicPage />, videos: <VideosPage />, tour: <TourPage />, merch: <MerchPage /> }[page] || (
    <HomePage />
  );

  return (
    <div className="relative min-h-screen bg-[#080706] text-[#f2ede3]">
      <IntroLoader onDone={() => setIntroDone(true)} />
      <Header page={page} />
      {pageContent}
      <Footer />
    </div>
  );
}

export default App;
