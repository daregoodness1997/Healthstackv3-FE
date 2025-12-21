import React, { useState, useContext, useEffect } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import client from "../../feathers";
import { useForm } from "react-hook-form";
//import {useNavigate} from 'react-router-dom'
import { UserContext, ObjectContext } from "../../context";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "react-datepicker/dist/react-datepicker.css";
import ModalBox from "../../components/modal";
import { PageWrapper } from "../../ui/styled/styles";
import { TableMenu } from "../../ui/styled/global";
import FilterMenu from "../../components/utilities/FilterMenu";
import CustomTable from "../../components/customtable";
import EmptyData from "../../components/empty";
import { ExpiredInventoryStoreSchema, InventoryStoreSchema } from "./schema";
import Input from "../../components/inputs/basic/Input";
import { Box, Grid, Typography } from "@mui/material";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import { customStyles } from "../../components/customtable/styles";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import MuiCustomDatePicker from "../../components/inputs/Date/MuiDatePicker";

export default function ProductEntryBatches( { closeModal, productItems,index, updateItems }) {
    const { handleSubmit } = useForm(); //watch, errors,
    const [success, setSuccess] = useState(false);
    const InventoryServ = client.service("inventory");
    //const navigate=useNavigate()
    const { state, setState } = useContext(ObjectContext);
    const [batchNo, setBatchNo] = useState("");
    const [quantity, setQuantity] = useState("");
    const [expirydate, setExpiryDate] = useState("");
    const [productItem, setProductItem] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [packsize, setPacksize] = useState("");
    const [packqtty, setPackqtty] = useState("");
  
    const Inventory =  productItems //state.InventoryModule.selectedInventory;
    console.log(Inventory, index)
  
    useEffect(() => {
        console.log(productItems, index)
      setProductItem(productItems[index].batches); 
      setPacksize(productItems[index].packsize)
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
        packsize,
        packqtty,
        quantity,
      };
      //  await setSuccess(false)
      setProductItem((prevProd) => prevProd.concat(productItemI));
      setBatchNo("");
      setQuantity("");
      setPackqtty("");
     /*  setPacksize(""); */
      setExpiryDate("");
    };
  
    const handleCancel = async () => {
     /*  const newInventoryModule = {
        selectedInventory: {},
        show: "details",
      };
      await setState((prevstate) => ({
        ...prevstate,
        InventoryModule: newInventoryModule,
      })); */
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
  
    const onSubmit = () => {

        productItems[index].batches=productItem
        updateItems(productItems)
        closeModal();

      /*  e.preventDefault();
  
      setSuccess(false);
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
        }); */
    };
  
    const handleBatchdel = (obj, i) => {
      setProductItem((obj) => obj.filter((el, index) => index !== i));
      setConfirmDialog(false);
      //}
    };
    useEffect(()=>{
        setQuantity(packsize*packqtty)
      },[packqtty,packsize])
    
  
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
        name: "Pack Size",
        key: "packsize",
        description: "Base Unit",
        selector: (row) => row.packsize,
        sortable: true,
        required: true,
        inputType: "TEXT",
      },
      {
        name: "Pack Qtty",
        key: "packqtty",
        description: "Base Unit",
        selector: (row) => row.packqtty,
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
          width: "800px",
         /*  maxHeight: "80vh", */
         /*  overflowY: "auto", */
        }}
      >
        <CustomConfirmationDialog
          open={confirmDialog}
          cancelAction={() => setConfirmDialog(false)}
          confirmationAction={handleBatchdel}
          type="danger"
          message="Are you sure you want to delete this batch?"
        />
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
  
          <Box item mb={4}>
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
                <MuiCustomDatePicker
                  label="Expiry Date"
                  value={expirydate}
                  handleChange={(value) => setExpiryDate(value)}
                  format="dd/MM/yyyy"
                  height="1rem"
                />
              </Grid>
              <Grid item lg={2} md={3} sm={2}>
              <Input
                /* ref={register({ required: true })} */
                name="Pack Size"
                value={packsize}
                type="number"
                onChange={(e) => setPacksize(e.target.value)}
                label="Pack Size"
                disabled
              />
            </Grid>
            <Grid item lg={2} md={3} sm={2}>
              <Input
                /* ref={register({ required: true })} */
                name="PackQuantity"
                value={packqtty}
                type="number"
                onChange={(e) =>{ 
                  setPackqtty(e.target.value)
                  /* setQuantity(packsize*packqtty) */
                }}
                label="Pack Quantity"
              />
            </Grid>
              <Grid item xs={4}>
                <Input
                  name="quantity"
                  value={quantity}
                  type="text"
                  onChange={(e) => setQuantity(e.target.value)}
                  label="Unit Quantity"
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
  
        {productItem?.length > 0 && (
            <>
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
       
  
        <Box container>
          <GlobalCustomButton
            sx={{
              marginRight: "15px",
            }}
            onClick={onSubmit}
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
        </>)}
      </Box>
    );
  }