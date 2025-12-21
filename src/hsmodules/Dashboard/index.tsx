import React, { useEffect, useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { LayoutContent, LayoutWrapper } from '../../components/layout/styles';
import SideMenu from '../../components/sidemenu';
import TopMenu from '../../components/topmenu';
import { ObjectContext } from '../../context';

interface DashProps {
  children?: React.ReactNode | undefined;
}

const Dashboard: React.FC<DashProps> = ({ children }) => {
  const { state } = useContext(ObjectContext);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
    document.title = 'Health Stack - Dashboard';
  }, []);

  const isOpen = state?.sideMenu?.open ?? false;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
          fontSize: 14,
        },
        components: {
          Card: {
            borderRadiusLG: 8,
            boxShadowTertiary:
              '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
          },
        },
      }}
    >
      <LayoutWrapper>
        <SideMenu isOpen={isOpen} />
        <LayoutContent>
          <TopMenu />

          <div
            className="layout__content-main"
            style={{
              padding: '24px',
              background: '#f0f2f5',
              minHeight: 'calc(100vh - 64px)',
            }}
          >
            {children}
            <Outlet />
          </div>
        </LayoutContent>
      </LayoutWrapper>
    </ConfigProvider>
  );
};

export default Dashboard;
