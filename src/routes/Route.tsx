import React from 'react';

import {
  Route as ReactRouterDOMRoute,
  RouteProps as ReactRouterDOMRouteProps,
  Redirect
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

import { Layout, Menu, Breadcrumb } from 'antd';
import { FileOutlined, TeamOutlined, BarChartOutlined, SettingOutlined } from '@ant-design/icons';

interface RouteProps extends ReactRouterDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({ isPrivate = false, component: Component, ...rest }) => {

  const { user } = useAuth();

  return (
    <ReactRouterDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user
          ? (
            !isPrivate
              ?
                <Component />
              :
                <Layout style={{ minHeight: '100vh' }}>
                  <Layout.Sider collapsible>
                    <Menu theme="dark" style={{ height: '60px' }}>
                    </Menu>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                      <Menu.Item key="1" icon={<BarChartOutlined />}>Dashboard</Menu.Item>
                      <Menu.SubMenu key="postsKey" icon={<FileOutlined />} title="Posts">
                        <Menu.Item key="postsKey1">Todos</Menu.Item>
                        <Menu.Item key="postsKey2">Aceitos</Menu.Item>
                        <Menu.Item key="postsKey3">Rejeitados</Menu.Item>
                      </Menu.SubMenu>
                      <Menu.SubMenu key="usersKey" icon={<TeamOutlined />} title="Usuários">
                        <Menu.Item key="usersKey1">Administradores</Menu.Item>
                        <Menu.Item key="usersKey2">Comuns</Menu.Item>
                      </Menu.SubMenu>
                      <Menu.Item key="2" icon={<SettingOutlined />}>Conta</Menu.Item>
                    </Menu>
                  </Layout.Sider>

                  <Layout className="site-layout">
                    <Layout.Header className="site-layout-background" style={{ padding: 0 }}>
                      <Menu theme="dark" mode="horizontal">
                        <Menu.Item key="1">Home</Menu.Item>
                        <Menu.Item key="2">Sobre</Menu.Item>
                        <Menu.Item key="3">Contato</Menu.Item>
                      </Menu>
                    </Layout.Header>

                    <Layout.Content style={{ margin: '0 16px' }}>
                      <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                      </Breadcrumb>

                      <div className="site-layout-background">
                          
                        <Component />

                      </div>

                    </Layout.Content>

                    <Layout.Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Layout.Footer>
                  </Layout>

                </Layout>
          )
          : (<Redirect to={{ pathname: isPrivate ? '/signin' : '/dashboard', state: { from: location }}} />)
      }}
    />
  );
}

export default Route;