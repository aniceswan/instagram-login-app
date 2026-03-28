#!/bin/bash

echo "🗂️  Project Structure Overview"
echo "=============================="
echo ""
echo "📦 Complete Project Structure:"
echo ""

tree -a -I 'node_modules|.git|dist|build' -L 3 2>/dev/null || find . -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' -not -path '*/build/*' | head -50

echo ""
echo "📊 File Count:"
find . -type f -not -path '*/node_modules/*' -not -path '*/.git/*' | wc -l | xargs echo "Total files:"
echo ""
echo "💾 Size:"
du -sh . 2>/dev/null
