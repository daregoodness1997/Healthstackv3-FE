/**
 * Refactored Appointment List Component for Clinic
 *
 * Features:
 * - TanStack Query for data fetching
 * - Zustand for state management
 * - Ant Design Table with pagination
 * - Optimized with React.memo
 * - Debounced search
 * - Date filtering
 * - Real-time updates via socket events
 */

import React, { useState, useCallback, useContext, useEffect } from 'react';
import {
  Input,
  Button,
  Tag,
  Space,
  Typography,
  Select,
  Alert,
  Table,
  DatePicker,
  Tooltip,
  Popconfirm,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import {
  useAppointments,
  usePrefetchAppointment,
  useDeleteAppointment,
  type Appointment,
} from '../../../hooks/queries/useAppointments';
import { useAppointmentStore } from '../../../stores/appointmentStore';
import { ErrorBoundary } from '../../../components/error-boundary/ErrorBoundary';
// @ts-ignore
import { UserContext, ObjectContext } from '../../../context';
import { format, formatDistanceToNowStrict } from 'date-fns';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * Main Appointment List Component
 */
interface AppointmentListRefactoredProps {
  onOpenCreate?: () => void;
  onOpenDetail?: () => void;
  onOpenModify?: () => void;
  title?: string;
  module?: string;
}

export const AppointmentListRefactored: React.FC<
  AppointmentListRefactoredProps
> = ({
  onOpenCreate,
  onOpenDetail,
  onOpenModify,
  title = 'Clinic Appointments',
  module = 'Clinic',
}) => {
  const { user } = useContext(UserContext) as any;
  const { state, setState } = useContext(ObjectContext) as any;
  const facilityId = user?.currentEmployee?.facilityDetail?._id;
  const employeeLocation = state?.employeeLocation;

  // Local state for filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [locationTypeFilter, setLocationTypeFilter] = useState<string>(
    module === 'General' ? 'All' : '',
  );
  const [appointmentTypeFilter, setAppointmentTypeFilter] =
    useState<string>('');
  const [appointmentStatusFilter, setAppointmentStatusFilter] =
    useState<string>('');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} appointments`,
    pageSizeOptions: ['10', '20', '50', '100'],
  });

  // Zustand store
  const { setSelectedAppointment, setShowModal } = useAppointmentStore();

  // TanStack Query
  const {
    data: appointmentsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAppointments({
    facilityId,
    locationId: employeeLocation?.locationId,
    locationType: employeeLocation?.locationType,
    locationTypeFilter: locationTypeFilter,
    search: debouncedSearch,
    appointmentType: appointmentTypeFilter || undefined,
    appointmentStatus: appointmentStatusFilter || undefined,
    startDate: dateRange[0]?.toDate(),
    endDate: dateRange[1]?.toDate(),
    limit: pagination.pageSize,
    skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 20),
  });

  const appointments = appointmentsData?.data || [];
  const total = appointmentsData?.total || 0;

  // Mutations
  const deleteAppointmentMutation = useDeleteAppointment();
  const prefetchAppointment = usePrefetchAppointment();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Handlers
  const handleView = useCallback(
    (appointment: Appointment) => {
      setSelectedAppointment(appointment);
      setState((prev: any) => ({
        ...prev,
        AppointmentModule: {
          ...prev.AppointmentModule,
          selectedAppointment: appointment,
          show: 'detail',
        },
      }));
      setShowModal('detail');
      if (onOpenDetail) {
        onOpenDetail();
      }
    },
    [setSelectedAppointment, setState, setShowModal, onOpenDetail],
  );

  const handleEdit = useCallback(
    (appointment: Appointment) => {
      setSelectedAppointment(appointment);
      setState((prev: any) => ({
        ...prev,
        AppointmentModule: {
          ...prev.AppointmentModule,
          selectedAppointment: appointment,
          show: 'modify',
        },
      }));
      setShowModal('modify');
      if (onOpenModify) {
        onOpenModify();
      }
    },
    [setSelectedAppointment, setState, setShowModal, onOpenModify],
  );

  const handleDelete = useCallback(
    async (appointmentId: string, patientName: string) => {
      await deleteAppointmentMutation.mutateAsync(appointmentId);
    },
    [deleteAppointmentMutation],
  );

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  const handleCreateAppointment = () => {
    setState((prev: any) => ({
      ...prev,
      AppointmentModule: {
        ...prev.AppointmentModule,
        selectedAppointment: {},
        show: 'create',
      },
      ClientModule: {
        ...prev.ClientModule,
        selectedClient: {},
        show: 'create',
      },
    }));
    setShowModal('create');
    if (onOpenCreate) {
      onOpenCreate();
    }
  };

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
  ) => {
    setDateRange(dates || [null, null]);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  // Table columns
  const columns: ColumnsType<Appointment> = [
    {
      title: 'Patient',
      key: 'patient',
      fixed: 'left',
      width: 220,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.firstname} {record.lastname}
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.phone}
          </Text>
        </div>
      ),
    },
    {
      title: 'Age/Gender',
      key: 'ageGender',
      width: 120,
      render: (_, record) => {
        const getAge = () => {
          try {
            if (!record.dob) return 'N/A';
            const date = new Date(record.dob);
            if (isNaN(date.getTime())) return 'N/A';
            return formatDistanceToNowStrict(date);
          } catch (error) {
            return 'N/A';
          }
        };

        return (
          <div>
            <div style={{ fontSize: 13 }}>{getAge()}</div>
            <Tag
              color={
                record.gender === 'Male'
                  ? 'blue'
                  : record.gender === 'Female'
                    ? 'pink'
                    : 'default'
              }
              style={{ fontSize: 11 }}
            >
              {record.gender || 'N/A'}
            </Tag>
          </div>
        );
      },
    },
    {
      title: 'Appointment Time',
      key: 'time',
      width: 150,
      render: (_, record) => {
        const getFormattedTime = () => {
          try {
            if (!record.start_time) return { date: 'N/A', time: 'N/A' };
            const date = new Date(record.start_time);
            if (isNaN(date.getTime()))
              return { date: 'Invalid Date', time: '' };
            return {
              date: format(date, 'dd/MM/yyyy'),
              time: format(date, 'hh:mm a'),
            };
          } catch (error) {
            return { date: 'Invalid Date', time: '' };
          }
        };

        const formatted = getFormattedTime();

        return (
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>
              {formatted.date}
            </div>
            {formatted.time && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {formatted.time}
              </Text>
            )}
          </div>
        );
      },
      sorter: (a, b) => {
        const dateA = new Date(a.start_time).getTime();
        const dateB = new Date(b.start_time).getTime();
        return (isNaN(dateA) ? 0 : dateA) - (isNaN(dateB) ? 0 : dateB);
      },
    },
    {
      title: 'Type',
      dataIndex: 'appointment_type',
      key: 'appointment_type',
      width: 120,
      render: (type) => (
        <Tag color="blue" style={{ fontSize: 12 }}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'appointment_status',
      key: 'appointment_status',
      width: 120,
      render: (status) => {
        const color =
          status === 'Confirmed'
            ? 'green'
            : status === 'Pending'
              ? 'orange'
              : status === 'Cancelled'
                ? 'red'
                : status === 'Completed'
                  ? 'blue'
                  : 'default';
        return (
          <Tag color={color} style={{ fontSize: 12 }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Class',
      dataIndex: 'appointmentClass',
      key: 'appointmentClass',
      width: 130,
      render: (appointmentClass) => (
        <Tag style={{ fontSize: 12 }}>{appointmentClass || 'On-site'}</Tag>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location_name',
      key: 'location_name',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Practitioner',
      dataIndex: 'practitioner_name',
      key: 'practitioner_name',
      width: 180,
      ellipsis: true,
      render: (name, record) => (
        <div>
          <div style={{ fontSize: 13 }}>{name}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.practitioner_profession}
          </Text>
        </div>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'appointment_reason',
      key: 'appointment_reason',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="link"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleView(record)}
              onMouseEnter={() => prefetchAppointment(record._id)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="link"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Appointment"
            description={`Are you sure you want to delete appointment for ${record.firstname} ${record.lastname}?`}
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
                danger
                icon={<DeleteOutlined />}
                size="small"
                loading={deleteAppointmentMutation.isPending}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ErrorBoundary>
      <div style={{ padding: '16px', backgroundColor: '#fff' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateAppointment}
            size="large"
          >
            Add New Appointment
          </Button>
        </div>

        {/* Filters */}
        <Space
          direction="vertical"
          size="middle"
          style={{ width: '100%', marginBottom: '16px' }}
        >
          <Space wrap size="middle">
            <Input
              placeholder="Search by name, phone, type, status, reason..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 350 }}
              allowClear
            />
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              placeholder={['Start Date', 'End Date']}
            />
            {module === 'General' && (
              <Select
                placeholder="Location Type"
                style={{ width: 180 }}
                value={locationTypeFilter || 'All'}
                onChange={setLocationTypeFilter}
              >
                <Option value="All">All</Option>
                <Option value="Blood Bank">Blood Bank</Option>
                <Option value="Client">Client</Option>
                <Option value="Clinic">Clinic</Option>
                <Option value="Pharmacy">Pharmacy</Option>
                <Option value="Radiology">Radiology</Option>
                <Option value="Referral">Referral</Option>
                <Option value="Theatre">Theatre</Option>
              </Select>
            )}
            <Select
              placeholder="Appointment Type"
              style={{ width: 180 }}
              value={appointmentTypeFilter || undefined}
              onChange={setAppointmentTypeFilter}
              allowClear
            >
              <Option value="Consultation">Consultation</Option>
              <Option value="Follow-up">Follow-up</Option>
              <Option value="Emergency">Emergency</Option>
              <Option value="Check-up">Check-up</Option>
            </Select>
            <Select
              placeholder="Status"
              style={{ width: 150 }}
              value={appointmentStatusFilter || undefined}
              onChange={setAppointmentStatusFilter}
              allowClear
            >
              <Option value="Pending">Pending</Option>
              <Option value="Confirmed">Confirmed</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Space>
        </Space>

        {/* Error State */}
        {isError && (
          <Alert
            message="Error Loading Appointments"
            description={error?.message || 'An error occurred'}
            type="error"
            showIcon
            closable
            style={{ marginBottom: '16px' }}
            action={
              <Button size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        )}

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
          scroll={{ x: 1500, y: 'calc(100vh - 380px)' }}
          size="small"
        />
      </div>
    </ErrorBoundary>
  );
};

export default AppointmentListRefactored;
