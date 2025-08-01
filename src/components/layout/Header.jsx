import { Layout, Typography, Space, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className="qfc-header">
      <div className="header-left">
        <div className="logo-section">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="header-text">
            <Title level={3} style={{ margin: 0, color: 'white', fontSize: '24px' }}>
              QFC Employment Standards Office
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
              Compliance Management System
            </Text>
          </div>
        </div>
      </div>
      
      <div className="header-right">
        <Space align="center">
          <div className="user-info">
            <Text style={{ color: 'white', marginRight: '8px' }}>
              {user?.name || user?.email || 'User'}
            </Text>
            {user?.role && (
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginRight: '8px' }}>
                ({user.role})
              </Text>
            )}
          </div>
          <Dropdown 
            menu={{ items: userMenuItems }} 
            placement="bottomRight"
            trigger={['click']}
          >
            <Avatar 
              style={{ cursor: 'pointer' }}
              src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop"
              icon={<UserOutlined />}
            />
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;