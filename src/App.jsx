import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Tag,
  Avatar,
  Space,
  Table,
  Button,
  Input,
  Select,
  Form,
  Progress,
  Divider
} from 'antd';
import {
  DashboardOutlined,
  PlusOutlined,
  FileTextOutlined,
  BookOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  SearchOutlined,
  DownloadOutlined,
  MailOutlined,
  FileAddOutlined,
  WarningOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  FileProtectOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  PercentageOutlined
} from '@ant-design/icons';
import './App.css';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Statistics data matching the design
  const statsData = [
    { 
      title: 'Reviews This Month', 
      value: 23, 
      color: '#1890ff',
      backgroundColor: '#f0f8ff'
    },
    { 
      title: 'Compliance Rate', 
      value: 89, 
      suffix: '%',
      color: '#52c41a',
      backgroundColor: '#f6ffed'
    },
    { 
      title: 'Violations Found', 
      value: 156,
      color: '#faad14',
      backgroundColor: '#fffbe6'
    },
    { 
      title: 'Avg Review Time', 
      value: '2.3 hrs',
      color: '#722ed1',
      backgroundColor: '#f9f0ff'
    }
  ];

  // Recent reviews data
  const recentReviews = [
    {
      id: 1,
      title: 'ABC Corporation Employment Contract',
      subtitle: 'Submitted 2 hours ago • 5 violations found',
      status: 'Completed',
      statusColor: '#52c41a'
    },
    {
      id: 2,
      title: 'XYZ Ltd HR Manual Review',
      subtitle: 'Submitted 1 day ago • Processing...',
      status: 'In Progress',
      statusColor: '#faad14'
    },
    {
      id: 3,
      title: 'DEF Industries Policy Update',
      subtitle: 'Submitted 3 days ago • Requires attention',
      status: 'Needs Review',
      statusColor: '#ff4d4f'
    }
  ];

  // All Reviews table data
  const allReviewsData = [
    {
      key: '1',
      company: 'ABC Corporation',
      email: 'abc@company.com',
      documentType: 'Employment Contract & HR Manual',
      submitted: '2 hours ago',
      status: 'Completed',
      violations: '5 Critical',
      violationsColor: '#ff4d4f'
    },
    {
      key: '2',
      company: 'XYZ Limited',
      email: 'hr@xyzltd.com',
      documentType: 'HR Policy Manual',
      submitted: '1 day ago',
      status: 'In Progress',
      violations: 'Processing...',
      violationsColor: '#faad14'
    },
    {
      key: '3',
      company: 'DEF Industries',
      email: 'legal@def.com',
      documentType: 'Employment Contract',
      submitted: '3 days ago',
      status: 'Needs Review',
      violations: '3 Issues',
      violationsColor: '#faad14'
    },
    {
      key: '4',
      company: 'GHI Enterprises',
      email: 'compliance@ghi.com',
      documentType: 'Complete Package',
      submitted: '1 week ago',
      status: 'Completed',
      violations: '0 Issues',
      violationsColor: '#52c41a'
    }
  ];

  const allReviewsColumns = [
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#262626' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Document Type',
      dataIndex: 'documentType',
      key: 'documentType',
    },
    {
      title: 'Submitted',
      dataIndex: 'submitted',
      key: 'submitted',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '#52c41a';
        if (status === 'In Progress') color = '#faad14';
        if (status === 'Needs Review') color = '#ff4d4f';
        
        return (
          <Tag color={color} style={{ borderRadius: '12px', fontWeight: 500 }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Violations',
      dataIndex: 'violations',
      key: 'violations',
      render: (text, record) => (
        <span style={{ color: record.violationsColor, fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'Completed' ? (
            <Button type="primary" size="small">View Report</Button>
          ) : record.status === 'Needs Review' ? (
            <Button type="primary" size="small">Review</Button>
          ) : (
            <Button size="small">View Status</Button>
          )}
        </Space>
      ),
    },
  ];

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'new-review',
      icon: <PlusOutlined />,
      label: 'New Review',
    },
    {
      key: 'all-reviews',
      icon: <FileTextOutlined />,
      label: 'All Reviews',
    },
    {
      key: 'regulations',
      icon: <BookOutlined />,
      label: 'Regulations',
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = (e) => {
    setCurrentPage(e.key);
  };

  const renderDashboard = () => (
    <div>
      <div className="content-header">
        <Title level={2} style={{ margin: 0, color: '#262626', fontSize: '32px', fontWeight: '600' }}>
          Dashboard
        </Title>
        <Text style={{ color: '#8c8c8c', fontSize: '16px', marginTop: '8px', display: 'block' }}>
          Welcome back, Sarah. Here's your compliance overview for today.
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="stat-card" style={{ backgroundColor: stat.backgroundColor }}>
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                valueStyle={{ 
                  color: '#262626', 
                  fontSize: '36px', 
                  fontWeight: '700',
                  lineHeight: '1.2'
                }}
                className="qfc-statistic"
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Reviews Section */}
      <div className="recent-reviews-section">
        <Title level={3} style={{ marginBottom: '24px', color: '#262626', fontSize: '24px' }}>
          Recent Reviews
        </Title>
        
        <div className="reviews-list">
          {recentReviews.map((review) => (
            <Card key={review.id} className="review-card">
              <div className="review-content">
                <div className="review-info">
                  <Title level={4} style={{ margin: 0, color: '#262626', fontSize: '18px', fontWeight: '600' }}>
                    {review.title}
                  </Title>
                  <Text style={{ color: '#8c8c8c', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                    {review.subtitle}
                  </Text>
                </div>
                <div className="review-status">
                  <Tag 
                    color={review.statusColor}
                    style={{ 
                      fontSize: '12px', 
                      padding: '4px 12px',
                      borderRadius: '16px',
                      border: 'none',
                      fontWeight: '500'
                    }}
                  >
                    {review.status}
                  </Tag>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNewReview = () => (
    <div>
      <div className="content-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <Title level={2} style={{ margin: 0, color: '#262626', fontSize: '32px', fontWeight: '600' }}>
          Start New Compliance Review
        </Title>
        <Text style={{ color: '#8c8c8c', fontSize: '16px', marginTop: '8px', display: 'block' }}>
          Upload employment documents to analyze against QFC regulations
        </Text>
      </div>

      <div className="upload-section">
        <Card className="upload-card">
          <div className="upload-area">
            <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <Text style={{ color: '#8c8c8c', fontSize: '16px', marginBottom: '24px', display: 'block' }}>
              Drag and drop files here, or click to browse
            </Text>
            <Button type="primary" size="large" icon={<PlusOutlined />}>
              Choose Files
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderAllReviews = () => (
    <div>
      <div className="content-header">
        <Title level={2} style={{ margin: 0, color: '#262626', fontSize: '32px', fontWeight: '600' }}>
          All Reviews
        </Title>
        <Text style={{ color: '#8c8c8c', fontSize: '16px', marginTop: '8px', display: 'block' }}>
          Manage and track all compliance reviews
        </Text>
      </div>

      <div className="filters-section" style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col>
            <Select defaultValue="all-statuses" style={{ width: 150 }}>
              <Option value="all-statuses">All Statuses</Option>
              <Option value="completed">Completed</Option>
              <Option value="in-progress">In Progress</Option>
              <Option value="needs-review">Needs Review</Option>
            </Select>
          </Col>
          <Col>
            <Select defaultValue="last-30-days" style={{ width: 150 }}>
              <Option value="last-30-days">Last 30 Days</Option>
              <Option value="last-7-days">Last 7 Days</Option>
              <Option value="last-90-days">Last 90 Days</Option>
            </Select>
          </Col>
          <Col flex="auto">
            <Input
              placeholder="Search company name..."
              prefix={<SearchOutlined />}
              style={{ maxWidth: 300 }}
            />
          </Col>
          <Col>
            <Button type="primary" icon={<SearchOutlined />}>
              Search
            </Button>
          </Col>
        </Row>
      </div>

      <Card>
        <Table
          columns={allReviewsColumns}
          dataSource={allReviewsData}
          pagination={{ pageSize: 10 }}
          className="reviews-table"
        />
      </Card>
    </div>
  );

  const renderRegulations = () => (
    <div>
      <div className="content-header">
        <Title level={2} style={{ margin: 0, color: '#262626', fontSize: '32px', fontWeight: '600' }}>
          Compliance Analysis Results
        </Title>
        <Text style={{ color: '#8c8c8c', fontSize: '16px', marginTop: '8px', display: 'block' }}>
          Analysis completed for ABC Corporation Employment Contract & HR Manual
        </Text>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <Space size="middle">
          <Button type="primary" icon={<DownloadOutlined />} size="large">
            Download Report
          </Button>
          <Button icon={<MailOutlined />} size="large">
            Email Results
          </Button>
          <Button icon={<FileAddOutlined />} size="large">
            Create Action Plan
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="analysis-card critical">
            <div className="analysis-content">
              <WarningOutlined style={{ fontSize: '24px', color: '#ff4d4f', marginBottom: '12px' }} />
              <Title level={4} style={{ color: '#ff4d4f', margin: 0 }}>Critical Violations</Title>
              <div className="analysis-number">5</div>
              <Text style={{ color: '#666', fontSize: '14px' }}>
                Mandatory compliance issues that require immediate attention
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="analysis-card recommendations">
            <div className="analysis-content">
              <BulbOutlined style={{ fontSize: '24px', color: '#faad14', marginBottom: '12px' }} />
              <Title level={4} style={{ color: '#faad14', margin: 0 }}>Recommendations</Title>
              <div className="analysis-number">2</div>
              <Text style={{ color: '#666', fontSize: '14px' }}>
                Best practice improvements suggested
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="analysis-card inconsistencies">
            <div className="analysis-content">
              <FileProtectOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '12px' }} />
              <Title level={4} style={{ color: '#1890ff', margin: 0 }}>Inconsistencies</Title>
              <div className="analysis-number">2</div>
              <Text style={{ color: '#666', fontSize: '14px' }}>
                Internal document conflicts found
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="analysis-card compliant">
            <div className="analysis-content">
              <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '12px' }} />
              <Title level={4} style={{ color: '#52c41a', margin: 0 }}>Compliant Items</Title>
              <div className="analysis-number">15</div>
              <Text style={{ color: '#666', fontSize: '14px' }}>
                Areas meeting QFC standards
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderReports = () => (
    <div>
      <div className="content-header">
        <Title level={2} style={{ margin: 0, color: '#262626', fontSize: '32px', fontWeight: '600' }}>
          Reports & Analytics
        </Title>
        <Text style={{ color: '#8c8c8c', fontSize: '16px', marginTop: '8px', display: 'block' }}>
          Generate comprehensive compliance reports and view analytics
        </Text>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <Space size="middle">
          <Button type="primary" icon={<FileTextOutlined />} size="large">
            Generate Monthly Report
          </Button>
          <Button icon={<RiseOutlined />} size="large">
            Compliance Trends
          </Button>
          <Button icon={<WarningOutlined />} size="large">
            Violation Summary
          </Button>
          <Button icon={<BarChartOutlined />} size="large">
            Company Performance
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card title="Compliance Rate Trend" className="chart-card">
            <div className="chart-placeholder">
              <RiseOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Progress percent={89} strokeColor="#1890ff" />
              <Text style={{ color: '#8c8c8c', fontSize: '14px', marginTop: '12px', display: 'block' }}>
                89% average compliance rate this quarter
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Top Violations" className="violations-card">
            <div className="violations-list">
              <div className="violation-item">
                <Text>Overtime Pay Issues</Text>
                <span className="violation-count" style={{ color: '#ff4d4f' }}>23</span>
              </div>
              <div className="violation-item">
                <Text>Vacation Days</Text>
                <span className="violation-count" style={{ color: '#ff4d4f' }}>18</span>
              </div>
              <div className="violation-item">
                <Text>Probation Period</Text>
                <span className="violation-count" style={{ color: '#ff4d4f' }}>15</span>
              </div>
              <div className="violation-item">
                <Text>Sick Leave</Text>
                <span className="violation-count" style={{ color: '#ff4d4f' }}>12</span>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Review Performance" className="performance-card">
            <div className="performance-metrics">
              <div className="metric-item">
                <ClockCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                <div className="metric-value" style={{ color: '#52c41a' }}>2.3hrs</div>
                <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>Average review time</Text>
              </div>
              <Divider />
              <div className="metric-item">
                <PercentageOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                <div className="metric-value" style={{ color: '#1890ff' }}>96%</div>
                <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>AI accuracy rate</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Recent Reports" style={{ marginTop: '24px' }}>
        <div className="recent-reports">
          <Text style={{ color: '#8c8c8c' }}>No recent reports generated</Text>
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div>
      <div className="content-header">
        <Title level={2} style={{ margin: 0, color: '#262626', fontSize: '32px', fontWeight: '600' }}>
          Settings
        </Title>
        <Text style={{ color: '#8c8c8c', fontSize: '16px', marginTop: '8px', display: 'block' }}>
          Configure system preferences and user settings
        </Text>
      </div>

      <Card title="User Profile" style={{ marginBottom: '24px' }}>
        <Form layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item label="Full Name">
            <Input defaultValue="Sarah Johnson" />
          </Form.Item>
          <Form.Item label="Email Address">
            <Input defaultValue="sarah.johnson@qfc.gov" />
          </Form.Item>
          <Form.Item label="Department">
            <Select defaultValue="employment-standards" style={{ width: '100%' }}>
              <Option value="employment-standards">Employment Standards Office</Option>
              <Option value="legal">Legal Department</Option>
              <Option value="compliance">Compliance Team</Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Notification Preferences">
        <Text style={{ color: '#8c8c8c' }}>Configure your notification settings here</Text>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return renderDashboard();
      case 'new-review':
        return renderNewReview();
      case 'all-reviews':
        return renderAllReviews();
      case 'regulations':
        return renderRegulations();
      case 'reports':
        return renderReports();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="qfc-header">
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
            <Text style={{ color: 'white', marginRight: '8px' }}>Sarah Johnson</Text>
            <Avatar 
              src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop"
              icon={<UserOutlined />}
            />
          </Space>
        </div>
      </Header>
      
      <Layout>
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
        
        <Content className="qfc-content">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;