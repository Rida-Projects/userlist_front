'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './UserList.module.css';

interface User {
  index: number;
  name: string;
}

interface AlphabetInfo {
  letter: string;
  count: number;
}

interface UserListResponse {
  users: User[];
  hasNext: boolean;
  totalElements?: number;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [alphabetInfo, setAlphabetInfo] = useState<AlphabetInfo[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = 'http://localhost:8080/api/users';

  // Load alphabet navigation data
  useEffect(() => {
    const loadAlphabetInfo = async () => {
      try {
        const response = await fetch(`${API_BASE}/alphabet`);
        if (!response.ok) {
          throw new Error('Failed to load alphabet information');
        }
        const data = await response.json();
        setAlphabetInfo(data);
      } catch (error) {
        console.error('Error loading alphabet info:', error);
        // Fallback: Create alphabet buttons without counts
        const fallbackAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => ({
          letter,
          count: 0
        }));
        setAlphabetInfo(fallbackAlphabet);
        console.log('Using fallback alphabet navigation');
      }
    };

    loadAlphabetInfo();
  }, []);

  // Load users based on current state
  const loadUsers = useCallback(async (pageNum = 0, reset = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let url: string;
      
      // Build URL based on combined filters
      if (selectedLetter && searchQuery.trim()) {
        // Combined: Search within specific letter range
        url = `${API_BASE}/letter/${selectedLetter}/search?q=${encodeURIComponent(searchQuery.trim())}&page=${pageNum}&size=50`;
      } else if (selectedLetter) {
        // Only alphabet filter
        url = `${API_BASE}/letter/${selectedLetter}?page=${pageNum}&size=50`;
      } else if (searchQuery.trim()) {
        // Only search filter
        url = `${API_BASE}/search?q=${encodeURIComponent(searchQuery.trim())}&page=${pageNum}&size=50`;
      } else {
        // No filters - show all users
        url = `${API_BASE}?page=${pageNum}&size=50`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: UserListResponse = await response.json();
      
      if (reset) {
        setUsers(data.users);
      } else {
        setUsers(prev => [...prev, ...data.users]);
      }
      
      setHasMore(data.hasNext);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users. Please check if the API server is running.');
    } finally {
      setLoading(false);
    }
  }, [loading, selectedLetter, searchQuery]);

  // Initial load and reload when filters change
  useEffect(() => {
    loadUsers(0, true);
  }, [selectedLetter, searchQuery]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop 
        >= document.documentElement.offsetHeight - 1000) {
      if (hasMore && !loading) {
        loadUsers(page + 1, false);
      }
    }
  }, [hasMore, loading, page, loadUsers]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Handle alphabet navigation
  const handleLetterClick = (letter: string) => {
    // Toggle letter selection - if same letter clicked, deselect it
    if (selectedLetter === letter) {
      setSelectedLetter(null);
    } else {
      setSelectedLetter(letter);
    }
    setPage(0);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedLetter(null);
    setSearchQuery('');
    setPage(0);
  };

  // Debug logging
  console.log('UserList rendering:', { 
    users: users.length, 
    alphabetInfo: alphabetInfo.length, 
    loading, 
    error 
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>
        User List (630K+ Users) - DEBUG MODE
      </h1>
      
      {/* Debug Info */}
      <div style={{ background: '#1f2937', color: '#f9fafb', padding: '15px', margin: '15px 0', border: '2px solid #3b82f6', borderRadius: '8px' }}>
        <h4 style={{ color: '#60a5fa', margin: '0 0 10px 0', fontSize: '16px' }}>🔍 Debug Info:</h4>
        <p style={{ margin: '5px 0', color: '#d1d5db' }}>Users loaded: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{users.length}</span></p>
        <p style={{ margin: '5px 0', color: '#d1d5db' }}>Alphabet info: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{alphabetInfo.length}</span> letters</p>
        <p style={{ margin: '5px 0', color: '#d1d5db' }}>Loading: <span style={{ color: loading ? '#f59e0b' : '#10b981', fontWeight: 'bold' }}>{loading ? 'Yes' : 'No'}</span></p>
        <p style={{ margin: '5px 0', color: '#d1d5db' }}>Error: <span style={{ color: error ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{error || 'None'}</span></p>
        <p style={{ margin: '5px 0', color: '#d1d5db' }}>Selected letter: <span style={{ color: selectedLetter ? '#3b82f6' : '#6b7280', fontWeight: 'bold' }}>{selectedLetter || 'None'}</span></p>
        <p style={{ margin: '5px 0', color: '#d1d5db' }}>Search query: <span style={{ color: searchQuery ? '#3b82f6' : '#6b7280', fontWeight: 'bold' }}>"{searchQuery}"</span></p>
      </div>
      
      {/* Error Display */}
      {error && (
        <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '0.5rem' }}>
          {error}
        </div>
      )}
      
      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            style={{ width: '100%', maxWidth: '28rem', padding: '0.75rem 1rem', fontSize: '1.125rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none', color: '#1f2937', backgroundColor: 'white' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Alphabet Navigation */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>Quick Navigation:</h3>
          <button
            onClick={clearFilters}
            style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
          >
            Clear All
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {Array.isArray(alphabetInfo) && alphabetInfo.length > 0 ? (
            alphabetInfo.map(info => (
              <button
                key={info.letter}
                onClick={() => handleLetterClick(info.letter)}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #3b82f6',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backgroundColor: selectedLetter === info.letter ? '#3b82f6' : 'white',
                  color: selectedLetter === info.letter ? 'white' : '#3b82f6'
                }}
              >
                {info.letter} {info.count > 0 ? `(${info.count.toLocaleString()})` : ''}
              </button>
            ))
          ) : (
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Loading alphabet navigation...
            </div>
          )}
        </div>
      </div>

      {/* User List */}
      <div className={styles.userListSection}>
        <h3 className={styles.userListTitle}>
          {selectedLetter && searchQuery ? 
            `Users starting with '${selectedLetter}' containing '${searchQuery}'` :
           selectedLetter ? `Users starting with '${selectedLetter}'` : 
           searchQuery ? `Search results for '${searchQuery}'` : 
           'All Users'}
        </h3>
        
        <div className={styles.userListContainer}>
          {users.length === 0 && !loading ? (
            <div className={styles.userListEmpty}>
              No users found. Try adjusting your search or filters.
            </div>
          ) : (
            users.map((user, index) => (
              <div
                key={`${user.index}-${index}`}
                className={`${styles.userItem} ${
                  index % 2 === 0 ? styles.userItemEven : styles.userItemOdd
                }`}
              >
                <span className={styles.userIndex}>#{user.index + 1}</span>
                <span className={styles.userName}>{user.name}</span>
              </div>
            ))
          )}
          
          {loading && (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
                Loading more users...
              </div>
            </div>
          )}
          
          {!hasMore && users.length > 0 && (
            <div className={styles.loadingEnd}>
              No more users to load
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsContainer}>
        <div className={styles.statsText}>
          <div>Loaded: <span className={styles.statsValue}>{users.length.toLocaleString()}</span> users</div>
          {selectedLetter && (
            <div>Letter filter: <span className={styles.statsValue}>{selectedLetter}</span></div>
          )}
          {searchQuery && (
            <div>Search query: <span className={styles.statsValue}>"{searchQuery}"</span></div>
          )}
          {selectedLetter && searchQuery && (
            <div>Combined filters: <span className={styles.statsValue}>{selectedLetter} + "{searchQuery}"</span></div>
          )}
          {!selectedLetter && !searchQuery && (
            <div>Showing all users</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
