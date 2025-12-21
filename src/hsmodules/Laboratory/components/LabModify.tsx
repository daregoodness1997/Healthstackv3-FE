import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, Button, Space } from 'antd';
// @ts-ignore - JS module
import Input from '../../../components/inputs/basic/Input';
import {
  useLaboratory,
  useUpdateLaboratory,
} from '../../../hooks/queries/useLaboratory';
import { useLaboratoryStore } from '../../../stores/laboratoryStore';
import { useUIStore } from '../../../stores/uiStore';

interface LabModifyProps {
  laboratoryId?: string;
  onSuccess?: () => void;
}

/**
 * LabModify Component
 * Form for editing existing laboratory locations
 *
 * Features:
 * - Pre-fills form with existing data
 * - React Hook Form with Controller pattern
 * - TanStack Query for fetching and updating
 * - Automatic validation
 */

const LabModify: React.FC<LabModifyProps> = ({
  laboratoryId: propLabId,
  onSuccess,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { currentLabId, setActiveView } = useLaboratoryStore();
  const updateMutation = useUpdateLaboratory();
  const { showActionLoader, hideActionLoader } = useUIStore();

  const labId = propLabId || currentLabId;
  const { data: laboratory, isLoading } = useLaboratory(labId || '');

  // Pre-fill form when laboratory data is loaded
  useEffect(() => {
    if (laboratory) {
      reset({
        name: laboratory.name,
        description: laboratory.description || '',
      });
    }
  }, [laboratory, reset]);

  const onSubmit = async (data: any) => {
    if (!labId) return;

    showActionLoader('Updating laboratory...');
    try {
      await updateMutation.mutateAsync({
        id: labId,
        data: {
          name: data.name,
          description: data.description,
        },
      });

      setActiveView('detail');
      onSuccess?.();
    } catch (error) {
      console.error('Error updating laboratory:', error);
    } finally {
      hideActionLoader();
    }
  };

  const handleCancel = () => {
    setActiveView('detail');
  };

  if (isLoading) {
    return (
      <Card loading title="Edit Laboratory">
        <div style={{ height: 200 }} />
      </Card>
    );
  }

  if (!laboratory) {
    return (
      <Card title="Edit Laboratory">
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          No laboratory found
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Edit Laboratory"
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
            rules={{ required: 'Laboratory name is required' }}
            render={({ field }) => (
              <Input
                {...field}
                label="Laboratory Name"
                placeholder="Enter laboratory name"
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
              Update Laboratory
            </Button>
          </Space>
        </Space>
      </form>
    </Card>
  );
};

export default LabModify;
