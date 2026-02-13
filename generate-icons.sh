#!/bin/bash
# Generate PNG icons from SVG favicon
# Usage: ./generate-icons.sh
# Requires: librsvg2-bin (sudo apt install librsvg2-bin)

ICONS_DIR="public/assets/icons"
FAVICON="$ICONS_DIR/favicon.svg"

if ! command -v rsvg-convert &> /dev/null; then
    echo "rsvg-convert not found. Installing..."
    sudo apt update && sudo apt install -y librsvg2-bin
fi

echo "Generating PNG icons from $FAVICON..."

rsvg-convert "$FAVICON" -w 32 -h 32 -o "$ICONS_DIR/favicon-32.png"
rsvg-convert "$FAVICON" -w 192 -h 192 -o "$ICONS_DIR/icon-192.png"
rsvg-convert "$FAVICON" -w 512 -h 512 -o "$ICONS_DIR/icon-512.png"
rsvg-convert "$FAVICON" -w 180 -h 180 -o "$ICONS_DIR/apple-touch-icon.png"

echo "Done! Generated:"
ls -la "$ICONS_DIR"/*.png
