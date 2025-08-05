import { Row, Col, Typography, Card, List, Tag, Alert, Button, Breadcrumb, Badge, Divider, Progress, Space, Statistic } from 'antd';
import { ReloadOutlined, WarningOutlined, CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, ClockCircleOutlined, FileTextOutlined, HomeOutlined } from '@ant-design/icons';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import ReviewCard from '../components/ui/ReviewCard';
import { useCompliance } from '../contexts/ComplianceContext';
import { statsData, recentReviews } from '../data/mockData';
import TestApiWorkflow from '../components/TestApiWorkflow';
import { useEffect, useState } from 'react';
import { getLatestComprehensiveResponse, getComplianceSummaryForDashboard } from '../services/localStorageService';

const { Title, Text, Paragraph } = Typography;

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

  const [comprehensiveData, setComprehensiveData] = useState(null);
  const [apiResponseData, setApiResponseData] = useState(null);

  // Load comprehensive API response data
  useEffect(() => {
    const loadComprehensiveData = () => {
      try {
        const latestResponse = getLatestComprehensiveResponse();
        const complianceSummary = getComplianceSummaryForDashboard();
        
        if (latestResponse?.data) {
          setComprehensiveData(latestResponse.data);
        }
        
        if (complianceSummary) {
          setApiResponseData(complianceSummary);
        }
      } catch (error) {
        console.error('Error loading comprehensive data:', error);
      }
    };

    loadComprehensiveData();
  }, []);

  // Also load from cookie/localStorage (existing functionality)
  useEffect(() => {
    const cookieResponse = document.cookie
      .split('; ')
      .find(row => row.startsWith('lastUploadResponse='));
    
    if (cookieResponse) {
      try {
        const responseData = JSON.parse(decodeURIComponent(cookieResponse.split('=')[1]));
        if (responseData && responseData.final) {
          const parsedData = JSON.parse(responseData.final);
          if (!apiResponseData) { // Only set if we don't have comprehensive data
            setApiResponseData(parsedData);
          }
        }
      } catch (error) {
        console.error('Error parsing API response data:', error);
        setApiResponseData(null);
      }
    }
  }, [apiResponseData]);

  // Enhanced stats data with comprehensive response metrics
  const enhancedStatsData = apiResponseData ? [
    { 
      title: 'Reviews This Month', 
      value: apiResponseData.reviews_this_month || getTotalReviews(), 
      color: '#1890ff',
      backgroundColor: '#f0f8ff'
    },
    { 
      title: 'Compliance Rate', 
      value: apiResponseData.compliance_rate || getComplianceStatus(),
      color: apiResponseData.compliance_status === 'Compliant' ? '#52c41a' : '#ff4d4f',
      backgroundColor: apiResponseData.compliance_status === 'Compliant' ? '#f6ffed' : '#fff2f0'
    },
    { 
      title: 'Critical Gaps', 
      value: apiResponseData.critical_issues || getCriticalIssuesCount(),
      color: '#ff4d4f',
      backgroundColor: '#fff2f0'
    },
    { 
      title: 'Avg Review Time', 
      value: apiResponseData.avg_review_time || '2.3 hrs',
      suffix: '',
      color: '#faad14',
      backgroundColor: '#fffbe6'
    }
  ] : [
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

  // Get status color helper
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'compliant': return 'success';
      case 'non-compliant': return 'error';
      case 'partially compliant': return 'warning';
      default: return 'default';
    }
  };

  // Get risk level color
  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
      </Breadcrumb>

      <PageHeader
        title="Dashboard"
        subtitle="QFC compliance overview and key metrics"
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={refreshData}
              loading={loading}
            >
              Refresh Data
            </Button>
          </Space>
        }
      />

      {/* Error Display */}
      {error && (
        <Alert
          message="Error Loading Dashboard Data"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* Comprehensive Analysis Summary */}
      {comprehensiveData && (
        <Card 
          title="Latest Compliance Analysis" 
          style={{ marginBottom: '24px' }}
          extra={
            comprehensiveData.final_assessment?.confidence_score && (
              <Tag color="blue">Confidence: {comprehensiveData.final_assessment.confidence_score}</Tag>
            )
          }
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>Company: </Text>
                  <Text>{comprehensiveData.analysis_summary?.company_name || 'Not specified'}</Text>
                </div>
                <div>
                  <Text strong>Document Type: </Text>
                  <Text>{comprehensiveData.analysis_summary?.document_type || 'Unknown'}</Text>
                </div>
                <div>
                  <Text strong>Analysis Date: </Text>
                  <Text>{comprehensiveData.analysis_summary?.analysis_date || 'Unknown'}</Text>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>Compliance Status: </Text>
                  <Tag color={getStatusColor(comprehensiveData.final_assessment?.overall_compliance_status)}>
                    {comprehensiveData.final_assessment?.overall_compliance_status || 'Unknown'}
                  </Tag>
                </div>
                <div>
                  <Text strong>Risk Level: </Text>
                  <Tag color={getRiskLevelColor(comprehensiveData.final_assessment?.risk_level)}>
                    {comprehensiveData.final_assessment?.risk_level || 'Unknown'}
                  </Tag>
                </div>
                {comprehensiveData.final_assessment?.next_review_date && (
                  <div>
                    <Text strong>Next Review: </Text>
                    <Text>{comprehensiveData.final_assessment.next_review_date}</Text>
                  </div>
                )}
              </Space>
            </Col>
          </Row>
          
          {comprehensiveData.final_assessment?.executive_summary && (
            <>
              <Divider />
              <div>
                <Text strong>Executive Summary:</Text>
                <Paragraph style={{ marginTop: '8px' }}>
                  {comprehensiveData.final_assessment.executive_summary}
                </Paragraph>
              </div>
            </>
          )}
        </Card>
      )}

      {/* Key Metrics */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {enhancedStatsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard {...stat} />
          </Col>
        ))}
      </Row>

      {/* Critical Issues and Action Items */}
      {comprehensiveData && (
        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          {/* Critical Gaps */}
          {comprehensiveData.critical_gaps?.items?.length > 0 && (
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <span>
                    <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                    Critical Gaps ({comprehensiveData.critical_gaps.count})
                  </span>
                }
                size="small"
              >
                <List
                  dataSource={comprehensiveData.critical_gaps.items.slice(0, 5)}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
                        title={<Text strong>{item.gap_type}</Text>}
                        description={
                          <Space direction="vertical" size="small">
                            <Text type="secondary">{item.qfc_article}</Text>
                            <Text style={{ fontSize: '12px' }}>{item.immediate_action}</Text>
                          </Space>
                        }
                      />
                      <Tag color="error">{item.severity}</Tag>
                    </List.Item>
                  )}
                />
                {comprehensiveData.critical_gaps.items.length > 5 && (
                  <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <Text type="secondary">
                      +{comprehensiveData.critical_gaps.items.length - 5} more critical gaps
                    </Text>
                  </div>
                )}
              </Card>
            </Col>
          )}

          {/* Immediate Actions */}
          {comprehensiveData.action_plan?.immediate_actions?.length > 0 && (
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <span>
                    <ClockCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                    Immediate Actions ({comprehensiveData.action_plan.immediate_actions.length})
                  </span>
                }
                size="small"
              >
                <List
                  dataSource={comprehensiveData.action_plan.immediate_actions.slice(0, 5)}
                  renderItem={(action) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<ClockCircleOutlined style={{ color: '#ff4d4f' }} />}
                        description={<Text>{action}</Text>}
                      />
                    </List.Item>
                  )}
                />
                {comprehensiveData.action_plan.immediate_actions.length > 5 && (
                  <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <Text type="secondary">
                      +{comprehensiveData.action_plan.immediate_actions.length - 5} more actions
                    </Text>
                  </div>
                )}
              </Card>
            </Col>
          )}

          {/* Recommendations */}
          {comprehensiveData.recommendations?.items?.length > 0 && (
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <span>
                    <InfoCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                    Recommendations ({comprehensiveData.recommendations.count})
                  </span>
                }
                size="small"
              >
                <List
                  dataSource={comprehensiveData.recommendations.items.slice(0, 5)}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<InfoCircleOutlined style={{ color: '#1890ff' }} />}
                        title={<Text strong>{item.area}</Text>}
                        description={<Text style={{ fontSize: '12px' }}>{item.recommended_change}</Text>}
                      />
                      <Tag color={item.priority === 'High' ? 'error' : item.priority === 'Medium' ? 'warning' : 'success'}>
                        {item.priority}
                      </Tag>
                    </List.Item>
                  )}
                />
                {comprehensiveData.recommendations.items.length > 5 && (
                  <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <Text type="secondary">
                      +{comprehensiveData.recommendations.items.length - 5} more recommendations
                    </Text>
                  </div>
                )}
              </Card>
            </Col>
          )}

          {/* Compliant Areas */}
          {comprehensiveData.compliant_items?.items?.length > 0 && (
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <span>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                    Compliant Areas ({comprehensiveData.compliant_items.count})
                  </span>
                }
                size="small"
              >
                <List
                  dataSource={comprehensiveData.compliant_items.items.slice(0, 5)}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                        title={<Text strong>{item.compliance_area}</Text>}
                        description={
                          <Space direction="vertical" size="small">
                            <Text type="secondary">{item.qfc_article}</Text>
                            <Text style={{ fontSize: '12px' }}>{item.strength}</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
                {comprehensiveData.compliant_items.items.length > 5 && (
                  <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <Text type="secondary">
                      +{comprehensiveData.compliant_items.items.length - 5} more compliant areas
                    </Text>
                  </div>
                )}
              </Card>
            </Col>
          )}
        </Row>
      )}

      {/* Fallback Dashboard Content */}
      {!comprehensiveData && (
        <>
          {/* Traditional dashboard content */}
          {dashboardData && !apiResponseData && (
            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
              <Col xs={24} lg={12}>
                <Card title="Compliance Overview" size="small">
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text>Compliance Status:</Text>
                      <Tag color={getStatusColor(dashboardData.compliance_status)}>
                        {dashboardData.compliance_status}
                      </Tag>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text>Critical Issues:</Text>
                      <Badge count={dashboardData.critical_issues} style={{ backgroundColor: '#ff4d4f' }} />
                    </div>
                  </Space>
                </Card>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card title="Recent Activity" size="small">
                  <Text type="secondary">
                    Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
                  </Text>
                </Card>
              </Col>
            </Row>
          )}

          {/* Recent Reviews */}
          <Row gutter={[24, 24]}>
            <Col xs={24} xl={16}>
              <Card title="Recent Reviews" size="small">
                <List
                  dataSource={getRecentReviews().slice(0, 5)}
                  renderItem={(review) => (
                    <ReviewCard key={review.id} review={review} />
                  )}
                />
              </Card>
            </Col>

            <Col xs={24} xl={8}>
              <Card title="Key Issues" size="small">
                <List
                  dataSource={getKeyIssues().slice(0, 5)}
                  renderItem={(issue) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<WarningOutlined style={{ color: '#faad14' }} />}
                        title={issue.title}
                        description={issue.description}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Test API Workflow */}
      <Divider style={{ margin: '40px 0 24px 0' }} />
      <TestApiWorkflow />
    </div>
  );
};

export default Dashboard;