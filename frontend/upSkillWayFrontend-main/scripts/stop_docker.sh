#!/bin/bash
set -e

echo "Stopping container if running..."
docker stop upskillway || true

echo "Removing container if exists..."
docker rm upskillway || true

echo "Cleaning unused Docker resources..."
docker system prune --volumes -f || true

echo "Stop script completed."
