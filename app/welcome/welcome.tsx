const tracks = [
	{ number: "01", title: "Gravity of Ghosts", mood: "Dark orbit", slug: "gravity-of-ghosts" },
	{ number: "02", title: "Last Mile", mood: "Terminal velocity", slug: "last-mile" },
	{ number: "03", title: "Medusa", mood: "Stone-cold signal", slug: "medusa" },
	{ number: "04", title: "Pressure", mood: "Core overload", slug: "pressure" },
];

const checkoutUrl = "https://payhip.com/b/xP2Le";

export function Welcome() {
	return (
		<main className="site-shell">
			<nav className="topbar" aria-label="Primary navigation">
				<a className="brand" href="#top" aria-label="HBOMB R.G. Orbit Deck home">
					<img className="brand-emblem" src="/hbomb-skull-bomb.svg" alt="" />
					<span className="brand-lockup">
						<strong>HBOMB R.G.</strong>
						<small>ORBIT SIGNAL DIVISION</small>
					</span>
				</a>
				<a className="nav-buy" href={checkoutUrl} target="_blank" rel="noreferrer">
					Buy Orbit Deck
				</a>
			</nav>

			<section className="hero" id="top">
				<div className="hero-copy">
					<p className="eyebrow">HBOMB R.G. presents</p>
					<h1>
						Music doesn’t sit still.
						<span>It pulls you into orbit.</span>
					</h1>
					<p className="hero-description">
						Four tracks become four cinematic worlds in an interactive,
						audio-reactive digital experience built for desktop and tablet.
					</p>
					<div className="hero-actions">
						<a className="primary-button" href={checkoutUrl} target="_blank" rel="noreferrer">
							Own the 4-Song Deck
							<span aria-hidden="true">↗</span>
						</a>
						<a className="text-link" href="#experience">
							Explore the experience
						</a>
					</div>
					<p className="delivery-note">Four complete songs • downloadable offline experience • reactive visuals • personal-use license • instant access</p>
					<p className="delivery-note">Instant digital delivery through Payhip</p>
				</div>

				<figure className="orbit-stage" aria-label="Four album worlds orbiting the HBOMB signal core">
					<div className="orbit-frame">
						<div className="orbit-worlds" aria-label="Four pulsing Orbit Deck cover worlds">
							{tracks.map((track) => (
								<div className="world-panel" key={track.number}>
									<video
										className="world-video"
										src={`/worlds/${track.slug}-cover.mp4`}
										poster={`/worlds/${track.slug}.jpg`}
										muted
										loop
										autoPlay
										playsInline
										preload="metadata"
										aria-label={`${track.title} animated cover`}
									/>
									<img
										className="world-poster"
										src={`/worlds/${track.slug}.jpg`}
										alt={`${track.title} cover`}
									/>
									<span className="world-tag">{track.number} · {track.title}</span>
								</div>
							))}
						</div>
						<div className="core-lockup" aria-hidden="true">
							<span>HBOMB R.G.</span>
							<strong>ORBIT</strong>
							<em>DECK</em>
						</div>
					</div>
					<figcaption>Four tracks mapped to four reactive worlds</figcaption>
				</figure>
			</section>

			<section className="signal-strip" aria-label="Product highlights">
				<span>4 mastered tracks</span>
				<span>Audio-reactive visuals</span>
				<span>Cinematic world entry</span>
				<span>Desktop + tablet</span>
			</section>

			<section className="experience" id="experience">
				<div className="section-heading">
					<p className="eyebrow">Inside the signal</p>
					<h2>Four tracks. Four worlds.</h2>
					<p>
						Every song changes the atmosphere. Energy, motion, weather and
						light react as you move through the deck.
					</p>
				</div>

				<ol className="track-list">
					{tracks.map((track) => (
						<li key={track.number}>
							<span className="track-number">{track.number}</span>
							<span className="track-title">{track.title}</span>
							<span className="track-mood">{track.mood}</span>
						</li>
					))}
				</ol>
			</section>

			<section className="features">
				<article>
					<span className="feature-index">A</span>
					<h3>Enter the world</h3>
					<p>Cinematic transitions take each track beyond a standard playlist.</p>
				</article>
				<article>
					<span className="feature-index">B</span>
					<h3>Feel the signal</h3>
					<p>Reactive rings, particles and atmosphere move with the music.</p>
				</article>
				<article>
					<span className="feature-index">C</span>
					<h3>Keep the experience</h3>
					<p>Purchase once and receive the complete digital edition instantly.</p>
				</article>
			</section>

			<section className="final-cta">
				<p className="eyebrow">Transmission ready</p>
				<h2>Welcome to the madness.</h2>
				<p>Own the first four-song HBOMB R.G. Orbit Deck.</p>
				<a className="primary-button" href={checkoutUrl} target="_blank" rel="noreferrer">
					Buy on Payhip
					<span aria-hidden="true">↗</span>
				</a>
			</section>

			<footer>
				<span>© 2026 HBOMB R.G.</span>
				<span>Independent music. Interactive worlds.</span>
			</footer>
		</main>
	);
}
