#!/bin/bash

# Backend Services Test Script
# This script tests if all backend services are running correctly

echo "🧪 Testing Backend Services..."
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test HTTP endpoint
test_endpoint() {
    local url=$1
    local service_name=$2
    local expected_status=${3:-200}
    
    print_status "Testing $service_name at $url..."
    
    if response=$(curl -s -w "%{http_code}" -o /dev/null "$url" 2>/dev/null); then
        if [ "$response" -eq "$expected_status" ]; then
            print_success "$service_name is responding correctly (HTTP $response)"
            ((TESTS_PASSED++))
            return 0
        else
            print_error "$service_name returned HTTP $response (expected $expected_status)"
            ((TESTS_FAILED++))
            return 1
        fi
    else
        print_error "$service_name is not responding"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Function to test API endpoint with JSON response
test_api_endpoint() {
    local url=$1
    local service_name=$2
    
    print_status "Testing $service_name API at $url..."
    
    if response=$(curl -s "$url" 2>/dev/null); then
        if echo "$response" | grep -q "\[" || echo "$response" | grep -q "{"; then
            print_success "$service_name API is returning valid JSON"
            ((TESTS_PASSED++))
            return 0
        else
            print_error "$service_name API is not returning valid JSON"
            ((TESTS_FAILED++))
            return 1
        fi
    else
        print_error "$service_name API is not responding"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Function to check if port is listening
test_port() {
    local port=$1
    local service_name=$2
    
    print_status "Testing $service_name on port $port..."
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_success "$service_name is listening on port $port"
        ((TESTS_PASSED++))
        return 0
    else
        print_error "$service_name is not listening on port $port"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Function to test Redis connection
test_redis() {
    print_status "Testing Redis connection..."
    
    if redis-cli ping >/dev/null 2>&1; then
        print_success "Redis is responding to ping"
        ((TESTS_PASSED++))
        return 0
    else
        print_error "Redis is not responding"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Function to test Celery workers
test_celery() {
    print_status "Testing Celery workers..."
    
    cd backend/ssr-app
    if [ -d "venv" ]; then
        source venv/bin/activate
        if celery -A config inspect active >/dev/null 2>&1; then
            print_success "Celery workers are active"
            ((TESTS_PASSED++))
        else
            print_error "Celery workers are not responding"
            ((TESTS_FAILED++))
        fi
    else
        print_error "Virtual environment not found"
        ((TESTS_FAILED++))
    fi
    cd ../..
}

echo ""
echo "🔍 Running Service Tests..."
echo ""

# Test Redis
test_redis

# Test ports
test_port 3000 "Web-API"
test_port 8000 "Django SSR"

# Test HTTP endpoints
test_endpoint "http://localhost:3000/api" "Web-API"
test_endpoint "http://localhost:8000" "Django SSR"
test_endpoint "http://localhost:8000/discounts/" "Django Discounts Page"
test_endpoint "http://localhost:8000/admin/" "Django Admin"

# Test API endpoints
test_api_endpoint "http://localhost:3000/api/discounts" "Web-API Discounts"

# Test Celery
test_celery

echo ""
echo "📊 Test Results Summary"
echo "======================="
echo "Tests Passed: $TESTS_PASSED"
echo "Tests Failed: $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    print_success "All tests passed! 🎉"
    echo ""
    echo "🌐 Service URLs:"
    echo "  Web-API:        http://localhost:3000"
    echo "  API Docs:       http://localhost:3000/api/docs"
    echo "  Django SSR:     http://localhost:8000"
    echo "  Discounts:      http://localhost:8000/discounts/"
    echo "  Django Admin:   http://localhost:8000/admin/"
    exit 0
else
    print_error "Some tests failed! ❌"
    echo ""
    echo "🔧 Troubleshooting Tips:"
    echo "  1. Make sure all services are running: ./start_backend.sh"
    echo "  2. Check logs in the logs/ directory"
    echo "  3. Ensure Redis is running: redis-cli ping"
    echo "  4. Verify ports 3000 and 8000 are available"
    exit 1
fi
