import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { menuItems } from '../../data/menuConfig.jsx';

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current page from pathname
  const currentPage = location.pathname.slice(1) || 'dashboard';
  
  const handleMenuClick = (e) => {
    navigate(`/${e.key}`);
  };

  return (
    <Sider 
      width={280}
      theme="light"
      className="qfc-sidebar"
    >
      <Menu
        theme="light"
        selectedKeys={[currentPage]}
        mode="inline"
        items={menuItems}
        className="qfc-menu"
        onClick={handleMenuClick}
      />
    </Sider>
  );
  };

export default Sidebar;