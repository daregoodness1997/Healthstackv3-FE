import React, { useState, useContext, useEffect } from "react";
import "./modules-list.scss";
import client from "../../feathers";
import CheckboxTree from "react-checkbox-tree";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../context";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import { Box } from "@mui/material";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import { modulesList, actionRoles } from "./modulelist-data";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { toast } from "react-toastify";

export default function ModuleList({ handlecloseModal }) {
  const {setValue } = useForm();
  const EmployeeServ = client.service("employee");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const { user } = useContext(UserContext); //,setUser
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const prevRoles = state.EmployeeModule.selectedEmployee.roles;
  const [checked, setChecked] = useState([...prevRoles]);
  const [expanded, setExpanded] = useState([]);
  // eslint-disable-next-line

  let draftDoc = {};
  draftDoc = state.EmployeeModule.selectedEmployee;
  // console.log(draftDoc)

  useEffect(() => {
    Object.entries(draftDoc).map(([keys, value], i) =>
      setValue(keys, value, {
        shouldValidate: true,
        shouldDirty: true,
      })
    );

    return () => {};
  }, []);

  useEffect(() => {
    draftDoc = state.EmployeeModule.selectedEmployee;

    return () => {};
  }, [state.EmployeeModule.selectedEmployee]);

  const updateEmployeeRoles = () => {
    showActionLoader();
    const newRoles = [...checked, ...expanded];
    const oldEmployeeData = state.EmployeeModule.selectedEmployee;

    const newEmployeeData = { ...oldEmployeeData, roles: newRoles };
    EmployeeServ.patch(draftDoc._id, newEmployeeData) 
      .then((res) => {
        setConfirmDialog(false);
        hideActionLoader();
        toast.success("Employee Roles updated succesfully");
        draftDoc = {};
        const newEmployeeModule = {
          selectedEmployee: res,
          show: "detail",
        };
        setState((prevstate) => ({
          ...prevstate,
          EmployeeModule: newEmployeeModule,
        }));

        handlecloseModal();
      })
      .catch((err) => {
        setConfirmDialog(false);
        hideActionLoader();
        console.error("Error updating Employee Roles", err);
      });
    // }
  };

  const resetEmployeeRoles = () => {
    //e.preventDefault();
    showActionLoader();
   

    const oldEmployeeData = state.EmployeeModule.selectedEmployee;

    const newEmployeeData = { ...oldEmployeeData, roles: [] };

    EmployeeServ.patch(draftDoc._id, newEmployeeData)
      .then((res) => {
        
        setConfirmDialog(false);
        hideActionLoader();
        toast.success("Employee Roles Reset succesfully");
       
        draftDoc = {};

        const newEmployeeModule = {
          selectedEmployee: res,
          show: "detail",
        };
        setState((prevstate) => ({
          ...prevstate,
          EmployeeModule: newEmployeeModule,
        }));

        handlecloseModal();
      })
      .catch((err) => {
        setConfirmDialog(false);
        hideActionLoader();
        // console.log(err);
        toast.error("Error Reseting Employee Roles" + err);
      });
    // }
  };


  const facilityModules = user.currentEmployee?.facilityDetail?.facilityModules;

  const facilityModulesList =
    facilityModules &&
    modulesList.filter(
      (item) =>
        item.value === "Documentation" || facilityModules.includes(item.value)
    );

  return (
    <>
      <Box
        sx={{
          width: "400px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end" }} gap={1}>
          <GlobalCustomButton onClick={() => setConfirmDialog(true)}>
            Confirm Roles
          </GlobalCustomButton>

          <GlobalCustomButton
            color="warning"
            onClick={() => setConfirmReset(true)}
          >
            Reset Roles
          </GlobalCustomButton>
        </Box>

        <Box>
          <CheckboxTree
            nodes={facilityModulesList.concat(actionRoles) || modulesList}
            checked={checked}
            expanded={expanded}
            onCheck={(checked) => setChecked(checked)}
            onExpand={(expanded) => setExpanded(expanded)}
            checkModel="all"
            //iconsClass="fa5"
          />
        </Box>

        <CustomConfirmationDialog
          open={confirmDialog}
          cancelAction={() => setConfirmDialog(false)}
          type="update"
          message="You are about to Update roles for the employee?"
          confirmationAction={updateEmployeeRoles}
        />

        <CustomConfirmationDialog
          open={confirmReset}
          cancelAction={() => setConfirmReset(false)}
          type="warning"
          message="You are about to Reset roles for the employee? This will clear all the Employee roles."
          confirmationAction={resetEmployeeRoles}
        />
      </Box>
    </>
  );
}