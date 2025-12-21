/* eslint-disable */
import React, { useState, useContext, useEffect } from "react";
import client from "../../../feathers";
import { useForm } from "react-hook-form";
import {ObjectContext } from "../../../context";
import { toast } from "react-toastify";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import Input from "../../../components/inputs/basic/Input";
import "react-datepicker/dist/react-datepicker.css";
import CustomConfirmationDialog from "../../../components/confirm-dialog/confirm-dialog";

export function EmployeeModify() {
    const { register, handleSubmit, setValue, reset, errors } = useForm(); 
    const EmployeeServ = client.service("employee");
    const [confirmDialog, setConfirmDialog] = useState(false);
    const { state, setState } = useContext(ObjectContext);
    const Employee = state.EmployeeModule.selectedEmployee;
  
    useEffect(() => {
      setValue("firstname", Employee.firstname, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("lastname", Employee.lastname, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("profession", Employee.profession, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("phone", Employee.phone, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("email", Employee.email, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("department", Employee.department, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("deptunit", Employee.deptunit, {
        shouldValidate: true,
        shouldDirty: true,
      });
      /*   setValue("EmployeeCategory", Employee.EmployeeCategory,  {
                  shouldValidate: true,
                  shouldDirty: true
              }) */
  
      return () => {};
    }, []);
  
    const changeState = () => {
      const newEmployeeModule = {
        selectedEmployee: {},
        show: "create",
      };
      setState((prevstate) => ({
        ...prevstate,
        EmployeeModule: newEmployeeModule,
      }));
    };
  
    const handleDelete = async () => {
      const dleteId = Employee._id;
      EmployeeServ.remove(dleteId)
        .then(() => {
          reset();
          toast({
            message: "Employee deleted succesfully",
            type: "is-success",
            dismissible: true,
            pauseOnHover: true,
          });
          changeState();
        })
        .catch((err) => {
         
          toast({
            message: "Error deleting Employee, probable network issues or " + err,
            type: "is-danger",
            dismissible: true,
            pauseOnHover: true,
          });
        });
      //}
    };
  
    const onSubmit = (data, e) => {
      e.preventDefault();
      data.facility = Employee.facility;
      EmployeeServ.patch(Employee._id, data)
        .then(() => {
          toast({
            message: "Employee updated succesfully",
            type: "is-success",
            dismissible: true,
            pauseOnHover: true,
          });
  
          changeState();
        })
        .catch((err) => {
          toast({
            message: "Error updating Employee, probable network issues or " + err,
            type: "is-danger",
            dismissible: true,
            pauseOnHover: true,
          });
        });
    };
  
    return (
      <>
        <div className="card ">
          <CustomConfirmationDialog
            open={confirmDialog}
            cancelAction={() => setConfirmDialog(false)}
            confirmationAction={handleDelete}
            type="danger"
            message="Are you sure you want to delete this data?"
          />
          <div className="card-header">
            <p className="card-header-title">Employee Details-Modify</p>
          </div>
          <div className="card-content vscrollable">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                style={{
                  width: "50px",
                }}
                {...register("firstname", { required: true })}
                name="firstname"
                type="text"
                placeholder="First Name"
              />
  
              <Input
                style={{
                  width: "50px",
                }}
                {...register("lastname", { required: true })}
                name="lastname"
                type="text"
                placeholder="Last Name"
              />
  
              <Input
                style={{
                  width: "50px",
                }}
                {...register("profession", { required: true })}
                name="profession"
                type="text"
                placeholder="Profession"
              />
  
              <Input
                style={{
                  width: "50px",
                }}
                {...register("phone", { required: true })}
                name="phone"
                type="text"
                placeholder="Phone No"
              />
              <Input
                style={{
                  width: "50px",
                }}
                {...register("email", { required: true })}
                name="email"
                type="text"
                placeholder="Email"
              />
              <Input
                style={{
                  width: "50px",
                }}
                {...register("department", { required: true })}
                name="department"
                type="text"
                placeholder="Department"
              />
              {errors && errors.department && <span>This field is required</span>}
              <Input
                style={{
                  width: "50px",
                }}
                {...register("depunit", { required: true })}
                name="depunit"
                type="text"
                placeholder="Department"
              />
            </form>
            <div className="block">
              <div style={{ display: "flex" }}>
                <GlobalCustomButton
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  style={{
                    backgroundColor: "#48c774",
                    width: "100px",
                    position: "relative",
                    cursor: "pointer",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Save
                </GlobalCustomButton>
  
                <GlobalCustomButton
                  type="submit"
                  onClick={() => setConfirmDialog(true)}
                  style={{
                    backgroundColor: "#f14668",
                    width: "100px",
                    position: "relative",
                    cursor: "pointer",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Delete
                </GlobalCustomButton>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }