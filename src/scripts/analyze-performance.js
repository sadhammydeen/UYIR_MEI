#!/usr/bin/env node

/**
 * Performance analysis script
 * 
 * This script analyzes performance test results and generates visualizations
 * Run after performance tests to generate reports
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const REPORT_DIR = path.join(__dirname, '../../performance-reports');
const CHART_OUTPUT_DIR = path.join(REPORT_DIR, 'charts');

// Ensure chart directory exists
if (!fs.existsSync(CHART_OUTPUT_DIR)) {
  fs.mkdirSync(CHART_OUTPUT_DIR, { recursive: true });
}

// Performance budgets (same as in tests)
const PERFORMANCE_BUDGETS = {
  FIRST_CONTENTFUL_PAINT: 1500, // ms
  LARGEST_CONTENTFUL_PAINT: 2500, // ms
  TIME_TO_INTERACTIVE: 3500, // ms
  TOTAL_BLOCKING_TIME: 300, // ms
  CUMULATIVE_LAYOUT_SHIFT: 0.1, // score
  SERVER_RESPONSE_TIME: 400, // ms
  TOTAL_BUNDLE_SIZE: 500 * 1024, // 500KB
};

// Get all report files
const getReportFiles = () => {
  return fs.readdirSync(REPORT_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => ({
      path: path.join(REPORT_DIR, file),
      name: file.replace(/_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}\.json$/, ''),
      date: file.match(/(\d{4}-\d{2}-\d{2}_\d{2}-\d{2})\.json$/)?.[1]?.replace('_', ' ') || 'Unknown'
    }));
};

// Parse report file
const parseReport = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const report = JSON.parse(data);
    
    return {
      score: report.categories.performance.score * 100,
      firstContentfulPaint: report.audits['first-contentful-paint'].numericValue,
      largestContentfulPaint: report.audits['largest-contentful-paint'].numericValue,
      timeToInteractive: report.audits['interactive'].numericValue,
      totalBlockingTime: report.audits['total-blocking-time'].numericValue,
      cumulativeLayoutShift: report.audits['cumulative-layout-shift'].numericValue,
      serverResponseTime: report.audits['server-response-time'].numericValue,
    };
  } catch (error) {
    console.error(`Error parsing report ${filePath}:`, error);
    return null;
  }
};

// Generate HTML report
const generateHTMLReport = (results) => {
  const routes = [...new Set(results.map(r => r.pageName))];
  const dates = [...new Set(results.map(r => r.date))].sort();
  
  // Group by page
  const resultsByPage = {};
  routes.forEach(route => {
    resultsByPage[route] = results.filter(r => r.pageName === route);
  });

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Uyir Mei Performance Report</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
      .container { max-width: 1200px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
      h1 { color: #333; text-align: center; margin-bottom: 30px; }
      h2 { color: #444; margin-top: 40px; }
      .chart-container { margin-bottom: 40px; }
      .metrics-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
      .metrics-table th, .metrics-table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
      .metrics-table th { background-color: #f2f2f2; font-weight: bold; }
      .metrics-table tr:hover { background-color: #f5f5f5; }
      .pass { color: green; }
      .fail { color: red; }
      .summary { margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 4px; }
      .tabs { display: flex; margin-bottom: 20px; border-bottom: 1px solid #ddd; }
      .tab { padding: 10px 20px; cursor: pointer; }
      .tab.active { border-bottom: 2px solid #0070f3; color: #0070f3; }
      .tab-content { display: none; }
      .tab-content.active { display: block; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Uyir Mei Performance Report</h1>
      
      <div class="summary">
        <h2>Overall Performance</h2>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>Total routes tested: ${routes.length}</p>
        <p>Test dates: ${dates.join(', ')}</p>
      </div>

      <div class="tabs">
        ${routes.map((route, i) => `<div class="tab ${i === 0 ? 'active' : ''}" onclick="openTab('${route}')">${route}</div>`).join('')}
      </div>

      ${routes.map((route, i) => `
        <div id="${route}" class="tab-content ${i === 0 ? 'active' : ''}">
          <h2>${route} Performance</h2>
          
          <div class="chart-container">
            <canvas id="${route}-chart"></canvas>
          </div>
          
          <h3>Detailed Metrics</h3>
          <table class="metrics-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Performance Score</th>
                <th>First Contentful Paint</th>
                <th>Largest Contentful Paint</th>
                <th>Time to Interactive</th>
                <th>Total Blocking Time</th>
                <th>Cumulative Layout Shift</th>
                <th>Server Response Time</th>
              </tr>
            </thead>
            <tbody>
              ${resultsByPage[route].map(r => `
                <tr>
                  <td>${r.date}</td>
                  <td class="${r.score >= 80 ? 'pass' : 'fail'}">${r.score.toFixed(0)}/100</td>
                  <td class="${r.firstContentfulPaint <= PERFORMANCE_BUDGETS.FIRST_CONTENTFUL_PAINT ? 'pass' : 'fail'}">${(r.firstContentfulPaint / 1000).toFixed(2)}s</td>
                  <td class="${r.largestContentfulPaint <= PERFORMANCE_BUDGETS.LARGEST_CONTENTFUL_PAINT ? 'pass' : 'fail'}">${(r.largestContentfulPaint / 1000).toFixed(2)}s</td>
                  <td class="${r.timeToInteractive <= PERFORMANCE_BUDGETS.TIME_TO_INTERACTIVE ? 'pass' : 'fail'}">${(r.timeToInteractive / 1000).toFixed(2)}s</td>
                  <td class="${r.totalBlockingTime <= PERFORMANCE_BUDGETS.TOTAL_BLOCKING_TIME ? 'pass' : 'fail'}">${r.totalBlockingTime.toFixed(0)}ms</td>
                  <td class="${r.cumulativeLayoutShift <= PERFORMANCE_BUDGETS.CUMULATIVE_LAYOUT_SHIFT ? 'pass' : 'fail'}">${r.cumulativeLayoutShift.toFixed(3)}</td>
                  <td class="${r.serverResponseTime <= PERFORMANCE_BUDGETS.SERVER_RESPONSE_TIME ? 'pass' : 'fail'}">${r.serverResponseTime.toFixed(0)}ms</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `).join('')}
    </div>

    <script>
      function openTab(tabName) {
        const tabs = document.getElementsByClassName('tab-content');
        for (let i = 0; i < tabs.length; i++) {
          tabs[i].classList.remove('active');
        }
        
        const tabButtons = document.getElementsByClassName('tab');
        for (let i = 0; i < tabButtons.length; i++) {
          tabButtons[i].classList.remove('active');
        }
        
        document.getElementById(tabName).classList.add('active');
        event.currentTarget.classList.add('active');
      }

      // Create charts for each page
      window.onload = function() {
        ${routes.map(route => `
          new Chart(document.getElementById('${route}-chart').getContext('2d'), {
            type: 'line',
            data: {
              labels: ${JSON.stringify(resultsByPage[route].map(r => r.date))},
              datasets: [
                {
                  label: 'Performance Score',
                  data: ${JSON.stringify(resultsByPage[route].map(r => r.score))},
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1,
                  yAxisID: 'score'
                },
                {
                  label: 'First Contentful Paint (s)',
                  data: ${JSON.stringify(resultsByPage[route].map(r => r.firstContentfulPaint / 1000))},
                  borderColor: 'rgb(255, 99, 132)',
                  tension: 0.1,
                  yAxisID: 'time'
                },
                {
                  label: 'Largest Contentful Paint (s)',
                  data: ${JSON.stringify(resultsByPage[route].map(r => r.largestContentfulPaint / 1000))},
                  borderColor: 'rgb(255, 205, 86)',
                  tension: 0.1,
                  yAxisID: 'time'
                },
                {
                  label: 'Time to Interactive (s)',
                  data: ${JSON.stringify(resultsByPage[route].map(r => r.timeToInteractive / 1000))},
                  borderColor: 'rgb(54, 162, 235)',
                  tension: 0.1,
                  yAxisID: 'time'
                }
              ]
            },
            options: {
              responsive: true,
              scales: {
                score: {
                  type: 'linear',
                  position: 'left',
                  title: {
                    display: true,
                    text: 'Score (0-100)'
                  },
                  min: 0,
                  max: 100
                },
                time: {
                  type: 'linear',
                  position: 'right',
                  title: {
                    display: true,
                    text: 'Time (seconds)'
                  },
                  min: 0
                }
              }
            }
          });
        `).join('')}
      };
    </script>
  </body>
  </html>
  `;

  fs.writeFileSync(path.join(REPORT_DIR, 'performance-report.html'), html);
  console.log(`HTML report generated at ${path.join(REPORT_DIR, 'performance-report.html')}`);
};

// Main function
const main = async () => {
  console.log('Analyzing performance test results...');
  
  const reportFiles = getReportFiles();
  if (reportFiles.length === 0) {
    console.log('No performance test reports found. Run tests first with: npm run test:perf');
    return;
  }
  
  console.log(`Found ${reportFiles.length} report files.`);
  
  // Process all reports
  const results = [];
  for (const file of reportFiles) {
    const metrics = parseReport(file.path);
    if (metrics) {
      results.push({
        pageName: file.name,
        date: file.date,
        ...metrics
      });
    }
  }
  
  // Generate HTML report
  generateHTMLReport(results);
  
  console.log('Analysis complete.');
  console.log('\nSuggestions for improving performance:');
  console.log('1. Implement code splitting to reduce initial bundle size');
  console.log('2. Use React.lazy() for components not needed on initial load');
  console.log('3. Consider server-side rendering for critical pages');
  console.log('4. Optimize images using next/image or similar');
  console.log('5. Implement caching strategies for API responses');
  console.log('6. Audit and remove unused dependencies');
  console.log('7. Use virtualization for long lists');
  console.log('8. Add preloading for critical resources');
};

// Run the script
main().catch(error => {
  console.error('Error running performance analysis:', error);
  process.exit(1);
}); 