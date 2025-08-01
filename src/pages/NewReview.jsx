import { Card, Button, Typography } from 'antd';
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import PageHeader from '../components/ui/PageHeader';

const { Text } = Typography;

const NewReview = () => {
  return (
    <div>
      <PageHeader
        title="Start New Compliance Review"
        subtitle="Upload employment documents to analyze against QFC regulations"
        centered
      />

      <div className="upload-section">
        <Card className="upload-card">
          <div className="upload-area">
            <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <Text style={{ color: '#8c8c8c', fontSize: '16px', marginBottom: '24px', display: 'block' }}>
              Drag and drop files here, or click to browse
            </Text>
            <Button type="primary" size="large" icon={<PlusOutlined />}>
              Choose Files
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NewReview;