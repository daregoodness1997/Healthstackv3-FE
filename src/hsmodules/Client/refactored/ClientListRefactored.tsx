/**
 * Refactored Client List Component
 *
 * Features:
 * - TanStack Query for data fetching
 * - Zustand for state management
 * - Ant Design Table with pagination
 * - Optimized with React.memo
 * - Debounced search
 * - Ant Design components
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
  UserOutlined,
  EyeOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  useClients,
  usePrefetchClient,
} from '../../../hooks/queries/useClients';
import { useClientOperations } from '../../../hooks/useClientOperations';
import { useClientStore } from '../../../stores/clientStore';
import { ErrorBoundary } from '../../../components/error-boundary/ErrorBoundary';
import { UserContext, ObjectContext } from '../../../context';
import type { Client } from '../../../types/client';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * Main Client List Component
 */
interface ClientListRefactoredProps {
  onOpenCreate?: () => void;
  onOpenDetail?: () => void;
  onOpenUpload?: () => void;
}

export const ClientListRefactored: React.FC<ClientListRefactoredProps> = ({
  onOpenCreate,
  onOpenDetail,
  onOpenUpload,
}) => {
  const { user } = useContext(UserContext);
  const { setState } = useContext(ObjectContext);
  const facilityId = user?.currentEmployee?.facilityDetail?._id;

  // Local state for filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('');
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} clients`,
    pageSizeOptions: ['10', '20', '50', '100'],
  });

  // Zustand store
  const { setSelectedClient } = useClientStore();

  // TanStack Query
  const {
    data: clientsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useClients({
    facilityId,
    search: debouncedSearch,
    gender: genderFilter || undefined,
    limit: pagination.pageSize,
    skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 20),
  });

  const clients = clientsData?.data || [];
  const total = clientsData?.total || 0;

  // Business logic hooks
  const { viewClient, deleteClient, isDeleting } =
    useClientOperations(facilityId);

  const prefetchClient = usePrefetchClient();

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
    (client: Client) => {
      setSelectedClient(client);
      setState((prev: any) => ({
        ...prev,
        ClientModule: {
          ...prev.ClientModule,
          selectedClient: client,
          show: 'detail',
        },
      }));
      if (onOpenDetail) {
        onOpenDetail();
      }
    },
    [setSelectedClient, setState, onOpenDetail],
  );

  const handleEdit = useCallback(
    (client: Client) => {
      setSelectedClient(client);
      setState((prev: any) => ({
        ...prev,
        ClientModule: {
          ...prev.ClientModule,
          selectedClient: client,
          show: 'edit',
        },
      }));
      if (onOpenCreate) {
        onOpenCreate();
      }
    },
    [setSelectedClient, setState, onOpenCreate],
  );

  const handleDelete = useCallback(
    async (clientId: string, clientName: string) => {
      await deleteClient(clientId, clientName);
    },
    [deleteClient],
  );

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  const handleCreateClient = () => {
    setState((prev: any) => ({
      ...prev,
      ClientModule: {
        ...prev.ClientModule,
        selectedClient: {},
        show: 'create',
      },
    }));
    if (onOpenCreate) {
      onOpenCreate();
    }
  };

  // Table columns
  const columns: ColumnsType<Client> = [
    {
      title: 'Patient',
      key: 'patient',
      fixed: 'left',
      width: 250,
      render: (_, record) => (
        <Space>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>
              {record.firstname} {record.lastname}
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              MRN: {record.mrn || 'N/A'}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (gender) => (
        <Tag
          color={
            gender === 'Male'
              ? 'blue'
              : gender === 'Female'
                ? 'pink'
                : 'default'
          }
        >
          {gender}
        </Tag>
      ),
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
      width: 120,
      render: (dob) => (dob ? new Date(dob).toLocaleDateString() : 'N/A'),
    },
    {
      title: 'Age',
      key: 'age',
      width: 80,
      render: (_, record) => {
        if (!record.dob) return 'N/A';
        const age = Math.floor(
          (Date.now() - new Date(record.dob).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000),
        );
        return age;
      },
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
            title="Delete Client"
            description={`Are you sure you want to delete ${record.firstname} ${record.lastname}?`}
            onConfirm={() =>
              handleDelete(record._id, `${record.firstname} ${record.lastname}`)
            }
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
          message="Error loading clients"
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
            Clients / Patients
          </Title>
          <Space>
            <Button
              size="large"
              icon={<UploadOutlined />}
              onClick={onOpenUpload}
            >
              Upload Clients
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleCreateClient}
            >
              New Client
            </Button>
          </Space>
        </div>

        {/* Filters */}
        <Space
          style={{ marginBottom: '16px', width: '100%' }}
          size="middle"
          wrap
        >
          <Input
            placeholder="Search by name, phone, email, or MRN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: '100%', maxWidth: '400px', minWidth: '200px' }}
            allowClear
          />

          <Select
            placeholder="Filter by Gender"
            value={genderFilter || undefined}
            onChange={(value) => {
              setGenderFilter(value || '');
              setPagination((prev) => ({ ...prev, current: 1 }));
            }}
            style={{ width: 200, minWidth: '150px' }}
            allowClear
          >
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Space>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={clients}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            ...pagination,
            total: total,
            showQuickJumper: true,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          bordered
          size="middle"
          onRow={(record) => ({
            onMouseEnter: () => prefetchClient(record._id),
          })}
        />
      </div>
    </ErrorBoundary>
  );
};

export default ClientListRefactored;
