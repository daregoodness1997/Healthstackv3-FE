/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import { UserContext, ObjectContext } from '../../context';
import { Outlet, useNavigate } from 'react-router-dom';
import FrontDesk, { FrontDeskList } from './FrontDesk';
import { Space } from 'antd';
import { Box } from '@mui/material';
import ModalBox from '../../components/modal';
import { toast } from 'react-toastify';

export default function ClientHome({ children }) {
  const { state, setState } = useContext(ObjectContext);
  const { user } = useContext(UserContext);

  // Early return if user is not loaded yet
  if (!user || !user.currentEmployee) {
    return null;
  }

  const employeeLocations = user.currentEmployee.locations || [];
  const frontDesks = employeeLocations.filter(
    (item) => item.locationType === 'Front Desk',
  );

  const location = state.FrontDesk.selectedFrontDesk._id
    ? state.FrontDesk.selectedFrontDesk
    : frontDesks[0];

  const [selectedClinic, setSelectedClinic] = useState(location);

  const navigate = useNavigate();

  const noLocation = () => {
    toast.error(
      'You need to set up a Client Location to access the Client Module',
    );
    navigate('/app');
  };

  useEffect(() => {
    if (!selectedClinic) return noLocation();
    const notSelected =
      selectedClinic && Object.keys(selectedClinic).length === 0;

    if (notSelected) {
      handleChangeFrontDesk();
    } else {
      const newEmployeeLocation = {
        locationName: selectedClinic.name,
        locationType: 'Front Desk',
        locationId: selectedClinic._id,
        facilityId: user.currentEmployee.facilityDetail._id,
        facilityName: user.currentEmployee.facilityDetail.facilityName,
        case: 'client',
      };

      const newClinicModule = {
        selectedFrontDesk: selectedClinic,
        show: 'detail',
      };

      setState((prevstate) => ({
        ...prevstate,
        employeeLocation: newEmployeeLocation,
        FrontDesk: newClinicModule,
      }));
    }
    return () => {};
  }, []);

  const handleChangeFrontDesk = async () => {
    await setState((prev) => ({
      ...prev,
      FrontDesk: { ...prev.FrontDesk, locationModal: true },
    }));
  };

  const handleCloseLocationModule = () => {
    setState((prev) => ({
      ...prev,
      FrontDesk: { ...prev.FrontDesk, locationModal: false },
    }));
  };

  useEffect(() => {
    setSelectedClinic(state.FrontDesk.selectedFrontDesk);

    const newEmployeeLocation = {
      locationName: state.FrontDesk.selectedFrontDesk.name,
      locationType: 'Front Desk',
      locationId: state.FrontDesk.selectedFrontDesk._id,
      facilityId: user.currentEmployee.facilityDetail._id,
      facilityName: user.currentEmployee.facilityDetail.facilityName,
      case: 'client',
    };

    setState((prevstate) => ({
      ...prevstate,
      employeeLocation: newEmployeeLocation,
    }));
  }, [state.FrontDesk.selectedFrontDesk]);

  return (
    <div>
      <ModalBox open={state.FrontDesk.locationModal}>
        <Box
          sx={{
            maxWidth: '600px',
            maxHeight: '80vh',
          }}
        >
          <FrontDeskList
            standalone={true}
            closeModal={handleCloseLocationModule}
          />
        </Box>
      </ModalBox>

      {children}
      <Outlet />
    </div>
  );
}
