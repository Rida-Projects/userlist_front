import UserList from './components/UserList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserList />

      <footer style={{ padding: '24px 0', marginTop: '24px' }}>
        <small className="mb-2 block text-xs" style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>&copy; 2025 Rida Rhnizar. All rights reserved.</small>
        <p className="text-xs mb-4" style={{ fontSize: '12px', marginBottom: '16px', color: '#6b7280', textAlign: 'center' }}>
          <span className="font-semibold" style={{ fontWeight: 600 }}>About this website:</span> built with React & Next.js, Java Spring Boot backend, AWS hosting.
        </p>
      </footer>
    </div>
  );
}
