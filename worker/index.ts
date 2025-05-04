export default {
	async fetch(request: Request, env: Env) {
		const url = new URL(request.url);
		const baseUrl = url.origin;

		// Handle opensearch request
		if (url.pathname === "/opensearch.xml") {
			return new Response(
				`<?xml version="1.0" encoding="utf-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
<ShortName>Und*ck</ShortName>
<Description>Search Und*ck</Description>
<InputEncoding>UTF-8</InputEncoding>
<LongName>Und*ck Search</LongName>
<Image height="16" width="16">data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAMMOAADDDgAAEAAAABAAAAAAAAAAQEBAAICAgAD///8Av7+/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAACMQAAAAARACMgAAAAIzNCMgAAAAI0IUNAAAAAA0AAAzAAAAATEAACMAAAABMgAAExAAAAAyAABDAAAAACNBIjEAAAAAAjMzIAAAAAAAARAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</Image><Url type="text/html" method="get" template="${baseUrl}/?q={searchTerms}"/><Url type="application/x-suggestions+json" template="${baseUrl}/ac/?q={searchTerms}&amp;type=list"/></OpenSearchDescription>`,
				{
					headers: { "Content-Type": "application/opensearchdescription+xml" },
				},
			);
		}

		// Handle autocomplete request
		if (url.pathname.startsWith("/ac/")) {
			const response = await fetch(
				new Request(`https://duckduckgo.com/${url.pathname}${url.search}`),
			);
			const body = await response.text();
			const headers = new Headers(response.headers);
			headers.delete("server");
			headers.delete("content-security-policy");
			headers.delete("x-duckduckgo-privacy-random-ac");
			return new Response(body, {
				headers,
			});
		}

		// Handle static assets request
		return env.ASSETS.fetch(request);
	},
};
