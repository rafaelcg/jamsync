#!/bin/bash
# Test script for R2 upload functionality

echo "=== JamSync Upload System Test ==="
echo ""

# Check environment variables
echo "1. Checking R2 configuration..."
if grep -q "R2_ACCESS_KEY_ID" /root/clawd/jamsync/.env.local; then
    echo "   ✓ R2 credentials configured in .env.local"
else
    echo "   ✗ R2 credentials missing in .env.local"
fi

# Check API route exists
echo ""
echo "2. Checking upload API route..."
if [ -f "/root/clawd/jamsync/src/app/api/upload/route.ts" ]; then
    echo "   ✓ Upload API route exists"
else
    echo "   ✗ Upload API route missing"
fi

# Check upload page
echo ""
echo "3. Checking upload page..."
if [ -f "/root/clawd/jamsync/src/app/upload/page.tsx" ]; then
    if grep -q "FormData" "/root/clawd/jamsync/src/app/upload/page.tsx"; then
        echo "   ✓ Upload page uses FormData for file upload"
    else
        echo "   ✗ Upload page doesn't use FormData"
    fi
else
    echo "   ✗ Upload page missing"
fi

# Check R2 service in backend
echo ""
echo "4. Checking backend R2 service..."
if [ -f "/root/clawd/jamsync/backend/src/services/r2Storage.ts" ]; then
    echo "   ✓ Backend R2 storage service exists"
else
    echo "   ✗ Backend R2 storage service missing"
fi

# Check tracks API for storage
echo ""
echo "5. Checking tracks API for storage..."
if [ -f "/root/clawd/jamsync/src/app/api/tracks/route.ts" ]; then
    if grep -q "tracks: Map" "/root/clawd/jamsync/src/app/api/tracks/route.ts"; then
        echo "   ✓ Tracks API has in-memory storage"
    else
        echo "   ✗ Tracks API doesn't have storage"
    fi
else
    echo "   ✗ Tracks API route missing"
fi

echo ""
echo "=== Test Complete ==="
echo ""
echo "To fully test the upload system:"
echo "1. Configure R2 credentials in /root/clawd/jamsync/.env.local"
echo "2. Start the Next.js dev server: cd /root/clawd/jamsync && npm run dev"
echo "3. Navigate to /upload and try uploading a file"
echo "4. Check the browser console for upload progress"
echo "5. Verify the file appears in your R2 bucket"
