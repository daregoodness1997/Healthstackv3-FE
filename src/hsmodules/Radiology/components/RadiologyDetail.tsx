import React from 'react';
import { Card, Descriptions, Button, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  useRadiology,
  useDeleteRadiology,
} from '../../../hooks/queries/useRadiology';
import { useRadiologyStore } from '../../../stores/radiologyStore';
// @ts-ignore - JS module
import { ObjectContext } from '../../../context';

interface RadiologyDetailProps {
  radiologyId?: string;
  onEdit?: () => void;
}

/**
 * RadiologyDetail Component
 * Displays detailed information about a radiology location
 */

const RadiologyDetail: React.FC<RadiologyDetailProps> = ({
  radiologyId: propRadId,
  onEdit,
}) => {
  const { setState } = React.useContext(ObjectContext) as any;
  const { currentRadiologyId, setActiveView } = useRadiologyStore();
  const deleteMutation = useDeleteRadiology();

  const radId = propRadId || currentRadiologyId;
  const { data: radiology, isLoading } = useRadiology(radId || '');

  const handleEdit = () => {
    setActiveView('modify');
    setState((prevstate: any) => ({
      ...prevstate,
      StoreModule: { ...prevstate.StoreModule, show: 'modify' },
    }));
    onEdit?.();
  };

  const handleDelete = async () => {
    if (!radId) return;

    if (window.confirm('Are you sure you want to delete this radiology?')) {
      await deleteMutation.mutateAsync(radId);
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
        <Descriptions title="Radiology Details" />
      </Card>
    );
  }

  if (!radiology) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          No radiology selected
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Radiology Details"
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
          <strong>{radiology.name}</strong>
        </Descriptions.Item>

        <Descriptions.Item label="Type">
          <Tag color="green">{radiology.locationType}</Tag>
        </Descriptions.Item>

        {radiology.description && (
          <Descriptions.Item label="Description">
            {radiology.description}
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Facility ID">
          {radiology.facility}
        </Descriptions.Item>

        {radiology.createdAt && (
          <Descriptions.Item label="Created At">
            {new Date(radiology.createdAt).toLocaleString()}
          </Descriptions.Item>
        )}

        {radiology.updatedAt && (
          <Descriptions.Item label="Last Updated">
            {new Date(radiology.updatedAt).toLocaleString()}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};

export default RadiologyDetail;
