#!/bin/bash
echo "=== Checking workflow syntax ==="
for file in .github/workflows/*.yml; do
  echo "Checking $file"
  cat "$file" | grep -E "name:|on:|jobs:"
done
