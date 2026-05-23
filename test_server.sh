#!/bin/bash
# Test script for MindBridge server
cd /home/handy/cope

echo "=== Starting server ==="
npx tsx server/index.ts &
SERVER_PID=$!
sleep 5

echo "=== Testing /api/health ==="
curl -s http://localhost:3001/api/health

echo ""
echo "=== Testing /api/auth/demo-accounts ==="
curl -s http://localhost:3001/api/auth/demo-accounts | python3 -c "import sys,json; d=json.load(sys.stdin); print('Accounts:', [a['username'] for a in d['accounts']])"

echo ""
echo "=== Testing login (rizky/student123) ==="
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"rizky","password":"student123"}' | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token','FAILED')[:40]+'...' if d.get('success') else 'FAIL: '+d.get('error',''))")
echo "Token: $TOKEN"

echo ""
echo "=== Testing login (dr.sari/konselor123) ==="
RESULT=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"dr.sari","password":"konselor123"}' | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print('OK role='+d['user']['role'] if d.get('success') else 'FAIL: '+d.get('error',''))")
echo "$RESULT"

echo ""
echo "=== Testing login (prof.hendra/prof123) ==="
RESULT2=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"prof.hendra","password":"prof123"}' | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print('OK role='+d['user']['role'] if d.get('success') else 'FAIL: '+d.get('error',''))")
echo "$RESULT2"

echo ""
echo "=== Testing wrong password ==="
RESULT3=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"rizky","password":"wrongpassword"}' | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print('CORRECTLY REJECTED: '+d.get('error','') if not d.get('success') else 'ERROR: Should have failed!')")
echo "$RESULT3"

echo ""
echo "=== Testing /api/data/history with student token ==="
FULL_TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"rizky","password":"student123"}' | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token',''))")

HISTORY=$(curl -s http://localhost:3001/api/data/history \
  -H "Authorization: Bearer $FULL_TOKEN" | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print('OK rows='+str(len(d['data'])) if d.get('success') else 'FAIL: '+d.get('error',''))")
echo "$HISTORY"

echo ""
echo "=== All tests done ==="
kill $SERVER_PID 2>/dev/null
