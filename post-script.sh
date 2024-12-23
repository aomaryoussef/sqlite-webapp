#!/bin/bash

URL="http://localhost:3001/external"  
FULL_VERSION="1" 
CONTENT_TYPE="application/json"

RESPONSE=$(curl -s -o response.json -w "%{http_code}" -X POST "$URL" \
    -H "Content-Type: $CONTENT_TYPE" \
    -d "{\"fullVersion\": \"$FULL_VERSION\"}")

HTTP_STATUS=$RESPONSE

if [[ $HTTP_STATUS -eq 200 ]]; then
    echo "Success: HTTP status $HTTP_STATUS"
else
    echo "Error: HTTP status $HTTP_STATUS"
fi

