import { Empty, Typography, Space, Card } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context';

const { Title, Text } = Typography;

const EmptyPage = () => {
  const { user } = useContext(UserContext) as any;
  const userName = user?.firstname
    ? `${user.firstname} ${user.lastname || ''}`.trim()
    : '';
  const facilityName =
    user?.currentEmployee?.facilityDetail?.facilityName || '';

  return (
    <div
      style={{
        width: '100%',
        maxHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Card
        style={{
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          borderRadius: '16px',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={2} style={{ marginBottom: '8px', color: '#1890ff' }}>
              Welcome {userName && <span>{userName}</span>} 👋
            </Title>
            {facilityName && (
              <Text type="secondary" style={{ fontSize: '16px' }}>
                {facilityName}
              </Text>
            )}
          </div>

          <Empty
            image="/empty.png"
            imageStyle={{
              height: 300,
              maxWidth: '100%',
              objectFit: 'contain',
              margin: '0 auto',
            }}
            description={
              <Space direction="vertical" size="small">
                <Title
                  level={4}
                  style={{ marginTop: '24px', marginBottom: '8px' }}
                >
                  No Notifications Available
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  You're all caught up! Check back later for updates.
                </Text>
              </Space>
            }
          >
            <div style={{ marginTop: '16px' }}>
              <BellOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
            </div>
          </Empty>

          <Text
            type="secondary"
            style={{ fontSize: '14px', display: 'block', marginTop: '24px' }}
          >
            Hope you have a wonderful time! 🎉
          </Text>
        </Space>
      </Card>
    </div>
  );
};

export default EmptyPage;
