import React, { useState, useCallback } from 'react';
import {
  Card,
  Button,
  Space,
  Input,
  Table,
  Empty,
  Typography,
  Alert,
  Tooltip,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useRadiologies } from '../../../hooks/queries/useRadiology';
import { useRadiologyStore } from '../../../stores/radiologyStore';
// @ts-ignore - JS module
import { UserContext, ObjectContext } from '../../../context';

const { Title } = Typography;

interface Radiology {
  _id: string;
  name: string;
  description?: string;
  facility: string;
  locationType: string;
  createdAt?: string;
}

interface RadiologyListProps {
  standalone?: boolean;
  closeModal?: () => void;
  onRowClick?: (radiology: Radiology) => void;
}

/**
 * RadiologyList Component
 * Displays list of radiologies with search and create functionality
 *
 * Features:
 * - Ant Design Table with pagination
 * - Debounced search
 * - TanStack Query for data fetching
 * - Automatic refetching on changes
 * - Row click handling
 */

const RadiologyList: React.FC<RadiologyListProps> = ({
  standalone,
  closeModal,
  onRowClick,
}) => {
  const { user } = React.useContext(UserContext) as any;
  const { setState } = React.useContext(ObjectContext) as any;
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} radiologies`,
    pageSizeOptions: ['10', '20', '50', '100'],
  });

  const { setActiveView, setCurrentRadiologyId, setSelectedRadiology } =
    useRadiologyStore();

  const facilityId = user?.currentEmployee?.facilityDetail?._id;

  // Fetch radiologies with pagination
  const {
    data: radiologiesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useRadiologies(facilityId, {
    $limit: pagination.pageSize,
    $skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 20),
    $sort: { name: 1 },
    ...(debouncedSearch && {
      name: { $regex: debouncedSearch, $options: 'i' },
    }),
  });

  const radiologies = radiologiesData?.data || [];
  const total = radiologiesData?.total || 0;

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleCreateNew = useCallback(() => {
    setActiveView('create');
    setState((prevstate: any) => ({
      ...prevstate,
      StoreModule: { ...prevstate.StoreModule, show: 'create' },
    }));
  }, [setActiveView, setState]);

  const handleRowClick = useCallback(
    (record: Radiology) => {
      setSelectedRadiology(record as any);
      setCurrentRadiologyId(record._id);
      setActiveView('detail');

      setState((prevstate: any) => ({
        ...prevstate,
        StoreModule: {
          selectedStore: record,
          show: 'detail',
        },
      }));

      if (standalone && closeModal) {
        setState((prevstate: any) => ({
          ...prevstate,
          RadiologyModule: {
            ...prevstate.RadiologyModule,
            selectedRadiology: record,
          },
        }));
        closeModal();
      }

      onRowClick?.(record);
    },
    [
      setSelectedRadiology,
      setCurrentRadiologyId,
      setActiveView,
      setState,
      standalone,
      closeModal,
      onRowClick,
    ],
  );

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  const columns: ColumnsType<Radiology> = [
    {
      title: 'Radiology Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => (date ? new Date(date).toLocaleDateString() : '-'),
      sorter: (a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      },
    },
  ];

  // Error state
  if (isError) {
    return (
      <Card title={standalone ? 'Select Radiology' : 'Radiologies'}>
        <Alert
          message="Error loading radiologies"
          description={(error as any)?.message || 'Unknown error'}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <Card
      title={standalone ? 'Select Radiology' : 'Radiologies'}
      extra={
        !standalone && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateNew}
            size="small"
          >
            Create New
          </Button>
        )
      }
      styles={{
        header: { backgroundColor: '#f0f2f5' },
        body: { padding: '16px' },
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Input
          placeholder="Search radiologies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: '100%' }}
          allowClear
          size="large"
        />

        <Table
          columns={columns}
          dataSource={radiologies}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            ...pagination,
            total: total,
            showQuickJumper: true,
          }}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: 'pointer' },
          })}
          locale={{
            emptyText: (
              <Empty
                description="No radiologies found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          rowClassName="hover:bg-gray-50"
          bordered
          size="middle"
        />
      </Space>
    </Card>
  );
};

export default RadiologyList;
