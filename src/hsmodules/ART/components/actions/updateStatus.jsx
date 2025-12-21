import { useForm } from "react-hook-form";
import { ObjectContext } from "../../../../context";
import { useContext } from "react";
import client from "../../../../feathers";
import { Box, Grid } from "@mui/material";
import GlobalCustomButton from "../../../../components/buttons/CustomButton";
import Input from "../../../../components/inputs/basic/Input";
import { toast } from "react-toastify";

export default function UpdateLabRequestStatus({ closeModal }) {
  const { register, handleSubmit, reset } = useForm();
  const { state, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const OrderServ = client.service("order");
  const documentId = state.OrderModule.selectedOrder._id;
  const orders = state.OrderModule.selectedOrder;

  const onSubmit = async (data) => {
    showActionLoader();
    const updateOrderStatus = {
      ...orders,
      order_status: data.order_status,
    };
    try {
      await OrderServ.patch(documentId, updateOrderStatus);
      toast.success("Status updated successfully");
      closeModal();
      reset({
        order_status: "",
      });
    } catch (err) {
      toast.error("Error submitting Status: " + err);
    } finally {
      hideActionLoader();
    }
  };
  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <GlobalCustomButton type="submit" onClick={handleSubmit(onSubmit)}>
          Update status
        </GlobalCustomButton>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Input
            label="Order Status"
            name="order_status"
            register={register("order_status")}
          />
        </Grid>
      </Grid>
    </>
  );
}
