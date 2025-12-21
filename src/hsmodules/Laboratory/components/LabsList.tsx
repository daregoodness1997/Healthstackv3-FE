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
import { useLaboratories } from '../../../hooks/queries/useLaboratory';
import { useLaboratoryStore } from '../../../stores/laboratoryStore';
// @ts-ignore - JS module
import { UserContext, ObjectContext } from '../../../context';

const { Title } = Typography;

interface Laboratory {
  _id: string;
  name: string;
  description?: string;
  facility: string;
  locationType: string;
  createdAt?: string;
}

interface LabsListProps {
  standalone?: boolean;
  closeModal?: () => void;
  onRowClick?: (lab: Laboratory) => void;
}

/**
 * LabsList Component
 * Displays list of laboratories with search and create functionality
 *
 * Features:
 * - Ant Design Table with pagination
 * - Debounced search
 * - TanStack Query for data fetching
 * - Automatic refetching on changes
 * - Row click handling
 */

const LabsList: React.FC<LabsListProps> = ({
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
    showTotal: (total) => `Total ${total} laboratories`,
    pageSizeOptions: ['10', '20', '50', '100'],
  });

  const { setActiveView, setCurrentLabId, setSelectedLaboratory } =
    useLaboratoryStore();

  const facilityId = user?.currentEmployee?.facilityDetail?._id;

  // Fetch laboratories with pagination
  const {
    data: labsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useLaboratories(facilityId, {
    $limit: pagination.pageSize,
    $skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 20),
    $sort: { name: 1 },
    ...(debouncedSearch && {
      name: { $regex: debouncedSearch, $options: 'i' },
    }),
  });

  const laboratories = labsData?.data || [];
  const total = labsData?.total || 0;

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
    (record: Laboratory) => {
      setSelectedLaboratory(record as any);
      setCurrentLabId(record._id);
      setActiveView('detail');

      // Backward compatibility with ObjectContext
      setState((prevstate: any) => ({
        ...prevstate,
        StoreModule: {
          selectedStore: record,
          show: 'detail',
        },
      }));

      // For standalone mode (location selection modal)
      if (standalone && closeModal) {
        setState((prevstate: any) => ({
          ...prevstate,
          LaboratoryModule: {
            ...prevstate.LaboratoryModule,
            selectedLab: record,
          },
        }));
        closeModal();
      }

      onRowClick?.(record);
    },
    [
      setSelectedLaboratory,
      setCurrentLabId,
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

  const columns: ColumnsType<Laboratory> = [
    {
      title: 'Laboratory Name',
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
      <Card title={standalone ? 'Select Laboratory' : 'Laboratories'}>
        <Alert
          message="Error loading laboratories"
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
      title={standalone ? 'Select Laboratory' : 'Laboratories'}
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
          placeholder="Search laboratories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: '100%' }}
          allowClear
          size="large"
        />

        <Table
          columns={columns}
          dataSource={laboratories}
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
                description="No laboratories found"
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

export default LabsList;
