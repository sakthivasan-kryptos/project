import { Card, Row, Col, Space, Button, Typography, List, Tag, Alert, Collapse } from 'antd';
import {
  DownloadOutlined,
  MailOutlined,
  FileAddOutlined,
  WarningOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  FileProtectOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import PageHeader from '../components/ui/PageHeader';
import { useCompliance } from '../contexts/ComplianceContext';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const Regulations = () => {
  const {
    documentAnalysis,
    getAllViolations,
    getViolationsByArticle,
    getRecommendations,
    getInconsistencies,
    getActionPlan,
    getFinalAssessment,
    refreshData,
    loading,
    error
  } = useCompliance();

  const violations = getAllViolations();
  const violationsByArticle = getViolationsByArticle();
  const recommendations = getRecommendations();
  const inconsistencies = getInconsistencies();
  const actionPlan = getActionPlan();
  const finalAssessment = getFinalAssessment();

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

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'medium': return <WarningOutlined style={{ color: '#faad14' }} />;
      default: return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    }
  };

  return (
    <div>
      <PageHeader
        title="Regulations and Compliance Analysis"
        subtitle={`QFC Article violations and compliance status: ${finalAssessment.overall_compliance_status || 'Not Available'}`}
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
          message="Error Loading Compliance Data"
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
              <Title level={4} style={{ color: '#ff4d4f', margin: 0 }}>Critical Gaps</Title>
              <div className="analysis-number">
                {documentAnalysis?.critical_gaps?.count || 0}
              </div>
              <Text style={{ color: '#666', fontSize: '14px' }}>
                {documentAnalysis?.critical_gaps?.description || 'Mandatory compliance issues'}
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="analysis-card recommendations">
            <div className="analysis-content">
              <BulbOutlined style={{ fontSize: '24px', color: '#faad14', marginBottom: '12px' }} />
              <Title level={4} style={{ color: '#faad14', margin: 0 }}>Recommendations</Title>
              <div className="analysis-number">{documentAnalysis?.recommendations?.count || 0}</div>
              <Text style={{ color: '#666', fontSize: '14px' }}>
                {documentAnalysis?.recommendations?.description || 'Best practice improvements'}
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="analysis-card inconsistencies">
            <div className="analysis-content">
              <FileProtectOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '12px' }} />
              <Title level={4} style={{ color: '#1890ff', margin: 0 }}>Inconsistencies</Title>
              <div className="analysis-number">{documentAnalysis?.inconsistencies?.count || 0}</div>
              <Text style={{ color: '#666', fontSize: '14px' }}>
                {documentAnalysis?.inconsistencies?.description || 'Internal document conflicts'}
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="analysis-card compliant">
            <div className="analysis-content">
              <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '12px' }} />
              <Title level={4} style={{ color: '#52c41a', margin: 0 }}>Compliance Status</Title>
              <div className="analysis-number">
                {finalAssessment.overall_compliance_status || 'N/A'}
              </div>
              <Text style={{ color: '#666', fontSize: '14px' }}>
                Confidence: {finalAssessment.confidence_score || '0%'}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Final Assessment */}
      {finalAssessment.executive_summary && (
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileProtectOutlined />
              Executive Summary
            </div>
          }
          style={{ marginBottom: '24px' }}
        >
          <Text>{finalAssessment.executive_summary}</Text>
          <div style={{ marginTop: '16px' }}>
            <Tag color={finalAssessment.risk_level === 'High' ? 'error' : 'warning'}>
              Risk Level: {finalAssessment.risk_level || 'Unknown'}
            </Tag>
            <Tag color="processing" style={{ marginLeft: '8px' }}>
              Next Review: {finalAssessment.next_review_date || 'Not specified'}
            </Tag>
          </div>
        </Card>
      )}

      {/* Critical Compliance Gaps */}
      {violations.length > 0 && (
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileProtectOutlined style={{ color: '#ff4d4f' }} />
              Critical Compliance Gaps
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
                    <Tag color="blue">{articleViolations.length} issue{articleViolations.length !== 1 ? 's' : ''}</Tag>
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
                            <Text strong>{violation.gap_type}</Text>
                            <Tag color={getSeverityColor(violation.severity)} size="small">
                              {violation.severity || 'Unknown'}
                            </Tag>
                          </div>
                        }
                        description={
                          <div>
                            <Text style={{ color: '#666', marginBottom: '8px', display: 'block' }}>
                              <strong>Document States:</strong> {violation.document_states}
                            </Text>
                            <Text style={{ marginBottom: '8px', display: 'block' }}>
                              <strong>QFC Requires:</strong> {violation.qfc_requires}
                            </Text>
                            <Text style={{ color: '#ff4d4f' }}>
                              <strong>Immediate Action:</strong> {violation.immediate_action}
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
                  avatar={getPriorityIcon(recommendation.priority)}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Text strong>{recommendation.area}</Text>
                      <Tag color={getSeverityColor(recommendation.priority)}>
                        {recommendation.priority} priority
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <Text style={{ marginBottom: '4px', display: 'block' }}>
                        <strong>Current Practice:</strong> {recommendation.current_practice}
                      </Text>
                      <Text style={{ marginBottom: '4px', display: 'block' }}>
                        <strong>Recommended Change:</strong> {recommendation.recommended_change}
                      </Text>
                      <Text style={{ color: '#52c41a' }}>
                        <strong>Business Benefit:</strong> {recommendation.business_benefit}
                      </Text>
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
              <FileProtectOutlined style={{ color: '#1890ff' }} />
              Document Inconsistencies
            </div>
          }
          style={{ marginBottom: '24px' }}
        >
          <List
            dataSource={inconsistencies}
            renderItem={(inconsistency) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
                  title={<Text strong>{inconsistency.conflict_area}</Text>}
                  description={
                    <div>
                      <Text strong style={{ display: 'block', marginBottom: '8px' }}>Conflicting Statements:</Text>
                      <ul style={{ marginBottom: '8px' }}>
                        {inconsistency.conflicting_statements.map((statement, idx) => (
                          <li key={idx}>{statement}</li>
                        ))}
                      </ul>
                      <Text style={{ marginBottom: '4px', display: 'block' }}>
                        <strong>Operational Risk:</strong> {inconsistency.operational_risk}
                      </Text>
                      <Text style={{ color: '#1890ff' }}>
                        <strong>Recommended Resolution:</strong> {inconsistency.recommended_resolution}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Action Plan */}
      {actionPlan && (
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileAddOutlined style={{ color: '#52c41a' }} />
              Recommended Action Plan
            </div>
          }
        >
          <Collapse defaultActiveKey={['1']}>
            <Panel header="Immediate Actions (Critical Compliance Issues)" key="1">
              <List
                dataSource={actionPlan.immediate_actions || []}
                renderItem={(action) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
                      description={action}
                    />
                  </List.Item>
                )}
              />
            </Panel>
            <Panel header="Short-term Improvements" key="2">
              <List
                dataSource={actionPlan.short_term_improvements || []}
                renderItem={(action) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<WarningOutlined style={{ color: '#faad14' }} />}
                      description={action}
                    />
                  </List.Item>
                )}
              />
            </Panel>
            <Panel header="Long-term Enhancements" key="3">
              <List
                dataSource={actionPlan.long_term_enhancements || []}
                renderItem={(action) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                      description={action}
                    />
                  </List.Item>
                )}
              />
            </Panel>
          </Collapse>
        </Card>
      )}

      {/* No Data Message */}
      {!loading && violations.length === 0 && recommendations.length === 0 && inconsistencies.length === 0 && (
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