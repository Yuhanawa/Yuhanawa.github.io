import path from "node:path";
import { defineConfig } from "astro/config";
import charm from "astro-charm";

const dirName = path.dirname(new URL(import.meta.url).pathname);

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
				custom: {
					CustomScriptComponent: `${dirName}/src/components/CustomScriptComponent.astro`,
				},
			},
		}),
	],
});
