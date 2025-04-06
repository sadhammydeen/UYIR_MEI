# Performance Testing Guide

This document outlines the approach to performance testing in the Uyir Mei platform.

## Overview

Performance is a critical aspect of user experience in our application. We have implemented automated performance testing to:

1. Set clear performance budgets
2. Detect performance regressions early
3. Measure the impact of code changes on performance
4. Ensure consistent performance across all routes

## Running Performance Tests

### Prerequisites

- Node.js installed (v18+)
- Application running locally (`npm run dev`)
- Required dependencies installed (`npm install`)

### Running Tests

You can run performance tests using one of the following methods:

#### Method 1: Using the convenience script

```bash
./perf-test.sh
```

This script will:
- Check if the application is running
- Run all performance tests
- Generate a performance report
- Open the report in your default browser

#### Method 2: Manual execution

```bash
# Run just the performance tests
npm run test:perf

# Generate the analysis report
npm run analyze:perf
```

## Understanding Performance Metrics

We measure the following key metrics:

### Core Web Vitals

1. **Largest Contentful Paint (LCP)**: Measures loading performance
   - Good: < 2.5s
   - Needs Improvement: 2.5s to 4s
   - Poor: > 4s

2. **First Input Delay (FID)**: Measures interactivity
   - Good: < 100ms
   - Needs Improvement: 100ms to 300ms
   - Poor: > 300ms

3. **Cumulative Layout Shift (CLS)**: Measures visual stability
   - Good: < 0.1
   - Needs Improvement: 0.1 to 0.25
   - Poor: > 0.25

### Additional Metrics

4. **First Contentful Paint (FCP)**: When the first content appears
   - Good: < 1.5s
   - Needs Improvement: 1.5s to 3s
   - Poor: > 3s

5. **Time to Interactive (TTI)**: When the page becomes fully interactive
   - Good: < 3.5s
   - Needs Improvement: 3.5s to 7.5s
   - Poor: > 7.5s

6. **Total Blocking Time (TBT)**: Sum of blocking time between FCP and TTI
   - Good: < 300ms
   - Needs Improvement: 300ms to 600ms
   - Poor: > 600ms

7. **Server Response Time**: Time for server to respond with content
   - Good: < 400ms
   - Needs Improvement: 400ms to 1000ms
   - Poor: > 1000ms

8. **JS Bundle Size**: Total size of JavaScript files
   - Good: < 500KB
   - Needs Improvement: 500KB to 1MB
   - Poor: > 1MB

## Performance Budgets

We have established the following performance budgets for our application:

| Metric | Budget |
|--------|--------|
| First Contentful Paint | 1500ms |
| Largest Contentful Paint | 2500ms |
| Time to Interactive | 3500ms |
| Total Blocking Time | 300ms |
| Cumulative Layout Shift | 0.1 |
| Server Response Time | 400ms |
| JS Bundle Size | 500KB |

These budgets are enforced by our automated performance tests.

## The Testing Process

Our performance tests use Puppeteer and Lighthouse to:

1. Open each route in a headless Chrome browser
2. Apply consistent network throttling and CPU throttling
3. Measure key performance metrics
4. Compare results against established budgets
5. Generate detailed reports

## Interpreting Test Results

The generated HTML report includes:

- A performance score (0-100) for each route
- Detailed metrics for each route
- Visualizations showing performance trends over time
- Color-coded indicators showing whether metrics meet the budget

### Performance Score Interpretation

- **90-100**: Excellent
- **80-89**: Good
- **50-79**: Needs Improvement
- **0-49**: Poor

## Common Performance Issues and Solutions

### Large Bundle Size

- Use code splitting to reduce initial load
- Implement lazy loading for components not needed on initial render
- Audit and remove unused dependencies

### Slow Server Response Time

- Optimize database queries
- Implement caching strategies
- Consider serverless functions for API routes

### Layout Shifts

- Always specify image dimensions
- Use content placeholders during loading
- Avoid dynamically injected content that changes layout

### Slow Rendering

- Implement virtualization for long lists
- Use React.memo to prevent unnecessary re-renders
- Consider using Web Workers for complex calculations

### Slow Initial Load

- Implement server-side rendering for critical pages
- Use Next.js Image component for optimized images
- Implement preloading for critical resources

## Continuous Performance Testing

We integrate performance testing into our development workflow:

1. Developers run performance tests locally before submitting changes
2. CI/CD pipeline runs performance tests on each pull request
3. Regular performance tests run on the staging environment
4. Performance metrics are tracked over time to identify trends

## Additional Resources

- [Web Vitals Documentation](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Performance Testing with Puppeteer](https://developers.google.com/web/tools/puppeteer/articles/ssr-puppeteer)
- [React Performance Optimization](https://reactjs.org/docs/optimizing-performance.html)
- [Next.js Performance Best Practices](https://nextjs.org/docs/advanced-features/measuring-performance) 