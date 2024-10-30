import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Spin } from 'antd';
import { loadMenuItems } from './utils/menuLoader';
import './App.css';

const { Content, Sider } = Layout;

interface MenuItem {
  key: string;
  label: string;
  component: React.ComponentType;
}

function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { token } = theme.useToken();

  useEffect(() => {
    loadMenuItems().then(items => {
      setMenuItems(items);
      if (items.length > 0) {
        setSelectedKey(items[0].key);
      }
      setLoading(false);
    });
  }, []);

  const CurrentComponent = menuItems.find(item => item.key === selectedKey)?.component;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" width={200}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems.map(({ key, label }) => ({
            key,
            label,
          }))}
          onClick={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px', padding: 24, background: token.colorBgContainer }}>
          {CurrentComponent && <CurrentComponent />}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
