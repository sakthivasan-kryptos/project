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
import { storeComprehensiveApiResponse, storeApiResponse } from '../services/localStorageService';

const { Text } = Typography;
const { Dragger } = Upload;
const { Panel } = Collapse;

const NewReview = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);
  const [apiResponseData, setApiResponseData] = useState(null);

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
    
    // Parse the response data
    let parsedData = null;
    try {
      parsedData = JSON.parse(result.final);
    } catch (parseError) {
      console.warn('Failed to parse result.final as JSON, using raw result:', parseError);
      parsedData = result;
    }

    setParsedResult(parsedData);
    setApiResponseData(result);

    // Store in localStorage using comprehensive storage service
    try {
      const metadata = {
        source: 'comprehensive_new_review',
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        documentType: 'PDF Employment Document'
      };

      let responseId;
      
      // Check if this is a comprehensive response with structured data
      if (parsedData && (
        parsedData.critical_gaps || 
        parsedData.recommendations || 
        parsedData.final_assessment ||
        parsedData.action_plan ||
        parsedData.analysis_summary
      )) {
        // Store as comprehensive response
        responseId = storeComprehensiveApiResponse(parsedData, metadata);
        console.log('Stored comprehensive API response with ID:', responseId);
      } else {
        // Store as simple response (legacy format support)
        responseId = storeApiResponse(result, metadata);
        console.log('Stored simple API response with ID:', responseId);
      }

      // Also maintain backward compatibility with cookie storage
      document.cookie = `lastUploadResponse=${JSON.stringify(result)}; path=/; max-age=86400`;
      
    } catch (storageError) {
      console.error('Error storing API response in localStorage:', storageError);
      // Continue with cookie fallback for backward compatibility
      document.cookie = `lastUploadResponse=${JSON.stringify(result)}; path=/; max-age=86400`;
    }

    setUploadSuccess(true);

    // Show success message with more details
    notification.success({
      message: 'Document Analysis Complete',
      description: `PDF "${file.name}" has been successfully analyzed and stored. Navigate to Dashboard, All Reviews, Regulations, or Reports to view the results.`,
      duration: 5,
      placement: 'topRight'
    });

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
    setApiResponseData(null);
  };

  const renderList = (items, renderItem) => (
    <List
      dataSource={items}
      renderItem={renderItem}
      bordered
      style={{ marginBottom: 16 }}
    />
  );

  // Enhanced results display with better data handling
  if (uploadSuccess && (parsedResult || apiResponseData)) {
    const displayData = parsedResult || apiResponseData;
    
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
          subtitle="Document successfully analyzed and stored. Results are now available across all screens."
          centered
        />
        <Card title="Uploaded Document Analysis Complete" style={{ marginTop: 24 }}>
          
          {/* Show comprehensive results if available */}
          {displayData.critical_gaps || displayData.recommendations || displayData.final_assessment ? (
            <Collapse accordion>
              {displayData.critical_gaps && (
                <Panel header={`Critical Gaps (${displayData.critical_gaps.count || 0})`} key="critical_gaps">
                  {displayData.critical_gaps.items ? renderList(displayData.critical_gaps.items, (item) => (
                    <List.Item>
                      <div>
                        <Text strong>Gap Type:</Text> {item.gap_type || 'N/A'} <br />
                        <Text strong>QFC Article:</Text> {item.qfc_article || 'N/A'} <br />
                        <Text strong>Current State:</Text> {item.document_states || 'N/A'} <br />
                        <Text strong>QFC Requires:</Text> {item.qfc_requires || 'N/A'} <br />
                        <Text strong>Immediate Action:</Text> {item.immediate_action || 'N/A'}
                      </div>
                    </List.Item>
                  )) : <Text>No critical gaps found.</Text>}
                </Panel>
              )}

              {displayData.recommendations && (
                <Panel header={`Recommendations (${displayData.recommendations.count || 0})`} key="recommendations">
                  {displayData.recommendations.items ? renderList(displayData.recommendations.items, (item) => (
                    <List.Item>
                      <div>
                        <Text strong>Area:</Text> {item.area || 'N/A'} <br />
                        <Text strong>Recommended Change:</Text> {item.recommended_change || 'N/A'} <br />
                        <Text strong>Business Benefit:</Text> {item.business_benefit || 'N/A'} <br />
                        <Text strong>Priority:</Text> {item.priority || 'N/A'}
                      </div>
                    </List.Item>
                  )) : <Text>No recommendations available.</Text>}
                </Panel>
              )}

              {displayData.inconsistencies && (
                <Panel header={`Document Inconsistencies (${displayData.inconsistencies.count || 0})`} key="inconsistencies">
                  {displayData.inconsistencies.items ? renderList(displayData.inconsistencies.items, (item) => (
                    <List.Item>
                      <div>
                        <Text strong>Conflict Area:</Text> {item.conflict_area || 'N/A'} <br />
                        <Text strong>Operational Risk:</Text> {item.operational_risk || 'N/A'} <br />
                        <Text strong>Recommended Resolution:</Text> {item.recommended_resolution || 'N/A'}
                      </div>
                    </List.Item>
                  )) : <Text>No inconsistencies found.</Text>}
                </Panel>
              )}

              {displayData.final_assessment && (
                <Panel header="Final Assessment" key="final_assessment">
                  <div>
                    <Text strong>Overall Compliance Status:</Text> {displayData.final_assessment.overall_compliance_status || 'Unknown'} <br />
                    <Text strong>Risk Level:</Text> {displayData.final_assessment.risk_level || 'Unknown'} <br />
                    <Text strong>Confidence Score:</Text> {displayData.final_assessment.confidence_score || 'N/A'} <br />
                    {displayData.final_assessment.executive_summary && (
                      <>
                        <br />
                        <Text strong>Executive Summary:</Text>
                        <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                          {displayData.final_assessment.executive_summary}
                        </div>
                      </>
                    )}
                  </div>
                </Panel>
              )}
            </Collapse>
          ) : displayData.mandatory_compliance_issues ? (
            // Legacy format support
            <Collapse accordion>
              <Panel header="Mandatory Compliance Issues" key="1">
                {renderList(displayData.mandatory_compliance_issues, (item) => (
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
                {renderList(displayData.best_practice_recommendations, (item) => (
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
                {renderList(displayData.document_inconsistencies, (item) => (
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
                  <Text strong>Status:</Text> {displayData.compliance_summary?.status}
                </p>
                <p>
                  <Text strong>Critical Issues:</Text> {displayData.compliance_summary?.critical_issues}
                </p>
                {displayData.compliance_summary?.must_fix_items && (
                  <List
                    header={<Text strong>Must Fix Items</Text>}
                    dataSource={displayData.compliance_summary.must_fix_items}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  />
                )}
              </Panel>
            </Collapse>
          ) : (
            // Raw data display fallback
            <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <Text strong>Analysis Results:</Text>
              <pre style={{ marginTop: '10px', fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(displayData, null, 2)}
              </pre>
            </div>
          )}

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