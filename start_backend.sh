#!/bin/bash

# Backend Services Startup Script
# This script starts both Django SSR app and NestJS web-api with environment variable checks

set -e  # Exit on any error

echo "🚀 Starting Backend Services..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        print_warning "Killing process on port $port (PID: $pid)"
        kill -9 $pid
        sleep 2
    fi
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check if Node.js is installed
if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if Python is installed
if ! command_exists python3; then
    print_error "Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if Redis is running
print_status "Checking Redis connection..."
if ! redis-cli ping >/dev/null 2>&1; then
    print_error "Redis is not running. Please start Redis first:"
    echo "  Ubuntu/Debian: sudo systemctl start redis"
    echo "  macOS: brew services start redis"
    echo "  Windows: Start Redis service"
    exit 1
fi
print_success "Redis is running"

# Check ports
print_status "Checking ports..."
if check_port 3000; then
    print_warning "Port 3000 is already in use. Attempting to free it..."
    kill_port 3000
fi

if check_port 8000; then
    print_warning "Port 8000 is already in use. Attempting to free it..."
    kill_port 8000
fi

# Environment Variables Check
print_status "Checking environment variables..."

# Load environment variables from .env file if it exists
if [ -f ".env" ]; then
    print_status "Loading environment variables from .env file..."
    export $(grep -v '^#' .env | xargs)
elif [ -f "env.example" ]; then
    print_warning "No .env file found. Copy env.example to .env and configure your settings:"
    echo "  cp env.example .env"
    echo "  # Then edit .env with your actual values"
fi

# Default environment variables (fallback values)
export EXTERNAL_API_BASE_URL=${EXTERNAL_API_BASE_URL:-"http://localhost:3000/api"}
export EXTERNAL_API_TIMEOUT=${EXTERNAL_API_TIMEOUT:-"30"}
export PORT=${PORT:-"3000"}
export DJANGO_PORT=${DJANGO_PORT:-"8000"}
export NODE_ENV=${NODE_ENV:-"development"}
export DJANGO_DEBUG=${DJANGO_DEBUG:-"True"}
export REDIS_URL=${REDIS_URL:-"redis://localhost:6379/0"}

# Database configuration
export DB_HOST=${DB_HOST:-"localhost"}
export DB_PORT=${DB_PORT:-"5432"}
export DB_USERNAME=${DB_USERNAME:-"postgres"}
export DB_PASSWORD=${DB_PASSWORD:-"password"}
export DB_DATABASE=${DB_DATABASE:-"web_systems_db"}

print_success "Environment variables set:"
echo "  EXTERNAL_API_BASE_URL: $EXTERNAL_API_BASE_URL"
echo "  EXTERNAL_API_TIMEOUT: $EXTERNAL_API_TIMEOUT"
echo "  PORT: $PORT"
echo "  DJANGO_PORT: $DJANGO_PORT"
echo "  NODE_ENV: $NODE_ENV"
echo "  DB_HOST: $DB_HOST"
echo "  DB_DATABASE: $DB_DATABASE"

# Create logs directory
mkdir -p logs

# Function to start NestJS web-api
start_web_api() {
    print_status "Starting NestJS Web-API..."
    
    cd backend/web-api
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing npm dependencies..."
        npm install
    fi
    
    # Build the project if needed
    if [ ! -d "dist" ] || [ "src" -nt "dist" ]; then
        print_status "Building NestJS application..."
        npm run build
    fi
    
    # Start the application in background with environment variables
    print_status "Starting web-api on port $PORT..."
    nohup env PORT=$PORT NODE_ENV=$NODE_ENV DB_HOST="$DB_HOST" DB_PORT=$DB_PORT DB_USERNAME="$DB_USERNAME" DB_PASSWORD="$DB_PASSWORD" DB_DATABASE="$DB_DATABASE" npm run start:prod > ../../logs/web-api.log 2>&1 &
    WEB_API_PID=$!
    echo $WEB_API_PID > ../../logs/web-api.pid
    
    # Wait for API to be ready
    print_status "Waiting for web-api to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:$PORT/api >/dev/null 2>&1; then
            print_success "Web-API is ready on http://localhost:$PORT"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Web-API failed to start within 30 seconds"
            exit 1
        fi
        sleep 1
    done
    
    cd ../..
}

# Function to start Django SSR app
start_django_app() {
    print_status "Starting Django SSR Application..."
    
    cd backend/ssr-app
    
    # Activate virtual environment
    if [ -d "venv" ]; then
        print_status "Activating virtual environment..."
        source venv/bin/activate
    else
        print_error "Virtual environment not found. Please create it first:"
        echo "  cd backend/ssr-app"
        echo "  python3 -m venv venv"
        echo "  source venv/bin/activate"
        echo "  pip install -r requirements.txt"
        exit 1
    fi
    
    # Install dependencies if needed
    print_status "Checking Python dependencies..."
    pip install -r requirements.txt >/dev/null 2>&1
    
    # Run migrations
    print_status "Running database migrations..."
    python manage.py makemigrations --noinput
    python manage.py migrate --noinput
    
    # Create superuser if it doesn't exist
    print_status "Checking superuser..."
    python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print('Superuser created: admin/admin')
else:
    print('Superuser already exists')
" 2>/dev/null
    
    # Start Django server in background with environment variables
    print_status "Starting Django server on port $DJANGO_PORT..."
    nohup env DJANGO_PORT=$DJANGO_PORT DJANGO_DEBUG=$DJANGO_DEBUG EXTERNAL_API_BASE_URL="$EXTERNAL_API_BASE_URL" EXTERNAL_API_TIMEOUT=$EXTERNAL_API_TIMEOUT python manage.py runserver 0.0.0.0:$DJANGO_PORT > ../../logs/django.log 2>&1 &
    DJANGO_PID=$!
    echo $DJANGO_PID > ../../logs/django.pid
    
    # Wait for Django to be ready
    print_status "Waiting for Django to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:$DJANGO_PORT >/dev/null 2>&1; then
            print_success "Django SSR is ready on http://localhost:$DJANGO_PORT"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Django failed to start within 30 seconds"
            exit 1
        fi
        sleep 1
    done
    
    cd ../..
}

# Function to start Celery services
start_celery_services() {
    print_status "Starting Celery services..."
    
    cd backend/ssr-app
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Start Celery worker in background with environment variables
    print_status "Starting Celery worker..."
    nohup env CELERY_BROKER_URL="$REDIS_URL" CELERY_RESULT_BACKEND="$REDIS_URL" celery -A config worker -l info > ../../logs/celery-worker.log 2>&1 &
    CELERY_WORKER_PID=$!
    echo $CELERY_WORKER_PID > ../../logs/celery-worker.pid
    
    # Start Celery beat in background with environment variables
    print_status "Starting Celery Beat scheduler..."
    nohup env CELERY_BROKER_URL="$REDIS_URL" CELERY_RESULT_BACKEND="$REDIS_URL" celery -A config beat -l info > ../../logs/celery-beat.log 2>&1 &
    CELERY_BEAT_PID=$!
    echo $CELERY_BEAT_PID > ../../logs/celery-beat.pid
    
    cd ../..
    
    print_success "Celery services started"
}

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down services..."
    
    # Kill Django
    if [ -f logs/django.pid ]; then
        DJANGO_PID=$(cat logs/django.pid)
        kill $DJANGO_PID 2>/dev/null || true
        rm -f logs/django.pid
    fi
    
    # Kill Celery services
    if [ -f logs/celery-worker.pid ]; then
        CELERY_WORKER_PID=$(cat logs/celery-worker.pid)
        kill $CELERY_WORKER_PID 2>/dev/null || true
        rm -f logs/celery-worker.pid
    fi
    
    if [ -f logs/celery-beat.pid ]; then
        CELERY_BEAT_PID=$(cat logs/celery-beat.pid)
        kill $CELERY_BEAT_PID 2>/dev/null || true
        rm -f logs/celery-beat.pid
    fi
    
    # Kill web-api
    if [ -f logs/web-api.pid ]; then
        WEB_API_PID=$(cat logs/web-api.pid)
        kill $WEB_API_PID 2>/dev/null || true
        rm -f logs/web-api.pid
    fi
    
    print_success "All services stopped"
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Start services
start_web_api
start_django_app
start_celery_services

echo ""
echo "🎉 All Backend Services Started Successfully!"
echo "=============================================="
echo ""
echo "📊 Service Status:"
echo "  🌐 Web-API (NestJS):    http://localhost:$PORT"
echo "  📚 API Documentation:   http://localhost:$PORT/api/docs"
echo "  🖥️  Django SSR App:     http://localhost:$DJANGO_PORT"
echo "  💰 Discounts Page:      http://localhost:$DJANGO_PORT/discounts/"
echo "  🔧 Django Admin:        http://localhost:$DJANGO_PORT/admin/ (admin/admin)"
echo ""
echo "📝 Log Files:"
echo "  Web-API:    logs/web-api.log"
echo "  Django:     logs/django.log"
echo "  Celery:     logs/celery-worker.log, logs/celery-beat.log"
echo ""
echo "🛠️  Management Commands:"
echo "  Test Tasks: cd backend/ssr-app && source venv/bin/activate && python manage.py test_tasks --sync"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Keep script running and show logs
tail -f logs/web-api.log logs/django.log logs/celery-worker.log logs/celery-beat.log
