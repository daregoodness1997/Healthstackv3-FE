import React, { useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
// @ts-ignore - JS module
import { UserContext, ObjectContext } from '../../context';
import { useLaboratoryStore } from '../../stores/laboratoryStore';
// @ts-ignore - JS module
import { StoreListStandalone } from './Labs';

/**
 * LaboratoryHome - Refactored
 * Main entry point for Laboratory module with location management
 *
 * Changes:
 * - Migrated from Material-UI Box to Ant Design Modal
 * - Using Zustand store for location state management
 * - Simplified location selection logic
 * - Maintained backward compatibility with ObjectContext
 */

export default function LaboratoryHomeRefactored({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { state, setState } = useContext(ObjectContext) as any;
  const { user } = useContext(UserContext) as any;
  const navigate = useNavigate();

  // Zustand store
  const {
    selectedLaboratory,
    locationModalOpen,
    setSelectedLaboratory,
    setLocationModalOpen,
  } = useLaboratoryStore();

  // Early return if user is not loaded yet
  if (!user || !user.currentEmployee) {
    return null;
  }

  const employeeLocations = user.currentEmployee.locations || [];
  const labLocations = employeeLocations.filter(
    (item: any) => item.locationType === 'Laboratory',
  );

  // Show error if no laboratory locations available
  const noLocation = () => {
    toast.error(
      'You need to set up a Laboratory Location to access the Laboratory Module',
    );
    navigate('/app');
  };

  // Initialize laboratory location on mount
  useEffect(() => {
    const storedLab = state.LaboratoryModule?.selectedLab;
    const initialLab = storedLab?._id ? storedLab : labLocations[0];

    if (!initialLab) {
      return noLocation();
    }

    const notSelected = initialLab && Object.keys(initialLab).length === 0;

    if (notSelected) {
      setLocationModalOpen(true);
    } else {
      // Set in Zustand store
      setSelectedLaboratory(initialLab);

      // Maintain backward compatibility with ObjectContext
      const newEmployeeLocation = {
        locationName: initialLab.name,
        locationType: 'Laboratory',
        locationId: initialLab._id,
        facilityId: user.currentEmployee.facilityDetail._id,
        facilityName: user.currentEmployee.facilityDetail.facilityName,
        case: 'laboratory',
      };

      setState((prevstate: any) => ({
        ...prevstate,
        employeeLocation: newEmployeeLocation,
        LaboratoryModule: {
          ...prevstate.LaboratoryModule,
          selectedLab: initialLab,
        },
      }));
    }
  }, []);

  // Sync with ObjectContext when LaboratoryModule state changes
  useEffect(() => {
    const selectedLab = state.LaboratoryModule?.selectedLab;

    if (selectedLab) {
      setSelectedLaboratory(selectedLab);

      const newEmployeeLocation = {
        locationName: selectedLab?.name,
        locationType: selectedLab?.locationType,
        locationId: selectedLab?._id,
        facilityId: user.currentEmployee.facilityDetail?._id,
        facilityName: user.currentEmployee.facilityDetail?.facilityName,
        case: 'laboratory',
      };

      setState((prevstate: any) => ({
        ...prevstate,
        employeeLocation: newEmployeeLocation,
      }));
    }
  }, [state.LaboratoryModule?.selectedLab]);

  // Sync modal state with ObjectContext
  useEffect(() => {
    if (state.LaboratoryModule?.locationModal !== undefined) {
      setLocationModalOpen(state.LaboratoryModule.locationModal);
    }
  }, [state.LaboratoryModule?.locationModal]);

  const handleCloseLocationModal = () => {
    setLocationModalOpen(false);
    setState((prev: any) => ({
      ...prev,
      LaboratoryModule: { ...prev.LaboratoryModule, locationModal: false },
    }));
  };

  return (
    <section className="section remPadTop">
      <section className="hero is-info is-fullheight">
        <div className="hero-body">
          <div className="layout__content-main">
            {/* Ant Design Modal replacing Material-UI */}
            <Modal
              open={locationModalOpen}
              onCancel={handleCloseLocationModal}
              footer={null}
              width={500}
              styles={{
                body: {
                  maxHeight: '80vh',
                  overflowY: 'auto',
                },
              }}
            >
              <StoreListStandalone
                standalone={true}
                closeModal={handleCloseLocationModal}
              />
            </Modal>

            {children}
            <Outlet />
          </div>
        </div>
      </section>
    </section>
  );
}
