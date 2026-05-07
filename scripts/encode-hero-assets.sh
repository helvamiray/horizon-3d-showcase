#!/usr/bin/env bash
# Regenerates compressed hero WebM + poster WebP (requires ffmpeg in PATH).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FFMPEG="${FFMPEG:-ffmpeg}"
cd "$ROOT"

mkdir -p public/img/posters

$FFMPEG -y -ss 00:00:00.5 -i public/videos/vega_tanitim.mp4 -vframes 1 -q:v 85 \
  public/img/posters/vega-hero.webp

$FFMPEG -y -ss 00:00:00.5 -i public/videos/tanitim.mp4 -vframes 1 -q:v 85 \
  public/img/posters/tanitim-about.webp

$FFMPEG -y -i public/videos/vega_tanitim.mp4 -an -c:v libvpx-vp9 -crf 32 -b:v 0 \
  -row-mt 1 -deadline good -cpu-used 2 public/videos/vega_tanitim.webm

echo "Done: vega_tanitim.webm, vega-hero.webp, tanitim-about.webp"
