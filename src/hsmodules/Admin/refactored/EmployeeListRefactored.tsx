/**
 * Refactored Employee List Component
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
  UserOutlined,
  EyeOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  useEmployees,
  usePrefetchEmployee,
  useDeleteEmployee,
} from '../../../hooks/queries/useEmployees';
import { useEmployeeStore } from '../../../stores/employeeStore';
import { ErrorBoundary } from '../../../components/error-boundary/ErrorBoundary';
import { UserContext, ObjectContext } from '../../../context';
import type { Employee } from '../../../hooks/queries/useEmployees';

const { Title, Text } = Typography;

interface EmployeeListRefactoredProps {
  onOpenCreate?: () => void;
  onOpenDetail?: () => void;
  onOpenUpload?: () => void;
}

export const EmployeeListRefactored: React.FC<EmployeeListRefactoredProps> = ({
  onOpenCreate,
  onOpenDetail,
  onOpenUpload,
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
    showTotal: (total) => `Total ${total} employees`,
    pageSizeOptions: ['10', '20', '50', '100'],
  });

  // Zustand store
  const { setSelectedEmployee } = useEmployeeStore();

  // TanStack Query
  const {
    data: employeesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useEmployees({
    facilityId,
    search: debouncedSearch,
    limit: pagination.pageSize,
    skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 20),
  });

  const employees = employeesData?.data || [];
  const total = employeesData?.total || 0;

  const prefetchEmployee = usePrefetchEmployee();
  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();

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
    (employee: Employee) => {
      setSelectedEmployee(employee);
      setState((prev: any) => ({
        ...prev,
        EmployeeModule: {
          ...prev.EmployeeModule,
          selectedEmployee: employee,
          show: 'detail',
        },
      }));
      if (onOpenDetail) {
        onOpenDetail();
      }
    },
    [setSelectedEmployee, setState, onOpenDetail],
  );

  const handleEdit = useCallback(
    (employee: Employee) => {
      setSelectedEmployee(employee);
      setState((prev: any) => ({
        ...prev,
        EmployeeModule: {
          ...prev.EmployeeModule,
          selectedEmployee: employee,
          show: 'edit',
        },
      }));
      if (onOpenCreate) {
        onOpenCreate();
      }
    },
    [setSelectedEmployee, setState, onOpenCreate],
  );

  const handleDelete = useCallback(
    async (employeeId: string) => {
      deleteEmployee(employeeId);
    },
    [deleteEmployee],
  );

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  const handleCreateEmployee = () => {
    setState((prev: any) => ({
      ...prev,
      EmployeeModule: {
        ...prev.EmployeeModule,
        selectedEmployee: {},
        show: 'create',
      },
    }));
    if (onOpenCreate) {
      onOpenCreate();
    }
  };

  // Table columns
  const columns: ColumnsType<Employee> = [
    {
      title: 'Employee',
      key: 'employee',
      fixed: 'left',
      width: 250,
      render: (_, record) => (
        <Space>
          <Avatar
            size="large"
            src={record.imageurl}
            icon={!record.imageurl && <UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>
              {record.firstname} {record.middlename || ''} {record.lastname}
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.profession || 'N/A'}
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
          {gender || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      render: (dept) => dept || 'N/A',
    },
    {
      title: 'Band',
      dataIndex: 'band',
      key: 'band',
      width: 120,
      render: (band) => (band ? <Tag color="green">{band}</Tag> : 'N/A'),
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
            title="Delete Employee"
            description={`Are you sure you want to delete ${record.firstname} ${record.lastname}?`}
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
          message="Error loading employees"
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
            Employees
          </Title>
          <Space>
            <Button
              size="large"
              icon={<UploadOutlined />}
              onClick={onOpenUpload}
            >
              Upload Employees
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleCreateEmployee}
            >
              New Employee
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
            placeholder="Search by name, phone, email, or profession..."
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
          dataSource={employees}
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
            onMouseEnter: () => prefetchEmployee(record._id),
          })}
        />
      </div>
    </ErrorBoundary>
  );
};

export default EmployeeListRefactored;
