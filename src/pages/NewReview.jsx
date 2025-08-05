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
  notification,
  Breadcrumb,
} from 'antd';
import {
  InboxOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  FileAddOutlined,
} from '@ant-design/icons';
import PageHeader from '../components/ui/PageHeader';

const { Text } = Typography;
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

    // Show success message using Ant Design message component
    message.success('Successfully updated.', 3);
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

  if (uploadSuccess && parsedResult) {
    return (
      <div>
        {/* Breadcrumb Navigation */}
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>New Review</Breadcrumb.Item>
          <Breadcrumb.Item>Results</Breadcrumb.Item>
        </Breadcrumb>

        <PageHeader
          title="Compliance Review Results"
          subtitle="Document successfully analyzed. See results below."
          centered
        />
        <Card title="Uploaded Document: Employment Contract" style={{ marginTop: 24 }}>
          <Collapse accordion>
            <Panel header="Mandatory Compliance Issues" key="1">
              {renderList(parsedResult.mandatory_compliance_issues, (item) => (
                <List.Item>
                  <div>
                    <Text strong>Violation:</Text> {item.violation} <br />
                    <Text strong>QFC Article:</Text> {item.qfc_article} <br />
                    <Text strong>Document States:</Text> {item.document_states} <br />
                    <Text strong>QFC Requires:</Text> {item.qfc_requires} <br />
                    <Text strong>Fix Required:</Text> {item.fix_required}
                  </div>
                </List.Item>
              ))}
            </Panel>

            <Panel header="Best Practice Recommendations" key="2">
              {renderList(parsedResult.best_practice_recommendations, (item) => (
                <List.Item>
                  <div>
                    <Text strong>Area:</Text> {item.area} <br />
                    <Text strong>Current:</Text> {item.current} <br />
                    <Text strong>Recommendation:</Text> {item.recommendation} <br />
                    <Text strong>Benefit:</Text> {item.benefit}
                  </div>
                </List.Item>
              ))}
            </Panel>

            <Panel header="Document Inconsistencies" key="3">
              {renderList(parsedResult.document_inconsistencies, (item) => (
                <List.Item>
                  <div>
                    <Text strong>Issue:</Text> {item.issue} <br />
                    <Text strong>Problem:</Text> {item.problem} <br />
                    <Text strong>Solution:</Text> {item.solution}
                  </div>
                </List.Item>
              ))}
            </Panel>

            <Panel header="Compliance Summary" key="4">
              <p>
                <Text strong>Status:</Text> {parsedResult.compliance_summary.status}
              </p>
              <p>
                <Text strong>Critical Issues:</Text> {parsedResult.compliance_summary.critical_issues}
              </p>
              <List
                header={<Text strong>Must Fix Items</Text>}
                dataSource={parsedResult.compliance_summary.must_fix_items}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
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
      {/* Breadcrumb Navigation */}
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FileAddOutlined />
          <span style={{ marginLeft: '4px' }}>New Review</span>
        </Breadcrumb.Item>
      </Breadcrumb>

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