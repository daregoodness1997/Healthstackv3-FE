import { Box } from "@mui/material";
import GlobalCustomButton from "../../../components/buttons/CustomButton";

const OtherNotes = ({ handleNext, register }) => {
  return (
    <div>
      Other Notes
      <Box
        spacing={1}
        sx={{
          display: "flex",
          gap: "1rem",
          position: "right",
          alignContent: "center",
          justifySelf: "right",
        }}
      >
        <GlobalCustomButton
          sx={{ marginTop: "10px", textAlign: "right" }}
          type="button"
          onClick={handleNext}
        >
          Next
        </GlobalCustomButton>
      </Box>
    </div>
  );
};

export default OtherNotes;
