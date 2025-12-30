import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import "../modules-list.scss";
import CheckboxTree from "react-checkbox-tree";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../../context";
import { toast } from "react-toastify";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import { Box } from "@mui/material";
import CustomConfirmationDialog from "../../../components/confirm-dialog/confirm-dialog";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { useLocations } from "../../../hooks/queries/useLocations";
import { useUpdateEmployee } from "../../../hooks/queries/useEmployees";

const EmployeeLocation = ({ handlecloseModal }) => {
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const updateEmployee = useUpdateEmployee();
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  const prevRoles = state.EmployeeModule.selectedEmployee.locations || [];
  const prevRolesIds = prevRoles.map(item => item._id);

  const { data: locationsData } = useLocations({
    facilityId: user.currentEmployee.facilityDetail._id,
    limit: 200,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const locations = locationsData?.data || [];

  useEffect(() => {
    setChecked(prevRolesIds);
  }, []);

  const updateEmployeeLocations = async () => {
    showActionLoader();
    const employee = state.EmployeeModule.selectedEmployee;

    const locationsId = [...checked, ...expanded];

    const locationsObject = locationsId.map(item => {
      const location = locations.find(loc => loc._id === item);
      if (!location) return;
      return location;
    });

    const newLocations = locationsObject.filter(item => item !== undefined);

    try {
      const res = await updateEmployee.mutateAsync({
        id: employee._id,
        data: { locations: newLocations },
      });
      setConfirmDialog(false);
      hideActionLoader();
      const newEmployeeModule = {
        selectedEmployee: res,
        show: "detail",
      };
      setState(prevstate => ({
        ...prevstate,
        EmployeeModule: newEmployeeModule,
      }));
      handlecloseModal();
    } catch (err) {
      setConfirmDialog(false);
      hideActionLoader();
      toast.error("Error updating Employee Locations" + err);
    }
  };

  const resetEmployeeLocations = async () => {
    showActionLoader();

    const employee = state.EmployeeModule.selectedEmployee;

    try {
      const res = await updateEmployee.mutateAsync({
        id: employee._id,
        data: { locations: [] },
      });
      setConfirmDialog(false);
      hideActionLoader();
      const newEmployeeModule = {
        selectedEmployee: res,
        show: "detail",
      };
      setState(prevstate => ({
        ...prevstate,
        EmployeeModule: newEmployeeModule,
      }));
      handlecloseModal();
    } catch (err) {
      setConfirmDialog(false);
      hideActionLoader();
      toast.error("Error Reseting Employee Locations" + err);
    }
  };

  ////////GET VARIOUS TYPES OF LOCATIONS ONLY
  const filteredArray = locations.filter(
    (v, i, a) => a.findIndex(v2 => v2.locationType === v.locationType) === i
  );

  ////////GENERATE AN OBJECT THAT WORKS WITH CHECKBOX TREE COMPONENT
  const convertedFilterArray = filteredArray.map(item => {
    const children = locations.filter(
      location => location.locationType === item.locationType
    );

    const newChildren = children.map(child => {
      return {
        ...child,
        label: child.name,
        value: child._id,
      };
    });

    return {
      locationType: item.locationType,
      label: item.locationType,
      value: item.locationType,
      children: newChildren,
    };
  });

  return (
    <>
      <Box
        sx={{
          width: "400px",
        }}
      >
        <Box
          sx={{display: "flex", justifyContent: "flex-end"}}
          gap={1}
          mb={1.5}
        >
          <GlobalCustomButton onClick={() => setConfirmDialog(true)}>
            Update Employee Location
          </GlobalCustomButton>

          <GlobalCustomButton
            color="warning"
            onClick={() => setConfirmReset(true)}
          >
            Reset Employee Location
          </GlobalCustomButton>
        </Box>

        <Box>
          <CheckboxTree
            nodes={convertedFilterArray}
            checked={checked}
            expanded={expanded}
            onCheck={checked => setChecked(checked)}
            onExpand={expanded => setExpanded(expanded)}
            checkModel="all"
            //iconsClass="fa5"
          />
        </Box>

        <CustomConfirmationDialog
          open={confirmDialog}
          cancelAction={() => setConfirmDialog(false)}
          type="update"
          message="You are about to Update roles for the employee?"
          confirmationAction={updateEmployeeLocations}
        />

        <CustomConfirmationDialog
          open={confirmReset}
          cancelAction={() => setConfirmReset(false)}
          type="warning"
          message="You are about to Reset roles for the employee? This will clear all the Employee roles."
          confirmationAction={resetEmployeeLocations}
        />
      </Box>
    </>
  );
};

export default EmployeeLocation;
