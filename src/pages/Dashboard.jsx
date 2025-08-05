import { Row, Col, Typography, Card, List, Tag, Alert, Button, Breadcrumb, Badge, Divider, Progress, Space, Statistic } from 'antd';
import { ReloadOutlined, WarningOutlined, CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, ClockCircleOutlined, FileTextOutlined, HomeOutlined } from '@ant-design/icons';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import ReviewCard from '../components/ui/ReviewCard';
import { useCompliance } from '../contexts/ComplianceContext';
import { statsData, recentReviews } from '../data/mockData';
import TestApiWorkflow from '../components/TestApiWorkflow';
import { useEffect, useState } from 'react';

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

  const [apiResponseData, setApiResponseData] = useState(null);

  // Load API response data from cookie/localStorage
  useEffect(() => {
    const cookieResponse = document.cookie
      .split('; ')
      .find(row => row.startsWith('lastUploadResponse='));
    
    if (cookieResponse) {
      try {
        const responseData = JSON.parse(decodeURIComponent(cookieResponse.split('=')[1]));
        if (responseData && responseData.final) {
          const parsedData = JSON.parse(responseData.final);
          setApiResponseData(parsedData);
        }
      } catch (error) {
        console.error('Error parsing API response data:', error);
        // Silently handle the error - show fallback UI
        setApiResponseData(null);
      }
    }
  }, []);

  // Enhanced stats data with real compliance data and API response metrics
  const enhancedStatsData = apiResponseData ? [
    { 
      title: 'Reviews This Month', 
      value: apiResponseData.dashboard_metrics?.reviews_this_month || getTotalReviews(), 
      color: '#1890ff',
      backgroundColor: '#f0f8ff'
    },
    { 
      title: 'Compliance Rate', 
      value: apiResponseData.dashboard_metrics?.compliance_rate || getComplianceStatus(),
      color: apiResponseData.final_assessment?.overall_compliance_status === 'Compliant' ? '#52c41a' : '#ff4d4f',
      backgroundColor: apiResponseData.final_assessment?.overall_compliance_status === 'Compliant' ? '#f6ffed' : '#fff2f0'
    },
    { 
      title: 'Critical Gaps', 
      value: apiResponseData.dashboard_metrics?.total_critical_gaps || getCriticalIssuesCount(),
      color: '#ff4d4f',
      backgroundColor: '#fff2f0'
    },
    { 
      title: 'Avg Review Time', 
      value: apiResponseData.dashboard_metrics?.avg_review_time || '2.3 hrs',
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'compliant': return 'success';
      case 'non-compliant': return 'error';
      case 'partially compliant': return 'warning';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'default';
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

      {/* Analysis Summary Section */}
      {apiResponseData?.analysis_summary && (
        <Card 
          style={{ marginBottom: '24px' }}
          bordered={false}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Statistic 
                title="Document Type" 
                value={apiResponseData.analysis_summary.document_type}
                valueStyle={{ fontSize: '14px' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic 
                title="Company" 
                value={apiResponseData.analysis_summary.company_name || 'Not specified'}
                valueStyle={{ fontSize: '14px' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic 
                title="Analysis Date" 
                value={apiResponseData.analysis_summary.analysis_date}
                valueStyle={{ fontSize: '14px' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div>
                <Text strong>Overall Status</Text>
                <div style={{ marginTop: '8px' }}>
                  <Tag color={getStatusColor(apiResponseData.analysis_summary.overall_status)}>
                    {apiResponseData.analysis_summary.overall_status}
                  </Tag>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      )}

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

      {/* Final Assessment Banner */}
      {apiResponseData?.final_assessment && (
        <Card 
          style={{ marginBottom: '24px', borderLeft: `4px solid ${apiResponseData.final_assessment.overall_compliance_status === 'Compliant' ? '#52c41a' : '#ff4d4f'}` }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} lg={18}>
              <div>
                <Title level={4} style={{ margin: 0, marginBottom: '8px' }}>
                  Final Compliance Assessment
                </Title>
                <Space size="large" wrap>
                  <div>
                    <Text strong>Status: </Text>
                    <Tag color={getStatusColor(apiResponseData.final_assessment.overall_compliance_status)} style={{ fontWeight: 'bold' }}>
                      {apiResponseData.final_assessment.overall_compliance_status}
                    </Tag>
                  </div>
                  <div>
                    <Text strong>Risk Level: </Text>
                    <Tag color={getRiskColor(apiResponseData.final_assessment.risk_level)}>
                      {apiResponseData.final_assessment.risk_level}
                    </Tag>
                  </div>
                  <div>
                    <Text strong>Confidence: </Text>
                    <Text>{apiResponseData.final_assessment.confidence_score}</Text>
                  </div>
                  <div>
                    <Text strong>Next Review: </Text>
                    <Text>{apiResponseData.final_assessment.next_review_date}</Text>
                  </div>
                </Space>
              </div>
            </Col>
            <Col xs={24} lg={6} style={{ textAlign: 'right' }}>
              <Button type="primary" icon={<FileTextOutlined />}>
                Download Report
              </Button>
            </Col>
          </Row>
          {apiResponseData.final_assessment.executive_summary && (
            <div style={{ marginTop: '16px' }}>
              <Divider style={{ margin: '16px 0' }} />
              <Paragraph style={{ marginBottom: 0 }}>
                <Text strong>Executive Summary: </Text>
                {apiResponseData.final_assessment.executive_summary}
              </Paragraph>
            </div>
          )}
        </Card>
      )}

      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        {/* Critical Gaps Section */}
        {apiResponseData?.critical_gaps && (
          <Col xs={24} xl={12}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                  Critical Gaps ({apiResponseData.critical_gaps.count})
                </div>
              }
              size="small"
              style={{ height: '100%' }}
            >
              <Paragraph style={{ marginBottom: '16px', fontSize: '13px', color: '#666' }}>
                {apiResponseData.critical_gaps.description}
              </Paragraph>
              
              <List
                size="small"
                dataSource={apiResponseData.critical_gaps.items.slice(0, 3)}
                renderItem={(item, index) => (
                  <List.Item style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <Text strong style={{ fontSize: '13px', color: '#262626' }}>
                          {item.gap_type}
                        </Text>
                        <Space>
                          <Tag color={getSeverityColor(item.severity)} size="small">
                            {item.severity}
                          </Tag>
                          {item.legal_risk === 'High' && (
                            <Badge status="error" />
                          )}
                        </Space>
                      </div>
                      <Text style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
                        <Text strong>Article:</Text> {item.qfc_article}
                      </Text>
                      <Text style={{ fontSize: '12px', color: '#666' }}>
                        {item.immediate_action}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
              {apiResponseData.critical_gaps.items.length > 3 && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  +{apiResponseData.critical_gaps.items.length - 3} more critical gaps
                </Text>
              )}
            </Card>
          </Col>
        )}

        {/* Recommendations Section */}
        {apiResponseData?.recommendations && (
          <Col xs={24} xl={12}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircleOutlined style={{ color: '#1890ff' }} />
                  Recommendations ({apiResponseData.recommendations.count})
                </div>
              }
              size="small"
              style={{ height: '100%' }}
            >
              <Paragraph style={{ marginBottom: '16px', fontSize: '13px', color: '#666' }}>
                {apiResponseData.recommendations.description}
              </Paragraph>
              
              <List
                size="small"
                dataSource={apiResponseData.recommendations.items.slice(0, 3)}
                renderItem={(item, index) => (
                  <List.Item style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <Text strong style={{ fontSize: '13px', color: '#262626' }}>
                          {item.area}
                        </Text>
                        <Tag color={item.priority === 'High' ? 'red' : item.priority === 'Medium' ? 'orange' : 'green'} size="small">
                          {item.priority}
                        </Tag>
                      </div>
                      <Text style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
                        <Text strong>Change:</Text> {item.recommended_change?.substring(0, 80)}...
                      </Text>
                      <Text style={{ fontSize: '12px', color: '#52c41a' }}>
                        <Text strong>Benefit:</Text> {item.business_benefit?.substring(0, 60)}...
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
              {apiResponseData.recommendations.items.length > 3 && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  +{apiResponseData.recommendations.items.length - 3} more recommendations
                </Text>
              )}
            </Card>
          </Col>
        )}
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        {/* Inconsistencies Section */}
        {apiResponseData?.inconsistencies && (
          <Col xs={24} xl={12}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <WarningOutlined style={{ color: '#faad14' }} />
                  Inconsistencies ({apiResponseData.inconsistencies.count})
                </div>
              }
              size="small"
              style={{ height: '100%' }}
            >
              <Paragraph style={{ marginBottom: '16px', fontSize: '13px', color: '#666' }}>
                {apiResponseData.inconsistencies.description}
              </Paragraph>
              
              <List
                size="small"
                dataSource={apiResponseData.inconsistencies.items}
                renderItem={(item, index) => (
                  <List.Item style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <Text strong style={{ fontSize: '13px', color: '#262626' }}>
                          {item.conflict_area}
                        </Text>
                        <Tag color={item.priority === 'High' ? 'red' : item.priority === 'Medium' ? 'orange' : 'green'} size="small">
                          {item.priority}
                        </Tag>
                      </div>
                      <Text style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
                        <Text strong>Risk:</Text> {item.operational_risk?.substring(0, 80)}...
                      </Text>
                      <Text style={{ fontSize: '12px', color: '#1890ff' }}>
                        <Text strong>Resolution:</Text> {item.recommended_resolution?.substring(0, 60)}...
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        )}

        {/* Compliant Items Section */}
        {apiResponseData?.compliant_items && (
          <Col xs={24} xl={12}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  Compliant Areas ({apiResponseData.compliant_items.count})
                </div>
              }
              size="small"
              style={{ height: '100%' }}
            >
              <Paragraph style={{ marginBottom: '16px', fontSize: '13px', color: '#666' }}>
                {apiResponseData.compliant_items.description}
              </Paragraph>
              
              <List
                size="small"
                dataSource={apiResponseData.compliant_items.items}
                renderItem={(item, index) => (
                  <List.Item style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ width: '100%' }}>
                      <Text strong style={{ fontSize: '13px', color: '#262626', display: 'block', marginBottom: '4px' }}>
                        {item.compliance_area}
                      </Text>
                      <Text style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
                        <Text strong>Article:</Text> {item.qfc_article}
                      </Text>
                      <Text style={{ fontSize: '12px', color: '#52c41a' }}>
                        <Text strong>Strength:</Text> {item.strength}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        )}
      </Row>

      {/* Action Plan Display */}
      {apiResponseData?.action_plan && (
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClockCircleOutlined style={{ color: '#1890ff' }} />
              Action Plan
            </div>
          }
          style={{ marginBottom: '40px' }}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={8}>
              <Card size="small" title="Immediate Actions" headStyle={{ backgroundColor: '#fff2f0' }}>
                <List
                  size="small"
                  dataSource={apiResponseData.action_plan.immediate_actions}
                  renderItem={(item, index) => (
                    <List.Item style={{ padding: '4px 0' }}>
                      <Text style={{ fontSize: '13px' }}>
                        {index + 1}. {item}
                      </Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card size="small" title="Short Term Improvements" headStyle={{ backgroundColor: '#fffbe6' }}>
                <List
                  size="small"
                  dataSource={apiResponseData.action_plan.short_term_improvements}
                  renderItem={(item, index) => (
                    <List.Item style={{ padding: '4px 0' }}>
                      <Text style={{ fontSize: '13px' }}>
                        {index + 1}. {item}
                      </Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card size="small" title="Long Term Enhancements" headStyle={{ backgroundColor: '#f6ffed' }}>
                <List
                  size="small"
                  dataSource={apiResponseData.action_plan.long_term_enhancements}
                  renderItem={(item, index) => (
                    <List.Item style={{ padding: '4px 0' }}>
                      <Text style={{ fontSize: '13px' }}>
                        {index + 1}. {item}
                      </Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      )}

      {/* Compliance Summary or Key Issues */}
      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        {dashboardData && !apiResponseData && (
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
        {getKeyIssues().length > 0 && !apiResponseData && (
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