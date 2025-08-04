import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
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
  const mockAnalysisData = analysisData || mockComplianceAnalysis;

  const reportRef = useRef();

  const handleDownloadReport = () => {
    const element = reportRef.current;
    const opt = {
      margin: 0.5,
      filename: 'compliance-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleShareReport = () => {
    console.log('Sharing compliance report...');
  };

  return (
    <div className="review-results-page">
      <PageHeader
        title="Compliance Analysis Results"
        subtitle={`${companyName} • ${documentType}`}
        extra={
          <Space>
            {onBack && (
              <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
                Back to Reviews
              </Button>
            )}
            <Button icon={<DownloadOutlined />} onClick={handleDownloadReport}>
              Download Report
            </Button>
            <Button icon={<PrinterOutlined />} onClick={handlePrintReport}>
              Print
            </Button>
            <Button type="primary" icon={<ShareAltOutlined />} onClick={handleShareReport}>
              Share
            </Button>
          </Space>
        }
      />

      {/* Report content to be exported as PDF */}
      <div ref={reportRef}>
        {/* Analysis Date */}
        <div style={{ marginBottom: '24px', padding: '16px 0' }}>
          <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
            Analysis completed on {new Date().toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <ComplianceSummaryCard summary={mockAnalysisData.compliance_summary} />
          </Col>

          <Col xs={24} lg={16}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <ComplianceIssuesCard issues={mockAnalysisData.mandatory_compliance_issues} />
              <DocumentInconsistenciesCard inconsistencies={mockAnalysisData.document_inconsistencies} />
              <BestPracticesCard recommendations={mockAnalysisData.best_practice_recommendations} />
            </Space>
          </Col>
        </Row>

        <Divider style={{ margin: '40px 0 24px 0' }} />
        <div style={{ textAlign: 'center', paddingBottom: '40px' }}>
          <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
            This report is automatically generated based on QFC Employment Standards Office regulations.
            For questions or clarifications, please contact the compliance team.
          </Text>
        </div>
      </div>

      {/* Footer Actions (not included in PDF) */}
      <div style={{ textAlign: 'center', paddingBottom: '40px' }}>
        <Space size="large">
          <Button size="large" onClick={handleDownloadReport}>
            Download Full Report
          </Button>
          <Button type="primary" size="large" onClick={handleShareReport}>
            Share with Team
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default ReviewResults;
