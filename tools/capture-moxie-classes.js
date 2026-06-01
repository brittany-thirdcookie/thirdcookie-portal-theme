/* =============================================
   THIRD COOKIE — CODE LIBRARY
   =============================================
   File:         tools/capture-moxie-classes.js
   Type:         Utility (DevTools paste)

   Origin:       Hand-authored for Moxie portal customization
   Site/Project: Third Cookie agency portal (Moxie)
   Location:     Paste into the browser DevTools console while
                 on a Moxie portal page. Output is copied to
                 the clipboard.

   Migrated:     June 2026
   Status:       Active

   Description:
   Walks every element under <body>, counts how many times
   each class appears, and copies a sorted (frequency desc)
   tab-separated list to the clipboard. Use the output to
   identify the real Moxie class names that replace the
   .PLACEHOLDER-* selectors in portal-theme.css.

   Dependencies:
   - Browser DevTools `copy()` global (Chrome / Firefox /
     Edge / Safari DevTools).

   Accessibility:
   - n/a — developer utility, runs in DevTools only.

   Last Updated: 2026-06-01
   Updated By:   Brittany
   ============================================= */
(() => {
  const m = {};
  document.querySelectorAll('body *').forEach(e => {
    if (typeof e.className === 'string')
      e.className.trim().split(/\s+/).forEach(c => c && (m[c] = (m[c]||0)+1));
  });
  const out = Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([c,n])=>`${n}\t.${c}`).join('\n');
  copy(out);
  console.log('Copied ' + Object.keys(m).length + ' classes');
})();
