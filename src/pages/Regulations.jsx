import { Card, Row, Col, Space, Button, Typography, List, Tag, Alert, Collapse, Divider } from 'antd';
import {
  DownloadOutlined,
  MailOutlined,
  FileAddOutlined,
  WarningOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  FileProtectOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import PageHeader from '../components/ui/PageHeader';
import { useCompliance } from '../contexts/ComplianceContext';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const Regulations = () => {
  const {
    regulationsData,
    complianceData,
    getAllViolations,
    getViolationsByArticle,
    refreshData,
    loading,
    error
  } = useCompliance();

  const violations = getAllViolations();
  const violationsByArticle = getViolationsByArticle();
  const recommendations = complianceData?.recommendations || [];
  const inconsistencies = complianceData?.inconsistencies || [];

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'processing';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'high': return <WarningOutlined style={{ color: '#faad14' }} />;
      default: return <WarningOutlined style={{ color: '#1890ff' }} />;
    }
  };

  return (
    <div>
      <PageHeader
        title="Regulations and Reports"
        subtitle="QFC Article violations, requirements, and compliance analysis"
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={refreshData}
              loading={loading}
            >
              Refresh Data
            </Button>
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
        }
      />

      {/* Error Alert */}
      {error && (
        <Alert
          message="Error Loading Regulations Data"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* Summary Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="analysis-card critical">
            <div className="analysis-content">
              <WarningOutlined style={{ fontSize: '24px', color: '#ff4d4f', marginBottom: '12px' }} />
              <Title level={4} style={{ color: '#ff4d4f', margin: 0 }}>Critical Violations</Title>
              <div className="analysis-number">
                {violations.filter(v => v.severity?.toLowerCase() === 'critical').length}
              </div>
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
              <div className="analysis-number">{recommendations.length}</div>
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
              <div className="analysis-number">{inconsistencies.length}</div>
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
              <Title level={4} style={{ color: '#52c41a', margin: 0 }}>Total Violations</Title>
              <div className="analysis-number">{violations.length}</div>
              <Text style={{ color: '#666', fontSize: '14px' }}>
                All QFC Article violations identified
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Detailed Violations by Article */}
      {Object.keys(violationsByArticle).length > 0 && (
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileProtectOutlined style={{ color: '#1890ff' }} />
              QFC Article Violations and Requirements
            </div>
          }
          style={{ marginBottom: '24px' }}
        >
          <Collapse ghost>
            {Object.entries(violationsByArticle).map(([article, articleViolations]) => (
              <Panel 
                header={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Text strong>{article}</Text>
                    <Tag color="blue">{articleViolations.length} violation{articleViolations.length !== 1 ? 's' : ''}</Tag>
                  </div>
                }
                key={article}
              >
                <List
                  dataSource={articleViolations}
                  renderItem={(violation) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={getSeverityIcon(violation.severity)}
                        title={
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Text strong>{violation.violation}</Text>
                            <Tag color={getSeverityColor(violation.severity)} size="small">
                              {violation.severity || 'Unknown'}
                            </Tag>
                          </div>
                        }
                        description={
                          <div>
                            <Text style={{ color: '#666', marginBottom: '8px', display: 'block' }}>
                              <strong>QFC Requires:</strong> {violation.required}
                            </Text>
                            <Text style={{ color: '#1890ff' }}>
                              <strong>Fix Required:</strong> {violation.fix_required}
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Panel>
            ))}
          </Collapse>
        </Card>
      )}

      {/* Best Practice Recommendations */}
      {recommendations.length > 0 && (
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BulbOutlined style={{ color: '#faad14' }} />
              Best Practice Recommendations
            </div>
          }
          style={{ marginBottom: '24px' }}
        >
          <List
            dataSource={recommendations}
            renderItem={(recommendation) => (
              <List.Item>
                <List.Item.Meta
                  title={<Text strong>{recommendation.area || 'General Recommendation'}</Text>}
                  description={
                    <div>
                      <Text style={{ marginBottom: '4px', display: 'block' }}>
                        {recommendation.recommendation}
                      </Text>
                      {recommendation.impact && (
                        <Text style={{ color: '#52c41a', fontSize: '12px' }}>
                          <strong>Impact:</strong> {recommendation.impact}
                        </Text>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Document Inconsistencies */}
      {inconsistencies.length > 0 && (
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileProtectOutlined style={{ color: '#ff4d4f' }} />
              Document Inconsistencies
            </div>
          }
        >
          <List
            dataSource={inconsistencies}
            renderItem={(inconsistency) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
                  title={<Text strong>{inconsistency.issue}</Text>}
                  description={
                    <div>
                      <Text style={{ marginBottom: '4px', display: 'block' }}>
                        {inconsistency.description}
                      </Text>
                      <Text style={{ color: '#1890ff', fontSize: '13px' }}>
                        <strong>Suggested Solution:</strong> {inconsistency.suggested_solution}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* No Data Message */}
      {violations.length === 0 && recommendations.length === 0 && inconsistencies.length === 0 && !loading && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <FileProtectOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <Title level={4} style={{ color: '#999' }}>No Compliance Data Available</Title>
            <Text style={{ color: '#666' }}>
              Upload and process documents to see QFC Article violations and compliance analysis.
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Regulations;