import { type CSSProperties, type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

function Home() {
  const [selectedCollection, setSelectedCollection] = useState('All editions');
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.title = 'Cosmic Cones — Tiny worlds, worth finding';
    const description = 'Meet Cosmic Cones: collectible fidget cones made by Gavyan Co. Explore classic rarities and seasonal editions. Sales are coming soon.';
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement('meta');
      desc.setAttribute('name', 'description');
      document.head.appendChild(desc);
    }
    desc.setAttribute('content', description);
    const tags: [string, string][] = [
      ['og:title', 'Cosmic Cones — Tiny worlds, worth finding'],
      ['og:description', description],
      ['og:type', 'website'],
      ['og:image', '/cosmic-cone-product.jpg'],
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
      name: 'Classic', window: 'THE FOUNDING SET', tone: 'classic', intro: 'Six little worlds. One iconic silhouette. Start anywhere.',
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
      name: "Valentine's Day", window: 'FEB 1 — VALENTINE’S DAY', tone: 'valentine', intro: 'A small orbit of hearts, from sweet to cosmic.',
      items: [
        ['Heart reg.', '33%', 'pink & red', ['#ed9aa8', '#d94355']],
        ['Heart dark', '33%', 'red & purple', ['#d94355', '#714d8f']],
        ['Heart light', '33%', 'pink & white', ['#efa7b2', '#f9f3df']],
        ['Love', '1%', 'pink & red & purple layered', ['#ec9aab', '#d94355', '#714d8f'], true],
      ],
    },
    {
      name: "St. Patrick's Day", window: 'MAR 1 — ST. PATRICK’S DAY', tone: 'patrick', intro: 'Four lucky finds with a little green in their orbit.',
      items: [
        ['Classic Shamrock', '33%', 'light & dark green', ['#a7c58c', '#326d4b']],
        ['Light Shamrock', '33%', 'white & light green', ['#f9f3df', '#a7c58c']],
        ['Dark Shamrock', '33%', 'green & dark green', ['#4b9164', '#244e3d']],
        ['Pot of Gold', '1%', 'gold', ['#dcae4d', '#f1d789']],
      ],
    },
    {
      name: 'Summer', window: 'JUNE — AUGUST', tone: 'summer', intro: 'Salt-air shades, open skies and a rare shimmer in the tide.',
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
      name: 'Fall', window: 'OCTOBER — NOVEMBER', tone: 'fall', intro: 'Golden hour, crunchy leaves and one pumpkin-spiced surprise.',
      items: [
        ['Sunshine', '25%', 'gold & yellow', ['#dba94e', '#f4cf5d']],
        ['Colorful Leaves', '25%', 'red & orange', ['#c74f42', '#e98346']],
        ['Sunset Sky', '25%', 'orange & yellow', ['#e88b49', '#f1ce61']],
        ["Jack O' Lantern", '24%', 'orange & green', ['#e98240', '#5a8556']],
        ['Pumpkin Pie', '1%', 'orange & tan', ['#db7945', '#cbae88']],
      ],
    },
    {
      name: 'Christmas', window: 'DECEMBER', tone: 'christmas', intro: 'A winter constellation wrapped in color and layered stripes.',
      items: [
        ['Spearmint', '30%', 'green & white layered', ['#65a57a', '#f7f0da'], true],
        ['Blizzard', '30%', 'blue & white layered', ['#70aaca', '#f7f0da'], true],
        ['Peppermint', '30%', 'red & white layered', ['#d95f5c', '#f7f0da'], true],
        ['Holiday Spirit', '10%', 'red, green & silver layered', ['#d95f5c', '#65a57a', '#bfc4c1'], true],
      ],
    },
  ] as const;
  const visibleCollections = selectedCollection === 'All editions'
    ? collections
    : collections.filter((collection) => collection.name === selectedCollection);
  const jumpToCollection = (name: string) => {
    setSelectedCollection(name);
    setMenuOpen(false);
    document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="cosmic-page">
      <div className="announcement"><span className="announcement-dot" /> A new little universe is forming <span className="announcement-rule" /> SALES COMING SOON</div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Cosmic Cones home"><span className="brand-mark"><Orbit size={21} strokeWidth={1.7} /></span><span>COSMIC<span className="brand-word-light"> CONES</span><small>BY GAVYAN CO.</small></span></a>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="#collections" onClick={() => setMenuOpen(false)}>The collections</a>
          <a href="#rarity" onClick={() => setMenuOpen(false)}>How rarity works</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>Our little universe</a>
        </nav>
        <a className="header-cta" href="#collections">Explore cones <ArrowUpRight size={15} /></a>
        <button className="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-art">
          <img
            className="hero-product-image"
            src="/cosmic-cone-product.jpg"
            alt="Cosmic Cone fidget with a charcoal body and bright green spiral bands."
          />
          <span className="hero-art-caption">GREEN SPIRAL · CLASSIC</span>
        </div>
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-star" /> POCKET-SIZED FIDGETS</div>
          <h1>Tiny worlds.<br /><em>Worth finding.</em></h1>
          <p className="hero-intro">Meet the collectible fidget cone with a universe of color, character, and the thrill of the unexpected.</p>
          <div className="hero-actions">
            <a href="#collections" className="button-primary">Find your constellation <ArrowDown size={16} /></a>
            <span className="hero-note">A collection to explore.<br />Not on sale just yet.</span>
          </div>
          <div className="hero-edition"><span className="edition-spark"><Sparkles size={14} /></span><span><b>6 collections</b><small>One curious little cosmos</small></span><span className="edition-divider" /><span><b>36 discoveries</b><small>Odds shown for every cone</small></span></div>
        </div>
        <span className="hero-side-note">COLLECT THE UNEXPECTED · VOL. 01</span>
        <a className="scroll-cue" href="#collections"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
      </section>

      <section className="ticker" aria-label="Brand statement">
        <div className="ticker-track"><span>SMALL OBJECTS, BIG UNIVERSE</span><i aria-hidden="true" /><span>MADE FOR THE CURIOUS</span><i aria-hidden="true" /><span>FIND YOUR FAVORITE</span><i aria-hidden="true" /><span>SMALL OBJECTS, BIG UNIVERSE</span><i aria-hidden="true" /><span>MADE FOR THE CURIOUS</span><i aria-hidden="true" /></div>
      </section>

      <section className="collections-section" id="collections">
        <div className="section-kicker"><span>01 / THE COLLECTIONS</span><span>CHOOSE A LITTLE WORLD <ArrowDown size={13} /></span></div>
        <div className="collection-heading">
          <div><h2>A universe of<br /><em>little discoveries.</em></h2></div>
          <p>From the first Classic to a once-a-season surprise, every collection has its own orbit. Take a look around—your favorite is out there.</p>
        </div>
        <div className="collection-filters" role="group" aria-label="Filter by collection">
          {['All editions', ...collections.map((c) => c.name)].map((name) => (
            <button key={name} className={selectedCollection === name ? 'filter-chip active' : 'filter-chip'} onClick={() => setSelectedCollection(name)} aria-pressed={selectedCollection === name}>{name}</button>
          ))}
        </div>
        <div className="collection-list">
          {visibleCollections.map((collection, index) => (
            <article className={`collection-block ${collection.tone}`} id={`collection-${collection.tone}`} key={collection.name}>
              <div className="collection-topline"><span className="collection-index">0{index + 1}</span><span className="collection-season">{collection.window}</span><span className="collection-count">{collection.items.length} CONES IN THIS SET</span></div>
              <div className="collection-intro">
                <div><h3>{collection.name}<span className="title-period">.</span></h3><p>{collection.intro}</p></div>
                <span className="collection-orbit"><Orbit size={34} strokeWidth={1} /></span>
              </div>
              <div className="cone-grid">
                {collection.items.map(([name, odds, colors, swatches, layered], itemIndex) => (
                  <div className="cone-card" key={name} data-testid={`card-cone-${collection.tone}-${itemIndex}`}>
                    <div className={`cone-stage ${layered ? 'is-layered' : ''}`}>
                      <span className="cone-star star-one" /><span className="cone-star star-two" />
                      <span
                        className="cone-shape"
                        style={{
                          '--cone-color-one': swatches[0],
                          '--cone-color-two': swatches[1] ?? swatches[0],
                          '--cone-color-three': swatches[2] ?? swatches[1] ?? swatches[0],
                        } as CSSProperties}
                      />
                      <span className="cone-shadow" />
                      {Number.parseFloat(odds) <= 3.9 && <span className="rare-stamp"><Sparkles size={10} /> RARE FIND</span>}
                    </div>
                    <div className="cone-info"><div className="cone-name-line"><h4>{name}</h4><span className="odds">{odds}</span></div><p>{colors}</p></div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="browse-note"><span className="note-orbit"><Orbit size={19} /></span><p><strong>Just looking is part of the fun.</strong> Sales are coming soon. For now, wander the collections and get to know the cosmos.</p><span className="soon-stamp">COMING<br />SOON</span></div>
      </section>

      <section className="rarity-section" id="rarity">
        <div className="rarity-art">
          <div className="rarity-sun" /><span className="rarity-path path-a" /><span className="rarity-path path-b" />
          <div className="rarity-cone rarity-cone-one"><i /></div><div className="rarity-cone rarity-cone-two"><i /></div><div className="rarity-cone rarity-cone-three"><i /></div>
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

      <section className="season-section" id="seasons">
        <div className="section-kicker"><span>02 / THE CALENDAR</span><span>THE YEAR, IN COLOR</span></div>
        <div className="season-heading"><h2>Seasons come.<br /><em>Curiosities stay.</em></h2><p>Some collections only orbit by for a little while. Here's when to look for them.</p></div>
        <div className="season-rail">
          {[
            ['FEB', "Valentine's Day", 'Feb 1 — Valentine’s Day', '#dc7d91'],
            ['MAR', "St. Patrick's Day", 'Mar 1 — St. Patrick’s Day', '#699c67'],
            ['JUN–AUG', 'Summer', 'June through August', '#55aab8'],
            ['OCT–NOV', 'Fall', 'October and November', '#dc944f'],
            ['DEC', 'Christmas', 'December', '#749b86'],
          ].map(([month, name, timing, color]) => (
            <button key={name} className="season-stop" onClick={() => jumpToCollection(name)} style={{ '--season-color': color } as CSSProperties}>
              <span className="season-month">{month}</span><span className="season-dot"><i /></span><span className="season-name">{name}</span><span className="season-timing">{timing}</span><ArrowUpRight className="season-arrow" size={15} />
            </button>
          ))}
        </div>
        <div className="season-footnote"><span className="tiny-spark" /> The Classic collection is the home constellation, here all year long.</div>
      </section>

      <section className="about-section" id="about">
        <div className="about-mark"><span className="about-ring ring-one" /><span className="about-ring ring-two" /><span className="about-star" /><span className="about-dot" /></div>
        <div className="about-copy"><div className="eyebrow"><span className="eyebrow-star" /> MADE BY GAVYAN CO.</div><h2>For the hands<br />that <em>love to wonder.</em></h2><p>Cosmic Cones turn a tiny moment into a small adventure. Follow the colors, discover the rarities, and find the cone that feels like yours.</p><a href="#collections" className="button-dark">Explore the collections <ArrowRight size={16} /></a></div>
        <div className="about-side"><span className="about-side-num">A SMALL THING<br />WITH A BIG ORBIT.</span><span className="about-side-line" /><span className="about-side-credit">COSMIC CONES<br />GAVYAN CO.</span></div>
      </section>

      <section className="faq-section">
        <div className="faq-heading"><div className="section-kicker"><span>03 / GOOD TO KNOW</span></div><h2>Curious?<br /><em>We are too.</em></h2><p>A few things worth knowing while the universe gets ready.</p></div>
        <div className="faq-list">
          <details><summary>Can I buy a Cosmic Cone today?<span>+</span></summary><p>Not yet. Sales are coming soon. You can explore every collection and its designs here while we get ready.</p></details>
          <details><summary>What do the percentages mean?<span>+</span></summary><p>They are the listed odds for each design in its collection. They describe the chance of finding a design; rounded odds may not total exactly 100%.</p></details>
          <details><summary>When do seasonal collections appear?<span>+</span></summary><p>Valentine’s Day runs Feb 1 through Valentine’s Day; St. Patrick’s Day runs March 1 through St. Patrick’s Day; Summer runs June through August; Fall runs October and November; Christmas runs December.</p></details>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-top"><a className="brand footer-brand" href="#top"><span className="brand-mark"><Orbit size={21} strokeWidth={1.7} /></span><span>COSMIC<span className="brand-word-light"> CONES</span><small>BY GAVYAN CO.</small></span></a><span className="footer-note">A tiny universe, waiting to be found.</span><a href="#top" className="back-top">BACK TO THE TOP <ArrowUpRight size={14} /></a></div>
        <div className="footer-bottom"><span>© GAVYAN CO. · COSMIC CONES</span><span>SALES COMING SOON</span><span>MADE FOR THE CURIOUS</span></div>
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
