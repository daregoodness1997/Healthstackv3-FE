/**
 * Refactored Radiology Request Component
 *
 * Features:
 * - TanStack Query for data fetching
 * - Zustand for state management
 * - Ant Design Table with pagination
 * - Debounced search
 * - Filters for billing status and payment mode
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
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import {
  useRadiologyBillRequests,
  useDeleteRadiologyBill,
} from '../../../hooks/queries/useRadiologyBills';
import { useRadiologyStore } from '../../../stores/radiologyStore';
import { ErrorBoundary } from '../../../components/error-boundary/ErrorBoundary';
// @ts-ignore - JS module
import { UserContext } from '../../../context';
import { format } from 'date-fns';

const { Title } = Typography;
const { Option } = Select;

interface RadiologyRequestRefactoredProps {
  onOpenDetail?: () => void;
}

export const RadiologyRequestRefactored: React.FC<
  RadiologyRequestRefactoredProps
> = ({ onOpenDetail }) => {
  const { user } = useContext(UserContext) as any;
  const facilityId = user?.currentEmployee?.facilityDetail?._id;

  // Local state for filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [billingStatusFilter, setBillingStatusFilter] = useState<string>('');
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} requests`,
    pageSizeOptions: ['10', '20', '50', '100'],
  });

  // Zustand store
  const { setSelectedRadiologyRequest, setSelectedClient } =
    useRadiologyStore();

  // TanStack Query - fetch bills with Radiology order_category and billing status
  const {
    data: requestsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useRadiologyBillRequests({
    facilityId,
    search: debouncedSearch,
    billingStatus: billingStatusFilter || undefined,
    limit: pagination.pageSize,
    skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 20),
  });

  const requests = requestsData?.data || [];
  const total = requestsData?.total || 0;

  const { mutate: deleteRequest, isPending: isDeleting } =
    useDeleteRadiologyBill();

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
    (request: any) => {
      setSelectedRadiologyRequest(request);
      setSelectedClient(request.orderInfo?.orderObj?.client);

      if (onOpenDetail) {
        onOpenDetail();
      }
    },
    [setSelectedRadiologyRequest, setSelectedClient, onOpenDetail],
  );

  const handleDelete = useCallback(
    async (requestId: string) => {
      deleteRequest(requestId);
    },
    [deleteRequest],
  );

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  // Get status tag color
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      Paid: 'green',
      Unpaid: 'red',
      'Partially Paid': 'orange',
      Pending: 'blue',
    };
    return statusMap[status] || 'default';
  };

  // Table columns
  const columns: ColumnsType<any> = [
    {
      title: 'S/N',
      key: 'sn',
      width: 60,
      render: (_, __, index) =>
        ((pagination.current || 1) - 1) * (pagination.pageSize || 20) +
        index +
        1,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => format(new Date(date), 'dd/MM/yyyy HH:mm'),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Client/Principal',
      key: 'client',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <FileTextOutlined style={{ color: '#1890ff' }} />
            <span style={{ fontWeight: 500 }}>
              {record.orderInfo?.orderObj?.clientname || 'N/A'}
            </span>
          </Space>
          <span style={{ fontSize: '12px', color: '#666' }}>
            {record.participantInfo?.paymentmode?.detail?.principalName || ''}
          </span>
        </Space>
      ),
    },
    {
      title: 'Test',
      key: 'test',
      ellipsis: true,
      render: (_, record) => record.orderInfo?.orderObj?.order || 'N/A',
    },
    {
      title: 'Payment Mode',
      key: 'paymentMode',
      width: 130,
      render: (_, record) => (
        <Tag
          color={
            record.participantInfo?.paymentmode?.type === 'Cash'
              ? 'green'
              : 'blue'
          }
        >
          {record.participantInfo?.paymentmode?.type || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Amount',
      key: 'amount',
      width: 120,
      render: (_, record) => {
        const price = record.serviceInfo?.price || 0;
        return `₦${price.toLocaleString()}`;
      },
      sorter: (a, b) =>
        (a.serviceInfo?.price || 0) - (b.serviceInfo?.price || 0),
    },
    {
      title: 'Requesting Doctor',
      key: 'doctor',
      width: 180,
      ellipsis: true,
      render: (_, record) =>
        record.orderInfo?.orderObj?.requestingdoctor_Name || 'N/A',
    },
    {
      title: 'Billing Status',
      dataIndex: 'billing_status',
      key: 'billing_status',
      width: 130,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status || 'N/A'}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
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
          <Popconfirm
            title="Delete Request"
            description={`Are you sure you want to delete this radiology request for ${record.orderInfo?.orderObj?.clientname}?`}
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
          message="Error loading radiology requests"
          description={(error as any)?.message || 'Unknown error'}
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
        {/* Filters */}
        <Space
          style={{ marginBottom: '16px', width: '100%' }}
          size="middle"
          wrap
        >
          <Input
            placeholder="Search by client, principal, or test..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: '100%', maxWidth: '400px', minWidth: '200px' }}
            allowClear
          />

          <Select
            placeholder="Filter by Billing Status"
            value={billingStatusFilter || undefined}
            onChange={(value) => {
              setBillingStatusFilter(value || '');
              setPagination((prev) => ({ ...prev, current: 1 }));
            }}
            style={{ width: 200, minWidth: '150px' }}
            allowClear
          >
            <Option value="Unpaid">Unpaid</Option>
            <Option value="Paid">Paid</Option>
            <Option value="Partially Paid">Partially Paid</Option>
          </Select>
        </Space>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={requests}
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
        />
      </div>
    </ErrorBoundary>
  );
};

export default RadiologyRequestRefactored;
