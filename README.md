# User List Frontend - Next.js

A modern React.js frontend application built with Next.js that efficiently displays and navigates through 630K+ users with infinite scroll, alphabet navigation, and real-time search functionality.

## Features

- **Infinite Scroll**: Load more users as you scroll down
- **Alphabet Navigation**: Quick jump to users starting with specific letters
- **Real-time Search**: Search through the user list with instant results
- **Pagination**: Efficient loading of data in chunks (50 users at a time)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Visual feedback during data loading
- **Modern UI**: Clean, professional interface built with Tailwind CSS

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (version 18 or higher)
2. **The User List API** running on `http://localhost:8080`

## Getting Started

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

- `GET /api/users` - Get paginated list of all users
- `GET /api/users/alphabet` - Get alphabet navigation data
- `GET /api/users/letter/{letter}` - Get users starting with a specific letter
- `GET /api/users/search?q={query}` - Search users by name

## Usage

### Search Users
- Type in the search box to find users by name
- Search is performed in real-time as you type
- Clear the search by clicking the ✕ button

### Alphabet Navigation
- Click on any letter button to jump to users starting with that letter
- Each button shows the count of users for that letter
- Use the "Clear All" button to reset all filters

### Infinite Scroll
- Scroll down to automatically load more users
- The application loads 50 users at a time for optimal performance
- A loading indicator appears when fetching more data

### Error Handling
- If the API server is not running, you'll see a helpful error message
- Network errors are handled gracefully with user-friendly notifications

## Project Structure

```
app/
├── components/
│   └── UserList.tsx          # Main user list component
├── globals.css               # Global styles
├── layout.tsx                # Root layout component
└── page.tsx                  # Home page
```

## Key Implementation Details

### Performance Optimizations
- **Infinite Scroll**: Only loads 50 users at a time to prevent browser freezing
- **useCallback**: Prevents unnecessary re-renders of event handlers
- **Efficient State Management**: Proper state updates to avoid memory leaks
- **Debounced Search**: Real-time search without overwhelming the API

### TypeScript Integration
- Full TypeScript support with proper type definitions
- Interface definitions for API responses
- Type-safe event handlers and state management

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive grid layouts and flexible components
- Touch-friendly interface elements

## Customization

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

### Styling Customization
The application uses Tailwind CSS for styling. You can customize the appearance by:
- Modifying Tailwind classes in the component
- Adding custom CSS in `app/globals.css`
- Updating the Tailwind configuration

## Troubleshooting

### API Connection Issues
- Ensure the User List API is running on `http://localhost:8080`
- Check that CORS is properly configured on the API server
- Verify the API endpoints are accessible

### Performance Issues
- Reduce the page size if experiencing slow loading
- Check browser developer tools for network issues
- Ensure the API server can handle the request load

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - useState, useEffect, useCallback for state management

## License

