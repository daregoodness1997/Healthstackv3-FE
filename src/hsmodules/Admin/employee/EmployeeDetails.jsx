/* eslint-disable */
import React, { useState, useContext } from "react";
import { ObjectContext } from "../../../context";
import ModuleList from "../ModuleList";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import Grid from "@mui/system/Unstable_Grid/Grid";
import "react-datepicker/dist/react-datepicker.css";
import ModalBox from "../../../components/modal";

export function EmployeeDetail({ showModifyModal }) {
    const { state, setState } = useContext(ObjectContext);
    const [showRoles, setShowRoles] = useState("");
  
    const Employee = state.EmployeeModule.selectedEmployee;
  
    const handleEdit = async () => {
      const newEmployeeModule = {
        selectedEmployee: Employee,
        show: "modify",
      };
      await setState((prevstate) => ({
        ...prevstate,
        EmployeeModule: newEmployeeModule,
      }));
      showModifyModal();
    };
    const handleRoles = () => {
      setShowRoles(true);
    };
    const handlecloseModal = () => {
      setShowRoles(false);
    };
  
    return (
      <>
        <div className="card ">
          <div className="card-header">
            <p className="card-header-title" style={{ fontWeight: "bold" }}>
              Employee Details
            </p>
          </div>
  
          <div className="card-content vscrollable">
            <Grid container spacing={2} mt={4}>
              <Grid item xs={12} sm={3} md={4}>
                <span
                  style={{
                    color: " #0364FF",
                    fontSize: "20px",
                    marginRight: ".8rem",
                  }}
                >
                  Name:
                </span>
                <span
                  className="is-size-7 padleft"
                  name="name"
                  style={{ fontWeight: "lighter", fontSize: "20px" }}
                >
                  {" "}
                  {Employee?.firstname}{" "}
                </span>
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <span
                  style={{
                    color: " #0364FF",
                    fontSize: "20px",
                    marginRight: ".8rem",
                  }}
                >
                  Last Name:
                </span>
                <span style={{ color: " #000000", fontSize: "20px" }}>
                  {Employee?.lastname}
                </span>
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <span
                  style={{
                    color: " #0364FF",
                    fontSize: "20px",
                    marginRight: ".8rem",
                  }}
                >
                  Profession:
                </span>
                <span style={{ color: " #000000", fontSize: "20px" }}>
                  {Employee?.profession}
                </span>
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <span
                  style={{
                    color: " #0364FF",
                    fontSize: "20px",
                    marginRight: ".8rem",
                  }}
                >
                  Phone:
                </span>
                <span style={{ color: " #000000", fontSize: "20px" }}>
                  {Employee?.phone}
                </span>
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <span
                  style={{
                    color: " #0364FF",
                    fontSize: "20px",
                    marginRight: ".8rem",
                  }}
                >
                  Email:
                </span>
                <span style={{ color: " #000000", fontSize: "20px" }}>
                  {Employee?.email}
                </span>
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <span
                  style={{
                    color: " #0364FF",
                    fontSize: "20px",
                    marginRight: ".8rem",
                  }}
                >
                  Department:
                </span>
                <span style={{ color: " #000000", fontSize: "20px" }}>
                  {Employee?.department}
                </span>
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <span
                  style={{
                    color: " #0364FF",
                    fontSize: "20px",
                    marginRight: ".8rem",
                  }}
                >
                  Department Unit:
                </span>
                <span style={{ color: " #000000", fontSize: "20px" }}>
                  {Employee?.deptunit}
                </span>
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={4}>
              <Grid item xs={12} sm={3} md={4}>
                <GlobalCustomButton
                  type="submit"
                  onClick={handleEdit}
                  style={{
                    backgroundColor: "#17935C",
                    width: "100px",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </GlobalCustomButton>
              </Grid>
              <Grid item xs={12} sm={3} md={3}>
                <GlobalCustomButton
                  type="submit"
                  onClick={handleRoles}
                  style={{
                    backgroundColor: "#0364FF",
                    width: "100px",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  Set Roles
                </GlobalCustomButton>
              </Grid>
            </Grid>
          </div>
        </div>
        <ModalBox
          open={showRoles}
          onClose={handlecloseModal}
          header="Employee Roles"
        >
          <ModuleList handlecloseModal={handlecloseModal} />
        </ModalBox>
      </>
    );
  }