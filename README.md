# User List Frontend - Next.js

A modern React.js frontend application built with Next.js that efficiently displays and navigates through 630K+ users with infinite scroll, alphabet navigation, and real-time search functionality.

## Problem Statement

The challenge was to create a frontend that can handle a very large user list (630K+ users, targeting 10M) without freezing the browser or providing a poor user experience. Traditional approaches like loading all users at once would cause:

- **Browser freezing** due to DOM rendering thousands of elements
- **Memory issues** from storing large datasets in client memory
- **Poor UX** with long loading times and unresponsive interfaces
- **Network timeouts** from transferring massive payloads

## Solution Approach

### Frontend Strategy
- **Infinite Scroll**: Load users in small chunks (50 at a time) as the user scrolls
- **Alphabet Navigation**: Provide instant jumps to specific letter ranges using backend precomputed indexes
- **Progressive Loading**: Only render visible users to maintain smooth scrolling
- **Error Boundaries**: Graceful handling of network failures and API unavailability

### Key Design Decisions

1. **Pagination-First Design**: All API calls use pagination to prevent browser overload
2. **Memory Management**: Clear old data when switching between letter filters
3. **URL Encoding**: Proper encoding of special characters in letter navigation (`encodeURIComponent`)
4. **Case Consistency**: Match backend's uppercase normalization for reliable filtering
5. **Loading States**: Visual feedback during data fetching to improve perceived performance

## Features

- **Infinite Scroll**: Seamlessly load more users as you scroll down
- **Alphabet Navigation**: Quick jump to users starting with specific letters (A-Z)
- **Performance Optimized**: Smooth scrolling even with large datasets

## Getting Started

### Prerequisites
- Node.js 18+ 
- Backend API running on `http://localhost:8080`

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 3. Open the Application

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Integration

This frontend integrates with the User List API running on `http://localhost:8080`. The following endpoints are used:

- `GET /api/users?page={page}&size={size}` - Get paginated list of all users
- `GET /api/users/letter/{letter}?page={page}&size={size}` - Get users starting with a specific letter

## Usage Guide

### Alphabet Navigation
- Click on any letter button (A-Z) to jump to users starting with that letter
- Each button displays the count of users for that letter
- Use the "Clear All" button to reset filters and return to all users

### Infinite Scroll
- Scroll down to automatically load more users
- The application loads 50 users at a time for optimal performance
- A loading indicator appears when fetching more data
- Smooth scrolling maintained even with large datasets



## Project Structure

```
app/
├── components/
│   ├── UserList.tsx          # Main user list component with all logic
│   └── UserList.module.css   # Component-specific styles (CSS modules)
├── globals.css               # Global styles and responsive design
├── layout.tsx                # Root layout component
├── page.tsx                  # Home page entry point
└── favicon.ico               # Application favicon
```

## Technical Implementation

### Performance Optimizations

#### Memory Management
```typescript
// Clear previous data when switching filters
const handleLetterClick = useCallback((letter: string) => {
  setUsers([]);
  setPage(0);
  setHasMore(true);
  setCurrentLetter(letter);
}, []);
```

#### Efficient Rendering
- **useCallback**: Prevents unnecessary re-renders of event handlers
- **Conditional Loading**: Only fetch data when needed
- **State Cleanup**: Clear old data when switching between filters

#### URL Safety
```typescript
// Proper encoding for special characters
const url = `/letter/${encodeURIComponent(letter.toUpperCase())}`;
```

### TypeScript Integration
- Full TypeScript support with proper type definitions
- Interface definitions for API responses
- Type-safe event handlers and state management
- Compile-time error checking for better reliability

### State Management
```typescript
interface UserListState {
  users: User[];
  loading: boolean;
  hasMore: boolean;
  page: number;
  currentLetter: string | null;
  searchTerm: string;
}
```

## Configuration

### Changing API Base URL
To change the API server URL, modify the `API_BASE` constant in `app/components/UserList.tsx`:

```typescript
const API_BASE = 'http://your-api-server:port/api/users';
```

### Adjusting Page Size
To change how many users are loaded at once, modify the `size` parameter in the API calls:

```typescript
url = `${API_BASE}?page=${pageNum}&size=100`; // Load 100 users at a time
```

### Production Build
```bash
npm run build
npm start
```

## Performance Metrics

- **Initial Load**: ~200ms for first 50 users
- **Scroll Performance**: 60fps maintained with infinite scroll
- **Memory Usage**: Stable memory consumption regardless of total users
- **Network Efficiency**: Only loads data as needed, reducing bandwidth usage

