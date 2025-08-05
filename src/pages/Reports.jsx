import { Card, Row, Col, Space, Button, Progress, Typography, Divider, List, Statistic, Breadcrumb } from 'antd';
import {
  FileTextOutlined,
  RiseOutlined,
  WarningOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  PercentageOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  HomeOutlined
} from '@ant-design/icons';
import PageHeader from '../components/ui/PageHeader';
import { ComplianceSummaryCard } from '../components/ui';

const { Text, Title } = Typography;

const Reports = () => {
  // Mock aggregated compliance data
  const complianceMetrics = {
    totalReviews: 156,
    complianceRate: 72,
    criticalIssues: 45,
    avgResolutionTime: '3.2 days',
    topViolations: [
      { type: 'Overtime Pay Issues', count: 23, trend: '+12%' },
      { type: 'Vacation Days', count: 18, trend: '-5%' },
      { type: 'Probation Period', count: 15, trend: '+8%' },
      { type: 'Sick Leave', count: 12, trend: '0%' },
      { type: 'Termination Notice', count: 9, trend: '-15%' }
    ],
    recentSummaries: [
      {
        status: "Non-Compliant",
        critical_issues: 5,
        must_fix_items: [
          "Reduce probation period to maximum 3 months",
          "Increase annual leave to 20 working days",
          "Add overtime pay clause at 125%"
        ]
      },
      {
        status: "Partially Compliant", 
        critical_issues: 2,
        must_fix_items: [
          "Update sick leave policy",
          "Clarify termination procedures"
        ]
      }
    ]
  };

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <BarChartOutlined />
          <span style={{ marginLeft: '4px' }}>Reports</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <PageHeader
        title="Reports & Analytics"
        subtitle="Generate comprehensive compliance reports and view analytics"
      />

      {/* Action Buttons */}
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

      {/* Key Metrics Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="metric-card">
            <Statistic
              title="Total Reviews"
              value={complianceMetrics.totalReviews}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="metric-card">
            <Statistic
              title="Compliance Rate"
              value={complianceMetrics.complianceRate}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: complianceMetrics.complianceRate > 80 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="metric-card">
            <Statistic
              title="Critical Issues"
              value={complianceMetrics.criticalIssues}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="metric-card">
            <Statistic
              title="Avg Resolution Time"
              value={complianceMetrics.avgResolutionTime}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Analytics Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        <Col xs={24} lg={8}>
          <Card title="Compliance Rate Trend" className="chart-card">
            <div className="chart-placeholder">
              <RiseOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Progress 
                percent={complianceMetrics.complianceRate} 
                strokeColor={complianceMetrics.complianceRate > 80 ? '#52c41a' : '#faad14'} 
              />
              <Text style={{ color: '#8c8c8c', fontSize: '14px', marginTop: '12px', display: 'block' }}>
                {complianceMetrics.complianceRate}% average compliance rate this quarter
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Top Violations" className="violations-card">
            <div className="violations-list">
              {complianceMetrics.topViolations.map((violation, index) => (
                <div key={index} className="violation-item" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < complianceMetrics.topViolations.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}>
                  <div>
                    <Text style={{ fontWeight: 500 }}>{violation.type}</Text>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      Trend: <span style={{ 
                        color: violation.trend.startsWith('+') ? '#ff4d4f' : 
                              violation.trend.startsWith('-') ? '#52c41a' : '#8c8c8c' 
                      }}>
                        {violation.trend}
                      </span>
                    </div>
                  </div>
                  <span className="violation-count" style={{ 
                    color: '#ff4d4f', 
                    fontWeight: 600,
                    fontSize: '18px'
                  }}>
                    {violation.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Review Performance" className="performance-card">
            <div className="performance-metrics">
              <div className="metric-item" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <ClockCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                <div className="metric-value" style={{ color: '#52c41a', fontSize: '24px', fontWeight: 600 }}>
                  2.3hrs
                </div>
                <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>Average review time</Text>
              </div>
              <Divider />
              <div className="metric-item" style={{ textAlign: 'center' }}>
                <PercentageOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                <div className="metric-value" style={{ color: '#1890ff', fontSize: '24px', fontWeight: 600 }}>
                  96%
                </div>
                <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>AI accuracy rate</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Compliance Summaries */}
      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        <Col span={24}>
          <Title level={3} style={{ marginBottom: '24px' }}>
            Recent Compliance Analysis
          </Title>
        </Col>
        {complianceMetrics.recentSummaries.map((summary, index) => (
          <Col xs={24} lg={12} key={index}>
            <ComplianceSummaryCard summary={summary} />
          </Col>
        ))}
      </Row>

      {/* Best Practices Insights */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BulbOutlined style={{ color: '#faad14' }} />
            <span>Common Recommendations</span>
          </div>
        }
        style={{ marginBottom: '24px' }}
      >
        <List
          size="small"
          dataSource={[
            "Include all statutory minimums directly in employment contracts",
            "Implement clear overtime payment policies at 125% rate",
            "Reduce probation periods to comply with 3-month maximum",
            "Establish comprehensive sick leave documentation",
            "Add detailed termination notice procedures"
          ]}
          renderItem={(item, index) => (
            <List.Item>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#faad14',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  {index + 1}
                </div>
                <Text>{item}</Text>
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* Recent Reports */}
      <Card title="Recent Reports">
        <div className="recent-reports">
          <Text style={{ color: '#8c8c8c' }}>
            Generate your first compliance report using the buttons above to see detailed analytics and trends.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Reports;