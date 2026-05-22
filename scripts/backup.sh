#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/mnt/j/wedding/backups"
CSV="/mnt/j/wedding/invitados.csv"
CONFIG="/mnt/j/wedding/config.json"
RETENTION=30

DATE=$(date +%Y-%m-%d)

cp "$CSV" "$BACKUP_DIR/invitados-$DATE.csv"
cp "$CONFIG" "$BACKUP_DIR/config-$DATE.json"

# Keep only last $RETENTION backups
find "$BACKUP_DIR" -name 'invitados-*.csv' -type f | sort | head -n -$RETENTION | xargs -r rm
find "$BACKUP_DIR" -name 'config-*.json' -type f | sort | head -n -$RETENTION | xargs -r rm
