import { Layout, Menu } from 'antd';
import { menuItems } from '../../data/menuConfig.jsx';

const { Sider } = Layout;

const Sidebar = ({ currentPage, onMenuClick }) => {
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
        onClick={onMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;