/* eslint-disable */
import React, { useContext, useEffect } from "react";
import client from "../../../feathers";
import { useForm } from "react-hook-form";
import { ObjectContext } from "../../../context";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import Input from "../../../components/inputs/basic/Input";
import { Box, Grid, Typography } from "@mui/material";
import GlobalCustomButton from "../../../components/buttons/CustomButton";

export default function InventoryReorder({ closeModal }) {
  const { register, handleSubmit, setValue } = useForm();
  const InventoryServ = client.service("inventory");
  const { state, setState } = useContext(ObjectContext);
  const Inventory = state.InventoryModule.selectedInventory;

  useEffect(() => {
    setValue("reorder_level", Inventory.reorder_level, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("oldlevel", Inventory.reorder_level, {
      shouldValidate: true,
      shouldDirty: true,
    });

    return () => {};
  }, []);

  const handleCancel = async () => {
    const newInventoryModule = {
      selectedInventory: {},
      show: "detail",
    };
    await setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
    closeModal();
  };

  const changeState = () => {
    const newInventoryModule = {
      selectedInventory: {},
      show: "detail",
    };
    setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
  };

  const onSubmit = (data, e) => {
    e.preventDefault();
    InventoryServ.patch(Inventory._id, {
      reorder_level: data.reorder_level,
    })
      .then(() => {
        toast.success("Reorder level updated succesfully");
        changeState();
        closeModal();
      })
      .catch((err) => {
        toast.error(
          `Error updating Reorder level, probable network issues or  ${err}`
        );
      });
  };

  return (
    <>
      <Box
        container
        sx={{
          width: "550px",
        }}
      >
        <Box
          item
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          mb={3}
        >
          <Typography>Set ReOrder Level for {Inventory.name}</Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box item mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Input
                  register={register("reorder_level", {
                    required: true,
                  })}
                  name="reorder_level"
                  type="text"
                  label="New Reorder Level"
                />
              </Grid>

              <Grid item xs={6}>
                <Input
                  register={register("oldlevel")}
                  disabled
                  name="oldlevel"
                  type="text"
                  label="Old Reorder Level"
                />
              </Grid>
            </Grid>
          </Box>
        </form>

        <Box
          sx={{
            display: "flex",
          }}
        >
          <GlobalCustomButton
            sx={{
              marginRight: "15px",
            }}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </GlobalCustomButton>

          <GlobalCustomButton
            variant="outlined"
            onClick={handleCancel}
            color="warning"
          >
            Cancel
          </GlobalCustomButton>
        </Box>
      </Box>
    </>
  );
}
