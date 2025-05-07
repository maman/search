import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";
import type { Bang } from "../types.ts";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function main() {
	const bangsResponse = await fetch("https://duckduckgo.com/bang.js");
	let bangs: string | Array<Bang & { t: string }> = await bangsResponse.text();
	const updateDate = new Date();
	bangs = JSON.parse(bangs) as Array<Bang & { t: string }>;
	const hash: Record<string, Bang> = {};
	for (const bang of bangs) {
		hash[bang.t] = { d: bang.d, u: bang.u };
	}
	const template = `import { Bang } from "../types.ts";

export const BANG_UPDATE_TIME = "${updateDate.toISOString()}";
export const hashbang: Record<string, Bang> = ${JSON.stringify(hash)};`;
	await fs.writeFile(path.join(__dirname, "..", "src", "ddbang.ts"), template, {
		encoding: "utf-8",
	});
}

main();
