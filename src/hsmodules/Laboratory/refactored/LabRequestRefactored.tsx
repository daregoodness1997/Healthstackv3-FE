/**
 * Refactored Laboratory Request Component
 *
 * Features:
 * - TanStack Query for data fetching
 * - Zustand for state management (NO setState)
 * - Ant Design Table with pagination
 * - Debounced search
 * - Billing status filter
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
  Select,
  Modal,
  Descriptions,
  Divider,
  Card,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  useLabBillRequests,
  useDeleteLabBill,
} from '../../../hooks/queries/useLabBills';
import { useLaboratoryStore } from '../../../stores/laboratoryStore';
import { ErrorBoundary } from '../../../components/error-boundary/ErrorBoundary';
// @ts-ignore - JS module
import { UserContext } from '../../../context';
import { format } from 'date-fns';

const { Title } = Typography;
const { Option } = Select;

interface LabRequestRefactoredProps {
  onOpenDetail?: () => void;
}

export const LabRequestRefactored: React.FC<LabRequestRefactoredProps> = ({
  onOpenDetail,
}) => {
  const { user } = useContext(UserContext) as any;
  const navigate = useNavigate();
  const facilityId = user?.currentEmployee?.facilityDetail?._id;

  // Local state for filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [billingStatusFilter, setBillingStatusFilter] = useState<string>('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} requests`,
    pageSizeOptions: ['10', '20', '50', '100'],
  });

  // Zustand store - NO setState
  const { setSelectedLabRequest, setSelectedClient } = useLaboratoryStore();

  // TanStack Query - fetch lab bills that are lab requests with billing status filter
  const {
    data: requestsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useLabBillRequests({
    facilityId,
    search: debouncedSearch,
    billingStatus: billingStatusFilter || undefined,
    limit: pagination.pageSize,
    skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 20),
  });

  const requests = requestsData?.data || [];
  const total = requestsData?.total || 0;

  const { mutate: deleteRequest, isPending: isDeleting } = useDeleteLabBill();

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
      setSelectedLabRequest(request);
      if (request.participantInfo?.client) {
        setSelectedClient(request.participantInfo.client);
      }
      setSelectedRequest(request);
      setViewModalOpen(true);
    },
    [setSelectedLabRequest, setSelectedClient],
  );

  const handleDelete = useCallback(
    (requestId: string) => {
      deleteRequest(requestId);
    },
    [deleteRequest],
  );

  const handleTableChange = useCallback(
    (newPagination: TablePaginationConfig) => {
      setPagination(newPagination);
    },
    [],
  );

  // Table columns
  const columns: ColumnsType<any> = [
    {
      title: 'S/N',
      key: 'sn',
      width: 60,
      fixed: 'left',
      render: (_, __, index) =>
        ((pagination.current || 1) - 1) * (pagination.pageSize || 20) +
        index +
        1,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => (date ? format(new Date(date), 'dd/MM/yyyy') : 'N/A'),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Client Name',
      key: 'clientName',
      width: 180,
      render: (_, record) => {
        const client = record.participantInfo?.client;
        const orderClient = record.orderInfo?.orderObj?.clientname;
        return (
          <span style={{ fontWeight: 500 }}>
            {orderClient ||
              (client
                ? `${client.firstname || ''} ${client.lastname || ''}`.trim()
                : 'N/A')}
          </span>
        );
      },
      sorter: (a, b) => {
        const nameA =
          a.orderInfo?.orderObj?.clientname ||
          `${a.participantInfo?.client?.firstname || ''} ${a.participantInfo?.client?.lastname || ''}`;
        const nameB =
          b.orderInfo?.orderObj?.clientname ||
          `${b.participantInfo?.client?.firstname || ''} ${b.participantInfo?.client?.lastname || ''}`;
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: 'Lab Order',
      key: 'order',
      width: 200,
      render: (_, record) => (
        <span>{record.orderInfo?.orderObj?.order || 'N/A'}</span>
      ),
      ellipsis: true,
    },
    {
      title: 'Requesting Doctor',
      key: 'doctor',
      width: 180,
      render: (_, record) => (
        <span>
          {record.orderInfo?.orderObj?.requestingdoctor_Name || 'N/A'}
        </span>
      ),
      ellipsis: true,
    },
    {
      title: 'Amount',
      key: 'amount',
      width: 120,
      render: (_, record) => (
        <Space>
          <DollarOutlined />
          <span>{record.amount?.toLocaleString() || '0'}</span>
        </Space>
      ),
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
    },
    {
      title: 'Billing Status',
      dataIndex: 'billing_status',
      key: 'billing_status',
      width: 130,
      render: (status) => {
        let color = 'default';
        if (status === 'Fully Paid') color = 'success';
        else if (status === 'Part Payment') color = 'warning';
        else if (status === 'Unpaid') color = 'error';
        return <Tag color={color}>{status || 'N/A'}</Tag>;
      },
      filters: [
        { text: 'Fully Paid', value: 'Fully Paid' },
        { text: 'Part Payment', value: 'Part Payment' },
        { text: 'Unpaid', value: 'Unpaid' },
      ],
      onFilter: (value, record) => record.billing_status === value,
    },
    {
      title: 'Report Status',
      dataIndex: 'report_status',
      key: 'report_status',
      width: 130,
      render: (status) => {
        let color = 'default';
        if (status === 'Completed') color = 'success';
        else if (status === 'In Progress') color = 'processing';
        else if (status === 'Pending') color = 'warning';
        return <Tag color={color}>{status || 'Pending'}</Tag>;
      },
      filters: [
        { text: 'Completed', value: 'Completed' },
        { text: 'In Progress', value: 'In Progress' },
        { text: 'Pending', value: 'Pending' },
      ],
      onFilter: (value, record) => record.report_status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
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
            description="Are you sure you want to delete this lab request?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                icon={<DeleteOutlined />}
                loading={isDeleting}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ErrorBoundary>
      <div style={{ padding: '24px' }}>
        <Title level={3}>
          <FileTextOutlined /> Laboratory Requests
        </Title>

        {/* Filters */}
        <Space
          style={{
            marginBottom: 16,
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Space>
            <Input
              placeholder="Search by client name, order, or doctor..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 350 }}
              allowClear
            />
            <Select
              placeholder="Filter by billing status"
              value={billingStatusFilter}
              onChange={setBillingStatusFilter}
              style={{ width: 200 }}
              allowClear
            >
              <Option value="">All Status</Option>
              <Option value="Fully Paid">Fully Paid</Option>
              <Option value="Part Payment">Part Payment</Option>
              <Option value="Unpaid">Unpaid</Option>
            </Select>
          </Space>
          <Button onClick={() => refetch()} loading={isLoading}>
            Refresh
          </Button>
        </Space>

        {/* Error State */}
        {isError && (
          <Alert
            message="Error Loading Lab Requests"
            description={
              error instanceof Error ? error.message : 'An error occurred'
            }
            type="error"
            showIcon
            closable
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Table */}
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            ...pagination,
            total,
            showQuickJumper: true,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1400 }}
          size="small"
        />

        {/* View Request Modal */}
        <Modal
          title="Laboratory Request Details"
          open={viewModalOpen}
          onCancel={() => {
            setViewModalOpen(false);
            setSelectedRequest(null);
          }}
          footer={[
            <Button
              key="close"
              onClick={() => {
                setViewModalOpen(false);
                setSelectedRequest(null);
              }}
            >
              Close
            </Button>,
          ]}
          width={800}
        >
          {selectedRequest && (
            <div>
              <Card size="small" style={{ marginBottom: 16 }}>
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="Client Name" span={2}>
                    <strong>
                      {selectedRequest.orderInfo?.orderObj?.clientname ||
                        `${selectedRequest.participantInfo?.client?.firstname || ''} ${selectedRequest.participantInfo?.client?.lastname || ''}`.trim() ||
                        'N/A'}
                    </strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Lab Order">
                    {selectedRequest.orderInfo?.orderObj?.order || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date">
                    {selectedRequest.createdAt
                      ? format(
                          new Date(selectedRequest.createdAt),
                          'dd/MM/yyyy HH:mm',
                        )
                      : 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Requesting Doctor">
                    {selectedRequest.orderInfo?.orderObj
                      ?.requestingdoctor_Name || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Request Location">
                    {selectedRequest.orderInfo?.orderObj
                      ?.requestingdoctor_locationName || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Amount">
                    <strong>
                      {selectedRequest.amount?.toLocaleString() || '0'}{' '}
                      {selectedRequest.currency || ''}
                    </strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Billing Status">
                    <Tag
                      color={
                        selectedRequest.billing_status === 'Fully Paid'
                          ? 'success'
                          : selectedRequest.billing_status === 'Part Payment'
                            ? 'warning'
                            : 'error'
                      }
                    >
                      {selectedRequest.billing_status || 'N/A'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Report Status">
                    <Tag
                      color={
                        selectedRequest.report_status === 'Completed'
                          ? 'success'
                          : selectedRequest.report_status === 'In Progress'
                            ? 'processing'
                            : 'warning'
                      }
                    >
                      {selectedRequest.report_status || 'Pending'}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {selectedRequest.orderInfo?.orderObj && (
                <>
                  <Divider>Order Details</Divider>
                  <Card size="small">
                    <Descriptions column={1} size="small" bordered>
                      {selectedRequest.orderInfo.orderObj.order_category && (
                        <Descriptions.Item label="Order Category">
                          {selectedRequest.orderInfo.orderObj.order_category}
                        </Descriptions.Item>
                      )}
                      {selectedRequest.orderInfo.orderObj.instruction && (
                        <Descriptions.Item label="Instructions">
                          {selectedRequest.orderInfo.orderObj.instruction}
                        </Descriptions.Item>
                      )}
                      {selectedRequest.orderInfo.orderObj.priority && (
                        <Descriptions.Item label="Priority">
                          <Tag
                            color={
                              selectedRequest.orderInfo.orderObj.priority ===
                              'Urgent'
                                ? 'red'
                                : 'default'
                            }
                          >
                            {selectedRequest.orderInfo.orderObj.priority}
                          </Tag>
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  </Card>
                </>
              )}

              {selectedRequest.participantInfo?.client && (
                <>
                  <Divider>Patient Information</Divider>
                  <Card size="small">
                    <Descriptions column={2} size="small" bordered>
                      <Descriptions.Item label="First Name">
                        {selectedRequest.participantInfo.client.firstname ||
                          'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Last Name">
                        {selectedRequest.participantInfo.client.lastname ||
                          'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Phone">
                        {selectedRequest.participantInfo.client.phone || 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Email">
                        {selectedRequest.participantInfo.client.email || 'N/A'}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </>
              )}
            </div>
          )}
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default LabRequestRefactored;
