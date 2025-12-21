/**
 * Refactored Radiology Check-in/Check-out Component
 *
 * Features:
 * - TanStack Query for data fetching
 * - Zustand for state management (NO setState)
 * - Ant Design Table with pagination
 * - Debounced search
 * - Check-in workflow management
 * - Split view: Checked-in and Checked-out
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
  Row,
  Col,
  Card,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  useAppointments,
  useUpdateAppointment,
} from '../../../hooks/queries/useAppointments';
import { useRadiologyStore } from '../../../stores/radiologyStore';
import { ErrorBoundary } from '../../../components/error-boundary/ErrorBoundary';
// @ts-ignore - JS module
import { UserContext } from '../../../context';
import { format, formatDistanceToNow } from 'date-fns';

const { Title } = Typography;

interface RadCheckedinRefactoredProps {
  onOpenDetail?: () => void;
}

export const RadCheckedinRefactored: React.FC<RadCheckedinRefactoredProps> = ({
  onOpenDetail,
}) => {
  const { user } = useContext(UserContext) as any;
  const navigate = useNavigate();
  const facilityId = user?.currentEmployee?.facilityDetail?._id;

  // Local state for filters
  const [checkedInSearch, setCheckedInSearch] = useState('');
  const [debouncedCheckedInSearch, setDebouncedCheckedInSearch] = useState('');
  const [checkedOutSearch, setCheckedOutSearch] = useState('');
  const [debouncedCheckedOutSearch, setDebouncedCheckedOutSearch] =
    useState('');

  const [checkedInPagination, setCheckedInPagination] =
    useState<TablePaginationConfig>({
      current: 1,
      pageSize: 20,
      showSizeChanger: true,
      showTotal: (total) => `Total ${total} checked-in`,
      pageSizeOptions: ['10', '20', '50', '100'],
    });

  const [checkedOutPagination, setCheckedOutPagination] =
    useState<TablePaginationConfig>({
      current: 1,
      pageSize: 20,
      showSizeChanger: true,
      showTotal: (total) => `Total ${total} checked-out`,
      pageSizeOptions: ['10', '20', '50', '100'],
    });

  // Zustand store - NO setState
  const { setSelectedClient } = useRadiologyStore();

  // TanStack Query - fetch checked-in appointments
  const {
    data: checkedInData,
    isLoading: isLoadingCheckedIn,
    isError: isErrorCheckedIn,
    error: errorCheckedIn,
    refetch: refetchCheckedIn,
  } = useAppointments({
    facilityId,
    locationTypeFilter: 'Radiology',
    appointmentStatus: 'Checked-in',
    search: debouncedCheckedInSearch,
    limit: checkedInPagination.pageSize,
    skip:
      ((checkedInPagination.current || 1) - 1) *
      (checkedInPagination.pageSize || 20),
  });

  // TanStack Query - fetch checked-out/completed appointments
  const {
    data: checkedOutData,
    isLoading: isLoadingCheckedOut,
    isError: isErrorCheckedOut,
    error: errorCheckedOut,
    refetch: refetchCheckedOut,
  } = useAppointments({
    facilityId,
    locationTypeFilter: 'Radiology',
    appointmentStatus: 'Completed',
    search: debouncedCheckedOutSearch,
    limit: checkedOutPagination.pageSize,
    skip:
      ((checkedOutPagination.current || 1) - 1) *
      (checkedOutPagination.pageSize || 20),
  });

  const checkedInAppointments = checkedInData?.data || [];
  const checkedInTotal = checkedInData?.total || 0;
  const checkedOutAppointments = checkedOutData?.data || [];
  const checkedOutTotal = checkedOutData?.total || 0;

  const { mutate: updateAppointment, isPending: isUpdating } =
    useUpdateAppointment();

  // Debounce search inputs
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCheckedInSearch(checkedInSearch);
      setCheckedInPagination((prev) => ({ ...prev, current: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [checkedInSearch]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCheckedOutSearch(checkedOutSearch);
      setCheckedOutPagination((prev) => ({ ...prev, current: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [checkedOutSearch]);

  // Handlers
  const handleView = useCallback(
    (appointment: any) => {
      setSelectedClient(appointment.client);
      navigate(`/app/radiology/appointments/${appointment._id}`);
    },
    [setSelectedClient, navigate],
  );

  const handleCheckOut = useCallback(
    async (appointmentId: string) => {
      updateAppointment({
        id: appointmentId,
        data: {
          appointment_status: 'Completed',
          end_time: new Date().toISOString(),
        },
      });
    },
    [updateAppointment],
  );

  // Checked-in columns
  const checkedInColumns: ColumnsType<any> = [
    {
      title: 'S/N',
      key: 'sn',
      width: 60,
      render: (_, __, index) =>
        ((checkedInPagination.current || 1) - 1) *
          (checkedInPagination.pageSize || 20) +
        index +
        1,
    },
    {
      title: 'Check-in Time',
      dataIndex: 'start_time',
      key: 'start_time',
      width: 150,
      render: (date) => (
        <Space direction="vertical" size={0}>
          <span>{format(new Date(date), 'HH:mm')}</span>
          <span style={{ fontSize: '12px', color: '#666' }}>
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </span>
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
    },
    {
      title: 'Practitioner',
      dataIndex: 'practitioner_name',
      key: 'practitioner_name',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'appointment_type',
      key: 'appointment_type',
      width: 120,
      render: (type) => <Tag color="blue">{type || 'N/A'}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'appointment_status',
      key: 'appointment_status',
      width: 130,
      render: (status) => (
        <Tag icon={<ClockCircleOutlined />} color="processing">
          {status}
        </Tag>
      ),
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
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Check Out">
            <Button
              type="primary"
              size="small"
              icon={<LogoutOutlined />}
              onClick={() => handleCheckOut(record._id)}
              loading={isUpdating}
            >
              Check Out
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Checked-out columns
  const checkedOutColumns: ColumnsType<any> = [
    {
      title: 'S/N',
      key: 'sn',
      width: 60,
      render: (_, __, index) =>
        ((checkedOutPagination.current || 1) - 1) *
          (checkedOutPagination.pageSize || 20) +
        index +
        1,
    },
    {
      title: 'Checkout Time',
      key: 'end_time',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <span>
            {record.end_time
              ? format(new Date(record.end_time), 'HH:mm')
              : 'N/A'}
          </span>
          {record.end_time && (
            <span style={{ fontSize: '12px', color: '#666' }}>
              {formatDistanceToNow(new Date(record.end_time), {
                addSuffix: true,
              })}
            </span>
          )}
        </Space>
      ),
      sorter: (a, b) =>
        new Date(a.end_time || a.updatedAt).getTime() -
        new Date(b.end_time || b.updatedAt).getTime(),
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
    },
    {
      title: 'Practitioner',
      dataIndex: 'practitioner_name',
      key: 'practitioner_name',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'appointment_type',
      key: 'appointment_type',
      width: 120,
      render: (type) => <Tag color="blue">{type || 'N/A'}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'appointment_status',
      key: 'appointment_status',
      width: 130,
      render: (status) => (
        <Tag icon={<CheckCircleOutlined />} color="success">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <ErrorBoundary>
      <div style={{ padding: '24px' }}>
        {/* Two Column Layout */}
        <Row gutter={[16, 16]}>
          {/* Checked-in Patients */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <ClockCircleOutlined style={{ color: '#1890ff' }} />
                  <span>Checked-in Patients</span>
                </Space>
              }
              bordered={false}
            >
              {/* Search */}
              <Input
                placeholder="Search checked-in patients..."
                value={checkedInSearch}
                onChange={(e) => setCheckedInSearch(e.target.value)}
                prefix={<SearchOutlined />}
                style={{ marginBottom: '16px' }}
                allowClear
              />

              {/* Error state */}
              {isErrorCheckedIn ? (
                <Alert
                  message="Error loading checked-in patients"
                  description={
                    (errorCheckedIn as any)?.message || 'Unknown error'
                  }
                  type="error"
                  showIcon
                  action={
                    <Button size="small" onClick={() => refetchCheckedIn()}>
                      Retry
                    </Button>
                  }
                />
              ) : (
                /* Table */
                <Table
                  columns={checkedInColumns}
                  dataSource={checkedInAppointments}
                  rowKey="_id"
                  loading={isLoadingCheckedIn}
                  pagination={{
                    ...checkedInPagination,
                    total: checkedInTotal,
                    showQuickJumper: true,
                  }}
                  onChange={(newPagination) =>
                    setCheckedInPagination(newPagination)
                  }
                  scroll={{ x: 1000 }}
                  size="small"
                />
              )}
            </Card>
          </Col>

          {/* Checked-out Patients */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <span>Checked-out Patients</span>
                </Space>
              }
              bordered={false}
            >
              {/* Search */}
              <Input
                placeholder="Search checked-out patients..."
                value={checkedOutSearch}
                onChange={(e) => setCheckedOutSearch(e.target.value)}
                prefix={<SearchOutlined />}
                style={{ marginBottom: '16px' }}
                allowClear
              />

              {/* Error state */}
              {isErrorCheckedOut ? (
                <Alert
                  message="Error loading checked-out patients"
                  description={
                    (errorCheckedOut as any)?.message || 'Unknown error'
                  }
                  type="error"
                  showIcon
                  action={
                    <Button size="small" onClick={() => refetchCheckedOut()}>
                      Retry
                    </Button>
                  }
                />
              ) : (
                /* Table */
                <Table
                  columns={checkedOutColumns}
                  dataSource={checkedOutAppointments}
                  rowKey="_id"
                  loading={isLoadingCheckedOut}
                  pagination={{
                    ...checkedOutPagination,
                    total: checkedOutTotal,
                    showQuickJumper: true,
                  }}
                  onChange={(newPagination) =>
                    setCheckedOutPagination(newPagination)
                  }
                  scroll={{ x: 1000 }}
                  size="small"
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </ErrorBoundary>
  );
};

export default RadCheckedinRefactored;
