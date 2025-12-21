import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import Input from "../../../components/inputs/basic/Input";
import client from "../../../feathers";
import {
    BottomWrapper,
    GrayWrapper
  } from "../../app/styles";
  import { HeadWrapper } from "../../app/styles";

export function LocationModify() {
    const { register, handleSubmit, setValue, reset } = useForm();
    const LocationServ = client.service("location");
    const { state, setState } = useContext(ObjectContext);
    const Location = state.LocationModule.selectedLocation;
  
    useEffect(() => {
      setValue("name", Location.name, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("locationType", Location.locationType, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("branch", Location.branch, {
        shouldValidate: true,
        shouldDirty: true,
      });
      return () => {};
    }, []);
  
    const handleCancel = async () => {
      const newLocationModule = {
        selectedLocation: {},
        show: "create",
      };
      await setState((prevstate) => ({
        ...prevstate,
        LocationModule: newLocationModule,
      }));
    };
  
    const changeState = () => {
      const newLocationModule = {
        selectedLocation: {},
        show: "create",
      };
      setState((prevstate) => ({
        ...prevstate,
        LocationModule: newLocationModule,
      }));
    };
    const handleDelete = async () => {
      let conf = window.confirm("Are you sure you want to delete this data?");
  
      const dleteId = Location._id;
      if (conf) {
        LocationServ.remove(dleteId)
          .then(() => {
            reset();
            toast({
              message: "Location deleted succesfully",
              type: "is-success",
              dismissible: true,
              pauseOnHover: true,
            });
            changeState();
          })
          .catch((err) => {
            toast({
              message:
                "Error deleting Location, probable network issues or " + err,
              type: "is-danger",
              dismissible: true,
              pauseOnHover: true,
            });
          });
      }
    };
  
    const onSubmit = (data, e) => {
      e.preventDefault();
      data.facility = Location.facility;
      LocationServ.patch(Location._id, data)
        .then(() => {
          toast({
            message: "Location updated succesfully",
            type: "is-success",
            dismissible: true,
            pauseOnHover: true,
          });
  
          changeState();
        })
        .catch((err) => {
          toast({
            message: "Error updating Location, probable network issues or " + err,
            type: "is-danger",
            dismissible: true,
            pauseOnHover: true,
          });
        });
    };
  
    return (
      <>
        <GrayWrapper>
          <HeadWrapper>
            <p className="card-header-title">Location Details-Modify</p>
          </HeadWrapper>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("name", { required: true })}
              name="name"
              type="text"
              label="Name"
              placeholder="Name"
            />
  
            <Input
              {...register("locationType", { required: true })}
              name="locationType"
              type="text"
              label="Location Type"
              placeholder="Location Type"
            />
            <Input
              {...register("branch")}
              name="branch"
              type="text"
              label="Branch"
              placeholder="Branch"
            />
          </form>
          <BottomWrapper>
            <GlobalCustomButton type="submit" onClick={handleSubmit}>
              {" "}
              <CheckIcon fontSize="small" sx={{ marginRight: "5px" }} />
              Save
            </GlobalCustomButton>
  
            <GlobalCustomButton type="submit" onClick={handleCancel}>
              <CloseIcon fontSize="small" sx={{ marginRight: "5px" }} />
              Cancel
            </GlobalCustomButton>
  
            <GlobalCustomButton type="submit" onClick={handleDelete}>
              <DeleteIcon fontSize="small" sx={{ marginRight: "5px" }} />
              Delete
            </GlobalCustomButton>
          </BottomWrapper>
        </GrayWrapper>
      </>
    );
  }