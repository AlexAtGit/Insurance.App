# Probability Calculator

A modern Angular v19 application for performing probability calculations through a RESTful API.

## Features

- Clean, responsive user interface
- Input validation for probability values (0-1)
- Support for two calculation functions: "CombinedWith" and "Either"
- Comprehensive error handling
- Full unit test coverage
- TypeScript strict mode
- Reactive Forms for robust state management

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Angular CLI v19

## Installation

1. Install dependencies:
```bash
npm install
```

## Configuration

Update the API URL in your environment files:

- `src/environments/environment.ts` - Development environment
- `src/environments/environment.prod.ts` - Production environment

## Development

Run the development server:
```bash
ng serve
```

Navigate to `http://localhost:4200`. The application will automatically reload if you change any of the source files.

## Build

Build for production:
```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Testing

Run unit tests:
```bash
ng test
```

Run tests with code coverage:
```bash
ng test --code-coverage
```

Coverage reports will be generated in the `coverage/` directory.

## Project Structure
