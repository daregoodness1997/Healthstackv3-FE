/**
 * Refactored Location List Component
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
  Select,
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
  EnvironmentOutlined,
} from '@ant-design/icons';
import {
  useLocations,
  usePrefetchLocation,
  useDeleteLocation,
} from '../../../hooks/queries/useLocations';
import { useLocationStore } from '../../../stores/locationStore';
import { ErrorBoundary } from '../../../components/error-boundary/ErrorBoundary';
import { UserContext, ObjectContext } from '../../../context';
import type { Location } from '../../../hooks/queries/useLocations';

const { Title } = Typography;
const { Option } = Select;

interface LocationListRefactoredProps {
  onOpenCreate?: () => void;
  onOpenDetail?: () => void;
}

export const LocationListRefactored: React.FC<LocationListRefactoredProps> = ({
  onOpenCreate,
  onOpenDetail,
}) => {
  const { user } = useContext(UserContext) as any;
  const { setState } = useContext(ObjectContext) as any;
  const facilityId = user?.currentEmployee?.facilityDetail?._id;

  // Local state for filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [locationTypeFilter, setLocationTypeFilter] = useState<string>('');
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} locations`,
    pageSizeOptions: ['10', '20', '50', '100'],
  });

  // Zustand store
  const { setSelectedLocation } = useLocationStore();

  // TanStack Query
  const {
    data: locationsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useLocations({
    facilityId,
    search: debouncedSearch,
    locationType: locationTypeFilter || undefined,
    limit: pagination.pageSize,
    skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 20),
  });

  const locations = locationsData?.data || [];
  const total = locationsData?.total || 0;

  const prefetchLocation = usePrefetchLocation();
  const { mutate: deleteLocation, isPending: isDeleting } = useDeleteLocation();

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
    (location: Location) => {
      setSelectedLocation(location);
      setState((prev: any) => ({
        ...prev,
        LocationModule: {
          ...prev.LocationModule,
          selectedLocation: location,
          show: 'detail',
        },
      }));
      if (onOpenDetail) {
        onOpenDetail();
      }
    },
    [setSelectedLocation, setState, onOpenDetail],
  );

  const handleEdit = useCallback(
    (location: Location) => {
      setSelectedLocation(location);
      setState((prev: any) => ({
        ...prev,
        LocationModule: {
          ...prev.LocationModule,
          selectedLocation: location,
          show: 'edit',
        },
      }));
      if (onOpenCreate) {
        onOpenCreate();
      }
    },
    [setSelectedLocation, setState, onOpenCreate],
  );

  const handleDelete = useCallback(
    async (locationId: string) => {
      deleteLocation(locationId);
    },
    [deleteLocation],
  );

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  const handleCreateLocation = () => {
    setState((prev: any) => ({
      ...prev,
      LocationModule: {
        ...prev.LocationModule,
        selectedLocation: {},
        show: 'create',
      },
    }));
    if (onOpenCreate) {
      onOpenCreate();
    }
  };

  // Table columns
  const columns: ColumnsType<Location> = [
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
      title: 'Location Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Location Type',
      dataIndex: 'locationType',
      key: 'locationType',
      width: 150,
      render: (type) => {
        const colorMap: Record<string, string> = {
          'Front Desk': 'blue',
          Clinic: 'green',
          Store: 'orange',
          Laboratory: 'purple',
          Finance: 'gold',
          Pharmacy: 'cyan',
          Radiology: 'magenta',
        };
        return <Tag color={colorMap[type] || 'default'}>{type}</Tag>;
      },
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      width: 150,
      render: (branch) => branch || 'N/A',
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
            title="Delete Location"
            description={`Are you sure you want to delete ${record.name}?`}
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
          message="Error loading locations"
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
            Locations
          </Title>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreateLocation}
          >
            New Location
          </Button>
        </div>

        {/* Filters */}
        <Space
          style={{ marginBottom: '16px', width: '100%' }}
          size="middle"
          wrap
        >
          <Input
            placeholder="Search by name, type, or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: '100%', maxWidth: '400px', minWidth: '200px' }}
            allowClear
          />

          <Select
            placeholder="Filter by Location Type"
            value={locationTypeFilter || undefined}
            onChange={(value) => {
              setLocationTypeFilter(value || '');
              setPagination((prev) => ({ ...prev, current: 1 }));
            }}
            style={{ width: 200, minWidth: '150px' }}
            allowClear
          >
            <Option value="Front Desk">Front Desk</Option>
            <Option value="Clinic">Clinic</Option>
            <Option value="Store">Store</Option>
            <Option value="Laboratory">Laboratory</Option>
            <Option value="Finance">Finance</Option>
            <Option value="Pharmacy">Pharmacy</Option>
            <Option value="Radiology">Radiology</Option>
          </Select>
        </Space>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={locations}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            ...pagination,
            total: total,
            showQuickJumper: true,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          bordered
          size="middle"
          onRow={(record) => ({
            onMouseEnter: () => prefetchLocation(record._id),
          })}
        />
      </div>
    </ErrorBoundary>
  );
};

export default LocationListRefactored;
