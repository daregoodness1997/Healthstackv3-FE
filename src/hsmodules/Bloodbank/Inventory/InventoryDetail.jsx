/* eslint-disable */
import React, { useContext, useEffect } from "react";
import client from "../../../feathers";
import { UserContext, ObjectContext } from "../../../context";
import "react-datepicker/dist/react-datepicker.css";
import Input from "../../../components/inputs/basic/Input";
import { Box } from "@mui/material";
import GlobalCustomButton from "../../../components/buttons/CustomButton";

export default function InventoryDetail({ openModals }) {
  const { state, setState } = useContext(ObjectContext);
  const { user } = useContext(UserContext);
  const Inventory = state.InventoryModule.selectedInventory;

  const getFacilities = async () => {
    const findProductEntry = await client.service("productentry").find({
      query: {
        "productitems.productId": Inventory.productId,
        facility: user.currentEmployee.facilityDetail._id,
        storeId: state.StoreModule.selectedStore._id,
        $limit: 20,
        $sort: {
          createdAt: -1,
        },
      },
    });

    //console.log(findProductEntry)
  };

  useEffect(() => {
    getFacilities();
    return () => {};
  }, [Inventory]);

  const handleEdit = async () => {
    const newInventoryModule = {
      selectedInventory: Inventory,
      show: "modify",
    };
    await setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
    openModals("modify");
  };

  const handleReorder = async () => {
    const newInventoryModule = {
      selectedInventory: Inventory,
      show: "reorder",
    };
    await setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
    openModals("reorder");
  };

  const handleBatch = async () => {
    const newInventoryModule = {
      selectedInventory: Inventory,
      show: "batch",
    };
    await setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
    openModals("batch");
  };

  const handleAudit = async () => {
    const newInventoryModule = {
      selectedInventory: Inventory,
      show: "audit",
    };
    await setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
    openModals("audit");
  };

  return (
    <>
      <Box
        container
        sx={{
          width: "500px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box item mb={2} pt={1}>
          <Input label="Inventory Name" value={Inventory.name} disabled />
        </Box>

        <Box
          item
          mb={3}
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <GlobalCustomButton onClick={handleEdit} sx={{ marginRight: "10px" }}>
            Set Price
          </GlobalCustomButton>

          <GlobalCustomButton
            sx={{
              textTransform: "capitalize",
              background: "#17935C",
              marginRight: "10px",
              "&:hover": {
                backgroundColor: "#17935C",
              },
            }}
            onClick={handleBatch}
          >
            Batches
          </GlobalCustomButton>

          <GlobalCustomButton
            onClick={handleReorder}
            sx={{ marginRight: "10px" }}
          >
            Reorder Level
          </GlobalCustomButton>

          <GlobalCustomButton variant="outlined" onClick={handleAudit}>
            Audit
          </GlobalCustomButton>
        </Box>
      </Box>
    </>
  );
}
