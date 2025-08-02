import { Row, Col, Button, Typography, Space, Divider } from 'antd';
import { 
  DownloadOutlined, 
  PrinterOutlined, 
  ShareAltOutlined,
  ArrowLeftOutlined 
} from '@ant-design/icons';
import { 
  PageHeader, 
  ComplianceIssuesCard, 
  BestPracticesCard, 
  DocumentInconsistenciesCard, 
  ComplianceSummaryCard 
} from '../components/ui';
import { mockComplianceAnalysis } from '../data/complianceData';

const { Title, Text } = Typography;

const ReviewResults = ({ 
  companyName = "ABC Corporation",
  documentType = "Employment Contract & HR Manual",
  analysisData,
  onBack
}) => {
  // Mock data for demonstration - in real app this would come from props/API
  const mockAnalysisData = analysisData || mockComplianceAnalysis;

  const handleDownloadReport = () => {
    // Implementation for downloading the report
    console.log('Downloading compliance report...');
  };

  const handlePrintReport = () => {
    // Implementation for printing the report
    window.print();
  };

  const handleShareReport = () => {
    // Implementation for sharing the report
    console.log('Sharing compliance report...');
  };

  return (
    <div className="review-results-page">
      <PageHeader
        title={`Compliance Analysis Results`}
        subtitle={`${companyName} • ${documentType}`}
        extra={
          <Space>
            {onBack && (
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={onBack}
              >
                Back to Reviews
              </Button>
            )}
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleDownloadReport}
            >
              Download Report
            </Button>
            <Button 
              icon={<PrinterOutlined />} 
              onClick={handlePrintReport}
            >
              Print
            </Button>
            <Button 
              type="primary" 
              icon={<ShareAltOutlined />} 
              onClick={handleShareReport}
            >
              Share
            </Button>
          </Space>
        }
      />

      {/* Analysis Date and Status */}
      <div style={{ marginBottom: '24px', padding: '16px 0' }}>
        <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
          Analysis completed on {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </div>

      {/* Main Content Grid */}
      <Row gutter={[24, 24]}>
        {/* Left Column - Summary */}
        <Col xs={24} lg={8}>
          <ComplianceSummaryCard summary={mockAnalysisData.compliance_summary} />
        </Col>

        {/* Right Column - Detailed Analysis */}
        <Col xs={24} lg={16}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Mandatory Compliance Issues */}
            <ComplianceIssuesCard issues={mockAnalysisData.mandatory_compliance_issues} />

            {/* Document Inconsistencies */}
            <DocumentInconsistenciesCard inconsistencies={mockAnalysisData.document_inconsistencies} />

            {/* Best Practice Recommendations */}
            <BestPracticesCard recommendations={mockAnalysisData.best_practice_recommendations} />
          </Space>
        </Col>
      </Row>

      {/* Footer Actions */}
      <Divider style={{ margin: '40px 0 24px 0' }} />
      <div style={{ textAlign: 'center', paddingBottom: '40px' }}>
        <Space size="large">
          <Button size="large" onClick={handleDownloadReport}>
            Download Full Report
          </Button>
          <Button type="primary" size="large" onClick={handleShareReport}>
            Share with Team
          </Button>
        </Space>
        <div style={{ marginTop: '16px' }}>
          <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
            This report is automatically generated based on QFC Employment Standards Office regulations.
            For questions or clarifications, please contact the compliance team.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ReviewResults;