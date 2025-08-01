import React, { useState } from 'react';
import { Layout } from 'antd';
import { Header, Sidebar } from './components/layout';
import { Dashboard, NewReview, AllReviews, Regulations, Reports, Settings } from './pages';
import './styles/App.css';

const { Content } = Layout;

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

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
}

export default App;