'use client'

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
  totalCount: number;
}


const UserList: React.FC = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [alphabetInfo, setAlphabetInfo] = useState<AlphabetInfo[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loadTime, setLoadTime] = useState<number>(0);

  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/users').replace(/\/$/, '');

  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleLetterClick = useCallback((letter: string) => {
    setSelectedLetter(letter);
    setCurrentPage(0);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedLetter(null);
    setCurrentPage(0);
  }, []);

  const fetchUsers = useCallback(async (page: number = 0, size: number = 50, letter?: string) => {
    const startTime = performance.now();
    setLoading(true);
    setError(null);
    try {
      const url = letter
        ? `${API_BASE}/letter/${encodeURIComponent(letter.toLowerCase())}?page=${page}&size=${size}`
        : `${API_BASE}?page=${page}&size=${size}`;
      console.log("Fetching users:", url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: UserListResponse = await response.json();
      const endTime = performance.now();
      const loadTimeMs = Math.round(endTime - startTime);
      
      console.log("=== API RESPONSE ===");
      console.log("Requested Page:", page, "Size:", size);
      console.log("Users received:", data.users.length);
      console.log("Total count:", data.totalCount);
      console.log("Load time:", loadTimeMs + "ms");
      console.log("First user:", data.users[0]);
      console.log("Last user:", data.users[data.users.length - 1]);
      console.log("==================");
      
      setUsers(data.users);
      setTotalCount(data.totalCount);
      setTotalPages(Math.ceil(data.totalCount / size));
      setLoadTime(loadTimeMs);
      setAlphabetInfo([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, pageSize, selectedLetter ?? undefined);
  }, [fetchUsers, currentPage, pageSize, selectedLetter]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', overflowX: 'hidden', width: '100%' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>
        User List (630K+ Users) - DEBUG MODE
      </h1>
      
      {/* Debug Info */}
      <div style={{ background: '#1f2937', color: '#f9fafb', padding: '15px', margin: '15px 0', border: '2px solid #3b82f6', borderRadius: '8px' }}>
        <h4 style={{ color: '#60a5fa', margin: '0 0 10px 0', fontSize: '16px' }}>🔍 Debug Info:</h4>
        <p style={{ margin: '5px 0', color: '#d1d5db' }}>Total users: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{totalCount.toLocaleString()}</span></p>
        <p style={{ margin: '5px 0', color: '#d1d5db' }}>Current page: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{currentPage + 1} of {totalPages}</span></p>
        <p style={{ margin: '5px 0', color: '#d1d5db' }}>Page size: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{pageSize.toLocaleString()}</span></p>
        <p style={{ margin: '5px 0', color: '#d1d5db' }}>Users on this page: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{users?.length || 0}</span></p>
        <p style={{ margin: '5px 0', color: '#d1d5db' }}>Load time: <span style={{ color: loadTime > 2000 ? '#ef4444' : loadTime > 1000 ? '#f59e0b' : '#10b981', fontWeight: 'bold' }}>{loadTime}ms</span></p>
        <p style={{ margin: '5px 0', color: '#d1d5db' }}>Loading: <span style={{ color: loading ? '#f59e0b' : '#10b981', fontWeight: 'bold' }}>{loading ? 'Yes' : 'No'}</span></p>
        <p style={{ margin: '5px 0', color: '#d1d5db' }}>Error: <span style={{ color: error ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{error || 'None'}</span></p>
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
          {LETTERS.map(l => (
            <button
              key={l}
              onClick={() => handleLetterClick(l)}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #3b82f6',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: selectedLetter === l ? '#3b82f6' : 'white',
                color: selectedLetter === l ? 'white' : '#3b82f6'
              }}
            >
              {l}
            </button>
          ))}
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

        {/* Pagination Controls - At Top of Table */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0 || loading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentPage === 0 || loading ? '#e2e8f0' : '#3b82f6',
                color: currentPage === 0 || loading ? '#9ca3af' : 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: currentPage === 0 || loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              ← Previous
            </button>
            
            <span style={{ 
              fontSize: '0.875rem', 
              color: '#374151',
              fontWeight: '500'
            }}>
              Page {currentPage + 1} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1 || loading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentPage >= totalPages - 1 || loading ? '#e2e8f0' : '#3b82f6',
                color: currentPage >= totalPages - 1 || loading ? '#9ca3af' : 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: currentPage >= totalPages - 1 || loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Next →
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: '#374151' }}>Page size:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(0); // Reset to first page when changing page size
              }}
              disabled={loading}
              style={{
                padding: '0.25rem 0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.875rem',
                backgroundColor: 'white',
                color: '#374151',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={1000}>1000</option>
              <option value={2000}>2000</option>
              <option value={5000}>5000</option>
              <option value={10000}>10000</option>
              <option value={50000}>50000</option>
            </select>
          </div>
        </div> 
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
          
          {users.length > 0 && (
            <div style={{ 
              padding: '1rem', 
              textAlign: 'center', 
              color: '#6b7280', 
              fontSize: '0.875rem',
              borderTop: '1px solid #e5e7eb',
              marginTop: '1rem'
            }}>
              Showing {users.length} of {totalCount.toLocaleString()} users
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserList;