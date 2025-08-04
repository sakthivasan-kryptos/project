import { Card, Table, Row, Col, Select, Input, Button, Tag, Alert } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState, useMemo } from 'react';
import PageHeader from '../components/ui/PageHeader';
import ReviewResults from './ReviewResults';
import { useCompliance } from '../contexts/ComplianceContext';
import { allReviewsData } from '../data/mockData';

const { Option } = Select;

const AllReviews = () => {
  const [selectedReview, setSelectedReview] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all-statuses');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    reviewsData,
    refreshData,
    loading,
    error
  } = useCompliance();

  const handleViewResults = (record) => {
    setSelectedReview(record);
    setShowResults(true);
  };

  const handleBackToList = () => {
    setShowResults(false);
    setSelectedReview(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'compliant': 
        return 'success';
      case 'non-compliant': 
        return 'error';
      case 'partially compliant':
      case 'needs review': 
        return 'warning';
      case 'in progress': 
        return 'processing';
      default: 
        return 'default';
    }
  };

  // Transform compliance reviews data to match table format
  const transformedComplianceReviews = useMemo(() => {
    if (!reviewsData?.reviews?.length) return [];
    
    return reviewsData.reviews.map((review, index) => ({
      key: review.id || `compliance-${index}`,
      company: review.company || 'Unknown Company',
      email: review.metadata?.email || 'N/A',
      documentType: review.document_type || 'Unknown Document',
      submitted: new Date(review.timestamp).toLocaleDateString(),
      status: review.status || 'Unknown',
      violations: review.critical_count > 0 ? `${review.critical_count} Critical` : '0 Issues',
      violationsColor: review.critical_count > 0 ? '#ff4d4f' : '#52c41a',
      complianceData: review // Store full compliance data for detailed view
    }));
  }, [reviewsData]);

  // Combined data source (compliance reviews + mock data)
  const combinedReviewsData = useMemo(() => {
    const complianceReviews = transformedComplianceReviews;
    const mockReviews = allReviewsData;
    
    // Filter based on search term and status
    const allReviews = [...complianceReviews, ...mockReviews];
    
    return allReviews.filter(review => {
      const matchesSearch = searchTerm === '' || 
        review.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.documentType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all-statuses' || 
        review.status.toLowerCase().replace(' ', '-') === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [transformedComplianceReviews, searchTerm, statusFilter]);

  // Updated table columns with proper action handlers
  const allReviewsColumns = [
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#262626' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Document Type',
      dataIndex: 'documentType',
      key: 'documentType',
    },
    {
      title: 'Submitted',
      dataIndex: 'submitted',
      key: 'submitted',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontSize: '12px' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Violations',
      dataIndex: 'violations',
      key: 'violations',
      render: (text, record) => (
        <span style={{ color: record.violationsColor, fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          {record.status === 'Completed' ? (
            <Button 
              type="primary" 
              size="small"
              onClick={() => handleViewResults(record)}
            >
              View Report
            </Button>
          ) : record.status === 'Needs Review' ? (
            <Button 
              type="primary" 
              size="small"
              onClick={() => handleViewResults(record)}
            >
              Review
            </Button>
          ) : (
            <Button 
              size="small"
              onClick={() => handleViewResults(record)}
            >
              View Status
            </Button>
          )}
        </div>
      ),
    },
  ];

  // If showing results, render the ReviewResults component
  if (showResults && selectedReview) {
    return (
      <ReviewResults
        companyName={selectedReview.company}
        documentType={selectedReview.documentType}
        onBack={handleBackToList}
      />
    );
  }

  // Default list view
  return (
    <div>
      <PageHeader
        title="All Reviews"
        subtitle="Manage and track all compliance reviews"
        extra={
          <Button 
            icon={<ReloadOutlined />} 
            onClick={refreshData}
            loading={loading}
          >
            Refresh Data
          </Button>
        }
      />

      {/* Error Alert */}
      {error && (
        <Alert
          message="Error Loading Reviews Data"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* Show data source info */}
      {transformedComplianceReviews.length > 0 && (
        <Alert
          message={`Showing ${transformedComplianceReviews.length} compliance review(s) from API responses and ${allReviewsData.length} sample reviews`}
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      <div className="filters-section" style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col>
            <Select 
              value={statusFilter} 
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value="all-statuses">All Statuses</Option>
              <Option value="completed">Completed</Option>
              <Option value="compliant">Compliant</Option>
              <Option value="non-compliant">Non-Compliant</Option>
              <Option value="partially-compliant">Partially Compliant</Option>
              <Option value="in-progress">In Progress</Option>
              <Option value="needs-review">Needs Review</Option>
            </Select>
          </Col>
          <Col>
            <Select defaultValue="last-30-days" style={{ width: 150 }}>
              <Option value="last-30-days">Last 30 Days</Option>
              <Option value="last-7-days">Last 7 Days</Option>
              <Option value="last-90-days">Last 90 Days</Option>
            </Select>
          </Col>
          <Col flex="auto">
            <Input
              placeholder="Search company name or document type..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: 300 }}
            />
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={() => {/* Search is already handled by useMemo */}}
            >
              Search
            </Button>
          </Col>
        </Row>
      </div>

      <Card>
        <Table
          columns={allReviewsColumns}
          dataSource={combinedReviewsData}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} reviews`
          }}
          className="reviews-table"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default AllReviews;