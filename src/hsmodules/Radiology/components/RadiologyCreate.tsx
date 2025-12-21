import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, Button, Space } from 'antd';
// @ts-ignore - JS module
import Input from '../../../components/inputs/basic/Input';
import { useCreateRadiology } from '../../../hooks/queries/useRadiology';
import { useUIStore } from '../../../stores/uiStore';
// @ts-ignore - JS module
import { UserContext } from '../../../context';

interface RadiologyCreateProps {
  onSuccess?: () => void;
}

/**
 * RadiologyCreate Component
 * Form for creating new radiology locations
 */

const RadiologyCreate: React.FC<RadiologyCreateProps> = ({ onSuccess }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { user } = React.useContext(UserContext) as any;
  const createMutation = useCreateRadiology();
  const { showActionLoader, hideActionLoader } = useUIStore();

  const onSubmit = async (data: any) => {
    showActionLoader('Creating radiology...');
    try {
      const payload = {
        ...data,
        facility: user.currentEmployee?.facilityDetail?._id,
        locationType: 'Radiology' as const,
      };

      await createMutation.mutateAsync(payload);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating radiology:', error);
    } finally {
      hideActionLoader();
    }
  };

  return (
    <Card
      title="Create Radiology"
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

          <Button
            type="primary"
            htmlType="submit"
            loading={createMutation.isPending}
            block
            size="large"
          >
            Create Radiology
          </Button>
        </Space>
      </form>
    </Card>
  );
};

export default RadiologyCreate;
