import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import { Header, Sidebar } from './components/layout';
import { Dashboard, NewReview, AllReviews, Regulations, Reports, Settings, LoginPage, ReviewResults } from './pages';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import './styles/App.css';

const { Content } = Layout;

// Main app layout for authenticated routes
const AppLayout = () => {
  const [currentPage, setCurrentPage] = React.useState('dashboard');

  const handleMenuClick = (e) => {
    setCurrentPage(e.key);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'new-review':
        return <NewReview />;
      case 'all-reviews':
        return <AllReviews />;
      case 'regulations':
        return <Regulations />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      
      <Layout>
        <Sidebar currentPage={currentPage} onMenuClick={handleMenuClick} />
        
        <Content className="qfc-content">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

// Router-based app layout (for future expansion)
const RouterAppLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      
      <Layout>
        <Sidebar />
        
        <Content className="qfc-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-review" element={<NewReview />} />
            <Route path="/all-reviews" element={<AllReviews />} />
            <Route path="/regulations" element={<Regulations />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route - Login */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;