import React, { useCallback } from 'react';
import { Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import "./_layout.less"
import { useModel } from '@/.umi/plugin-model/useModel';
import { useMount } from 'ahooks';
import { history } from 'umi';

const { Header, Content, Footer, Sider } = Layout;

const items: MenuProps['items'] = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));

const App: React.FC = (props) => {
  const menuList = [
    {
      key: 'userList',
      icon: React.createElement(UserOutlined),
      label: '所有用户',
      onClick: () => {
        history.push('/admin/userManage/userList')
      }
    },
    {
      key: 'candidateList',
      icon: React.createElement(UserOutlined),
      label: '候选人列表',
      onClick: () => {
        history.push('/admin/userManage/candidate')
      }
    },
    {
      key: 'electioList',
      icon: React.createElement(AppstoreOutlined),
      label: '选举列表',
      onClick: () => {
        history.push('/admin/election')
      }
    },
    // {
    //   key: 'electioInfo',
    //   icon: React.createElement(AppstoreOutlined),
    //   label: '选举信息',
    //   onClick: () => {
    //     history.push('/admin/electionInfo')
    //   }
    // }
  ]
  useMount(() => {
    // findAllDept()
    // findRoles()
  });
  return (
  <Layout hasSider>
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="logo" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={menuList} />
    </Sider>
    <Layout className="site-layout" style={{ marginLeft: 200 }}>
      <Header className="site-layout-background" style={{ padding: 0 }} />
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
      { props.children }
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  </Layout>
)};

export default App;