import React, { useState } from 'react';
import {
  Card,
  Button,
  Typography,
  Upload,
  Modal,
  message,
  Spin,
  Collapse,
  List,
  Tag,
} from 'antd';
import {
  InboxOutlined,
} from '@ant-design/icons';
import PageHeader from '../components/ui/PageHeader';

const { Text, Title } = Typography;
const { Dragger } = Upload;
const { Panel } = Collapse;

const NewReview = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);

  const handleUpload = async (file) => {
    if (file.type !== 'application/pdf') {
      message.error('Only PDF files are allowed!');
      return false;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error('File size must be less than 10MB!');
      return false;
    }

    setUploading(true);

    try {
      // Convert PDF to base64
      const pdf_base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
      });

      const response = await fetch('https://complainceanalysis-dtddbbcpeuc3h0f7.eastus2-01.azurewebsites.net/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdf_base64 }),
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const parsed = JSON.parse(result.final);
      setParsedResult(parsed);
      document.cookie = `lastUploadResponse=${JSON.stringify(result)}; path=/; max-age=86400`;
      setUploadSuccess(true);

      message.success('Document successfully analyzed!', 3);
    } catch (err) {
      console.error('Upload error:', err);
      message.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }

    return false;
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf',
    beforeUpload: handleUpload,
    showUploadList: false,
    disabled: uploading,
  };

  const handleNewUpload = () => {
    setUploadSuccess(false);
    setParsedResult(null);
  };

  const renderList = (items, renderItem) => (
    <List
      dataSource={items}
      renderItem={renderItem}
      bordered
      style={{ marginBottom: 16 }}
    />
  );

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'gold';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  if (uploadSuccess && parsedResult) {
    return (
      <div>
        <PageHeader
          title="Compliance Review Results"
          subtitle="Document successfully analyzed. See results below."
          centered
        />
        
        <Card 
          title={`Uploaded Document: ${parsedResult.analysis_summary.document_type}`} 
          style={{ marginTop: 24 }}
          extra={
            <Tag color={parsedResult.final_assessment.risk_level === 'High' ? 'red' : 'orange'}>
              {parsedResult.final_assessment.overall_compliance_status}
            </Tag>
          }
        >
          <div style={{ marginBottom: 24 }}>
            <Title level={5}>Executive Summary</Title>
            <Text>{parsedResult.final_assessment.executive_summary}</Text>
          </div>

          <Collapse accordion defaultActiveKey={['1']}>
            <Panel header={`Critical Compliance Gaps (${parsedResult.critical_gaps.count})`} key="1">
              {renderList(parsedResult.critical_gaps.items, (item) => (
                <List.Item>
                  <div>
                    <Text strong>Gap Type:</Text> {item.gap_type} <br />
                    <Text strong>Severity:</Text> <Tag color={getSeverityColor(item.severity)}>{item.severity}</Tag> <br />
                    <Text strong>QFC Article:</Text> {item.qfc_article} <br />
                    <Text strong>Document States:</Text> {item.document_states} <br />
                    <Text strong>QFC Requires:</Text> {item.qfc_requires} <br />
                    <Text strong>Immediate Action:</Text> {item.immediate_action} <br />
                    <Text strong>Legal Risk:</Text> <Tag color={getSeverityColor(item.legal_risk)}>{item.legal_risk}</Tag>
                  </div>
                </List.Item>
              ))}
            </Panel>

            <Panel header={`Best Practice Recommendations (${parsedResult.recommendations.count})`} key="2">
              {renderList(parsedResult.recommendations.items, (item) => (
                <List.Item>
                  <div>
                    <Text strong>Area:</Text> {item.area} <br />
                    <Text strong>Priority:</Text> <Tag color={getSeverityColor(item.priority)}>{item.priority}</Tag> <br />
                    <Text strong>Current Practice:</Text> {item.current_practice} <br />
                    <Text strong>Recommended Change:</Text> {item.recommended_change} <br />
                    <Text strong>Business Benefit:</Text> {item.business_benefit} <br />
                    <Text strong>Implementation Effort:</Text> {item.implementation_effort}
                  </div>
                </List.Item>
              ))}
            </Panel>

            <Panel header={`Document Inconsistencies (${parsedResult.inconsistencies.count})`} key="3">
              {renderList(parsedResult.inconsistencies.items, (item) => (
                <List.Item>
                  <div>
                    <Text strong>Conflict Area:</Text> {item.conflict_area} <br />
                    <Text strong>Conflicting Statements:</Text>
                    <ul>
                      {item.conflicting_statements.map((statement, idx) => (
                        <li key={idx}>{statement}</li>
                      ))}
                    </ul>
                    <Text strong>Operational Risk:</Text> {item.operational_risk} <br />
                    <Text strong>Recommended Resolution:</Text> {item.recommended_resolution} <br />
                    <Text strong>Priority:</Text> <Tag color={getSeverityColor(item.priority)}>{item.priority}</Tag>
                  </div>
                </List.Item>
              ))}
            </Panel>

            <Panel header="Action Plan" key="4">
              <Title level={5}>Immediate Actions</Title>
              <ul>
                {parsedResult.action_plan.immediate_actions.map((action, idx) => (
                  <li key={`immediate-${idx}`}>{action}</li>
                ))}
              </ul>
              
              <Title level={5}>Short-term Improvements</Title>
              <ul>
                {parsedResult.action_plan.short_term_improvements.map((action, idx) => (
                  <li key={`short-${idx}`}>{action}</li>
                ))}
              </ul>
              
              <Title level={5}>Long-term Enhancements</Title>
              <ul>
                {parsedResult.action_plan.long_term_enhancements.map((action, idx) => (
                  <li key={`long-${idx}`}>{action}</li>
                ))}
              </ul>
            </Panel>

            <Panel header="Compliance Metrics" key="5">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <Card size="small" title="Critical Gaps" style={{ width: 200 }}>
                  <Title level={2} style={{ margin: 0, color: 'red' }}>
                    {parsedResult.dashboard_metrics.total_critical_gaps}
                  </Title>
                </Card>
                <Card size="small" title="Recommendations" style={{ width: 200 }}>
                  <Title level={2} style={{ margin: 0, color: 'orange' }}>
                    {parsedResult.dashboard_metrics.total_recommendations}
                  </Title>
                </Card>
                <Card size="small" title="Inconsistencies" style={{ width: 200 }}>
                  <Title level={2} style={{ margin: 0, color: 'gold' }}>
                    {parsedResult.dashboard_metrics.total_inconsistencies}
                  </Title>
                </Card>
                <Card size="small" title="Compliant Areas" style={{ width: 200 }}>
                  <Title level={2} style={{ margin: 0, color: 'green' }}>
                    {parsedResult.dashboard_metrics.total_compliant_areas}
                  </Title>
                </Card>
              </div>
            </Panel>
          </Collapse>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Button type="primary" onClick={handleNewUpload}>
              Upload Another Document
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Start New Compliance Review"
        subtitle="Upload PDF employment documents to analyze against QFC regulations"
        centered
      />

      <div className="upload-section">
        <Card className="upload-card">
          <Spin spinning={uploading} tip="Processing your document...">
            <Dragger {...uploadProps}>
              <div className="upload-area">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: '16px', marginBottom: '8px' }}>
                  Click or drag PDF file to this area to upload
                </p>
                <p className="ant-upload-hint" style={{ color: '#8c8c8c', fontSize: '14px' }}>
                  Only PDF files are supported. Maximum file size: 10MB
                </p>
              </div>
            </Dragger>
          </Spin>
        </Card>
      </div>

      <Modal open={uploading} footer={null} closable={false} centered width={300}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', fontSize: '16px' }}>
            Processing your document...
          </div>
          <div style={{ marginTop: '8px', color: '#8c8c8c', fontSize: '14px' }}>
            Please wait while we analyze your PDF
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NewReview;