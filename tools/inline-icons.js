/* =============================================
   THIRD COOKIE — CODE LIBRARY
   =============================================
   File:         tools/inline-icons.js
   Type:         Utility (build script)

   Origin:       Hand-authored for Moxie portal customization
   Site/Project: Third Cookie agency portal (Moxie)
   Location:     Run locally with Node:  node tools/inline-icons.js
                 Reads the private/local master icon set from ./icons/
                 (gitignored — never committed here) and regenerates
                 icons.css with each used icon inlined as a data URI.

   Migrated:     June 2026
   Status:       Active

   Description:
   Generates icons.css from the USED subset of the licensed Pixelarticons
   Pro set. Each glyph is inlined as a data:image/svg+xml mask, so this
   public repo ships "a stylesheet that uses N glyphs" (permitted use) and
   never redistributes the raw icon files as-is (which the license forbids).
   To add an icon: drop its .svg in ./icons/, add the name to NAMES below,
   and re-run this script.

   Dependencies:
   - Node (fs); the local ./icons/ master set (gitignored)

   Accessibility:
   - n/a — developer build utility.

   Last Updated: 2026-06-13
   Updated By:   Brittany
   ============================================= */
'use strict';
const fs = require('fs');
const path = require('path');

// --- the USED subset. Add a name here (and drop ./icons/<name>.svg) to ship it.
const NAMES = [
  'invoice-text',
  'home',
  'folder',
  'briefcase-check',
  'folders',
  'calendar-today',
  'form',
  'external-link',
  'app-mac-plus',
  'notebook-pen',
  'clock',
  'mail',
  'phone',
];

const LAST_UPDATED = '2026-06-13';
const ICON_DIR = path.join(__dirname, '..', 'icons');
const OUT = path.join(__dirname, '..', 'icons.css');

// SVG -> compact data URI suitable for url("...") in CSS.
function dataUri(svg) {
  const compact = svg.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
  return 'data:image/svg+xml,' + encodeURIComponent(compact);
}

const glyphs = NAMES.map((name) => {
  const file = path.join(ICON_DIR, name + '.svg');
  if (!fs.existsSync(file)) {
    console.error('MISSING: icons/' + name + '.svg');
    process.exit(1);
  }
  return { name: name, url: 'url("' + dataUri(fs.readFileSync(file, 'utf8')) + '")' };
});

// Two exposures per glyph, from one data URI:
//  • --ti-<name> on :root — a mask token usable anywhere, incl. ::before/
//    ::after pseudo-elements that can't carry a .tci-<name> class.
//  • .tci-<name> — feeds --src for the .tci base class (left-nav icons),
//    referencing the root var so the URI is defined exactly once.
const vars    = ':root{\n' + glyphs.map((g) => '  --ti-' + g.name + ':' + g.url + ';').join('\n') + '\n}';
const classes = glyphs.map((g) => '.tci-' + g.name + '{--src:var(--ti-' + g.name + ');}').join('\n');
const map     = vars + '\n\n' + classes;

const css = `/* =============================================
   THIRD COOKIE — CODE LIBRARY
   =============================================
   File:         icons.css
   Type:         Stylesheet (icon layer)

   Origin:       Hand-authored for Moxie portal customization
   Site/Project: Third Cookie agency portal (Moxie)
   Location:     Loaded via Moxie → Customization → Custom code
                 (see portal-custom-code.js). Served from this repo's
                 main branch via jsDelivr CDN.

   Migrated:     June 2026
   Status:       Active — iterating

   Description:
   Self-hosted pixel-icon layer. Each icon is the USED subset of the
   licensed Pixelarticons Pro set, inlined as a data-URI mask — so this
   public repo never redistributes the raw icon files as-is (license:
   files can't be redistributed; embedding in product CSS is permitted).
   GENERATED FILE — do not hand-edit; edit tools/inline-icons.js and re-run.

   Dependencies:
   - None at runtime (data-URI masks; no network requests for the glyphs)

   Accessibility:
   - Icons are decorative masks; give adjacent text or an aria-label so
     meaning isn't color/shape-only. currentColor tinting follows text.

   Last Updated: ${LAST_UPDATED}
   Updated By:   Brittany
   ============================================= */

/* ---- base: a recolorable, pixel-crisp icon ------------------------------
   Single-color SVGs are used as a MASK, so the icon takes its color from
   the surrounding text (currentColor). Scale via font-size or width/height. */
.tci{
  display:inline-block;
  width:1em; height:1em;            /* scales with font-size by default      */
  flex:0 0 auto;
  background-color:currentColor;    /* icon color = text color               */
  -webkit-mask-image:var(--src);    mask-image:var(--src);
  -webkit-mask-repeat:no-repeat;    mask-repeat:no-repeat;
  -webkit-mask-position:center;     mask-position:center;
  -webkit-mask-size:contain;        mask-size:contain;
  image-rendering:pixelated;        /* keep pixel art crisp at any size       */
  vertical-align:-.125em;           /* optical baseline next to text          */
}

/* ---- size helpers (optional) -------------------------------------------- */
.tci-sm{ width:16px; height:16px; }
.tci-md{ width:20px; height:20px; }
.tci-lg{ width:24px; height:24px; }

/* ---- color helpers (optional) — work because icons inherit color -------- */
.tci-persimmon{ color:var(--tc-persimmon,#e4572e); }
.tci-charcoal { color:var(--tc-ink,#242323); }

/* ---- ICON MAP (generated) ----------------------------------------------
   Each glyph is exposed two ways from a single inlined data URI:
   • --ti-<name> on :root — a url() mask token for use ANYWHERE, including
     ::before/::after pseudo-elements that can't take a .tci-<name> class
     (portal-theme.css's .tcwp welcome page masks its icons this way).
   • .tci-<name> — sets --src for the .tci base class (the left-nav icons
     injected by portal-custom-code.js). */
${map}
`;

fs.writeFileSync(OUT, css);
console.log('Wrote icons.css with ' + NAMES.length + ' icons (' + (css.length) + ' bytes).');
