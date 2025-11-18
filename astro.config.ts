import { defineConfig } from "astro/config";
import charm from "astro-charm";

// https://astro.build/config
export default defineConfig({
	prefetch: true,
	site: "https://yuhanawa.github.io/",

	integrations: [
		charm({
			config: {
				lang: "zh",
				title: "Yuhanawa's Blog",
				description: "Yuhanawa's Blog",
				author: "Yuhanawa",
				side: {
					title: "Yuhanawa",
					sub: "Hello,",
					bio: " I'm here",
					navHome: {
						title: "Home",
					},
					footer: [
						{
							title: "Twitter",
							link: "https://x.com/yuhanawa",
							icon: "simple-icons:twitter",
						},
						{
							title: "GitHub",
							link: "https://github.com/yuhanawa",
							icon: "simple-icons:github",
						},
					],
				},
			},
			pages: {},
			overrides: {
				components: {
					// you can add custom script by overriding CustomScriptComponent,
					// it will be added to the end of `<head>`.
					// example:
					// CustomScriptComponent: "./src/components/CustomScriptComponent.astro",
				},
			},
		}),
	],
});
