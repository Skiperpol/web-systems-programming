#!/bin/bash

# Backend Services Stop Script
# This script stops all running backend services

echo "🛑 Stopping Backend Services..."
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to kill process by PID file
kill_service() {
    local service_name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            print_status "Stopping $service_name (PID: $pid)..."
            kill "$pid"
            sleep 2
            
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                print_warning "Force killing $service_name..."
                kill -9 "$pid"
            fi
            
            print_success "$service_name stopped"
        else
            print_warning "$service_name was not running"
        fi
        rm -f "$pid_file"
    else
        print_warning "PID file for $service_name not found"
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    local service_name=$2
    
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        print_status "Killing $service_name on port $port (PID: $pid)..."
        kill -9 $pid
        sleep 1
        print_success "$service_name stopped"
    else
        print_warning "$service_name was not running on port $port"
    fi
}

# Kill services by PID files
print_status "Stopping services by PID files..."
kill_service "Django Server" "logs/django.pid"
kill_service "Celery Worker" "logs/celery-worker.pid"
kill_service "Celery Beat" "logs/celery-beat.pid"
kill_service "Web-API" "logs/web-api.pid"

# Kill services by ports (fallback)
print_status "Checking for remaining processes on ports..."
kill_port 8000 "Django Server"
kill_port 3000 "Web-API"

# Kill any remaining Celery processes
print_status "Killing any remaining Celery processes..."
pkill -f "celery.*config" 2>/dev/null || true

echo ""
print_success "All backend services have been stopped!"
echo ""
echo "📝 Log files are preserved in the logs/ directory"
echo "🔄 Run './start_backend.sh' to start services again"
