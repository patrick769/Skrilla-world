#!/usr/bin/env bash
# Rebuilds the five self-contained Big Skrilla World pages.
#
# Each root *.html is BOTH the Vite template (with ./src/main.tsx) during
# development and the final single-file build after deployment — so this
# script always regenerates the templates from src/ first. Never run
# `vite build` against the root pages directly after deploying, or the
# previous build gets re-processed as source.
#
# Usage:  ./build-pages.sh
set -euo pipefail
cd "$(dirname "$0")"

PAGES=("index:home:Official Home" "music:music:Music" "videos:videos:Videos" "tour:tour:World Tour" "merch:merch:Official Merch")

write_template() {
  local file="$1" page="$2" title="$3"
  cat > "$file.html" <<EOF
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#080706" />
    <meta name="description" content="Big Skrilla World — music, videos, tour dates and official merchandise." />
    <title>BIG SKRILLA // $title</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Jost:wght@200;300;400;500&display=swap" rel="stylesheet">
  </head>
  <body data-page="$page" class="bg-[#080706] text-[#f2ede3] overflow-x-hidden">
    <div id="root"></div>
    <script type="module" src="./src/main.tsx"></script>
  </body>
</html>
EOF
}

echo "→ Writing templates"
for entry in "${PAGES[@]}"; do
  IFS=':' read -r file page title <<< "$entry"
  write_template "$file" "$page" "$title"
done

echo "→ Building single-file pages"
rm -rf offline-dist
for entry in "${PAGES[@]}"; do
  IFS=':' read -r file _ _ <<< "$entry"
  OFFLINE_PAGE="$file.html" npx vite build -c vite.offline.config.ts >/dev/null
  echo "   ✓ $file.html"
done

echo "→ Deploying to repo root"
cp offline-dist/*.html .

echo "Done — root pages rebuilt from src/."
