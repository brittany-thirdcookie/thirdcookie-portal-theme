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
   from this repo via jsDelivr CDN.

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
  //    @main serves the latest commit on main. jsDelivr caches ~12h.
  //    Instant refresh options:
  //      • jsDelivr purge tool: https://www.jsdelivr.com/tools/purge
  //      • Cache-bust query: append ?v=YYYYMMDD-N and bump the value
  //      • Pin to a commit hash during heavy iteration: @<sha> instead of @main
  //    Branch preview: replace @main with @<branch-name> (e.g. @theme-sidenav)
  link('https://cdn.jsdelivr.net/gh/brittany-thirdcookie/thirdcookie-portal-theme@main/portal-theme.css');
})();
