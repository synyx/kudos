#!/bin/bash
set -e

# Usage: ./update-version.sh [major|minor|patch]

if [ -z "$1" ]; then
  echo "Usage: ./update-version.sh [major|minor|patch]"
  exit 1
fi

BUMP_TYPE=$1

# Validate bump type
if [[ ! "$BUMP_TYPE" =~ ^(major|minor|patch)$ ]]; then
  echo "Error: Invalid bump type. Use: major, minor, or patch"
  exit 1
fi

echo "📦 Bumping version ($BUMP_TYPE)..."

# Bump package.json version (creates commit + tag automatically)
pnpm version "$BUMP_TYPE" --git-tag-version=false --allow-same-version=false

# Get the new version from package.json
NEW_VERSION=$(node -p "require('./package.json').version")

echo "✅ Package version bumped to: $NEW_VERSION"

# Update Helm chart appVersion
CHART_FILE="helm/kudos/Chart.yaml"

# Use sed to update appVersion in Chart.yaml
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/^appVersion: .*/appVersion: $NEW_VERSION/" "$CHART_FILE"
else
  # Linux
  sed -i "s/^appVersion: .*/appVersion: $NEW_VERSION/" "$CHART_FILE"
fi

echo "✅ Helm chart appVersion updated to: $NEW_VERSION"

echo ""
echo "🎉 Version update complete!"
