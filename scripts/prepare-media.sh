#!/usr/bin/env bash
#
# Turn a raw AI-generated clip into web assets in public/media/.
#
#   scripts/prepare-media.sh <slot-name> <input-file> [--loop] [--width N] [--poster]
#
# Examples:
#   scripts/prepare-media.sh hero-muhurtham ~/Downloads/kling-out.mp4 --loop --poster
#   scripts/prepare-media.sh diya-loop ~/Downloads/flame.mp4 --loop --width 720
#
# Produces <slot>.webm (VP9) and <slot>.mp4 (H.264 fallback), audio stripped.
# --loop builds a seamless palindrome: forward then reversed, so the last frame
# matches the first. Image-to-video models never loop on their own.
# --poster writes <slot>-poster.jpg from the first frame (the hero needs this;
# it is what reduced-motion visitors see instead of the video).
#
# Requires ffmpeg:  brew install ffmpeg

set -euo pipefail

die() { printf 'error: %s\n' "$1" >&2; exit 1; }

command -v ffmpeg >/dev/null || die "ffmpeg not found. Install it with: brew install ffmpeg"

[ $# -ge 2 ] || die "usage: $(basename "$0") <slot-name> <input-file> [--loop] [--width N] [--poster]"

SLOT=$1
INPUT=$2
shift 2

[ -f "$INPUT" ] || die "no such file: $INPUT"

LOOP=0
POSTER=0
WIDTH=1920

while [ $# -gt 0 ]; do
  case $1 in
    --loop)   LOOP=1 ;;
    --poster) POSTER=1 ;;
    --width)  shift; [ $# -gt 0 ] || die "--width needs a value"; WIDTH=$1 ;;
    *)        die "unknown option: $1" ;;
  esac
  shift
done

# Resolve public/media relative to this script, so it works from any cwd.
ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
OUT="$ROOT/public/media"
mkdir -p "$OUT"

# scale to WIDTH, keep aspect, force even height (required by H.264)
SCALE="scale=${WIDTH}:-2:flags=lanczos"

if [ "$LOOP" -eq 1 ]; then
  # Drop the first frame of the reversed pass (= the forward pass's last frame)
  # or it shows twice and reads as a stutter at the turn. setpts is required:
  # trim leaves the original timestamps, and concat needs them to start at 0.
  # Note: `reverse` buffers the whole clip in RAM — keep source clips short.
  FILTER="[0:v]${SCALE},split[a][b];[b]reverse,trim=start_frame=1,setpts=PTS-STARTPTS[r];[a][r]concat=n=2:v=1[v]"
  MAP=(-map "[v]")
  printf 'Building a seamless palindrome loop (forward + reversed).\n'
else
  FILTER="[0:v]${SCALE}[v]"
  MAP=(-map "[v]")
fi

printf 'Encoding %s at %spx wide...\n' "$SLOT" "$WIDTH"

# VP9 / WebM — what the site prefers
ffmpeg -hide_banner -loglevel error -y -i "$INPUT" \
  -filter_complex "$FILTER" "${MAP[@]}" \
  -an -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -pix_fmt yuv420p \
  "$OUT/$SLOT.webm"

# H.264 / MP4 — Safari and older browsers
ffmpeg -hide_banner -loglevel error -y -i "$INPUT" \
  -filter_complex "$FILTER" "${MAP[@]}" \
  -an -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart \
  "$OUT/$SLOT.mp4"

if [ "$POSTER" -eq 1 ]; then
  ffmpeg -hide_banner -loglevel error -y -i "$INPUT" \
    -vf "$SCALE" -frames:v 1 -q:v 3 "$OUT/$SLOT-poster.jpg"
fi

printf '\nWrote to public/media/:\n'
for f in "$SLOT.webm" "$SLOT.mp4" "$SLOT-poster.jpg"; do
  [ -f "$OUT/$f" ] && printf '  %-28s %s\n' "$f" "$(du -h "$OUT/$f" | cut -f1)"
done

printf '\nBudget: hero video <= 4MB, diya loop <= 600KB.\n'
printf 'Too big? Re-run with a higher -crf (edit this script) or a smaller --width.\n'
printf 'Then just reload the site — the slot activates on its own.\n'
