import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, Button, Space } from 'antd';
// @ts-ignore - JS module
import Input from '../../../components/inputs/basic/Input';
import {
  useRadiology,
  useUpdateRadiology,
} from '../../../hooks/queries/useRadiology';
import { useRadiologyStore } from '../../../stores/radiologyStore';
import { useUIStore } from '../../../stores/uiStore';

interface RadiologyModifyProps {
  radiologyId?: string;
  onSuccess?: () => void;
}

/**
 * RadiologyModify Component
 * Form for editing existing radiology locations
 */

const RadiologyModify: React.FC<RadiologyModifyProps> = ({
  radiologyId: propRadId,
  onSuccess,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { currentRadiologyId, setActiveView } = useRadiologyStore();
  const updateMutation = useUpdateRadiology();
  const { showActionLoader, hideActionLoader } = useUIStore();

  const radId = propRadId || currentRadiologyId;
  const { data: radiology, isLoading } = useRadiology(radId || '');

  useEffect(() => {
    if (radiology) {
      reset({
        name: radiology.name,
        description: radiology.description || '',
      });
    }
  }, [radiology, reset]);

  const onSubmit = async (data: any) => {
    if (!radId) return;

    showActionLoader('Updating radiology...');
    try {
      await updateMutation.mutateAsync({
        id: radId,
        data: {
          name: data.name,
          description: data.description,
        },
      });

      setActiveView('detail');
      onSuccess?.();
    } catch (error) {
      console.error('Error updating radiology:', error);
    } finally {
      hideActionLoader();
    }
  };

  const handleCancel = () => {
    setActiveView('detail');
  };

  if (isLoading) {
    return (
      <Card loading title="Edit Radiology">
        <div style={{ height: 200 }} />
      </Card>
    );
  }

  if (!radiology) {
    return (
      <Card title="Edit Radiology">
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          No radiology found
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Edit Radiology"
      styles={{
        header: { backgroundColor: '#f0f2f5', fontWeight: 500 },
        body: { maxHeight: '70vh', overflowY: 'auto' },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Radiology name is required' }}
            render={({ field }) => (
              <Input
                {...field}
                label="Radiology Name"
                placeholder="Enter radiology name"
                required
                important
                errorText={errors.name?.message as string}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Description"
                placeholder="Enter description (optional)"
                errorText={errors.description?.message as string}
              />
            )}
          />

          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateMutation.isPending}
            >
              Update Radiology
            </Button>
          </Space>
        </Space>
      </form>
    </Card>
  );
};

export default RadiologyModify;
