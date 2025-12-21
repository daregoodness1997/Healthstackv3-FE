/* eslint-disable */
import React, { useState, useContext, useEffect } from "react";
import client from "../../../feathers";
import { ObjectContext } from "../../../context";
import "react-datepicker/dist/react-datepicker.css";
import Input from "../../../components/inputs/basic/Input";
import { Box } from "@mui/material";
import GlobalCustomButton from "../../../components/buttons/CustomButton";

export default function InventoryModify({ closeModal }) {
  const { register, handleSubmit, setValue } = useForm();
  const [billservice, setBillService] = useState();
  const { state, setState } = useContext(ObjectContext);
  const billServ = client.service("billing");

  const Inventory = state.InventoryModule.selectedInventory;
  const handleSetPrice = async () => {
    const service = await billServ.get(Inventory.billingId);
    const contractSel = service.contracts.filter(
      (element) =>
        element.source_org === Inventory.facility &&
        element.dest_org === Inventory.facility
    );

    setValue("price", contractSel[0].price, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("oldprice", contractSel[0].price, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setBillService(service);
  };

  useEffect(() => {
    handleSetPrice();

    return () => {};
  }, []);

  const handleCancel = async () => {
    const newInventoryModule = {
      selectedInventory: {},
      show: "details",
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
    const contractSel = billservice.contracts.filter(
      (element) =>
        element.source_org === Inventory.facility &&
        element.dest_org === Inventory.facility
    );
    contractSel[0].price = data.price;
    billServ
      .patch(billservice._id, billservice)
      .then((res) => {
        toast.success("Price updated succesfully");
        changeState();
        closeModal();
      })
      .catch((err) => {
        toast.error(`Error updating Price, probable network issues or ${err}`);
      });
  };

  return (
    <>
      <Box
        container
        sx={{
          width: "500px",
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
          <Typography>
            Set Price for {Inventory.name} per {Inventory.baseunit}
          </Typography>
        </Box>

        <Box item mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Input
                label="New Selling Price"
                register={register("price", { required: true })}
              />
            </Grid>

            <Grid item xs={6}>
              <Input
                label="Old Selling Price"
                register={register("oldprice", {
                  required: true,
                })}
                disabled
              />
            </Grid>
          </Grid>
        </Box>

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
            color="warning"
            onClick={handleCancel}
          >
            Cancel
          </GlobalCustomButton>
        </Box>
      </Box>
    </>
  );
}
