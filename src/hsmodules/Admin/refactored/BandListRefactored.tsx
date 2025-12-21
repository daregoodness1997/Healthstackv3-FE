/**
 * Refactored Band List Component
 *
 * Features:
 * - TanStack Query for data fetching
 * - Zustand for state management
 * - Ant Design Table with pagination
 * - Debounced search
 */

import React, { useState, useCallback, useContext } from 'react';
import {
  Input,
  Button,
  Tag,
  Space,
  Typography,
  Alert,
  Table,
  Tooltip,
  Popconfirm,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  useBands,
  usePrefetchBand,
  useDeleteBand,
} from '../../../hooks/queries/useBands';
import { useBandStore } from '../../../stores/bandStore';
import { ErrorBoundary } from '../../../components/error-boundary/ErrorBoundary';
import { UserContext, ObjectContext } from '../../../context';
import type { Band } from '../../../hooks/queries/useBands';

const { Title } = Typography;

interface BandListRefactoredProps {
  onOpenCreate?: () => void;
  onOpenDetail?: () => void;
}

export const BandListRefactored: React.FC<BandListRefactoredProps> = ({
  onOpenCreate,
  onOpenDetail,
}) => {
  const { user } = useContext(UserContext) as any;
  const { setState } = useContext(ObjectContext) as any;
  const facilityId = user?.currentEmployee?.facilityDetail?._id;

  // Local state for filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} bands`,
    pageSizeOptions: ['10', '20', '50', '100'],
  });

  // Zustand store
  const { setSelectedBand } = useBandStore();

  // TanStack Query
  const {
    data: bandsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useBands({
    facilityId,
    search: debouncedSearch,
    limit: pagination.pageSize,
    skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 20),
  });

  const bands = bandsData?.data || [];
  const total = bandsData?.total || 0;

  const prefetchBand = usePrefetchBand();
  const { mutate: deleteBand, isPending: isDeleting } = useDeleteBand();

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Handlers
  const handleView = useCallback(
    (band: Band) => {
      setSelectedBand(band);
      setState((prev: any) => ({
        ...prev,
        BandModule: {
          ...prev.BandModule,
          selectedBand: band,
          show: 'detail',
        },
      }));
      if (onOpenDetail) {
        onOpenDetail();
      }
    },
    [setSelectedBand, setState, onOpenDetail],
  );

  const handleEdit = useCallback(
    (band: Band) => {
      setSelectedBand(band);
      setState((prev: any) => ({
        ...prev,
        BandModule: {
          ...prev.BandModule,
          selectedBand: band,
          show: 'edit',
        },
      }));
      if (onOpenCreate) {
        onOpenCreate();
      }
    },
    [setSelectedBand, setState, onOpenCreate],
  );

  const handleDelete = useCallback(
    async (bandId: string) => {
      deleteBand(bandId);
    },
    [deleteBand],
  );

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  const handleCreateBand = () => {
    setState((prev: any) => ({
      ...prev,
      BandModule: {
        ...prev.BandModule,
        selectedBand: {},
        show: 'create',
      },
    }));
    if (onOpenCreate) {
      onOpenCreate();
    }
  };

  // Table columns
  const columns: ColumnsType<Band> = [
    {
      title: 'S/N',
      key: 'sn',
      width: 80,
      render: (_, __, index) =>
        ((pagination.current || 1) - 1) * (pagination.pageSize || 20) +
        index +
        1,
    },
    {
      title: 'Band Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text, record) => (
        <span style={{ fontWeight: 500 }}>
          {text || record.bandType || 'N/A'}
        </span>
      ),
    },
    {
      title: 'Band Type',
      dataIndex: 'bandType',
      key: 'bandType',
      render: (text) => (text ? <Tag color="purple">{text}</Tag> : 'N/A'),
    },
    {
      title: 'Band Level',
      dataIndex: 'bandLevel',
      key: 'bandLevel',
      render: (level) => <Tag color="blue">{level || 'N/A'}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => text || 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Band"
            description={`Are you sure you want to delete ${record.bandType}?`}
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                loading={isDeleting}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Error state
  if (isError) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Error loading bands"
          description={error?.message || 'Unknown error'}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            List of Bands
          </Title>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreateBand}
          >
            New Band
          </Button>
        </div>

        {/* Filters */}
        <Space
          style={{ marginBottom: '16px', width: '100%' }}
          size="middle"
          wrap
        >
          <Input
            placeholder="Search by name, band type, level, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: '100%', maxWidth: '400px', minWidth: '200px' }}
            allowClear
          />
        </Space>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={bands}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            ...pagination,
            total: total,
            showQuickJumper: true,
          }}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
          bordered
          size="middle"
          onRow={(record) => ({
            onMouseEnter: () => prefetchBand(record._id),
          })}
        />
      </div>
    </ErrorBoundary>
  );
};

export default BandListRefactored;
