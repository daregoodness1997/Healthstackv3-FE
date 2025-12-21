/**
 * Organization Header Component
 *
 * Displays organization logo with dropdown menu
 */

import { Avatar, Dropdown } from 'antd';
import { CameraOutlined, DeleteOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

interface OrganizationHeaderProps {
  logoUrl?: string;
  onChangeLogo: () => void;
  onRemoveLogo?: () => void;
}

const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({
  logoUrl,
  onChangeLogo,
  onRemoveLogo,
}) => {
  const menuItems: MenuProps['items'] = [
    {
      key: 'change',
      label: 'Change Logo',
      icon: <CameraOutlined />,
      onClick: onChangeLogo,
    },
    ...(onRemoveLogo
      ? [
          {
            key: 'remove',
            label: 'Remove Logo',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: onRemoveLogo,
          },
        ]
      : []),
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: '#fafafa',
        position: 'sticky',
        zIndex: 99,
        top: 0,
        left: 0,
        padding: '8px 16px',
        marginBottom: '16px',
      }}
    >
      <Dropdown menu={{ items: menuItems }} trigger={['click']}>
        <Avatar size={68} src={logoUrl} style={{ cursor: 'pointer' }}>
          LOGO
        </Avatar>
      </Dropdown>
    </div>
  );
};

export default OrganizationHeader;
