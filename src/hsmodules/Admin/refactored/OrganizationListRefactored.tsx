/**
 * Refactored Organization List Component
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
  Avatar,
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
  BankOutlined,
} from '@ant-design/icons';
import {
  useOrganizations,
  usePrefetchOrganization,
  useDeleteOrganization,
} from '../../../hooks/queries/useOrganizations';
import { useOrganizationStore } from '../../../stores/organizationStore';
import { ErrorBoundary } from '../../../components/error-boundary/ErrorBoundary';
import { UserContext, ObjectContext } from '../../../context';
import type { Organization } from '../../../hooks/queries/useOrganizations';

const { Title, Text } = Typography;

interface OrganizationListRefactoredProps {
  onOpenCreate?: () => void;
  onOpenDetail?: () => void;
}

export const OrganizationListRefactored: React.FC<
  OrganizationListRefactoredProps
> = ({ onOpenCreate, onOpenDetail }) => {
  const { user } = useContext(UserContext) as any;
  const { setState } = useContext(ObjectContext) as any;

  // Local state for filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} organizations`,
    pageSizeOptions: ['10', '20', '50', '100'],
  });

  // Zustand store
  const { setSelectedOrganization } = useOrganizationStore();

  // TanStack Query
  const {
    data: organizationsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useOrganizations({
    search: debouncedSearch,
    limit: pagination.pageSize,
    skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 20),
  });

  const organizations = organizationsData?.data || [];
  const total = organizationsData?.total || 0;

  const prefetchOrganization = usePrefetchOrganization();
  const { mutate: deleteOrganization, isPending: isDeleting } =
    useDeleteOrganization();

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
    (organization: Organization) => {
      setSelectedOrganization(organization);
      setState((prev: any) => ({
        ...prev,
        OrganizationModule: {
          ...prev.OrganizationModule,
          selectedOrganization: organization,
          show: 'detail',
        },
      }));
      if (onOpenDetail) {
        onOpenDetail();
      }
    },
    [setSelectedOrganization, setState, onOpenDetail],
  );

  const handleEdit = useCallback(
    (organization: Organization) => {
      setSelectedOrganization(organization);
      setState((prev: any) => ({
        ...prev,
        OrganizationModule: {
          ...prev.OrganizationModule,
          selectedOrganization: organization,
          show: 'edit',
        },
      }));
      if (onOpenCreate) {
        onOpenCreate();
      }
    },
    [setSelectedOrganization, setState, onOpenCreate],
  );

  const handleDelete = useCallback(
    async (organizationId: string) => {
      deleteOrganization(organizationId);
    },
    [deleteOrganization],
  );

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  const handleCreateOrganization = () => {
    setState((prev: any) => ({
      ...prev,
      OrganizationModule: {
        ...prev.OrganizationModule,
        selectedOrganization: {},
        show: 'create',
      },
    }));
    if (onOpenCreate) {
      onOpenCreate();
    }
  };

  // Table columns
  const columns: ColumnsType<Organization> = [
    {
      title: 'Organization',
      key: 'organization',
      fixed: 'left',
      width: 300,
      render: (_, record) => (
        <Space>
          <Avatar
            size="large"
            src={record.facilityLogo}
            icon={!record.facilityLogo && <BankOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.facilityName}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.facilityType || 'N/A'}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.facilityContactPhone || 'N/A'}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.facilityEmail || 'N/A'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Location',
      key: 'location',
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.facilityCity || 'N/A'}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.facilityState || 'N/A'}, {record.facilityCountry || 'N/A'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Owner',
      dataIndex: 'facilityOwner',
      key: 'facilityOwner',
      width: 150,
      render: (owner) => owner || 'N/A',
    },
    {
      title: 'Modules',
      dataIndex: 'modules',
      key: 'modules',
      width: 150,
      render: (modules) => (
        <Tag color="blue">{modules?.length || 0} modules</Tag>
      ),
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
            title="Delete Organization"
            description={`Are you sure you want to delete ${record.facilityName}?`}
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
          message="Error loading organizations"
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
            Organizations
          </Title>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreateOrganization}
          >
            New Organization
          </Button>
        </div>

        {/* Filters */}
        <Space
          style={{ marginBottom: '16px', width: '100%' }}
          size="middle"
          wrap
        >
          <Input
            placeholder="Search by name, email, phone, or city..."
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
          dataSource={organizations}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            ...pagination,
            total: total,
            showQuickJumper: true,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1400 }}
          bordered
          size="middle"
          onRow={(record) => ({
            onMouseEnter: () => prefetchOrganization(record._id),
          })}
        />
      </div>
    </ErrorBoundary>
  );
};

export default OrganizationListRefactored;
