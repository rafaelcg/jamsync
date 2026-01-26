#!/bin/bash
# Test script for R2 storage integration

BASE_URL="http://localhost:3001"
API_PREFIX="$BASE_URL/api/v1"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "JamSync R2 Storage Integration Test"
echo "=========================================="
echo ""

# Test 1: Check server health
echo -e "${YELLOW}Test 1: Server Health Check${NC}"
HEALTH=$(curl -s "$BASE_URL/health")
if echo "$HEALTH" | grep -q "ok"; then
  echo -e "${GREEN}✓ Server is healthy${NC}"
  echo "Response: $HEALTH"
else
  echo -e "${RED}✗ Server health check failed${NC}"
  echo "Response: $HEALTH"
fi
echo ""

# Test 2: Test uploads/status endpoint (without auth - should fail)
echo -e "${YELLOW}Test 2: Uploads Status (No Auth - Expected Fail)${NC}"
STATUS=$(curl -s "$API_PREFIX/uploads/status")
if echo "$STATUS" | grep -q "No token provided"; then
  echo -e "${GREEN}✓ Authentication working correctly${NC}"
else
  echo -e "${YELLOW}⚠ Unexpected response: $STATUS${NC}"
fi
echo ""

# Test 3: Create a test user and get token
echo -e "${YELLOW}Test 3: Create Test User & Get Token${NC}"

# Register a test user
REGISTER=$(curl -s -X POST "$API_PREFIX/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"testr2user","email":"testr2@example.com","displayName":"Test R2 User","password":"testpassword123"}')

echo "Register response: $REGISTER"

# Extract token (assuming it returns a token)
TOKEN=$(echo "$REGISTER" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${YELLOW}⚠ Could not extract token, trying login...${NC}"
  # Try to login instead
  LOGIN=$(curl -s -X POST "$API_PREFIX/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"testr2@example.com","password":"testpassword123"}')
  echo "Login response: $LOGIN"
  TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
fi

if [ -n "$TOKEN" ]; then
  echo -e "${GREEN}✓ Got authentication token${NC}"
  
  # Test 4: Check R2 status with auth
  echo ""
  echo -e "${YELLOW}Test 4: R2 Storage Status (With Auth)${NC}"
  STATUS=$(curl -s "$API_PREFIX/uploads/status" \
    -H "Authorization: Bearer $TOKEN")
  echo "R2 Status: $STATUS"
  
  if echo "$STATUS" | grep -q '"r2Configured":false'; then
    echo -e "${YELLOW}ℹ R2 is not configured (expected - no credentials in .env)${NC}"
  elif echo "$STATUS" | grep -q '"r2Configured":true'; then
    echo -e "${GREEN}✓ R2 is configured and ready${NC}"
  fi
  
  # Test 5: Try a file upload (will fail without R2 credentials)
  echo ""
  echo -e "${YELLOW}Test 5: Test File Upload${NC}"
  
  # Create a small test audio file
  echo "Uploading test file..."
  UPLOAD_RESULT=$(curl -s -X POST "$API_PREFIX/uploads/media" \
    -H "Authorization: Bearer $TOKEN" \
    -F "file=@/dev/null;type=audio/mpeg")
  
  echo "Upload response: $UPLOAD_RESULT"
  
  if echo "$UPLOAD_RESULT" | grep -q "Cloud storage not configured"; then
    echo -e "${YELLOW}ℹ Upload correctly fails without R2 credentials (expected)${NC}"
  elif echo "$UPLOAD_RESULT" | grep -q '"url"'; then
    echo -e "${GREEN}✓ File uploaded successfully to R2!${NC}"
    URL=$(echo "$UPLOAD_RESULT" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    echo "File URL: $URL"
  else
    echo -e "${RED}✗ Upload failed unexpectedly${NC}"
  fi
else
  echo -e "${RED}✗ Could not get authentication token${NC}"
fi

echo ""
echo "=========================================="
echo "Test Complete"
echo "=========================================="
