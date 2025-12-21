import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Grid, Stack } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { toast } from "react-toastify";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import CustomTable from "../../../components/customtable";
import ModalBox from "../../../components/modal";
import Input from "../../../components/inputs/basic/Input";
import { FormsHeaderText } from "../../../components/texts";

const FollowUpVisit = ({
  schema,
  initialData = [],
  onDataUpdate,
  inputFields,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit } = useForm();

  const handleShowModal = () => setShowModal(true);
  const handleHideModal = () => setShowModal(false);

  const handleSave = (formData) => {
    onDataUpdate(formData);
    handleHideModal();
    toast.success("Follow-up visit details added successfully");
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        paddingBlock={2}
        spacing={2}
      >
        <FormsHeaderText text="Follow-up Visits" />

        <GlobalCustomButton onClick={handleShowModal}>
          <AddCircleOutline fontSize="small" sx={{ marginRight: "5px" }} />
          Add New Follow-up Visit
        </GlobalCustomButton>
      </Stack>

      <Box>
        <CustomTable
          title="Follow-up Visits"
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
        header="Add New Follow-up Visit"
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
            {inputFields?.map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Input
                  register={register(field.name, {
                    required: field.required || false,
                  })}
                  name={field.name}
                  label={field.label}
                  type={field.type}
                />
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormsHeaderText text="Getational Age By" />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="L.M.P"
                name="lmp"
                type="date"
                register={register("lmp")}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="Fundal Height"
                name="fundal_height"
                register={register("fundal_height")}
              />
            </Grid>
            <Grid item xs={6}>
              <Input label="Scan" name="scan" register={register("scan")} />
            </Grid>
          </Grid>
        </Box>
      </ModalBox>
    </>
  );
};

export default FollowUpVisit;
