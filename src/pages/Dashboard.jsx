import { Row, Col, Typography, Card, List, Tag, Alert, Button } from 'antd';
import { ReloadOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import ReviewCard from '../components/ui/ReviewCard';
import { useCompliance } from '../contexts/ComplianceContext';
import { statsData, recentReviews } from '../data/mockData';
import TestApiWorkflow from '../components/TestApiWorkflow';

const { Title, Text } = Typography;

const Dashboard = () => {
  const {
    dashboardData,
    getComplianceStatus,
    getCriticalIssuesCount,
    getMustFixItems,
    getKeyIssues,
    getRecentReviews,
    getTotalReviews,
    refreshData,
    loading,
    error,
    lastUpdated
  } = useCompliance();

  // Enhanced stats data with real compliance data
  const enhancedStatsData = [
    { 
      title: 'Total Reviews', 
      value: getTotalReviews(), 
      color: '#1890ff',
      backgroundColor: '#f0f8ff'
    },
    { 
      title: 'Compliance Status', 
      value: getComplianceStatus(),
      color: getComplianceStatus() === 'Compliant' ? '#52c41a' : '#ff4d4f',
      backgroundColor: getComplianceStatus() === 'Compliant' ? '#f6ffed' : '#fff2f0'
    },
    { 
      title: 'Critical Issues', 
      value: getCriticalIssuesCount(),
      color: '#ff4d4f',
      backgroundColor: '#fff2f0'
    },
    { 
      title: 'Must Fix Items', 
      value: getMustFixItems().length,
      suffix: ' items',
      color: '#faad14',
      backgroundColor: '#fffbe6'
    }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'compliant': return 'success';
      case 'non-compliant': return 'error';
      case 'partially compliant': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, Sarah. Here's your compliance overview for today."
        extra={
          <Button 
            icon={<ReloadOutlined />} 
            onClick={refreshData}
            loading={loading}
          >
            Refresh Data
          </Button>
        }
      />

      {/* Error Alert */}
      {error && (
        <Alert
          message="Error Loading Compliance Data"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* Last Updated Info */}
      {lastUpdated && (
        <div style={{ marginBottom: '16px', textAlign: 'right' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </Text>
        </div>
      )}

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        {enhancedStatsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard {...stat} />
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        {/* Compliance Summary */}
        {dashboardData && (
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <WarningOutlined style={{ color: '#faad14' }} />
                  Compliance Summary
                </div>
              }
              size="small"
            >
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Status: </Text>
                <Tag color={getStatusColor(dashboardData.compliance_status)}>
                  {dashboardData.compliance_status}
                </Tag>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Critical Issues: </Text>
                <Text style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                  {dashboardData.critical_issues}
                </Text>
              </div>

              {getMustFixItems().length > 0 && (
                <div>
                  <Text strong style={{ marginBottom: '8px', display: 'block' }}>
                    Must Fix Items:
                  </Text>
                  <List
                    size="small"
                    dataSource={getMustFixItems().slice(0, 3)}
                    renderItem={(item, index) => (
                      <List.Item style={{ padding: '4px 0' }}>
                        <Text style={{ fontSize: '13px' }}>
                          {index + 1}. {item}
                        </Text>
                      </List.Item>
                    )}
                  />
                  {getMustFixItems().length > 3 && (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      +{getMustFixItems().length - 3} more items
                    </Text>
                  )}
                </div>
              )}
            </Card>
          </Col>
        )}

        {/* Key Issues */}
        {getKeyIssues().length > 0 && (
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircleOutlined style={{ color: '#1890ff' }} />
                  Key Compliance Issues
                </div>
              }
              size="small"
            >
              <List
                size="small"
                dataSource={getKeyIssues().slice(0, 4)}
                renderItem={(issue, index) => (
                  <List.Item style={{ padding: '8px 0' }}>
                    <div>
                      <Text strong style={{ fontSize: '13px', color: '#262626' }}>
                        {issue.qfc_article || `Issue ${index + 1}`}
                      </Text>
                      <br />
                      <Text style={{ fontSize: '12px', color: '#666' }}>
                        {issue.violation || issue.description || 'No description available'}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
              {getKeyIssues().length > 4 && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  +{getKeyIssues().length - 4} more issues
                </Text>
              )}
            </Card>
          </Col>
        )}
      </Row>

      {/* Test API Workflow Component */}
      {/* <TestApiWorkflow /> */}

      {/* Recent Reviews Section */}
      <div className="recent-reviews-section">
        <Title level={3} style={{ marginBottom: '24px', color: '#262626', fontSize: '24px' }}>
          Recent Reviews
        </Title>
        
        <div className="reviews-list">
          {/* Show compliance-based reviews if available, otherwise fallback to mock data */}
          {getRecentReviews().length > 0 ? (
            getRecentReviews().map((review) => (
              <Card key={review.id} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Title level={5} style={{ margin: 0, color: '#262626' }}>
                      {review.company} - {review.document_type}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                      {new Date(review.timestamp).toLocaleString()} • {review.critical_count} critical issues
                    </Text>
                  </div>
                  <Tag color={getStatusColor(review.status)}>
                    {review.status}
                  </Tag>
                </div>
              </Card>
            ))
          ) : (
            recentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;