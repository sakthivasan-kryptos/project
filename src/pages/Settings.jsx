import { Card, Form, Input, Select, Typography } from 'antd';
import PageHeader from '../components/ui/PageHeader';

const { Option } = Select;
const { Text } = Typography;

const Settings = () => {
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configure system preferences and user settings"
      />

      <Card title="User Profile" style={{ marginBottom: '24px' }}>
        <Form layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item label="Full Name">
            <Input defaultValue="Sarah Johnson" />
          </Form.Item>
          <Form.Item label="Email Address">
            <Input defaultValue="sarah.johnson@qfc.gov" />
          </Form.Item>
          <Form.Item label="Department">
            <Select defaultValue="employment-standards" style={{ width: '100%' }}>
              <Option value="employment-standards">Employment Standards Office</Option>
              <Option value="legal">Legal Department</Option>
              <Option value="compliance">Compliance Team</Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Notification Preferences">
        <Text style={{ color: '#8c8c8c' }}>Configure your notification settings here</Text>
      </Card>
    </div>
  );
};

export default Settings;