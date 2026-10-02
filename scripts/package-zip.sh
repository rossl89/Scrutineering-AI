#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARCHIVE_NAME="Scrutineering-Assistant-V0.1.zip"

cd "$ROOT_DIR"
npm run build
rm -f "$ARCHIVE_NAME"
(
  cd dist
  zip -q -r "../$ARCHIVE_NAME" .
)

echo "Created $ROOT_DIR/$ARCHIVE_NAME"
