# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Privacy Guardian is a modern browser privacy detection tool built with Next.js 14, designed to help users identify and understand privacy risks in their browsers.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: Zustand
- **UI Components**: Custom components with Radix UI primitives
- **Animations**: Framer Motion
- **Testing**: Jest + React Testing Library
- **Icons**: Lucide React

## Key Commands

```bash
# Development
npm run dev          # Start development server with Turbopack

# Testing
npm test            # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Build & Deploy
npm run build       # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

## Project Architecture

### Directory Structure
```
app/                    # Next.js App Router pages and API routes
├── api/               # API endpoints for detection services
├── layout.tsx         # Root layout with theme and error handling
└── page.tsx           # Main detection page

components/            # React components
├── ui/               # Reusable UI components (Button, Card, Toast, etc.)
├── detectors/        # Detection feature components
├── layout/           # Layout components (Header, Footer)
└── results/          # Result display components

lib/                   # Core business logic
├── detectors/        # Detection algorithms
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
└── utils/            # Utility functions

stores/               # Zustand state management
```

### Key Features

1. **Privacy Detection**
   - IP address detection with VPN/proxy detection
   - WebRTC leak detection
   - Browser fingerprinting analysis
   - Browser configuration checks

2. **User Experience**
   - Dark/light theme toggle
   - Real-time detection progress
   - Toast notifications for user feedback
   - Error boundaries for graceful error handling
   - Responsive design for all devices

3. **Code Quality**
   - Comprehensive test coverage
   - TypeScript for type safety
   - ESLint and Prettier for code consistency
   - Modular architecture for maintainability

## Development Guidelines

### Testing
- Write tests for all new detection logic
- Use React Testing Library for component tests
- Aim for >80% test coverage
- Run tests before committing

### Error Handling
- Use the toast system for user notifications
- Wrap components in error boundaries where appropriate
- Log errors to console in development
- Provide user-friendly error messages

### Performance
- Use React.lazy for code splitting where appropriate
- Optimize images with Next.js Image component
- Minimize API calls with proper caching
- Use Web Workers for heavy computations (planned)

### Accessibility
- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers

## Current Improvements in Progress

1. **High Priority**
   - ✅ Testing framework setup
   - ✅ Theme switching (dark/light mode)
   - ✅ Global error handling and toast notifications
   - ⏳ DNS leak detection
   - ⏳ IPv6 leak detection

2. **Medium Priority**
   - ⏳ Detection history with localStorage
   - ⏳ PDF report generation
   - ⏳ Performance optimization with Web Workers
   - ⏳ Parallel detection execution

3. **Low Priority**
   - ⏳ Privacy education center
   - ⏳ Real-time monitoring mode
   - ⏳ Detailed privacy recommendations

## API Endpoints

- `GET /api/detect-ip` - IP address detection
- `GET /api/detect-webrtc` - WebRTC leak detection (client-side indicator)
- `GET /api/fingerprint` - Browser fingerprint analysis (client-side indicator)

## Environment Variables

Currently no environment variables are required. In the future, we may add:
- API keys for third-party services
- Feature flags
- Analytics configuration

## Deployment

The app is optimized for deployment on Vercel:
```bash
npx vercel --prod
```

## Known Issues

- IP geolocation uses HTTP (ip-api.com) - should be proxied through our API
- WebRTC detection has a fixed 5-second timeout - could be optimized
- Some detection features require client-side execution

## Future Enhancements

- Add DNS leak detection
- Implement IPv6 leak detection
- Create browser extension
- Add multi-language support
- Implement user accounts for history tracking
- Add more detailed privacy recommendations