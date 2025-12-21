/**
 * Refactored Radiology Report Component
 *
 * Features:
 * - TanStack Query for data fetching
 * - Zustand for state management
 * - Ant Design Table with pagination
 * - Debounced search
 * - Real-time updates via socket events
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
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  useRadiologyBillReports,
  useDeleteRadiologyBill,
} from '../../../hooks/queries/useRadiologyBills';
import { useRadiologyStore } from '../../../stores/radiologyStore';
import { ErrorBoundary } from '../../../components/error-boundary/ErrorBoundary';
// @ts-ignore - JS module
import { UserContext } from '../../../context';
import { format } from 'date-fns';

const { Title } = Typography;

interface RadiologyReportRefactoredProps {
  onOpenDetail?: () => void;
}

export const RadiologyReportRefactored: React.FC<
  RadiologyReportRefactoredProps
> = ({ onOpenDetail }) => {
  const { user } = useContext(UserContext) as any;
  const navigate = useNavigate();
  const facilityId = user?.currentEmployee?.facilityDetail?._id;

  // Local state for filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} reports`,
    pageSizeOptions: ['10', '20', '50', '100'],
  });

  // Zustand store
  const { setSelectedRadiologyReport, setSelectedClient } = useRadiologyStore();

  // TanStack Query - fetch bills with Radiology order_category
  const {
    data: reportsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useRadiologyBillReports({
    facilityId,
    search: debouncedSearch,
    limit: pagination.pageSize,
    skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 20),
  });

  const reports = reportsData?.data || [];
  const total = reportsData?.total || 0;

  const { mutate: deleteReport, isPending: isDeleting } =
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
    (report: any) => {
      setSelectedRadiologyReport(report);
      setSelectedClient(report.orderInfo?.orderObj?.client);
      navigate('/app/radiology/rad-details');
    },
    [setSelectedRadiologyReport, setSelectedClient, navigate],
  );

  const handleDelete = useCallback(
    async (reportId: string) => {
      deleteReport(reportId);
    },
    [deleteReport],
  );

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  // Get status tag color
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      Completed: 'green',
      Pending: 'orange',
      'In Progress': 'blue',
      Paid: 'success',
      Unpaid: 'error',
      'Partially Paid': 'warning',
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
      title: 'Client',
      key: 'client',
      width: 200,
      render: (_, record) => (
        <Space>
          <FileTextOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>
            {record.orderInfo?.orderObj?.clientname || 'N/A'}
          </span>
        </Space>
      ),
      sorter: (a, b) =>
        (a.orderInfo?.orderObj?.clientname || '').localeCompare(
          b.orderInfo?.orderObj?.clientname || '',
        ),
    },
    {
      title: 'Test',
      key: 'test',
      ellipsis: true,
      render: (_, record) => record.orderInfo?.orderObj?.order || 'N/A',
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
      title: 'Request Location',
      key: 'location',
      width: 150,
      ellipsis: true,
      render: (_, record) =>
        record.orderInfo?.orderObj?.requestingdoctor_locationName || 'N/A',
    },
    {
      title: 'Billing Status',
      dataIndex: 'billing_status',
      key: 'billing_status',
      width: 130,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status || 'N/A'}</Tag>
      ),
      filters: [
        { text: 'Paid', value: 'Paid' },
        { text: 'Unpaid', value: 'Unpaid' },
        { text: 'Partially Paid', value: 'Partially Paid' },
      ],
      onFilter: (value, record) => record.billing_status === value,
    },
    {
      title: 'Report Status',
      dataIndex: 'report_status',
      key: 'report_status',
      width: 130,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status || 'N/A'}</Tag>
      ),
      filters: [
        { text: 'Completed', value: 'Completed' },
        { text: 'Pending', value: 'Pending' },
        { text: 'In Progress', value: 'In Progress' },
      ],
      onFilter: (value, record) => record.report_status === value,
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
            title="Delete Report"
            description={`Are you sure you want to delete this radiology result for ${record.orderInfo?.orderObj?.clientname}?`}
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
          message="Error loading radiology reports"
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
            placeholder="Search by client name, test, or doctor..."
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
          dataSource={reports}
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

export default RadiologyReportRefactored;
