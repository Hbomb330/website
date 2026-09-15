import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Orbit Deck — 4-Song Interactive Edition | HBOMB R.G." },
		{
			name: "description",
			content:
				"Enter the HBOMB R.G. Orbit Deck: four tracks inside a cinematic, audio-reactive digital experience.",
		},
		{ property: "og:title", content: "HBOMB R.G. — Orbit Deck" },
		{
			property: "og:description",
			content: "Four songs. Four worlds. One interactive music experience.",
		},
	];
}

export default function Home() {
	return <Welcome />;
}
