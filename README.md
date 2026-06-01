# thirdcookie-portal-theme

Public theme stylesheet for the **Third Cookie** Moxie agency portal. This repo exists to enable [jsDelivr](https://www.jsdelivr.com/) CDN delivery of `portal-theme.css` into Moxie. The companion private repo [`thirdcookie-library`](https://github.com/brittany-thirdcookie/thirdcookie-library) holds the rest of Third Cookie's snippets and patterns.

## Why this repo is public

Moxie loads external CSS via `<link>` tags. The simplest hosting path is jsDelivr, which only serves public GitHub repos. We isolate the public-by-necessity portal theme here so the rest of `thirdcookie-library` can stay private.

## Files

- **`portal-theme.css`** — the agency-brand stylesheet served via jsDelivr. **Edit this file.**
- **`portal-custom-code.js`** — the loader pasted into Moxie's Customization → Custom code. Canonical copy lives here; Moxie holds the live instance. Keep them in sync.
- **`tools/capture-moxie-classes.js`** — DevTools utility. Paste into the console on a portal page to capture class names for new component rules.

## How to update the theme

1. Branch off `main`: `theme-<chunk>` (e.g., `theme-sidenav`, `theme-statcards`)
2. Edit `portal-theme.css` in VS Code
3. **Preview the branch in Moxie** — temporarily change the loader URL in `portal-custom-code.js` (the live copy in Moxie's customization field) to:
   ```
   https://cdn.jsdelivr.net/gh/brittany-thirdcookie/thirdcookie-portal-theme@<branch-name>/portal-theme.css
   ```
   Reload the portal and confirm.
4. PR → squash-merge to `main` (standard Third Cookie git workflow)
5. Swap the loader URL back to `@main` (or leave it permanently on `@main` and use the cache controls below)

## jsDelivr cache control

`@main` caches ~12 hours. To bust:

- **Purge:** https://www.jsdelivr.com/tools/purge
- **Cache-bust query:** append `?v=YYYYMMDD-N` to the URL and bump the value
- **Pin to a commit hash** during heavy iteration: `@<sha>` instead of `@main`

## Moxie install (one-time)

Paste the contents of `portal-custom-code.js` into **Moxie → Customization → Custom code**. The loader injects the fonts and the theme stylesheet on every portal page.

## Related

- Private library: [`thirdcookie-library`](https://github.com/brittany-thirdcookie/thirdcookie-library)

---

Built and maintained by [Brittany](https://github.com/brittany-thirdcookie) at [Third Cookie LLC](https://thirdcookie.com).
