#!/bin/bash
set -euo pipefail

# Database backup helper. Supports SQLite and Postgres (env-driven).
# Usage: ./backup-db.sh /path/to/backups

OUTDIR="${1:-./backups}"
mkdir -p "$OUTDIR"

if [ -f "backend/data/data.db" ]; then
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  cp backend/data/data.db "$OUTDIR/data.${TIMESTAMP}.db"
  echo "SQLite backup written to $OUTDIR/data.${TIMESTAMP}.db"
  exit 0
fi

if [ -n "${DATABASE_URL-}" ]; then
  # Expecting postgres URL
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  PGPASSFILE="${PGPASSFILE:-~/.pgpass}"
  echo "Backing up Postgres (pg_dump) to $OUTDIR/pg_${TIMESTAMP}.sql"
  pg_dump "$DATABASE_URL" > "$OUTDIR/pg_${TIMESTAMP}.sql"
  echo "Postgres dump completed"
  exit 0
fi

echo "No recognized database found (SQLite file or DATABASE_URL)."
exit 1
