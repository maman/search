import type { Bang } from "../types";

export const hashbang: Record<string, Bang> = {
	ppx: {
		d: "www.perplexity.ai",
		u: "https://www.perplexity.ai/search?q={{{s}}}&copilot=false",
	},
	old: {
		d: "web.archive.org",
		u: "https://web.archive.org/web/{{{s}}}",
	},
	snap: {
		d: "archive.ph",
		u: "https://archive.ph/timegate/{{{s}}}",
	},
	bb: {
		d: "b1.mahardi.me",
		u: "https://b1.mahardi.me?{{{s}}}",
	},
};
