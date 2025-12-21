import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbItems = [
    {
      title: (
        <span onClick={() => navigate('/app')} style={{ cursor: 'pointer' }}>
          <HomeOutlined />
        </span>
      ),
    },
    ...pathnames.slice(1).map((name, index) => {
      const url = `/${pathnames.slice(0, index + 2).join('/')}`;
      const isLast = index === pathnames.length - 2;

      return {
        title: isLast ? (
          <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>
            {name.replace(/-/g, ' ')}
          </span>
        ) : (
          <span
            onClick={() => navigate(url)}
            style={{
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {name.replace(/-/g, ' ')}
          </span>
        ),
      };
    }),
  ];

  return <Breadcrumb items={breadcrumbItems} />;
}

export default Breadcrumbs;
