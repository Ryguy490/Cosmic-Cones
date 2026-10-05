import { type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConeIllustration } from '@/components/cone-illustration';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, Orbit, Sparkles, X } from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

const seasonalReleaseWindows: Record<string, readonly [number, number]> = {
  "Valentine's Day": [201, 214],
  "St. Patrick's Day": [301, 317],
  Summer: [601, 831],
  Fall: [1001, 1130],
  Christmas: [1201, 1231],
};

const PULL_TO_REFRESH_THRESHOLD = 72;

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const pullDistanceRef = useRef(0);

  useEffect(() => {
    let midnightTimer = 0;
    const syncNow = () => {
      const nextDate = new Date();
      setNow((currentDate) => (
        currentDate.getFullYear() === nextDate.getFullYear()
          && currentDate.getMonth() === nextDate.getMonth()
          && currentDate.getDate() === nextDate.getDate()
          ? currentDate
          : nextDate
      ));
    };
    const scheduleMidnightSync = () => {
      const current = new Date();
      const nextMidnight = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate() + 1,
      );
      midnightTimer = window.setTimeout(() => {
        syncNow();
        scheduleMidnightSync();
      }, Math.max(1, nextMidnight.getTime() - current.getTime()));
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') syncNow();
    };

    scheduleMidnightSync();
    window.addEventListener('focus', syncNow);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.clearTimeout(midnightTimer);
      window.removeEventListener('focus', syncNow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    let refreshTimer = 0;

    const resetPull = () => {
      touchStartY.current = null;
      pullDistanceRef.current = 0;
      setPullDistance(0);
    };
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1 || window.scrollY > 0) {
        resetPull();
        return;
      }
      touchStartY.current = event.touches[0].clientY;
    };
    const handleTouchMove = (event: TouchEvent) => {
      if (touchStartY.current === null || event.touches.length !== 1) return;
      if (window.scrollY > 0) {
        resetPull();
        return;
      }

      const distance = event.touches[0].clientY - touchStartY.current;
      if (distance <= 0) {
        resetPull();
        return;
      }
      if (distance >= 4) event.preventDefault();

      const nextDistance = Math.min(distance, 108);
      pullDistanceRef.current = nextDistance;
      setPullDistance(nextDistance);
    };
    const handleTouchEnd = () => {
      const shouldRefresh = pullDistanceRef.current >= PULL_TO_REFRESH_THRESHOLD;
      resetPull();
      if (!shouldRefresh) return;

      setIsRefreshing(true);
      refreshTimer = window.setTimeout(() => window.location.reload(), 180);
    };
    const handleTouchCancel = () => resetPull();

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, []);

  useEffect(() => {
    document.title = 'Cosmic-Cones';
    const description = 'Pocket-sized fidget cones from Gavyan Co. Browse the Classic collection and seasonal designs during their scheduled release windows. Sales are coming soon.';
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement('meta');
      desc.setAttribute('name', 'description');
      document.head.appendChild(desc);
    }
    desc.setAttribute('content', description);
    const tags: [string, string][] = [
      ['og:title', 'Cosmic-Cones'],
      ['og:description', description],
      ['og:type', 'website'],
    ];
    tags.forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });
  }, []);

  const collections = [
    {
      name: 'Classic', tone: 'classic', intro: '',
      items: [
        ['Common', '32%', 'yellow & white', ['#f5c943', '#f9f3df']],
        ['Uncommon', '26.7%', 'green & white', ['#79a879', '#f9f3df']],
        ['Rare', '23.7%', 'blue & white', ['#70a9d2', '#f9f3df']],
        ['Epic', '13.6%', 'red & white', ['#df735d', '#f9f3df']],
        ['Legendary', '3.9%', 'metallic', ['#b9b9b4', '#e7e2d8']],
        ['Mythical', '0.1%', 'light blue & silver', ['#a9d8e6', '#c3c8c8']],
      ],
    },
    {
      name: "Valentine's Day", tone: 'valentine', intro: 'A small orbit of hearts, from sweet to cosmic.',
      items: [
        ['Heart reg.', '33%', 'pink & red', ['#ed9aa8', '#d94355']],
        ['Heart dark', '33%', 'red & purple', ['#d94355', '#714d8f']],
        ['Heart light', '33%', 'pink & white', ['#efa7b2', '#f9f3df']],
        ['Love', '1%', 'pink & red & purple layered', ['#ec9aab', '#d94355', '#714d8f'], true],
      ],
    },
    {
      name: "St. Patrick's Day", tone: 'patrick', intro: 'Four lucky finds with a little green in their orbit.',
      items: [
        ['Classic Shamrock', '33%', 'light & dark green', ['#a7c58c', '#326d4b']],
        ['Light Shamrock', '33%', 'white & light green', ['#f9f3df', '#a7c58c']],
        ['Dark Shamrock', '33%', 'green & dark green', ['#4b9164', '#244e3d']],
        ['Pot of Gold', '1%', 'gold', ['#dcae4d', '#f1d789']],
      ],
    },
    {
      name: 'Summer', tone: 'summer', intro: 'Salt-air shades, open skies and a rare shimmer in the tide.',
      items: [
        ['Beach', '20%', 'blue & tan', ['#76b8d1', '#cfad80']],
        ['Ocean', '20%', 'blue & teal', ['#3c8dac', '#5fc2ae']],
        ['Beach Dunes', '20%', 'tan & green', ['#cdb184', '#85a16b']],
        ['Deep Ocean', '20%', 'dark blue & blue', ['#184c78', '#589ac5']],
        ['Clear Skies', '19%', 'yellow & light blue', ['#f2cc5a', '#9fd0e0']],
        ['Sea Foam', '1%', 'light teal & light blue & silver layered', ['#86d2c5', '#a7dcec', '#c8ceca'], true],
      ],
    },
    {
      name: 'Fall', tone: 'fall', intro: 'Golden hour, crunchy leaves and one pumpkin-spiced surprise.',
      items: [
        ['Sunshine', '25%', 'gold & yellow', ['#dba94e', '#f4cf5d']],
        ['Colorful Leaves', '25%', 'red & orange', ['#c74f42', '#e98346']],
        ['Sunset Sky', '25%', 'orange & yellow', ['#e88b49', '#f1ce61']],
        ["Jack O' Lantern", '24%', 'orange & green', ['#e98240', '#5a8556']],
        ['Pumpkin Pie', '1%', 'orange & tan', ['#db7945', '#cbae88']],
      ],
    },
    {
      name: 'Christmas', tone: 'christmas', intro: 'A winter constellation wrapped in color and layered stripes.',
      items: [
        ['Spearmint', '30%', 'green & white layered', ['#65a57a', '#f7f0da'], true],
        ['Blizzard', '30%', 'blue & white layered', ['#70aaca', '#f7f0da'], true],
        ['Peppermint', '30%', 'red & white layered', ['#d95f5c', '#f7f0da'], true],
        ['Holiday Spirit', '10%', 'red, green & silver layered', ['#d95f5c', '#65a57a', '#bfc4c1'], true],
      ],
    },
  ] as const;
  const totalDesignCount = collections.reduce(
    (total, collection) => total + collection.items.length,
    0,
  );
  const todayKey = (now.getMonth() + 1) * 100 + now.getDate();
  const visibleCollections = collections.filter((collection) => {
    if (collection.name === 'Classic') return true;
    const releaseWindow = seasonalReleaseWindows[collection.name];
    return !!releaseWindow && todayKey >= releaseWindow[0] && todayKey <= releaseWindow[1];
  });
  const activeSeasonalCollections = visibleCollections.filter(
    (collection) => collection.name !== 'Classic',
  );
  const releaseStatus = activeSeasonalCollections.length === 0
    ? 'No seasonal collection is in its release window right now. Classic remains here all year.'
    : activeSeasonalCollections.length === 1
      ? `${activeSeasonalCollections[0].name} is in its scheduled release window.`
      : `${activeSeasonalCollections.map((collection) => collection.name).join(' and ')} are in their scheduled release windows.`;
  const tickerMessages = [
    'SMALL OBJECTS, BIG UNIVERSE',
    ...activeSeasonalCollections.map(
      (collection) => `${collection.name.toUpperCase()} COLLECTION IS AVAILABLE`,
    ),
    'FIND YOUR FAVORITE',
  ];

  return (
    <main className="cosmic-page" id="top">
      <div
        className={`pull-refresh-indicator ${pullDistance > 0 || isRefreshing ? 'is-visible' : ''}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-hidden={pullDistance === 0 && !isRefreshing}
        data-testid="status-pull-to-refresh"
        style={{ transform: `translate(-50%, ${Math.max(0, pullDistance - 36)}px)` }}
      >
        {isRefreshing
          ? 'Refreshing'
          : pullDistance >= PULL_TO_REFRESH_THRESHOLD
            ? 'Release to refresh'
            : 'Pull to refresh'}
      </div>
      <div className="announcement"><span className="announcement-dot" /> A new little universe is forming <span className="announcement-rule" /> SALES COMING SOON</div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Cosmic Cones home"><span className="brand-mark"><Orbit size={21} strokeWidth={1.7} /></span><span>COSMIC<span className="brand-word-light"> CONES</span><small>BY GAVYAN CO.</small></span></a>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="#collections" onClick={() => setMenuOpen(false)}>The collections</a>
          <a href="#rarity" onClick={() => setMenuOpen(false)}>How rarity works</a>
        </nav>
        <a className="header-cta" href="#collections">Explore cones <ArrowUpRight size={15} /></a>
        <button className="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-art" aria-hidden="true">
          <span className="hero-orbit hero-orbit-one" />
          <span className="hero-orbit hero-orbit-two" />
          <span className="hero-star hero-star-one" />
          <span className="hero-star hero-star-two" />
          <div className="hero-cone-wrap">
            <ConeIllustration colors={['#b9b9b4', '#e7e2d8']} metallic />
          </div>
          <span className="hero-art-caption">LEGENDARY · METALLIC</span>
        </div>
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-star" /> POCKET-SIZED FIDGETS</div>
          <h1 id="hero-title">Cosmic<br /><em>Cones</em></h1>
          <p className="hero-intro">A pocket-sized fidget cone with playful color, character, and the thrill of the unexpected.</p>
          <div className="hero-actions">
            <a href="#collections" className="button-primary">Explore the collections <ArrowDown size={16} /></a>
            <span className="hero-note">Browse by collection.<br />Sales coming soon.</span>
          </div>
          <div className="hero-edition">
            <span className="edition-spark"><Sparkles size={14} /></span>
            <span><b>{collections.length} scheduled collections</b><small>Released throughout the year</small></span>
            <span className="edition-divider" />
            <span><b>{totalDesignCount} cone designs</b><small>Rarity odds shown for each</small></span>
          </div>
        </div>
        <span className="hero-side-note">COLLECT THE UNEXPECTED · VOL. 01</span>
        <a className="scroll-cue" href="#collections"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
      </section>

      <section className="ticker" aria-label="Cosmic Cones updates">
        <div className="ticker-track">
          {[0, 1].map((loopIndex) => (
            <div className="ticker-group" aria-hidden={loopIndex === 1} key={loopIndex}>
              {tickerMessages.map((message, messageIndex) => (
                <span className="ticker-item" key={`${loopIndex}-${messageIndex}`}>
                  {message}<i aria-hidden="true" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="collections-section" id="collections">
        <div className="collection-list">
          {visibleCollections.map((collection) => (
            <article className={`collection-block ${collection.tone}`} id={`collection-${collection.tone}`} key={collection.name}>
              <div className="collection-intro">
                <div><h3>{collection.name}</h3>{collection.intro && <p>{collection.intro}</p>}</div>
                <span className="collection-orbit"><Orbit size={34} strokeWidth={1} /></span>
              </div>
              <div className="cone-grid">
                {collection.items.map(([name, odds, colors, swatches], itemIndex) => (
                  <div className="cone-card" key={name} data-testid={`card-cone-${collection.tone}-${itemIndex}`}>
                    <div className="cone-stage">
                      <span className="cone-star star-one" /><span className="cone-star star-two" />
                      <ConeIllustration
                        colors={swatches}
                        metallic={collection.name === 'Classic' && name === 'Legendary'}
                      />
                      {Number.parseFloat(odds) <= 3.9 && <span className="rare-stamp"><Sparkles size={10} /> RARE FIND</span>}
                    </div>
                    <div className="cone-info"><div className="cone-name-line"><h4>{name}</h4><span className="odds">{odds}</span></div><p>{colors}</p></div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="browse-note"><span className="note-orbit"><Orbit size={19} /></span><p><strong>Just looking is part of the fun.</strong> Sales are coming soon. Seasonal collections appear here only during their scheduled release windows.</p><span className="soon-stamp">COMING<br />SOON</span></div>
      </section>

      <section className="rarity-section" id="rarity">
        <div className="rarity-art">
          <div className="rarity-sun" /><span className="rarity-path path-a" /><span className="rarity-path path-b" />
          <div className="rarity-cone rarity-cone-one"><ConeIllustration colors={['#f5cb4f', '#f8f2df']} /></div>
          <div className="rarity-cone rarity-cone-two"><ConeIllustration colors={['#67a9d1', '#e7e4d8']} /></div>
          <div className="rarity-cone rarity-cone-three"><ConeIllustration colors={['#d97263', '#f4eee2']} /></div>
          <span className="rarity-label label-top">COMMON<br />32%</span><span className="rarity-label label-bottom">MYTHICAL<br />0.1%</span>
          <span className="rarity-caption">THE CLASSIC CONSTELLATION</span>
        </div>
        <div className="rarity-copy">
          <div className="eyebrow eyebrow-light"><span className="eyebrow-star" /> A LITTLE CHANCE, A LOT OF WONDER</div>
          <h2>Some things<br />are <em>harder to find.</em></h2>
          <p>Every cone has a rarity, and every collection has its own mix. Odds tell you the chance of finding each design—not a promise of what you’ll find.</p>
          <div className="odds-example"><div><strong>32%</strong><span>Common</span></div><div className="odds-line" /><div><strong>0.1%</strong><span>Mythical</span></div></div>
          <a href="#collections" className="text-link">Meet the full lineup <ArrowRight size={16} /></a>
          <small className="rounding-note">Odds are shown as provided for each collection; rounded figures may not total 100%.</small>
        </div>
      </section>

      <section className="release-note-section" aria-label="Seasonal release status">
        <div className="release-note-icon"><Orbit size={22} /></div>
        <div>
          <span className="release-note-kicker">SEASONAL RELEASES</span>
          <p>
            {releaseStatus} Seasonal designs appear automatically on their scheduled dates. Sales are still closed.
          </p>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-heading"><div className="section-kicker"><span>02 / GOOD TO KNOW</span></div><h2>Curious?<br /><em>We are too.</em></h2><p>A few things worth knowing while the universe gets ready.</p></div>
        <div className="faq-list">
          <details><summary>Can I buy a Cosmic Cone today?<span>+</span></summary><p>Not yet. Sales are coming soon. Classic is always available to browse, and seasonal collections appear only during their scheduled windows.</p></details>
          <details><summary>What do the percentages mean?<span>+</span></summary><p>They are the listed odds for each design in its collection. They describe the chance of finding a design; rounded odds may not total exactly 100%.</p></details>
          <details><summary>When do seasonal collections appear?<span>+</span></summary><p>Valentine’s Day runs Feb 1–14; St. Patrick’s Day runs March 1–17; Summer runs June through August; Fall runs October and November; Christmas runs December. Each collection appears automatically during its window.</p></details>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-top"><a className="brand footer-brand" href="#top"><span className="brand-mark"><Orbit size={21} strokeWidth={1.7} /></span><span>COSMIC<span className="brand-word-light"> CONES</span><small>BY GAVYAN CO.</small></span></a><span className="footer-note">A tiny universe, waiting to be found.</span><a href="#top" className="back-top">BACK TO THE TOP <ArrowUpRight size={14} /></a></div>
        <div className="footer-bottom"><span>© GAVYAN CO. · COSMIC CONES</span><span>SALES COMING SOON</span></div>
      </footer>
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
