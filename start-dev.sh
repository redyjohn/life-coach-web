#!/bin/bash

echo "Starting Life Coach Web Development Environment..."
echo

echo "Checking if Node.js is installed..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js version:"
node --version

echo
echo "Installing dependencies..."
npm install

echo
echo "Starting backend server on port 3000..."
npm run server &
BACKEND_PID=$!

echo "Waiting for backend server to start..."
sleep 3

echo
echo "Starting frontend development server on port 5173..."
npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting up..."
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait

