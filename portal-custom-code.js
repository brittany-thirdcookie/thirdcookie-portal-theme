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
   ab-megadot9 via Adobe Typekit) and loads portal-theme.css +
   icons.css from this repo via jsDelivr CDN. Includes a
   LIVE_PREVIEW toggle that resolves the branch's latest commit
   SHA via the GitHub API and loads that immutable commit, so
   pushes appear instantly during iteration (bypasses jsDelivr's
   branch cache).

   Dependencies:
   - portal-theme.css (this repo, main branch)
   - icons.css (this repo, main branch)
   - jsDelivr CDN

   Accessibility:
   - Loader injects <link> tags only; no behavioral changes here.
   - Accessibility concerns live in portal-theme.css.

   Last Updated: 2026-06-02
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

  // 2) Hosted stylesheets (theme + icons).
  //    jsDelivr caches the @main branch->commit resolution for ~12h, so loading
  //    @main can serve stale CSS for hours after a push. A ?v= query busts the
  //    file cache but NOT that branch lookup — so it can't fix this on its own.
  //
  //    LIVE_PREVIEW=true resolves the branch's latest commit SHA from the GitHub
  //    API and loads that immutable commit from jsDelivr. A SHA is never cached
  //    stale, so the newest push appears instantly. Falls back to @<BRANCH> if
  //    the API is unreachable / rate-limited (60 req/hr per IP, unauth).
  //    Set LIVE_PREVIEW=false for production: loads @<BRANCH> directly — one
  //    request, no API dependency, normal ~12h caching.
  var REPO   = 'brittany-thirdcookie/thirdcookie-portal-theme';
  var BRANCH = 'main';      // set to a feature branch name to preview that branch
  var LIVE_PREVIEW = true;  // true = instant (SHA-resolved); false = cached @<BRANCH>
  var FILES  = ['portal-theme.css', 'icons.css'];  // stylesheets served from this repo
  function cdnAt(ref, file){
    return 'https://cdn.jsdelivr.net/gh/' + REPO + '@' + ref + '/' + file;
  }
  function loadAll(ref){ FILES.forEach(function (f){ link(cdnAt(ref, f)); }); }
  if (LIVE_PREVIEW) {
    fetch('https://api.github.com/repos/' + REPO + '/commits/' + BRANCH,
          { headers: { Accept: 'application/vnd.github.sha' } })
      .then(function (r){ return r.ok ? r.text() : Promise.reject(r.status); })
      .then(function (sha){ loadAll(sha.trim()); })
      .catch(function (){ loadAll(BRANCH); });
  } else {
    loadAll(BRANCH);
  }
})();
