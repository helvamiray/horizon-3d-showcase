#!/usr/bin/env bash
# Hero posters (`public/img/posters/*.webp`) are maintained as committed assets.
# Bundled MP4/WebM under `public/videos/` was removed from the app — no ffmpeg pipeline here.
set -euo pipefail
echo "media:encode-hero — posters already in public/img/posters/ (no bundled hero video)."
exit 0
