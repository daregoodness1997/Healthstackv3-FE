import { Card, Space, DatePicker, Dropdown, Button } from 'antd';
import {
  CalendarOutlined,
  MoreOutlined,
  DownloadOutlined,
  EyeOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { ReactNode } from 'react';

const { RangePicker } = DatePicker;

interface ChartCardProps {
  title: string;
  children: ReactNode;
  showDatePicker?: boolean;
  showMoreMenu?: boolean;
  height?: string;
  extra?: ReactNode;
}

const menuItems = [
  { key: 'export', icon: <DownloadOutlined />, label: 'Export Report' },
  { key: 'view', icon: <EyeOutlined />, label: 'View Report' },
  { key: 'print', icon: <PrinterOutlined />, label: 'Print Report' },
];

export const ChartCard = ({
  title,
  children,
  showDatePicker = true,
  showMoreMenu = true,
  height = '400px',
  extra,
}: ChartCardProps) => {
  return (
    <Card
      variant="borderless"
      style={{ height: '100%' }}
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <span
            style={{ fontSize: '16px', fontWeight: '600', color: '#262626' }}
          >
            {title}
          </span>
          <Space wrap>
            {extra}
            {showDatePicker && (
              <RangePicker
                suffixIcon={<CalendarOutlined />}
                style={{ minWidth: '200px', maxWidth: '260px' }}
                size="small"
              />
            )}
            {showMoreMenu && (
              <Dropdown
                menu={{ items: menuItems }}
                trigger={['click']}
                placement="bottomRight"
              >
                <Button
                  icon={<MoreOutlined />}
                  style={{ border: 'none' }}
                  size="small"
                />
              </Dropdown>
            )}
          </Space>
        </div>
      }
    >
      <div style={{ height, padding: '8px 16px 16px', width: '100%' }}>
        {children}
      </div>
    </Card>
  );
};
