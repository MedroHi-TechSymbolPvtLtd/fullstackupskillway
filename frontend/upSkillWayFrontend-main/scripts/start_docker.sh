#!/bin/bash
set -e

REGION="ap-south-1"
ACCOUNT_ID="488479524661"
IMAGE_REPO="upskillway"
IMAGE_URI="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$IMAGE_REPO:latest"

echo "Logging in to Amazon ECR..."
aws ecr get-login-password --region $REGION | \
docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

echo "Pulling latest Docker image..."
docker pull $IMAGE_URI

echo "Stopping old container if running..."
docker stop upskillway || true
docker rm upskillway || true

echo "Starting new HTTPS-enabled container..."
docker run -d \
  --name upskillway \
  -p 80:80 \
  -p 443:443 \
  --restart always \
  $IMAGE_URI

echo "Container started successfully!"
docker ps | grep upskillway

