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
   ab-megadot9 via the Adobe Typekit JS loader) and loads portal-theme.css +
   icons.css from this repo via jsDelivr CDN. Includes a
   LIVE_PREVIEW toggle that resolves the branch's latest commit
   SHA via the GitHub API and loads that immutable commit, so
   pushes appear instantly during iteration (bypasses jsDelivr's
   branch cache).
   Also swaps the left-nav glyphs: maps each nav row (by visible
   label) to a pixel icon from icons.css, hides Moxie's original
   glyph, and re-applies on SPA re-renders (timed passes + a
   MutationObserver; the swap is idempotent).

   Dependencies:
   - portal-theme.css (this repo, main branch)
   - icons.css (this repo, main branch)
   - jsDelivr CDN

   Accessibility:
   - Nav icons are injected as decorative <i> with aria-hidden,
     before the existing text label — meaning still comes from the
     label, not the glyph.
   - Otherwise loader injects <link> tags only; broader concerns
     live in portal-theme.css.

   Last Updated: 2026-11-02
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

  // 1) Brand fonts — Barlow (body, Google Fonts) + Stratos & Megadot (Adobe kit).
  link('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
  // Adobe kit via the JS embed, NOT the .css form. The kit's .css form is
  // domain-locked and 412s on hub.thirdcookie.com, so Stratos/Megadot silently
  // fall back to Barlow. The JS loader isn't domain-locked and works here
  // (same embed the Portal Preview uses).
  (function (d) {
    var c = { kitId: 'wte8zqm', scriptTimeout: 3000, async: true },
        h = d.documentElement,
        t = setTimeout(function () { h.className = h.className.replace(/\bwf-loading\b/g, '') + ' wf-inactive'; }, c.scriptTimeout),
        tk = d.createElement('script'), f = false, s = d.getElementsByTagName('script')[0], a;
    h.className += ' wf-loading';
    tk.src = 'https://use.typekit.net/' + c.kitId + '.js';
    tk.async = true;
    tk.onload = tk.onreadystatechange = function () {
      a = this.readyState;
      if (f || a && a != 'complete' && a != 'loaded') return;
      f = true; clearTimeout(t);
      try { Typekit.load(c); } catch (e) {}
    };
    s.parentNode.insertBefore(tk, s);
  })(document);

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
/* ---- 3) left-nav pixel icons ------------------------------------------
     Map each nav row (matched by its visible label) to a glyph from icons.css.
     The portal is a SPA, so the nav can re-render — we run a few times AND
     observe the DOM, and the swap is idempotent (guards on an injected .tci).

     NOTE: if you ALSO rename nav labels (the Moxie article's trick), do the
     icon swap on the ORIGINAL names first, or key this map to the new text. */
  var NAV_ICONS = {
    'Home':       'home',
    'Invoices':   'invoice-text',
    'Projects':   'folders',
    'Agreements':  'briefcase-check',
    'Files':       'folder',
    'Meetings':    'calendar-today',
    'Forms':       'form',
    'Requests':    'notebook-pen',
    'Time worked': 'clock'
  };

  function applyNavIcons(){
    var labels = document.querySelectorAll('.nav-label');
    for (var i = 0; i < labels.length; i++) {
      var label = labels[i];
      var name  = NAV_ICONS[(label.innerText || label.textContent || '').trim()];
      if (!name) continue;
      var row = label.closest('.nav-link-expanded, .nav-link, a, li') || label.parentElement;
      if (!row || row.querySelector('.tci')) continue;            // already done
      var old = row.querySelector('.v-icon, .material-symbols-outlined, [class*="material-symbols"], i, svg');
      // classList works on BOTH HTML and SVG elements; old.className.indexOf throws
      // on an <svg> (its className is an SVGAnimatedString, not a string) — which
      // crashed applyNavIcons on every pass because Moxie's nav glyphs are SVGs.
      if (old && !old.classList.contains('tci')) old.style.display = 'none';   // hide Moxie's glyph
      var ic = document.createElement('i');
      ic.className = 'tci tci-' + name;
      ic.setAttribute('aria-hidden', 'true');
      label.parentNode.insertBefore(ic, label);                   // pixel icon before the label
    }
  }

  [100, 500, 1500].forEach(function (t){ setTimeout(applyNavIcons, t); });

  var scheduled = false;
  function schedule(){
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function (){ scheduled = false; applyNavIcons(); });
  }
  if (window.MutationObserver) {
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  }
})();
