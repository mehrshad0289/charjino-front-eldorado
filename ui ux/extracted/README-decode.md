# Decoding the .make captures

The `.make` files (Figma html.to.design captures) only contain 1920px desktop
snapshots — despite "390w" in the filenames. Verified 2026-11-03 by decoding
all four captures: each has exactly two document snapshots (duplicated light
theme), both `"width":"1920px"`.

- `fig_reassemble.py` — decoder: zip -> canvas.fig -> raw-deflate streams ->
  printable runs -> full TSX snapshots (`extracted/snapshots/`).
- Mobile design reference: live eldorado.gg (only surviving source; the
  captured /efootball-accounts page 404s live, but
  `/efootball-accounts/a/183-1-0` works — see sitemap).
