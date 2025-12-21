/**
 * Client Appointments Page Wrapper
 * Wraps AppointmentListRefactored with modal management
 */

import React, { useState, useContext } from 'react';
import AppointmentListRefactored from '../Appointment/refactored/AppointmentListRefactored';
// @ts-ignore
import ModalBox from '../../components/modal';
// @ts-ignore
import { ObjectContext } from '../../context';
// Import existing appointment modal components
const AppointmentCreate = React.lazy(
  () =>
    // @ts-ignore
    import('../../components/appointment/components/AppointmentCreate'),
);
const AppointmentDetail = React.lazy(
  () =>
    // @ts-ignore
    import('../../components/appointment/components/AppointmentDetail'),
);

const ClientAppointmentsPage: React.FC = () => {
  const [createModal, setCreateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const { state } = useContext(ObjectContext) as any;

  return (
    <div>
      <AppointmentListRefactored
        title="Client Appointments"
        module="Client"
        onOpenCreate={() => setCreateModal(true)}
        onOpenDetail={() => setDetailModal(true)}
        onOpenModify={() => setCreateModal(true)} // Reuse create modal for editing
      />

      <ModalBox
        open={createModal}
        onClose={() => setCreateModal(false)}
        header={
          state?.AppointmentModule?.selectedAppointment?._id
            ? 'Edit Appointment'
            : 'Create Appointment'
        }
      >
        <React.Suspense fallback={<div>Loading...</div>}>
          <AppointmentCreate closeModal={() => setCreateModal(false)} />
        </React.Suspense>
      </ModalBox>

      <ModalBox
        open={detailModal}
        onClose={() => setDetailModal(false)}
        header="Appointment Details"
      >
        <React.Suspense fallback={<div>Loading...</div>}>
          <AppointmentDetail
            closeModal={() => setDetailModal(false)}
            module="Client"
          />
        </React.Suspense>
      </ModalBox>
    </div>
  );
};

export default ClientAppointmentsPage;
