/**
 * Performance testing script for Uyir Mei platform
 * 
 * This script uses Puppeteer to measure key performance metrics and detect regressions
 */

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

// Performance budgets
const PERFORMANCE_BUDGETS = {
  FIRST_CONTENTFUL_PAINT: 1500, // ms
  LARGEST_CONTENTFUL_PAINT: 2500, // ms
  TIME_TO_INTERACTIVE: 3500, // ms
  TOTAL_BLOCKING_TIME: 300, // ms
  CUMULATIVE_LAYOUT_SHIFT: 0.1, // score
  SERVER_RESPONSE_TIME: 400, // ms
  TOTAL_BUNDLE_SIZE: 500 * 1024, // 500KB
};

// Routes to test (add more as needed)
const ROUTES = [
  { name: 'Home', path: '/' },
  { name: 'Login', path: '/login' },
  { name: 'NGO Dashboard', path: '/ngo/dashboard', requiresAuth: true },
  { name: 'NGO Profile', path: '/ngo/profile', requiresAuth: true },
  { name: 'Impact Leaderboard', path: '/ngo/leaderboard' },
  { name: 'Partner Finder', path: '/ngo/partners' },
];

// Test credentials (for testing authenticated routes)
const TEST_CREDENTIALS = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'testpassword123',
};

// URL to test
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

// Output directory for reports
const REPORT_DIR = path.join(__dirname, '../../performance-reports');

// Ensure report directory exists
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

// Format date for filenames
const formatDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
};

describe('Performance Tests', function() {
  this.timeout(60000); // Increase timeout for Lighthouse
  
  let browser;
  let page;
  let isAuthenticated = false;
  
  before(async () => {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1280, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    page = await browser.newPage();
    
    // Set user agent to desktop Chrome
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36');
    
    // Enable CPU and network throttling for more realistic results
    const client = await page.target().createCDPSession();
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 20, // 20ms
      downloadThroughput: 5 * 1024 * 1024 / 8, // 5Mbps
      uploadThroughput: 1 * 1024 * 1024 / 8, // 1Mbps
    });
    
    // Add performance observer
    await page.evaluateOnNewDocument(() => {
      window.performanceMetrics = {};
      
      // Create a performance observer
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.performanceMetrics[entry.name] = entry.startTime;
        }
      });
      
      // Observe paint timing events
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
    });
  });
  
  after(async () => {
    await browser.close();
  });
  
  // Helper to login
  async function login() {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForSelector('input[type="email"]');
    
    // Fill login form
    await page.type('input[type="email"]', TEST_CREDENTIALS.email);
    await page.type('input[type="password"]', TEST_CREDENTIALS.password);
    
    // Submit form
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    
    isAuthenticated = true;
  }
  
  // Run Lighthouse audit
  async function runLighthouseAudit(url, name) {
    const { lhr } = await lighthouse(url, {
      port: (new URL(browser.wsEndpoint())).port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance'],
      formFactor: 'desktop',
      throttling: {
        rttMs: 40,
        throughputKbps: 10 * 1024,
        cpuSlowdownMultiplier: 1,
      },
    });
    
    // Save report
    const reportPath = path.join(REPORT_DIR, `${name.replace(/\s+/g, '-').toLowerCase()}_${formatDate()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(lhr, null, 2));
    
    return {
      score: lhr.categories.performance.score * 100,
      firstContentfulPaint: lhr.audits['first-contentful-paint'].numericValue,
      largestContentfulPaint: lhr.audits['largest-contentful-paint'].numericValue,
      timeToInteractive: lhr.audits['interactive'].numericValue,
      totalBlockingTime: lhr.audits['total-blocking-time'].numericValue,
      cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].numericValue,
      serverResponseTime: lhr.audits['server-response-time'].numericValue,
    };
  }
  
  // Test each route
  for (const route of ROUTES) {
    it(`${route.name} page meets performance budget`, async () => {
      if (route.requiresAuth && !isAuthenticated) {
        await login();
      }
      
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle0' });
      
      // Measure bundle size
      const jsRequests = await page.evaluate(() => {
        return performance.getEntriesByType('resource')
          .filter(resource => resource.initiatorType === 'script')
          .map(resource => ({
            url: resource.name,
            size: resource.transferSize
          }));
      });
      
      const totalJsSize = jsRequests.reduce((total, req) => total + req.size, 0);
      
      console.log(`Total JS bundle size for ${route.name}: ${(totalJsSize / 1024).toFixed(2)}KB`);
      expect(totalJsSize).to.be.at.most(PERFORMANCE_BUDGETS.TOTAL_BUNDLE_SIZE, 'Total JS bundle size exceeds budget');
      
      // Run Lighthouse audit
      const metrics = await runLighthouseAudit(`${BASE_URL}${route.path}`, route.name);
      
      // Log metrics
      console.log(`Performance metrics for ${route.name}:`);
      console.log(`- Performance Score: ${metrics.score.toFixed(0)}/100`);
      console.log(`- First Contentful Paint: ${(metrics.firstContentfulPaint / 1000).toFixed(2)}s`);
      console.log(`- Largest Contentful Paint: ${(metrics.largestContentfulPaint / 1000).toFixed(2)}s`);
      console.log(`- Time to Interactive: ${(metrics.timeToInteractive / 1000).toFixed(2)}s`);
      console.log(`- Total Blocking Time: ${metrics.totalBlockingTime.toFixed(0)}ms`);
      console.log(`- Cumulative Layout Shift: ${metrics.cumulativeLayoutShift.toFixed(3)}`);
      console.log(`- Server Response Time: ${metrics.serverResponseTime.toFixed(0)}ms`);
      
      // Assert metrics against budget
      expect(metrics.score).to.be.at.least(80, 'Performance score is too low');
      expect(metrics.firstContentfulPaint).to.be.at.most(PERFORMANCE_BUDGETS.FIRST_CONTENTFUL_PAINT, 'First Contentful Paint exceeds budget');
      expect(metrics.largestContentfulPaint).to.be.at.most(PERFORMANCE_BUDGETS.LARGEST_CONTENTFUL_PAINT, 'Largest Contentful Paint exceeds budget');
      expect(metrics.timeToInteractive).to.be.at.most(PERFORMANCE_BUDGETS.TIME_TO_INTERACTIVE, 'Time to Interactive exceeds budget');
      expect(metrics.totalBlockingTime).to.be.at.most(PERFORMANCE_BUDGETS.TOTAL_BLOCKING_TIME, 'Total Blocking Time exceeds budget');
      expect(metrics.cumulativeLayoutShift).to.be.at.most(PERFORMANCE_BUDGETS.CUMULATIVE_LAYOUT_SHIFT, 'Cumulative Layout Shift exceeds budget');
      expect(metrics.serverResponseTime).to.be.at.most(PERFORMANCE_BUDGETS.SERVER_RESPONSE_TIME, 'Server Response Time exceeds budget');
    });
  }
}); 