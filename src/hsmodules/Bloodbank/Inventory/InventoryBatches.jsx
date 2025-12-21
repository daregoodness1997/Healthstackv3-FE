/* eslint-disable */
import React, { useState, useContext, useEffect } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import client from "../../../feathers";
import { useForm } from "react-hook-form";
import { ObjectContext } from "../../../context";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import CustomTable from "../../../components/customtable";
import Input from "../../../components/inputs/basic/Input";
import { Box, Grid, Typography } from "@mui/material";
import GlobalCustomButton from "../../../components/buttons/CustomButton";

export default function InventoryBatches({ closeModal }) {
  const { handleSubmit } = useForm();
  const InventoryServ = client.service("inventory");
  const { state, setState } = useContext(ObjectContext);
  const [batchNo, setBatchNo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expirydate, setExpiryDate] = useState("");
  const [productItem, setProductItem] = useState([]);

  const Inventory = state.InventoryModule.selectedInventory;

  useEffect(() => {
    setProductItem(Inventory.batches);
    return () => {};
  }, []);

  const handleClickProd = async () => {
    if (!batchNo || !quantity || !expirydate) {
      toast({
        message: "Kindly enter Batch Number,expiry date and quantity",
        type: "is-danger",
        dismissible: true,
        pauseOnHover: true,
      });
      return;
    }
    let productItemI = {
      batchNo,
      expirydate,
      quantity,
    };
    setProductItem((prevProd) => prevProd.concat(productItemI));
    setBatchNo("");
    setQuantity("");
    setExpiryDate("");
  };

  const handleCancel = async () => {
    const newInventoryModule = {
      selectedInventory: {},
      show: "details",
    };
    await setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
    ////console.log(state)
    closeModal();
  };

  const changeState = () => {
    const newInventoryModule = {
      selectedInventory: {},
      show: "details",
    };
    setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
  };

  const onSubmit = (data, e) => {
    e.preventDefault();

    InventoryServ.patch(Inventory._id, {
      batches: productItem,
    })
      .then((res) => {
        toast.success("Batch updated succesfully");

        changeState();
        closeModal();
      })
      .catch((err) => {
        toast.error(`Error updating Batch, probable network issues or ${err}`);
      });
  };

  const handleBatchdel = (obj, i) => {
    let confirm = window.confirm("Are you sure you want to delete this batch?");
    if (confirm) {
      setProductItem((obj) => obj.filter((el, index) => index !== i));
    }
  };

  const DatePickerCustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <div
      onClick={onClick}
      ref={ref}
      style={{
        width: "100%",
        height: "40px",
        border: "1.5px solid #BBBBBB",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        fontSize: "0.85rem",
        padding: "0 15px",
        color: "#000000",
        backgroundColor: "#fff",
        cursor: "pointer",
      }}
    >
      {value === "" ? "Pick Date" : value}
    </div>
  ));

  const batchesSchema = [
    {
      name: "S/NO",
      width: "70px",
      key: "sn",
      description: "Enter name of Disease",
      selector: (row, i) => i + 1,
      sortable: true,
      required: true,
      inputType: "HIDDEN",
    },
    {
      name: "Batch",
      key: "batchNo",
      description: "Enter Batch",
      selector: (row) => row.batchNo,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Quantity",
      key: "quantity",
      description: "Enter Quantity",
      selector: (row) => row.quantity,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Expiry Date",
      style: (row) => ({ color: row.expiry && "#ffffff" }),
      key: "expirydate",
      description: "Enter Date",
      selector: (row) =>
        row.expirydate
          ? format(new Date(row.expirydate), "dd-MM-yy")
          : "--------",
      sortable: true,
      required: true,
      inputType: "DATE",
    },
    {
      name: "Actions",
      key: "category",
      description: "Enter Category",
      selector: (row, i) => (
        <span
          style={{ color: "red", fontSize: "inherit" }}
          onClick={() => handleBatchdel(row, i)}
        >
          delete
        </span>
      ),
      sortable: true,
      required: true,
      inputType: "BUTTON",
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.expiry,
      style: {
        backgroundColor: "pink",
        color: "#ffffff !important",
      },
    },
  ];

  return (
    <Box
      container
      sx={{
        width: "600px",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <Box
        container
        sx={{
          width: "100%",
        }}
      >
        <Box
          item
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          mb={1}
        >
          <Typography
            sx={{
              fontSize: ".9rem",
            }}
          >
            Batches for {Inventory.name}
          </Typography>
          <GlobalCustomButton onClick={handleClickProd}>
            <AddCircleOutlineIcon
              sx={{ marginRight: "5px" }}
              fontSize="small"
            />
            Add
          </GlobalCustomButton>
        </Box>

        <Box item mb={2}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Input
                name="batchNo"
                value={batchNo}
                type="text"
                onChange={(e) => setBatchNo(e.target.value)}
                label="Batch Number"
              />
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                selected={expirydate}
                onChange={(date) => setExpiryDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Expiry Date"
                customInput={<DatePickerCustomInput />}
                wrapperClassName="date-picker-custom-style"
              />
            </Grid>
            <Grid item xs={4}>
              <Input
                name="quantity"
                value={quantity}
                type="text"
                onChange={(e) => setQuantity(e.target.value)}
                label="Quantity"
              />
            </Grid>
          </Grid>
        </Box>
      </Box>

      {productItem.length > 0 && (
        <Box
          sx={{
            width: "100%",
            overflowY: "auto",
          }}
          mb={2}
        >
          <CustomTable
            title={""}
            columns={batchesSchema}
            data={productItem}
            pointerOnHover
            highlightOnHover
            striped
            onRowClicked={(row, i) => onRowClicked(row, i)}
            progressPending={false}
            conditionalRowStyles={conditionalRowStyles}
          />
        </Box>
      )}

      <Box container>
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
  );
}
