import { Card, Typography, Space, Avatar } from 'antd';
import { GithubOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

function Home() {
  const authorName = import.meta.env.VITE_AUTHOR_NAME;
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
  const githubUrl = import.meta.env.VITE_GITHUB_URL;
  const projectName = import.meta.env.VITE_PROJECT_NAME;

  return (
    <div>
      <Title level={2}>Welcome to {projectName}</Title>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space align="center" size="large">
            <Avatar size={64} icon={<UserOutlined />} />
            <div>
              <Title level={4}>About the Author</Title>
              <Space direction="vertical">
                <Space>
                  <UserOutlined />
                  <Text strong>{authorName}</Text>
                </Space>
                <Space>
                  <MailOutlined />
                  <Link href={`mailto:${contactEmail}`}>{contactEmail}</Link>
                </Space>
                <Space>
                  <GithubOutlined />
                  <Link href={githubUrl} target="_blank">GitHub Profile</Link>
                </Space>
              </Space>
            </div>
          </Space>

        </Space>
      </Card>
    </div>
  );
}

export default Home;