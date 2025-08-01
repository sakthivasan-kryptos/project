import { Card, Table, Row, Col, Select, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PageHeader from '../components/ui/PageHeader';
import { allReviewsData } from '../data/mockData';
import { allReviewsColumns } from '../data/tableColumns.jsx';

const { Option } = Select;

const AllReviews = () => {
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