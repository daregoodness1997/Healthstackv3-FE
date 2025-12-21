/**
 * Refactored Laboratory Report Component
 *
 * Features:
 * - TanStack Query for data fetching
 * - Zustand for state management (NO setState)
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
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  useLabBillReports,
  useDeleteLabBill,
} from '../../../hooks/queries/useLabBills';
import { useLaboratoryStore } from '../../../stores/laboratoryStore';
import { ErrorBoundary } from '../../../components/error-boundary/ErrorBoundary';
// @ts-ignore - JS module
import { UserContext } from '../../../context';
import { format } from 'date-fns';

const { Title } = Typography;

interface LabReportRefactoredProps {
  onOpenDetail?: () => void;
}

export const LabReportRefactored: React.FC<LabReportRefactoredProps> = ({
  onOpenDetail,
}) => {
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

  // Zustand store - NO setState
  const {
    setSelectedLabReport,
    setSelectedClient,
    resultModalOpen,
    setResultModalOpen,
  } = useLaboratoryStore();

  // TanStack Query - fetch lab bills that are lab orders
  const {
    data: reportsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useLabBillReports({
    facilityId,
    search: debouncedSearch,
    limit: pagination.pageSize,
    skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 20),
  });

  const reports = reportsData?.data || [];
  const total = reportsData?.total || 0;

  // Get selected report from store
  const selectedLabReport = useLaboratoryStore(
    (state) => state.selectedLabReport,
  );

  const { mutate: deleteReport, isPending: isDeleting } = useDeleteLabBill();

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
      setSelectedLabReport(report);
      setSelectedClient(report.orderInfo?.orderObj?.client);
      setResultModalOpen(true);
    },
    [setSelectedLabReport, setSelectedClient, setResultModalOpen],
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
      render: (_, record) =>
        record.serviceInfo?.name || record.orderInfo?.orderObj?.order || 'N/A',
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
            description={`Are you sure you want to delete this lab result for ${record.orderInfo?.orderObj?.clientname}?`}
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
          message="Error loading lab reports"
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
            Laboratory Results
          </Title>
        </div>

        {/* Filters */}
        <Space
          style={{ marginBottom: '16px', width: '100%' }}
          size="middle"
          wrap
        >
          <Input
            placeholder="Search by client name, test, or status..."
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

        {/* View Result Modal */}
        <Modal
          title="Laboratory Result Details"
          open={resultModalOpen}
          onCancel={() => {
            setResultModalOpen(false);
            setSelectedLabReport(null);
          }}
          footer={[
            <Button
              key="close"
              onClick={() => {
                setResultModalOpen(false);
                setSelectedLabReport(null);
              }}
            >
              Close
            </Button>,
          ]}
          width={800}
        >
          {selectedLabReport && (
            <div>
              <Card size="small" style={{ marginBottom: 16 }}>
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="Client Name" span={2}>
                    <strong>
                      {selectedLabReport.orderInfo?.orderObj?.clientname ||
                        'N/A'}
                    </strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Test/Order">
                    {selectedLabReport.orderInfo?.orderObj?.order || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date">
                    {selectedLabReport.createdAt
                      ? format(
                          new Date(selectedLabReport.createdAt),
                          'dd/MM/yyyy HH:mm',
                        )
                      : 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Requesting Doctor">
                    {selectedLabReport.orderInfo?.orderObj
                      ?.requestingdoctor_Name || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Request Location">
                    {selectedLabReport.orderInfo?.orderObj
                      ?.requestingdoctor_locationName || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Billing Status">
                    <Tag
                      color={getStatusColor(selectedLabReport.billing_status)}
                    >
                      {selectedLabReport.billing_status || 'N/A'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Report Status">
                    <Tag
                      color={getStatusColor(selectedLabReport.report_status)}
                    >
                      {selectedLabReport.report_status || 'Pending'}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {selectedLabReport.resultDetail && (
                <>
                  <Divider>Result Details</Divider>
                  <Card size="small">
                    <Descriptions column={1} size="small" bordered>
                      {selectedLabReport.resultDetail.labFormType && (
                        <Descriptions.Item label="Test Type">
                          {selectedLabReport.resultDetail.labFormType
                            .testname || 'N/A'}
                        </Descriptions.Item>
                      )}
                      {selectedLabReport.resultDetail.result && (
                        <Descriptions.Item label="Result">
                          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                            {JSON.stringify(
                              selectedLabReport.resultDetail.result,
                              null,
                              2,
                            )}
                          </pre>
                        </Descriptions.Item>
                      )}
                      {selectedLabReport.resultDetail.comment && (
                        <Descriptions.Item label="Comments">
                          {selectedLabReport.resultDetail.comment}
                        </Descriptions.Item>
                      )}
                      {selectedLabReport.resultDetail.scientist && (
                        <Descriptions.Item label="Scientist">
                          {selectedLabReport.resultDetail.scientist}
                        </Descriptions.Item>
                      )}
                      {selectedLabReport.resultDetail.date && (
                        <Descriptions.Item label="Result Date">
                          {format(
                            new Date(selectedLabReport.resultDetail.date),
                            'dd/MM/yyyy HH:mm',
                          )}
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  </Card>
                </>
              )}

              {!selectedLabReport.resultDetail && (
                <Alert
                  message="No Result Available"
                  description="This lab report does not have any result details yet."
                  type="info"
                  showIcon
                />
              )}
            </div>
          )}
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default LabReportRefactored;
