# Unduck

DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables all of DuckDuckGo's bangs to work, but much faster.

## How is it that much faster?

DuckDuckGo does their redirects server side. Their DNS is...not always great. Result is that it often takes ages.

I solved this by doing all of the work client side. Once you've went once, the JS is all cache'd and will never need to be downloaded again. Your device does the redirects, not me.

## Enhancements in this Fork

This version includes several key improvements over the original project:

1. Pre-fetches DuckDuckGo's bangs during build process
2. Implements a hashmap for more efficient bang indexing (based on work from https://github.com/t3dotgg/unduck/pull/65)
3. Provides complete opensearch & autocomplete integration
4. Supports custom bang definitions (configurable in src/custom.ts)
5. Deploys via Cloudflare Workers