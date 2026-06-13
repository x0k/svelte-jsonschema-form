#!/usr/bin/env bash
set -euo pipefail

css_file="${1:-dist/styles.css}"
min_vars="${2:-}"

if [ ! -f "$css_file" ]; then
  echo "ERROR: CSS file not found: $css_file"
  exit 1
fi

file_size=$(wc -c < "$css_file")
if [ "$file_size" -lt 100 ]; then
  echo "ERROR: CSS file too small ($file_size bytes): $css_file"
  exit 1
fi

content=$(cat "$css_file")

if echo "$content" | grep -q ':root' 2>/dev/null; then
  if ! echo "$content" | grep -q ':host' 2>/dev/null; then
    echo "WARNING: CSS defines :root but not :host — variables may not apply inside Shadow DOM"
  fi
fi

if [ -n "$min_vars" ]; then
  IFS=',' read -ra vars <<< "$min_vars"
  for var in "${vars[@]}"; do
    if ! echo "$content" | grep -q -- "--$var" 2>/dev/null; then
      echo "ERROR: Required CSS variable --$var not found in $css_file"
      exit 1
    fi
  done
fi

echo "OK: $css_file ($(numfmt --to=iec-i $file_size) — $(wc -l < "$css_file") lines)"
