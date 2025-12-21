import { Box, Grid, Stack } from "@mui/material";
import React from "react";
import { FormsHeaderText } from "../../../components/texts";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import Input from "../../../components/inputs/basic/Input";
import Textarea from "../../../components/inputs/basic/Textarea";
import { useForm } from "react-hook-form";
import CustomTable from "../../../components/customtable";
import { AddCircleOutline } from "@mui/icons-material";
import ModalBox from "../../../components/modal";
import { useState } from "react";
import { toast } from "react-toastify";

export default function BloodFlow({ schema, initialData = [], onDataUpdate }) {
  const { register, handleSubmit } = useForm();
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleHideModal = () => setShowModal(false);

  const handleSave = (formData) => {
    onDataUpdate(formData);
    handleHideModal();
    toast.success("Blood flow added successfully");
  };
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        paddingBlock={2}
        spacing={2}
      >
        <FormsHeaderText text="Blood Flow Information" />

        <GlobalCustomButton onClick={handleShowModal}>
          <AddCircleOutline fontSize="small" sx={{ marginRight: "5px" }} />
          Add Blood Flow
        </GlobalCustomButton>
      </Stack>
      <Box>
        <CustomTable
          title=""
          columns={schema}
          data={initialData}
          pointerOnHover
          highlightOnHover
          striped
        />
      </Box>
      <ModalBox
        open={showModal}
        onClose={handleHideModal}
        header="Add New Blood Flow"
        width="60%"
      >
        <Box sx={{ width: "100%" }}>
          <Box
            mt={2}
            sx={{ display: "flex", justifyContent: "flex-end", py: "10px" }}
          >
            <GlobalCustomButton onClick={handleSubmit(handleSave)}>
              Save
            </GlobalCustomButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Input
                label="Blood Flow"
                name="bloodFlow"
                type="text"
                register={register("bloodFlow")}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="VP"
                name="vp"
                type="text"
                register={register("vp")}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="AP"
                name="ap"
                type="text"
                register={register("ap")}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="UFR"
                name="ufr"
                type="text"
                register={register("ufr")}
              />
            </Grid>

            <Grid item xs={6}>
              <Input
                label="Heparin"
                name="heparin"
                type="text"
                register={register("heparin")}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="BP"
                name="bp"
                type="text"
                register={register("bp")}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="Fluid Loss"
                name="fluidLoss"
                type="text"
                register={register("fluidLoss")}
              />
            </Grid>

            <Grid item xs={12}>
              <Textarea
                label="Remarks"
                name="remarks"
                type="text"
                multiline
                rows={4}
                register={register("remarks")}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                label="Nurse Signature"
                name="nurseSignature"
                type="text"
                register={register("nurseSignature")}
              />
            </Grid>
          </Grid>
        </Box>
      </ModalBox>
    </Box>
  );
}
