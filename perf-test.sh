#!/bin/bash

# Performance testing and analysis script for Uyir Mei platform

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Uyir Mei Platform Performance Testing ===${NC}"
echo
echo -e "${YELLOW}This script will run performance tests and generate reports.${NC}"
echo

# Check if the app is running
if ! curl -s http://localhost:3000 > /dev/null; then
  echo -e "${RED}Error: Application does not appear to be running at http://localhost:3000${NC}"
  echo -e "Please start the application with ${YELLOW}npm run dev${NC} before running this script."
  exit 1
fi

# Create performance reports directory if it doesn't exist
mkdir -p performance-reports

# Run the performance tests
echo -e "${GREEN}Running performance tests...${NC}"
npm run test:perf

# Check if the tests were successful
if [ $? -ne 0 ]; then
  echo -e "${RED}Performance tests failed.${NC}"
  echo -e "Please check the output above for errors."
  exit 1
fi

# Analyze the performance data
echo
echo -e "${GREEN}Analyzing performance results...${NC}"
npm run analyze:perf

# Check if the analysis was successful
if [ $? -ne 0 ]; then
  echo -e "${RED}Performance analysis failed.${NC}"
  echo -e "Please check the output above for errors."
  exit 1
fi

echo
echo -e "${GREEN}Performance testing and analysis complete!${NC}"
echo -e "View the report at: ${YELLOW}performance-reports/performance-report.html${NC}"

# Try to open the report automatically
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  open performance-reports/performance-report.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  if command -v xdg-open > /dev/null; then
    xdg-open performance-reports/performance-report.html
  fi
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  # Windows
  start performance-reports/performance-report.html
fi

echo
echo -e "${YELLOW}Recommendations:${NC}"
echo "1. Review the report for any metrics exceeding the performance budget"
echo "2. Pay special attention to routes with scores below 80"
echo "3. Consider implementing the suggested improvements in the report"
echo "4. Run tests regularly to track performance over time"
echo

exit 0 