import { useState } from "react";
import type { Route } from "./+types/home";
import "../hub.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "HBOMB R.G. — Apps for your everyday orbit" },
    {
      name: "description",
      content:
        "Explore four free HBOMB Windows apps, browser interface previews, and HB Transfer and HB Chat in development.",
    },
    { property: "og:title", content: "HBOMB R.G. — App Hub" },
    {
      property: "og:description",
      content:
        "Independent Windows apps. New connections in development. Explore the HBOMB app hub.",
    },
  ];
}

// Release links and versions match Hbomb330/hbombrg-com's published app catalog.
const apps = [
  {
    id: "blue-wave",
    name: "Blue Wave",
    version: "2.1.0",
    icon: "≈",
    kind: "DESKTOP ATMOSPHERE",
    description:
      "Animated waves, your own MP4 backgrounds, and automatic pausing for fullscreen games and apps.",
    file: "blue-wave-v2.1.0/HBOMB.Blue.Wave.2.1.0.exe",
    format: "EXE",
  },
  {
    id: "time-core",
    name: "Time Core",
    version: "2.3.0",
    icon: "24",
    kind: "TIME, REIMAGINED",
    description:
      "Six clock styles, countdown alerts, video backgrounds and compact or fullscreen views.",
    file: "time-core-v2.3.0/HBOMB.Time.Core.Setup.2.3.0.exe",
    format: "Installer",
  },
  {
    id: "weather",
    name: "HBOMB Weather",
    version: "1.1.6",
    icon: "°",
    kind: "A WINDOW TO OUTSIDE",
    description:
      "Weather information with animated backgrounds, themes and a compact desktop view.",
    file: "weather-v1.1.6/HBOMB-Weather-1.1.6-Portable.zip",
    format: "Portable ZIP",
  },
  {
    id: "notepad",
    name: "HBOMB Notepad",
    version: "1.3.0",
    icon: "//",
    kind: "ROOM FOR YOUR IDEAS",
    description:
      "A focused desktop space for everyday notes. Keep your next idea close at hand.",
    file: "Notepad/HBOMB.Notepad.Setup.1.3.0.exe",
    format: "Installer",
  },
];

export default function Home() {
  const [paused, setPaused] = useState(false);
  return (
    <div className={`hub${paused ? " hub-paused" : ""}`}>
      <a className="hub-skip" href="#main">
        Skip to content
      </a>
      <header className="hub-header">
        <nav className="hub-wrap" aria-label="Main navigation">
          <a className="hub-brand" href="/" aria-label="HBOMB app hub">
            <img src="/hbomb-skull-bomb.svg" alt="" />
            <span>
              HBOMB R.G.<small>INDEPENDENT SOFTWARE</small>
            </span>
          </a>
          <div className="hub-nav">
            <a href="#apps">Windows apps</a>
            <a href="#labs">In development</a>
            <a href="/orbit-deck">Orbit Deck ↗</a>
          </div>
        </nav>
      </header>
      <main id="main">
        <section className="hub-hero hub-wrap" aria-labelledby="hub-title">
          <div className="hub-intro">
            <p className="hub-label">YOUR DESKTOP. YOUR SIGNAL.</p>
            <h1 id="hub-title">
              Small apps.
              <br />
              <span>Big energy.</span>
            </h1>
            <p className="hub-lead">
              Make your everyday space feel like yours. Discover independent
              Windows tools, explore browser previews, and see what’s next from
              HBOMB.
            </p>
            <div className="hub-actions">
              <a className="hub-button hub-primary" href="#apps">
                Find your next app <span aria-hidden="true">↗</span>
              </a>
              <a className="hub-button" href="#labs">
                Explore the lab
              </a>
            </div>
            <p className="hub-note">
              4 free Windows apps · New projects in development
            </p>
          </div>
          <div className="hub-art" aria-hidden="true">
            <div className="hub-ring" />
            <div className="hub-console">
              <div className="hub-console-bar">
                <span>HB / WORKSPACE</span>
                <span>● ● ●</span>
              </div>
              <div className="hub-console-grid">
                <div className="hub-wave">
                  ≈<small>BLUE WAVE</small>
                </div>
                <div className="hub-clock">
                  12:48<small>TIME CORE / CONCEPT</small>
                </div>
                <div className="hub-weather">
                  ☀<small>WEATHER</small>
                </div>
                <div className="hub-note-art">
                  <span />
                  <span />
                  <span />
                  <small>YOUR NEXT IDEA</small>
                </div>
              </div>
              <div className="hub-console-foot">
                FOUR TOOLS. ONE HBOMB WORLD.
              </div>
            </div>
            <span className="hub-art-caption">
              ILLUSTRATIVE INTERFACE CONCEPT
            </span>
          </div>
        </section>
        <div className="hub-strip">
          <div className="hub-wrap">
            <span>BUILT TO MAKE IT YOURS</span>
            <span>WINDOWS / ANDROID / BROWSER</span>
            <button
              type="button"
              aria-pressed={paused}
              onClick={() => setPaused(!paused)}
            >
              {paused ? "Resume motion" : "Pause motion"}
            </button>
          </div>
        </div>
        <section
          className="hub-section hub-wrap"
          id="apps"
          aria-labelledby="apps-title"
        >
          <div className="hub-section-head">
            <div>
              <p className="hub-label">01 / READY FOR YOUR DESKTOP</p>
              <h2 id="apps-title">Meet your everyday apps.</h2>
            </div>
            <p>
              Free Windows downloads, straight from the published releases.
              Browser previews demonstrate the interface; they do not install or
              launch the desktop apps.
            </p>
          </div>
          <div className="hub-app-grid">
            {apps.map((app) => (
              <article className={`hub-card hub-${app.id}`} key={app.id}>
                <div className="hub-card-top">
                  <span className="hub-tag">Windows · Free download</span>
                  <span className="hub-version">v{app.version}</span>
                </div>
                <div className="hub-glyph" aria-hidden="true">
                  {app.icon}
                </div>
                <p className="hub-label">{app.kind}</p>
                <h3>{app.name}</h3>
                <p className="hub-description">{app.description}</p>
                {app.id === "weather" && (
                  <p className="hub-install-note">
                    Extract the whole ZIP. Keep resources and weather-assets
                    beside the executable.
                  </p>
                )}
                <div className="hub-card-actions">
                  <a
                    className="hub-download"
                    href={`https://github.com/Hbomb330/hbombrg-com/releases/download/${app.file}`}
                  >
                    Download <span className="hub-format">{app.format}</span>
                    <span className="hub-sr"> — {app.name}</span> ↗
                  </a>
                  <a
                    className="hub-preview"
                    href={`https://hbombrg.com/#${app.id}`}
                  >
                    View preview<span className="hub-sr"> — {app.name}</span> ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
          <a
            className="hub-help"
            href="https://hbombrg.com/#windows-install-help"
          >
            Windows installation help ↗
          </a>
        </section>
        <section className="hub-labs" id="labs" aria-labelledby="labs-title">
          <div className="hub-wrap">
            <div className="hub-section-head">
              <div>
                <p className="hub-label">02 / NEXT ON THE SIGNAL</p>
                <h2 id="labs-title">
                  New connections.
                  <br />
                  Work in progress.
                </h2>
              </div>
              <p>
                From desktop to Android, the next wave is taking shape. These
                projects are in development, with no public production download
                offered here.
              </p>
            </div>
            <div className="hub-lab-grid">
              <article>
                <span className="hub-tag">
                  In development · Local Wi-Fi MVP
                </span>
                <h3>
                  HB Transfer <span aria-hidden="true">↗</span>
                </h3>
                <p>
                  A project for moving files between Windows and Android over
                  local Wi-Fi. File sizes, compatibility and transfer
                  reliability still need validation.
                </p>
                <a href="https://hbombrg.com/transfer-chat.html#transfer">
                  Explore HB Transfer ↗
                </a>
              </article>
              <article>
                <span className="hub-tag">
                  Android 10+ · Development testing
                </span>
                <h3>
                  HB Chat <span aria-hidden="true">↗</span>
                </h3>
                <p>
                  Peer-to-peer messaging and file sharing for Android. Live
                  messaging, reconnection and background behavior still require
                  device testing.
                </p>
                <a href="https://hbombrg.com/transfer-chat.html#chat">
                  Explore HB Chat ↗
                </a>
              </article>
            </div>
          </div>
        </section>
        <section className="hub-archive hub-wrap">
          <div>
            <p className="hub-label">03 / THE ORIGINAL EXPERIENCE</p>
            <h2>Still in orbit.</h2>
            <p>
              The original Orbit Deck presentation has a home of its own.
              Explore its worlds and existing edition details.
            </p>
          </div>
          <a className="hub-button" href="/orbit-deck">
            Explore Orbit Deck ↗
          </a>
        </section>
      </main>
      <footer className="hub-footer hub-wrap">
        <span>© 2026 HBOMB R.G. / INDEPENDENT BY DESIGN</span>
        <a href="https://hbombrg.com/">Main app site ↗</a>
        <a href="https://github.com/Hbomb330/hbombrg-com/issues/new?template=bug_report.yml">
          Report an app bug ↗
        </a>
      </footer>
    </div>
  );
}
