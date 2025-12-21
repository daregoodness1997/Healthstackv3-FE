import React, { useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
// @ts-ignore - JS module
import { UserContext, ObjectContext } from '../../context';
import { useRadiologyStore } from '../../stores/radiologyStore';
// @ts-ignore - JS module
import { StoreListStandalone } from './Radiologys';

export default function RadiologyHomeRefactored({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { state, setState } = useContext(ObjectContext) as any;
  const { user } = useContext(UserContext) as any;
  const navigate = useNavigate();

  // Zustand store
  const {
    selectedRadiology,
    locationModalOpen,
    setSelectedRadiology,
    setLocationModalOpen,
  } = useRadiologyStore();

  // Early return if user is not loaded yet
  if (!user || !user.currentEmployee) {
    return null;
  }

  const employeeLocations = user.currentEmployee.locations || [];
  const radLocations = employeeLocations.filter(
    (item: any) => item.locationType === 'Radiology',
  );

  // Show error if no radiology locations available
  const noLocation = () => {
    toast.error(
      'You need to set up a Radiology Location to access the Radiology Module',
    );
    navigate('/app');
  };

  // Initialize radiology location on mount
  useEffect(() => {
    const storedRadiology = state.RadiologyModule?.selectedRadiology;
    const initialRadiology = storedRadiology?._id
      ? storedRadiology
      : radLocations[0];

    if (!initialRadiology) {
      return noLocation();
    }

    const notSelected =
      initialRadiology && Object.keys(initialRadiology).length === 0;

    if (notSelected) {
      setLocationModalOpen(true);
    } else {
      // Set in Zustand store
      setSelectedRadiology(initialRadiology);

      // Maintain backward compatibility with ObjectContext
      const newEmployeeLocation = {
        locationName: initialRadiology.name,
        locationType: 'Radiology',
        locationId: initialRadiology._id,
        facilityId: user.currentEmployee.facilityDetail._id,
        facilityName: user.currentEmployee.facilityDetail.facilityName,
        case: 'radiology',
      };

      setState((prevstate: any) => ({
        ...prevstate,
        employeeLocation: newEmployeeLocation,
        RadiologyModule: {
          ...prevstate.RadiologyModule,
          selectedRadiology: initialRadiology,
        },
      }));
    }
  }, []);

  // Sync with ObjectContext when RadiologyModule state changes
  useEffect(() => {
    const selectedRad = state.RadiologyModule?.selectedRadiology;

    if (selectedRad) {
      setSelectedRadiology(selectedRad);

      const newEmployeeLocation = {
        locationName: selectedRad.name,
        locationType: selectedRad.locationType,
        locationId: selectedRad._id,
        facilityId: user.currentEmployee.facilityDetail._id,
        facilityName: user.currentEmployee.facilityDetail.facilityName,
        case: 'radiology',
      };

      setState((prevstate: any) => ({
        ...prevstate,
        employeeLocation: newEmployeeLocation,
      }));
    }
  }, [state.RadiologyModule?.selectedRadiology]);

  // Sync modal state with ObjectContext
  useEffect(() => {
    if (state.RadiologyModule?.locationModal !== undefined) {
      setLocationModalOpen(state.RadiologyModule.locationModal);
    }
  }, [state.RadiologyModule?.locationModal]);

  const handleCloseLocationModal = () => {
    setLocationModalOpen(false);
    setState((prev: any) => ({
      ...prev,
      RadiologyModule: { ...prev.RadiologyModule, locationModal: false },
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
              width={600}
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
