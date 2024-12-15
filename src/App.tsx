import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Spin } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { loadMenuItems } from './utils/menuLoader';
import './App.css';

const { Content, Sider } = Layout;

interface MenuItem {
  key: string;
  label: string;
  component: React.ComponentType;
  meta?: {
    order?: number;
    title?: string;
    icon?: React.ComponentType;
  };
}

function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
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
      <Sider 
        theme="light" 
        width={200} 
        collapsible 
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems.map(({ key, label, meta }) => ({
            key,
            label,
            title: label,
            icon: meta?.icon ? React.createElement(meta.icon) : null
          }))}
          onClick={({ key }) => setSelectedKey(key)}
        />
        <div 
          className="collapse-trigger"
          onClick={() => setCollapsed(!collapsed)}
          style={{
            padding: '16px',
            textAlign: 'center',
            cursor: 'pointer',
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            position: 'absolute',
            bottom: 0,
            width: '100%',
            background: token.colorBgContainer,
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
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
