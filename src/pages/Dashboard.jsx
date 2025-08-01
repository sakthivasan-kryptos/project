import { Row, Col, Typography } from 'antd';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import ReviewCard from '../components/ui/ReviewCard';
import { statsData, recentReviews } from '../data/mockData';

const { Title } = Typography;

const Dashboard = () => {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, Sarah. Here's your compliance overview for today."
      />

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard {...stat} />
          </Col>
        ))}
      </Row>

      {/* Recent Reviews Section */}
      <div className="recent-reviews-section">
        <Title level={3} style={{ marginBottom: '24px', color: '#262626', fontSize: '24px' }}>
          Recent Reviews
        </Title>
        
        <div className="reviews-list">
          {recentReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;