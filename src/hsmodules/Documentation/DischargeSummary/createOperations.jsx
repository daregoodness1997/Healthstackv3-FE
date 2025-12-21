import { Box, Grid } from "@mui/material";
import Input from "../../../components/inputs/basic/Input";
import { useForm } from "react-hook-form";
import GlobalCustomButton from "../../../components/buttons/CustomButton";

const CreateOperations = ({ closeModal, setOperations }) => {
  const { register, handleSubmit, setValue, reset, watch } = useForm();

  const handleOperations = (data) => {
    console.log(data);
    setOperations((prev) => [data, ...prev]);
    reset({
      Operation: "",
      Surgeons: "",
      "Doctor Code Number": "",
    });
    //closeModal();
  };

  return (
    <Box
      sx={{
        width: "500px",
      }}
    >
      <div className="card-content vscrollable">
        <>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Input
                register={register("Operation", {
                  required: {
                    value: true,
                    message: "This field is required",
                  },
                })}
                type="text"
                label="Operation"
              />
            </Grid>

            <Grid item md={6} sm={6} xs={6}>
              <Input
                register={register("Surgeons", {
                  required: {
                    value: true,
                    message: "This field is required",
                  },
                })}
                type="text"
                label="Surgeon"
              />
            </Grid>

            <Grid item md={6} sm={6} xs={6}>
              <Input
                register={register("Doctor Code Number", {
                  required: {
                    value: true,
                    message: "This field is required",
                  },
                })}
                type="number"
                label="Code Number"
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifySelf: "right",
              marginTop: "15px",
              width: "100%",
              gap: 1,
            }}
          >
            <GlobalCustomButton onClick={handleSubmit(handleOperations)}>
              Add
            </GlobalCustomButton>

            <GlobalCustomButton color="error" onClick={closeModal}>
              Cancel
            </GlobalCustomButton>
          </Box>
        </>
      </div>
    </Box>
  );
};

export default CreateOperations;
