#!/bin/bash

# Define the URL
URL="http://localhost:3002/external"

# Make the curl request and extract the version field using jq
VERSION=$(curl -s "$URL" | jq -r '.version')

# Print the version
echo "$VERSION"
