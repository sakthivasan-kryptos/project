import { Card, Table, Row, Col, Select, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import ReviewResults from './ReviewResults';
import { allReviewsData } from '../data/mockData';

const { Option } = Select;

const AllReviews = () => {
  const [selectedReview, setSelectedReview] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleViewResults = (record) => {
    setSelectedReview(record);
    setShowResults(true);
  };

  const handleBackToList = () => {
    setShowResults(false);
    setSelectedReview(null);
  };

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
      render: (status) => {
        let color = '#52c41a';
        if (status === 'In Progress') color = '#faad14';
        if (status === 'Needs Review') color = '#ff4d4f';
        
        return (
          <span 
            style={{ 
              color: color, 
              fontWeight: 500,
              padding: '4px 8px',
              borderRadius: '12px',
              backgroundColor: `${color}15`,
              fontSize: '12px'
            }}
          >
            {status}
          </span>
        );
      },
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
      />

      <div className="filters-section" style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col>
            <Select defaultValue="all-statuses" style={{ width: 150 }}>
              <Option value="all-statuses">All Statuses</Option>
              <Option value="completed">Completed</Option>
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
              placeholder="Search company name..."
              prefix={<SearchOutlined />}
              style={{ maxWidth: 300 }}
            />
          </Col>
          <Col>
            <Button type="primary" icon={<SearchOutlined />}>
              Search
            </Button>
          </Col>
        </Row>
      </div>

      <Card>
        <Table
          columns={allReviewsColumns}
          dataSource={allReviewsData}
          pagination={{ pageSize: 10 }}
          className="reviews-table"
        />
      </Card>
    </div>
  );
};

export default AllReviews;