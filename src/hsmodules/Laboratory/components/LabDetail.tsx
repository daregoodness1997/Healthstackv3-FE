import React from 'react';
import { Card, Descriptions, Button, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  useLaboratory,
  useDeleteLaboratory,
} from '../../../hooks/queries/useLaboratory';
import { useLaboratoryStore } from '../../../stores/laboratoryStore';
// @ts-ignore - JS module
import { ObjectContext } from '../../../context';

interface LabDetailProps {
  laboratoryId?: string;
  onEdit?: () => void;
}

/**
 * LabDetail Component
 * Displays detailed information about a laboratory
 *
 * Features:
 * - Ant Design Descriptions for clean display
 * - Edit and delete actions
 * - TanStack Query for data fetching
 * - Loading and error states
 */

const LabDetail: React.FC<LabDetailProps> = ({
  laboratoryId: propLabId,
  onEdit,
}) => {
  const { setState } = React.useContext(ObjectContext) as any;
  const { currentLabId, setActiveView } = useLaboratoryStore();
  const deleteMutation = useDeleteLaboratory();

  const labId = propLabId || currentLabId;
  const { data: laboratory, isLoading } = useLaboratory(labId || '');

  const handleEdit = () => {
    setActiveView('modify');
    setState((prevstate: any) => ({
      ...prevstate,
      StoreModule: { ...prevstate.StoreModule, show: 'modify' },
    }));
    onEdit?.();
  };

  const handleDelete = async () => {
    if (!labId) return;

    if (window.confirm('Are you sure you want to delete this laboratory?')) {
      await deleteMutation.mutateAsync(labId);
      setActiveView('list');
      setState((prevstate: any) => ({
        ...prevstate,
        StoreModule: { ...prevstate.StoreModule, show: 'list' },
      }));
    }
  };

  if (isLoading) {
    return (
      <Card loading>
        <Descriptions title="Laboratory Details" />
      </Card>
    );
  }

  if (!laboratory) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          No laboratory selected
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Laboratory Details"
      extra={
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
            size="small"
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={deleteMutation.isPending}
            size="small"
          >
            Delete
          </Button>
        </Space>
      }
      styles={{
        header: { backgroundColor: '#f0f2f5' },
        body: { padding: '24px' },
      }}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Name">
          <strong>{laboratory.name}</strong>
        </Descriptions.Item>

        <Descriptions.Item label="Type">
          <Tag color="blue">{laboratory.locationType}</Tag>
        </Descriptions.Item>

        {laboratory.description && (
          <Descriptions.Item label="Description">
            {laboratory.description}
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Facility ID">
          {laboratory.facility}
        </Descriptions.Item>

        {laboratory.createdAt && (
          <Descriptions.Item label="Created At">
            {new Date(laboratory.createdAt).toLocaleString()}
          </Descriptions.Item>
        )}

        {laboratory.updatedAt && (
          <Descriptions.Item label="Last Updated">
            {new Date(laboratory.updatedAt).toLocaleString()}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};

export default LabDetail;
