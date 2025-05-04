import clipboardCheck from "./assets/clipboard-check.svg";
import clipboard from "./assets/clipboard.svg";
import { hashbang as custombangs } from "./custom";
import { BANG_UPDATE_TIME } from "./ddbang-meta";

function noSearchDefaultPageRender() {
	if (import.meta.env.DEV) {
		document.title = `🚧 ${document.title}`;
	}
	const app = document.querySelector<HTMLDivElement>("#app");
	if (!app) return;
	app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div class="content-container">
        <h1>Und*ck</h1>
        <p>DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables <a href="https://duckduckgo.com/bang.html" target="_blank">all of DuckDuckGo's bangs.</a></p>
        <div class="url-container"> 
          <input 
            type="text" 
            class="url-input"
            value="${document.location.origin}?q=%s"
            readonly 
          />
          <button class="copy-button">
            <img src=${clipboard} alt="Copy" />
          </button>
        </div>
      </div>
      <footer class="footer">
        <a href="https://duckduckgo.com/bang.html" target="_blank" title="updated at: ${BANG_UPDATE_TIME}">
          bangs
        </a>
        •
        <a href="https://x.com/achmadmahardi" target="_blank">maman</a>
        •
        <a href="https://github.com/maman/search" target="_blank">github</a>
      </footer>
    </div>
  `;

	const copyButton = app.querySelector<HTMLButtonElement>(".copy-button");
	const copyIcon = copyButton?.querySelector("img");
	const urlInput = app?.querySelector<HTMLInputElement>(".url-input");

	copyButton?.addEventListener("click", async () => {
		await navigator.clipboard.writeText(urlInput?.value ?? "");
		if (copyIcon) copyIcon.src = clipboardCheck;

		setTimeout(() => {
			if (copyIcon) copyIcon.src = clipboard;
		}, 2000);
	});
}

async function getBangredirectUrl() {
	const url = new URL(window.location.href);
	const query = url.searchParams.get("q")?.trim() ?? "";
	if (!query) {
		noSearchDefaultPageRender();
		return null;
	}

	const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
	const { hashbang } = await import("./ddbang");
	const defaultBang = hashbang[LS_DEFAULT_BANG];

	const match = query.match(/!(\S+)/i);

	const bangCandidate = match?.[1]?.toLowerCase();
	const selectedBang =
		custombangs[bangCandidate ?? LS_DEFAULT_BANG] ??
		hashbang[bangCandidate ?? LS_DEFAULT_BANG] ??
		defaultBang;

	// Remove the first bang from the query
	const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

	// If the query is just `!gh`, use `github.com` instead of `github.com/search?q=`
	if (cleanQuery === "")
		return selectedBang ? `https://${selectedBang.d}` : null;

	// Format of the url is:
	// https://www.google.com/search?q={{{s}}}
	const searchUrl = selectedBang?.u.replace(
		"{{{s}}}",
		// Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
		encodeURIComponent(cleanQuery).replace(/%2F/g, "/"),
	);
	if (!searchUrl) return null;

	return searchUrl;
}

async function doRedirect() {
	const searchUrl = await getBangredirectUrl();
	if (!searchUrl) return;
	window.location.replace(searchUrl);
}

doRedirect();
