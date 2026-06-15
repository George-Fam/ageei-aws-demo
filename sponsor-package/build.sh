#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHROME="${CHROME:-chromium}"

pdf() {
    local name="$1"
    "$CHROME" \
        --headless \
        --disable-gpu \
        --no-sandbox \
        --no-pdf-header-footer \
        --run-all-compositor-stages-before-draw \
        --virtual-time-budget=10000 \
        --print-to-pdf="$DIR/build/$name.pdf" \
        "file://$DIR/$name.html" 2>/dev/null
    echo "→ $name.pdf"
}

mkdir -p $DIR/build
pdf package-en
pdf package-fr
