/**
 * Organization Modules Modal Component
 *
 * Modal for managing organization modules
 */

import { useEffect, useContext } from 'react';
import { Button, Space } from 'antd';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
// @ts-ignore - JS module without types
import { UserContext } from '../../../context';
import { useUpdateOrganization } from '../../../hooks/queries/useOrganizations';
// @ts-ignore - JS module without types
import CheckboxGroup from '../../../components/inputs/basic/Checkbox/CheckBoxGroup';
// @ts-ignore - JS module without types
import { orgTypeModules } from '../../app/app-modules';

interface OrganizationModulesModalProps {
  closeModal: () => void;
}

const OrganizationModulesModal: React.FC<OrganizationModulesModalProps> = ({
  closeModal,
}) => {
  const { control, handleSubmit, setValue } = useForm();
  const { user, setUser } = useContext(UserContext) as any;
  const updateMutation = useUpdateOrganization();

  const facilityType = user.currentEmployee.facilityDetail.facilityType;
  const selectedType = orgTypeModules.find(
    (item: any) => item.name === facilityType,
  );
  const facilityModules = selectedType ? selectedType.modules : ['Admin'];

  useEffect(() => {
    const prevModules = user.currentEmployee.facilityDetail.facilityModules || [
      'Admin',
    ];
    setValue('modules', prevModules);
  }, [user, setValue]);

  const updateModules = async (data: { modules: string[] }) => {
    const employee = user.currentEmployee;
    const prevOrgDetail = user.currentEmployee.facilityDetail;

    const updateData = {
      updatedAt: dayjs().toISOString(),
      updatedBy: employee.userId,
      updatedByName: `${employee.firstname} ${employee.lastname}`,
      facilityModules: data.modules,
    };

    updateMutation.mutate(
      {
        id: prevOrgDetail._id,
        data: updateData,
      },
      {
        onSuccess: (resp) => {
          setUser((prev: any) => ({
            ...prev,
            currentEmployee: {
              ...prev.currentEmployee,
              facilityDetail: resp,
            },
          }));
          closeModal();
        },
      },
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <div>
        <CheckboxGroup
          name="modules"
          control={control}
          options={facilityModules}
          row
        />
      </div>

      <Space style={{ marginTop: '16px' }}>
        <Button onClick={closeModal}>Cancel</Button>
        <Button
          type="primary"
          onClick={handleSubmit(updateModules as any)}
          loading={updateMutation.isPending}
        >
          Update Modules
        </Button>
      </Space>
    </div>
  );
};

export default OrganizationModulesModal;
