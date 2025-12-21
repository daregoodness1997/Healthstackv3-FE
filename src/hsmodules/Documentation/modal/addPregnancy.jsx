import { Box, Grid, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormsHeaderText } from "../../../components/texts";
import Input from "../../../components/inputs/basic/Input";
import { toast } from "react-toastify";
import { useState } from "react";
import CustomTable from "../../../components/customtable";
import ModalBox from "../../../components/modal";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import { AddCircleOutline } from "@mui/icons-material";

const PregnancyDetails = ({
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

    toast.success("Pregnancy details added successfully");
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        paddingBlock={2}
        spacing={2}
      >
        <FormsHeaderText text="Birth Info" />

        <GlobalCustomButton onClick={handleShowModal}>
          <AddCircleOutline fontSize="small" sx={{ marginRight: "5px" }} />
          Add Birth Info
        </GlobalCustomButton>
      </Stack>

      <Box>
        <CustomTable
          title="Pregnancy Details"
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
        header="Add New Pregnancy Detail"
        width="60%"
      >
        <Box sx={{ width: "100%" }}>
          <Box
            mt={2}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              py: "10px",
            }}
          >
            <GlobalCustomButton onClick={handleSubmit(handleSave)}>
              Save
            </GlobalCustomButton>
          </Box>
          <Grid container spacing={2}>
            {inputFields?.map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Input
                  register={register(field.name, { required: true })}
                  name={field.name}
                  label={field.label}
                  type={field.type}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </ModalBox>
    </>
  );
};

export default PregnancyDetails;
