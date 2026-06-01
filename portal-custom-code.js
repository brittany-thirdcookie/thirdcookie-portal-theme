/* =============================================
   THIRD COOKIE — CODE LIBRARY
   =============================================
   File:         portal-custom-code.js
   Type:         Loader (paste into Moxie)

   Origin:       Hand-authored for Moxie portal customization
   Site/Project: Third Cookie agency portal (Moxie)
   Location:     Paste into Moxie → Customization → Custom code.
                 This repo holds the canonical copy; Moxie holds
                 the live instance. Keep them in sync.

   Migrated:     June 2026
   Status:       Active

   Description:
   Injects brand fonts (Barlow via Google Fonts, Stratos +
   ab-megadot9 via Adobe Typekit) and loads portal-theme.css
   from this repo via jsDelivr CDN. Includes a LIVE_PREVIEW
   toggle that cache-busts the theme URL for instant updates
   during iteration.

   Dependencies:
   - portal-theme.css (this repo, main branch)
   - jsDelivr CDN

   Accessibility:
   - Loader injects <link> tags only; no behavioral changes here.
   - Accessibility concerns live in portal-theme.css.

   Last Updated: 2026-06-01
   Updated By:   Brittany
   ============================================= */
(function () {
  var head = document.head || document.documentElement;

  function link(href) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    head.appendChild(l);
  }

  // 1) Brand fonts — Barlow (body) + Stratos & Megadot (Adobe kit)
  link('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
  link('https://use.typekit.net/wte8zqm.css');

  // 2) Hosted theme stylesheet.
  //    @main caches ~12h at jsDelivr's edge AND up to 7 days in the browser,
  //    so without a buster a fresh push can take hours/days to appear.
  //
  //    LIVE_PREVIEW=true appends ?v=<timestamp> on every load → each request
  //    is a unique URL, so jsDelivr re-fetches the latest commit and the
  //    browser can't serve a stale copy. Effectively instant on push.
  //    Trade-off: the theme is no longer cached. Set LIVE_PREVIEW=false once
  //    iteration settles to restore ~12h caching for production.
  //
  //    Manual levers: jsDelivr purge tool (https://www.jsdelivr.com/tools/purge)
  //    or pin to a commit @<sha>. Branch preview: swap @main for @<branch-name>
  //    (e.g. @theme-sidenav) — the buster works there too.
  var LIVE_PREVIEW = true;
  var theme = 'https://cdn.jsdelivr.net/gh/brittany-thirdcookie/thirdcookie-portal-theme@main/portal-theme.css';
  link(LIVE_PREVIEW ? theme + '?v=' + Date.now() : theme);
})();
