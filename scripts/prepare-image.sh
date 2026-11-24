#!/usr/bin/env bash
#
# Turn a raw AI-generated still into web assets in public/media/.
#
#   scripts/prepare-image.sh <slot-name> <input-file> [--width N] [--quality Q]
#
# Examples:
#   scripts/prepare-image.sh mandapam-wide  ~/Downloads/Venue_And_Map.png
#   scripts/prepare-image.sh tradition-1    ~/Downloads/Jeelakarra.png --width 600
#
# Writes <slot>.avif and <slot>.webp. The site prefers AVIF and falls back to
# WebP automatically, so both are worth having. The source PNGs out of an image
# model are typically 2-3 MB each; these land around 100-200 KB.
#
# Requires: cwebp and avifenc  ->  brew install webp libavif

set -euo pipefail

die() { printf 'error: %s\n' "$1" >&2; exit 1; }

for t in cwebp avifenc sips; do
  command -v "$t" >/dev/null || die "$t not found. Install with: brew install webp libavif"
done

[ $# -ge 2 ] || die "usage: $(basename "$0") <slot-name> <input-file> [--width N] [--quality Q]"

SLOT=$1
INPUT=$2
shift 2

[ -f "$INPUT" ] || die "no such file: $INPUT"

WIDTH=1400
QUALITY=82

while [ $# -gt 0 ]; do
  case $1 in
    --width)   shift; [ $# -gt 0 ] || die "--width needs a value"; WIDTH=$1 ;;
    --quality) shift; [ $# -gt 0 ] || die "--quality needs a value"; QUALITY=$1 ;;
    *)         die "unknown option: $1" ;;
  esac
  shift
done

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
OUT="$ROOT/public/media"
SRC="$ROOT/assets-src"
mkdir -p "$OUT" "$SRC"

# Keep the full-resolution original as a master, outside the served folder.
MASTER="$SRC/$(basename "$INPUT")"
[ "$(cd "$(dirname "$INPUT")" && pwd)/$(basename "$INPUT")" = "$MASTER" ] || cp "$INPUT" "$MASTER"

# Never upscale: an enlarged source just costs bytes with no gain in detail.
SRC_W=$(sips -g pixelWidth "$INPUT" | awk '/pixelWidth/{print $2}')
if [ -n "$SRC_W" ] && [ "$SRC_W" -lt "$WIDTH" ]; then
  printf 'source is %spx wide; keeping that instead of upscaling to %s\n' "$SRC_W" "$WIDTH"
  WIDTH=$SRC_W
fi

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

sips --resampleWidth "$WIDTH" "$INPUT" --out "$TMP/$SLOT.png" >/dev/null
cwebp -quiet -q "$QUALITY" -m 6 "$TMP/$SLOT.png" -o "$OUT/$SLOT.webp"
avifenc -q $((QUALITY - 20)) -s 4 --jobs all "$TMP/$SLOT.png" "$OUT/$SLOT.avif" >/dev/null

printf '\nWrote to public/media/:\n'
for f in "$SLOT.avif" "$SLOT.webp"; do
  printf '  %-30s %s\n' "$f" "$(du -h "$OUT/$f" | cut -f1)"
done
printf 'Master kept at assets-src/%s\n' "$(basename "$MASTER")"
printf 'Reload the site — the slot activates on its own.\n'
