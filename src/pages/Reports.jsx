import { Card, Row, Col, Space, Button, Progress, Typography, Divider } from 'antd';
import {
  FileTextOutlined,
  RiseOutlined,
  WarningOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  PercentageOutlined
} from '@ant-design/icons';
import PageHeader from '../components/ui/PageHeader';

const { Text } = Typography;

const Reports = () => {
  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Generate comprehensive compliance reports and view analytics"
      />

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
};

export default Reports;