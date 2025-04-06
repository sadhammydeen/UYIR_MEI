# Uyir Mei Platform

A comprehensive NGO management and collaboration platform to connect NGOs, volunteers, donors, and beneficiaries.

## Overview

Uyir Mei is a platform designed to optimize NGO operations through:

- NGO profile management with verification and impact metrics
- Volunteer-NGO matching system
- Donor engagement and transparent donation tracking
- NGO collaboration tools for projects and resource sharing
- Beneficiary connection and support tracking
- Performance monitoring and impact visualization

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or later)
- npm or yarn
- Firebase account (for authentication and database)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/uyir-mei.git
   cd uyir-mei
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn
   ```

3. Set up Firebase:
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Set up Firestore database
   - Add your Firebase configuration to `.env.local`:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
uyir-mei/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app directory and routes
│   │   ├── auth/       # Authentication components
│   │   ├── dashboard/  # Dashboard components
│   │   ├── ngo/        # NGO-specific components
│   │   ├── performance/# Performance tracking components
│   │   ├── shared/     # Shared components
│   │   └── ui/         # UI components (buttons, inputs, etc.)
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and services
│   │   ├── auth.ts     # Authentication service
│   │   ├── firebase.ts # Firebase configuration
│   │   ├── ngo.ts      # NGO data service
│   │   └── apiClient.ts# API client with caching
│   ├── store/          # Global state management (Zustand)
│   ├── styles/         # Global styles
│   ├── tests/          # Test files
│   │   └── performance.perf.js # Performance tests
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper utilities
└── tailwind.config.js  # Tailwind CSS configuration
```

## Architecture

### Frontend

- **Next.js**: React framework for server-side rendering and static site generation
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling components
- **shadcn/ui**: UI component library based on Radix UI
- **Zustand**: For global state management
- **React Query**: For data fetching, caching, and state management
- **React Virtualized**: For optimized rendering of large lists

### Backend

- **Firebase Authentication**: For user authentication
- **Firestore**: NoSQL database for storing application data
- **Firebase Storage**: For storing files and media
- **Firebase Functions**: For serverless APIs and background jobs

## Key Features

### NGO Management

- Comprehensive profiles with impact metrics
- Verification system with certification badges
- Project management and impact tracking

### Volunteer System

- Skill-based matching with NGO needs
- Hours tracking and impact visualization
- Volunteer recognition system

### Donation Platform

- Transparent fund allocation
- Impact tracking for donations
- Recurring donation management

### Collaboration Tools

- Partner finder for NGO-to-NGO collaboration
- Resource sharing marketplace
- Project co-creation workspace

### Impact Visualization

- Interactive dashboards
- Impact leaderboards
- Certification badges

## Performance Testing

The platform includes automated performance testing to ensure optimal user experience:

### Setup Performance Tests

1. Ensure you have the required dependencies:
   ```
   npm install --save-dev puppeteer lighthouse mocha chai
   ```

2. Run the performance tests:
   ```
   npm run test:perf
   ```

### Performance Budget

We maintain strict performance budgets to ensure fast loading times:

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Total Blocking Time: < 300ms
- Cumulative Layout Shift: < 0.1
- Server Response Time: < 400ms
- Total JS Bundle Size: < 500KB

### Optimizations

- Code splitting
- Lazy loading
- Image optimization
- Component virtualization for lists
- Efficient state management with Zustand
- API caching with React Query
- Memoization of expensive calculations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
