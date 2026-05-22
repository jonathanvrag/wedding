#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$PROJECT_DIR/backups"
RETENTION=30

mkdir -p "$BACKUP_DIR"

DATE=$(date +%Y-%m-%d)

cp "$PROJECT_DIR/invitados.csv" "$BACKUP_DIR/invitados-$DATE.csv"
cp "$PROJECT_DIR/config.json" "$BACKUP_DIR/config-$DATE.json"

find "$BACKUP_DIR" -name 'invitados-*.csv' -type f | sort | head -n -$RETENTION | xargs -r rm
find "$BACKUP_DIR" -name 'config-*.json' -type f | sort | head -n -$RETENTION | xargs -r rm
