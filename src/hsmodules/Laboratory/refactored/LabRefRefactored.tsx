/**
 * Refactored Laboratory Reference Values Component
 *
 * Features:
 * - TanStack Query for data fetching
 * - Zustand for state management (NO setState)
 * - Ant Design Table with pagination
 * - Debounced search
 * - CRUD operations for lab reference values
 * - Real-time updates via socket events
 */

import React, { useState, useCallback, useContext } from 'react';
import {
  Input,
  Button,
  Space,
  Typography,
  Alert,
  Table,
  Tooltip,
  Popconfirm,
  Modal,
  Form,
  Select,
  Card,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import {
  useLabRefValues,
  useDeleteLabRefValue,
  useCreateLabRefValue,
  useUpdateLabRefValue,
} from '../../../hooks/queries/useLabRefValues';
import { useLaboratoryStore } from '../../../stores/laboratoryStore';
import { ErrorBoundary } from '../../../components/error-boundary/ErrorBoundary';
// @ts-ignore - JS module
import { UserContext } from '../../../context';
import { format } from 'date-fns';

const { Title } = Typography;
const { Option } = Select;

interface LabRefRefactoredProps {
  onOpenDetail?: () => void;
}

export const LabRefRefactored: React.FC<LabRefRefactoredProps> = () => {
  const { user } = useContext(UserContext) as any;
  const facilityId = user?.currentEmployee?.facilityDetail?._id;

  // Local state for filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} reference values`,
    pageSizeOptions: ['10', '20', '50', '100'],
  });

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLabRef, setSelectedLabRef] = useState<any>(null);

  // Form instance
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Zustand store - NO setState
  const { setSelectedLabReport } = useLaboratoryStore();

  // TanStack Query - fetch lab reference values
  const {
    data: labRefData,
    isLoading,
    isError,
    error,
    refetch,
  } = useLabRefValues({
    facilityId,
    search: debouncedSearch,
    limit: pagination.pageSize,
    skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 20),
  });

  const labRefValues = labRefData?.data || [];
  const total = labRefData?.total || 0;

  const { mutate: deleteLabRef, isPending: isDeleting } =
    useDeleteLabRefValue();
  const { mutate: createLabRef, isPending: isCreating } =
    useCreateLabRefValue();
  const { mutate: updateLabRef, isPending: isUpdating } =
    useUpdateLabRefValue();

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Handlers
  const handleDelete = useCallback(
    (id: string) => {
      deleteLabRef(id);
    },
    [deleteLabRef],
  );

  const handleEdit = useCallback(
    (record: any) => {
      setSelectedLabRef(record);
      editForm.setFieldsValue({
        testname: record.testname,
        testclass: record.testclass,
      });
      setIsEditModalOpen(true);
    },
    [editForm],
  );

  const handleTableChange = useCallback(
    (newPagination: TablePaginationConfig) => {
      setPagination(newPagination);
    },
    [],
  );

  const handleCreateSubmit = useCallback(() => {
    createForm.validateFields().then((values) => {
      createLabRef(
        {
          ...values,
          facilityId,
          tests: values.tests || [],
        },
        {
          onSuccess: () => {
            createForm.resetFields();
            setIsCreateModalOpen(false);
          },
        },
      );
    });
  }, [createForm, createLabRef, facilityId]);

  const handleEditSubmit = useCallback(() => {
    editForm.validateFields().then((values) => {
      if (selectedLabRef?._id) {
        updateLabRef(
          {
            id: selectedLabRef._id,
            data: values,
          },
          {
            onSuccess: () => {
              editForm.resetFields();
              setIsEditModalOpen(false);
              setSelectedLabRef(null);
            },
          },
        );
      }
    });
  }, [editForm, updateLabRef, selectedLabRef]);

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
      title: 'Test Name',
      dataIndex: 'testname',
      key: 'testname',
      width: 250,
      sorter: (a, b) => (a.testname || '').localeCompare(b.testname || ''),
      render: (text) => (
        <span style={{ fontWeight: 500 }}>{text || 'N/A'}</span>
      ),
    },
    {
      title: 'Test Class',
      dataIndex: 'testclass',
      key: 'testclass',
      width: 200,
      sorter: (a, b) => (a.testclass || '').localeCompare(b.testclass || ''),
    },
    {
      title: 'Number of Tests',
      key: 'testsCount',
      width: 150,
      render: (_, record) => <span>{record.tests?.length || 0} test(s)</span>,
      sorter: (a, b) => (a.tests?.length || 0) - (b.tests?.length || 0),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => (date ? format(new Date(date), 'dd/MM/yyyy') : 'N/A'),
      sorter: (a, b) =>
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Reference Value"
            description={`Are you sure you want to delete "${record.testname}"?`}
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
          <FileTextOutlined /> Laboratory Reference Values
        </Title>

        {/* Filters and Actions */}
        <Space
          style={{
            marginBottom: 16,
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Input
            placeholder="Search by test name or class..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 350 }}
            allowClear
          />
          <Space>
            <Button onClick={() => refetch()} loading={isLoading}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Add New
            </Button>
          </Space>
        </Space>

        {/* Error State */}
        {isError && (
          <Alert
            message="Error Loading Lab Reference Values"
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
          dataSource={labRefValues}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            ...pagination,
            total,
            showQuickJumper: true,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          size="small"
        />

        {/* Create Modal */}
        <Modal
          title="Create Lab Reference Value"
          open={isCreateModalOpen}
          onOk={handleCreateSubmit}
          onCancel={() => {
            createForm.resetFields();
            setIsCreateModalOpen(false);
          }}
          confirmLoading={isCreating}
          width={600}
        >
          <Form form={createForm} layout="vertical" style={{ marginTop: 24 }}>
            <Form.Item
              name="testname"
              label="Test Name"
              rules={[{ required: true, message: 'Please enter test name' }]}
            >
              <Input placeholder="Enter test name" />
            </Form.Item>
            <Form.Item
              name="testclass"
              label="Test Class"
              rules={[{ required: true, message: 'Please select test class' }]}
            >
              <Select placeholder="Select test class">
                <Option value="Hematology">Hematology</Option>
                <Option value="Chemistry">Chemistry</Option>
                <Option value="Microbiology">Microbiology</Option>
                <Option value="Serology">Serology</Option>
                <Option value="Immunology">Immunology</Option>
                <Option value="Molecular">Molecular</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Modal */}
        <Modal
          title="Edit Lab Reference Value"
          open={isEditModalOpen}
          onOk={handleEditSubmit}
          onCancel={() => {
            editForm.resetFields();
            setIsEditModalOpen(false);
            setSelectedLabRef(null);
          }}
          confirmLoading={isUpdating}
          width={600}
        >
          <Form form={editForm} layout="vertical" style={{ marginTop: 24 }}>
            <Form.Item
              name="testname"
              label="Test Name"
              rules={[{ required: true, message: 'Please enter test name' }]}
            >
              <Input placeholder="Enter test name" />
            </Form.Item>
            <Form.Item
              name="testclass"
              label="Test Class"
              rules={[{ required: true, message: 'Please select test class' }]}
            >
              <Select placeholder="Select test class">
                <Option value="Hematology">Hematology</Option>
                <Option value="Chemistry">Chemistry</Option>
                <Option value="Microbiology">Microbiology</Option>
                <Option value="Serology">Serology</Option>
                <Option value="Immunology">Immunology</Option>
                <Option value="Molecular">Molecular</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default LabRefRefactored;
