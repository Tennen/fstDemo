import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import { UploadOutlined, AppstoreOutlined } from '@ant-design/icons';
import FileViewerDemo from './demos/FileViewerDemo';
import './App.css';

const { Header, Sider, Content } = Layout;

interface Demo {
  key: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType;
}

const demos: Demo[] = [
  {
    key: 'fileViewer',
    label: 'File Viewer',
    icon: <UploadOutlined />,
    component: FileViewerDemo,
  },
  // Add more demos here as needed
];

function App() {
  const [selectedDemo, setSelectedDemo] = useState<string>(demos[0].key);
  const { token } = theme.useToken();

  const CurrentDemoComponent = demos.find(demo => demo.key === selectedDemo)?.component || demos[0].component;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" width={200}>
        <Menu
          mode="inline"
          selectedKeys={[selectedDemo]}
          items={demos.map(demo => ({
            key: demo.key,
            icon: demo.icon,
            label: demo.label,
          }))}
          onClick={({ key }) => setSelectedDemo(key)}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px', padding: 24, background: token.colorBgContainer }}>
          <CurrentDemoComponent />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
