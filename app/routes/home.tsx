import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "HBOMB R.G. — Static Pulse Edition" },
		{
			name: "description",
			content: "Explore the HBOMB R.G. Static Pulse Edition storefront.",
		},
	];
}

export default function Home() {
	return (
		<iframe
			title="HBOMB R.G. Static Pulse Edition"
			src="/static-pulse/index.html"
			style={{
				position: "fixed",
				inset: 0,
				width: "100%",
				height: "100%",
				border: 0,
				background: "#020205",
			}}
			allow="autoplay; fullscreen"
		/>
	);
}
