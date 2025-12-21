import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, Button, Space } from 'antd';
import { toast } from 'react-toastify';
// @ts-ignore - JS module
import Input from '../../../components/inputs/basic/Input';
import { useCreateLaboratory } from '../../../hooks/queries/useLaboratory';
import { useUIStore } from '../../../stores/uiStore';
// @ts-ignore - JS module
import { UserContext } from '../../../context';

interface LabCreateProps {
  onSuccess?: () => void;
}

/**
 * LabCreate Component
 * Form for creating new laboratory locations
 *
 * Features:
 * - Ant Design UI components
 * - React Hook Form with Controller pattern
 * - TanStack Query mutation for creation
 * - Automatic toast notifications
 * - Loading states
 */

const LabCreate: React.FC<LabCreateProps> = ({ onSuccess }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { user } = React.useContext(UserContext) as any;
  const createMutation = useCreateLaboratory();
  const { showActionLoader, hideActionLoader } = useUIStore();

  const onSubmit = async (data: any) => {
    showActionLoader('Creating laboratory...');
    try {
      const payload = {
        ...data,
        facility: user.currentEmployee?.facilityDetail?._id,
        locationType: 'Laboratory' as const,
      };

      await createMutation.mutateAsync(payload);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating laboratory:', error);
    } finally {
      hideActionLoader();
    }
  };

  return (
    <Card
      title="Create Laboratory"
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

          <Button
            type="primary"
            htmlType="submit"
            loading={createMutation.isPending}
            block
            size="large"
          >
            Create Laboratory
          </Button>
        </Space>
      </form>
    </Card>
  );
};

export default LabCreate;
