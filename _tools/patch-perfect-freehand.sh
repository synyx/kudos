#!/bin/sh

# this fixes https://github.com/steveruizok/perfect-freehand/pull/59
# This script exists because the PR is not merged/pulled yet

echo "patching perfect-freehand"
mv node_modules/perfect-freehand/dist/esm/index.js node_modules/perfect-freehand/dist/esm/index.mjs
sed -i 's/.\/dist\/esm\/index.js/.\/dist\/esm\/index.mjs/g' node_modules/perfect-freehand/package.json