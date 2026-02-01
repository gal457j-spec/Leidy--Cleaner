#!/usr/bin/env bash
set -euo pipefail

BASE_URL="http://localhost:3001"

echo "== Health check =="
curl -s "$BASE_URL/health" | jq .

echo "\n== DB health check =="
curl -s "$BASE_URL/health/db" | jq .

echo "\n== Reviews stats =="
curl -s "$BASE_URL/api/reviews/stats" | jq .

echo "\n== Public reviews =="
curl -s "$BASE_URL/api/reviews?page=1&limit=5" | jq .

echo "\nSmoke tests completed"
