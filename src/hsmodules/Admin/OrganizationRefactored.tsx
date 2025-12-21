/**
 * Organization Management Page
 *
 * Main page for managing organization details, modules, and settings
 */

import { useEffect, useState, useContext } from 'react';
import { Modal } from 'antd';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
// @ts-ignore - JS module without types
import { UserContext } from '../../context';
import {
  useOrganization,
  useUpdateOrganization,
} from '../../hooks/queries/useOrganizations';
import OrganizationHeader from './components/OrganizationHeader';
import OrganizationDetailsForm from './components/OrganizationDetailsForm';
import OrganizationModulesModal from './components/OrganizationModulesModal';
import LogoUploadModal from './components/LogoUploadModal';
// @ts-ignore - JS module without types
import BankAccount from './BankAccount';
// @ts-ignore - JS module without types
import { BeneList, PolicyList } from '../ManagedCare/Corporate';
// @ts-ignore - JS module without types
import Claims from '../ManagedCare/Claims';
// @ts-ignore - JS module without types
import PremiumPayment from '../ManagedCare/Claims';

interface AdminOrganizationProps {
  propId?: string;
}

const AdminOrganization: React.FC<AdminOrganizationProps> = ({ propId }) => {
  const { control, handleSubmit, setValue, reset } = useForm();
  const { user, setUser } = useContext(UserContext) as any;
  const [edit, setEdit] = useState(false);
  const [modulesModal, setModulesModal] = useState(false);
  const [logoUploadModal, setLogoUploadModal] = useState(false);
  const [view, setView] = useState('details');

  // Get organization ID
  const organizationId = propId || user.currentEmployee.facilityDetail._id;

  // Fetch organization data using TanStack Query
  const { data: facility, isLoading, error } = useOrganization(organizationId);

  // Update organization mutation
  const updateMutation = useUpdateOrganization();

  // Prefill form values when facility data loads
  useEffect(() => {
    if (facility) {
      Object.keys(facility).forEach((key) => {
        setValue(key, (facility as any)[key]);
      });
    }
  }, [facility, setValue]);

  const updateOrganization = async (data: any) => {
    const employee = user.currentEmployee;

    const updateData = {
      ...data,
      updatedAt: dayjs().toISOString(),
      updatedBy: employee.userId,
      updatedByName: `${employee.firstname} ${employee.lastname}`,
    };

    updateMutation.mutate(
      {
        id: organizationId,
        data: updateData,
      },
      {
        onSuccess: (resp) => {
          reset(resp);
          setUser((prev: any) => ({
            ...prev,
            currentEmployee: {
              ...prev.currentEmployee,
              facilityDetail: resp,
            },
          }));
          setEdit(false);
        },
      },
    );
  };

  const handleCancelEdit = () => {
    setEdit(false);
    setView('details');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        Loading organization details...
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#ff4d4f' }}>
        Error loading organization: {error.message}
      </div>
    );
  }

  return (
    <div>
      <OrganizationHeader
        logoUrl={facility?.facilityLogo}
        onChangeLogo={() => setLogoUploadModal(true)}
      />

      {view === 'claims' && (
        <div>
          <Claims standAlone={true} />
        </div>
      )}

      {view === 'policy' && (
        <div>
          <PolicyList standAlone={facility?._id || ''} />
        </div>
      )}

      {view === 'beneficiaries' && (
        <div>
          <BeneList standAlone={facility?._id || ''} />
        </div>
      )}

      {view === 'details' && (
        <>
          <OrganizationDetailsForm
            control={control}
            edit={edit}
            onEdit={() => setEdit(true)}
            onCancel={handleCancelEdit}
            onSubmit={handleSubmit(updateOrganization)}
          />

          <div style={{ padding: '16px' }}>
            <BankAccount />
          </div>
        </>
      )}

      {view === 'premium' && <PremiumPayment />}

      <Modal
        title="Organization Modules"
        open={modulesModal}
        onCancel={() => setModulesModal(false)}
        footer={null}
        width={800}
      >
        <OrganizationModulesModal closeModal={() => setModulesModal(false)} />
      </Modal>

      <Modal
        title="Upload Organization Logo"
        open={logoUploadModal}
        onCancel={() => setLogoUploadModal(false)}
        footer={null}
        width={500}
      >
        <LogoUploadModal closeModal={() => setLogoUploadModal(false)} />
      </Modal>
    </div>
  );
};

export default AdminOrganization;
