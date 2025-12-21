/**
 * Refactored Radiology Appointments Component
 *
 * Features:
 * - TanStack Query for data fetching
 * - Zustand for state management (NO setState)
 * - Ant Design Table with pagination
 * - Debounced search
 * - Appointment status filters
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
  Select,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  useAppointments,
  useDeleteAppointment,
} from '../../../hooks/queries/useAppointments';
import { useRadiologyStore } from '../../../stores/radiologyStore';
import { ErrorBoundary } from '../../../components/error-boundary/ErrorBoundary';
// @ts-ignore - JS module
import { UserContext } from '../../../context';
import { format } from 'date-fns';

const { Title } = Typography;
const { Option } = Select;

interface RadAppointmentsRefactoredProps {
  onOpenDetail?: () => void;
}

export const RadAppointmentsRefactored: React.FC<
  RadAppointmentsRefactoredProps
> = ({ onOpenDetail }) => {
  const { user } = useContext(UserContext) as any;
  const navigate = useNavigate();
  const facilityId = user?.currentEmployee?.facilityDetail?._id;
  const locationId = user?.currentEmployee?.locations?.find(
    (loc: any) => loc.locationType === 'Radiology',
  )?._id;

  // Local state for filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState<string>('');
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} appointments`,
    pageSizeOptions: ['10', '20', '50', '100'],
  });

  // Zustand store - NO setState
  const { setSelectedClient } = useRadiologyStore();

  // TanStack Query - fetch radiology appointments
  const {
    data: appointmentsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAppointments({
    facilityId,
    locationId: locationId,
    locationType: 'Radiology',
    locationTypeFilter: 'Radiology',
    search: debouncedSearch,
    appointmentStatus: appointmentStatus || undefined,
    limit: pagination.pageSize,
    skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 20),
  });

  const appointments = appointmentsData?.data || [];
  const total = appointmentsData?.total || 0;

  const { mutate: deleteAppointment, isPending: isDeleting } =
    useDeleteAppointment();

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
    (appointment: any) => {
      setSelectedClient(appointment.client);
      navigate(`/app/radiology/appointments/${appointment._id}`);
    },
    [setSelectedClient, navigate],
  );

  const handleDelete = useCallback(
    async (appointmentId: string) => {
      deleteAppointment(appointmentId);
    },
    [deleteAppointment],
  );

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  // Get status tag color
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      Scheduled: 'blue',
      Confirmed: 'cyan',
      'Checked-in': 'processing',
      'In Progress': 'processing',
      Completed: 'success',
      Cancelled: 'error',
      'No Show': 'default',
      Rescheduled: 'warning',
    };
    return statusMap[status] || 'default';
  };

  // Get appointment type color
  const getAppointmentTypeColor = (type: string) => {
    const typeMap: Record<string, string> = {
      'Walk-in': 'green',
      Scheduled: 'blue',
      Emergency: 'red',
      'Follow-up': 'orange',
    };
    return typeMap[type] || 'default';
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
      title: 'Date & Time',
      dataIndex: 'start_time',
      key: 'start_time',
      width: 180,
      render: (date) => (
        <Space direction="vertical" size={0}>
          <Space size="small">
            <CalendarOutlined style={{ color: '#1890ff' }} />
            <span>{format(new Date(date), 'dd/MM/yyyy')}</span>
          </Space>
          <Space size="small">
            <ClockCircleOutlined style={{ color: '#52c41a' }} />
            <span>{format(new Date(date), 'HH:mm')}</span>
          </Space>
        </Space>
      ),
      sorter: (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    },
    {
      title: 'Client',
      key: 'client',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 500 }}>
            {`${record.firstname || ''} ${record.lastname || ''}`.trim() ||
              'N/A'}
          </span>
          {record.phone && (
            <span style={{ fontSize: '12px', color: '#666' }}>
              {record.phone}
            </span>
          )}
        </Space>
      ),
      sorter: (a, b) => (a.lastname || '').localeCompare(b.lastname || ''),
    },
    {
      title: 'Practitioner',
      key: 'practitioner',
      width: 180,
      ellipsis: true,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <span>{record.practitioner_name || 'N/A'}</span>
          {record.practitioner_profession && (
            <span style={{ fontSize: '12px', color: '#666' }}>
              {record.practitioner_profession}
            </span>
          )}
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'appointment_type',
      key: 'appointment_type',
      width: 120,
      render: (type) => (
        <Tag color={getAppointmentTypeColor(type)}>{type || 'N/A'}</Tag>
      ),
      filters: [
        { text: 'Walk-in', value: 'Walk-in' },
        { text: 'Scheduled', value: 'Scheduled' },
        { text: 'Emergency', value: 'Emergency' },
        { text: 'Follow-up', value: 'Follow-up' },
      ],
      onFilter: (value, record) => record.appointment_type === value,
    },
    {
      title: 'Status',
      dataIndex: 'appointment_status',
      key: 'appointment_status',
      width: 130,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status || 'N/A'}</Tag>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'appointment_reason',
      key: 'appointment_reason',
      ellipsis: true,
      render: (reason) => reason || 'N/A',
    },
    {
      title: 'Location',
      dataIndex: 'location_name',
      key: 'location_name',
      width: 150,
      ellipsis: true,
      render: (location) => location || 'N/A',
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
            title="Delete Appointment"
            description={`Are you sure you want to delete this appointment for ${record.firstname} ${record.lastname}?`}
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
          message="Error loading appointments"
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
            placeholder="Search by client name, phone, or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: '100%', maxWidth: '400px', minWidth: '200px' }}
            allowClear
          />
          <Select
            placeholder="Filter by status"
            value={appointmentStatus || undefined}
            onChange={(value) => {
              setAppointmentStatus(value || '');
              setPagination((prev) => ({ ...prev, current: 1 }));
            }}
            style={{ width: '200px' }}
            allowClear
          >
            <Option value="Scheduled">Scheduled</Option>
            <Option value="Confirmed">Confirmed</Option>
            <Option value="Checked-in">Checked-in</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Cancelled">Cancelled</Option>
            <Option value="No Show">No Show</Option>
            <Option value="Rescheduled">Rescheduled</Option>
          </Select>
        </Space>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            ...pagination,
            total: total,
            showQuickJumper: true,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1600 }}
          bordered
          size="middle"
        />
      </div>
    </ErrorBoundary>
  );
};

export default RadAppointmentsRefactored;
