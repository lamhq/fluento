#!/bin/bash
set -e

# Create node_modules directory
docker run --rm -v "$PWD/assets":/var/task -w /var/task \
  --entrypoint bash public.ecr.aws/lambda/nodejs:22-arm64 \
  -c "npm install @langchain/openai@^1.5.10"

# Create layer zip file
mkdir -p assets/layer/nodejs
mv assets/node_modules assets/layer/nodejs/
cd assets/layer
zip -r ../api-layer.zip .
cd ../..

# Clean up the layer build directory
rm -rf assets/layer
rm -f assets/package-lock.json assets/package.json
