#!/bin/bash

# Define the URL
URL="http://localhost:3001/external"

# Make the curl request and extract the version field using jq
VERSION=$(curl -s "$URL" | jq -r '.version')
FUL_VERSION=$(curl -s "$URL" | jq -r '.fullVersion')

# Print the version
echo "$VERSION"
echo "$FUL_VERSION"
