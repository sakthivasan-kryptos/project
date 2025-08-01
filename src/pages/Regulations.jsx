import { Card, Row, Col, Space, Button, Typography } from 'antd';
import {
  DownloadOutlined,
  MailOutlined,
  FileAddOutlined,
  WarningOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  FileProtectOutlined
} from '@ant-design/icons';
import PageHeader from '../components/ui/PageHeader';

const { Title, Text } = Typography;

const Regulations = () => {
  return (
    <div>
      <PageHeader
        title="Compliance Analysis Results"
        subtitle="Analysis completed for ABC Corporation Employment Contract & HR Manual"
      />

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
};

export default Regulations;