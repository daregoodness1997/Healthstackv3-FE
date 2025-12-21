import { Box, Grid, Typography } from "@mui/material";
import CustomSelect from "../../../components/inputs/basic/Select";
import Input from "../../../components/inputs/basic/Input";
import Icd11Search from "../../helpers/icd11search";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import { useForm } from "react-hook-form";
import { useState } from "react";
import CustomTable from "../../../components/customtable";

const IcdCoding = ({
  reset,
  control,
  handleSubmit,
  handleNext,
  register,
  diagnosis,
  setDiagnosis,
}) => {
  //const { handleSubmit } = useForm();
  const [data, setData] = useState([]);
  const [icd, setIcd] = useState([]);
  const [clear, setClear] = useState(false);

  //console.log(watch());
  const handleGetService = (param) => {
    //console.log(data);
    setIcd(param);
    // setValue("unitprice", data ? data.price : 0);
  };

  const handleAddDiagnosis = (data) => {
    console.log(data, icd);
    const diagnosisData = {
      //   ...data,
      //   ...icd,
      Code: icd.Code,
      "Diagnosis type": data["Diagnosis type"],
      Diagnosis: data.Diagnosis,
      Title: icd.Title,
    };

    setDiagnosis((prev) => [diagnosisData, ...prev]);
    // toast.success("Diagnosis successfully listed.");
    reset({
      type: null,
      diagnosis: null,
      code: "",
      "Diagnosis type": "",
      Diagnosis: "",
    });
    //console.log(diagnosis);
    console.log(data);
  };

  console.log(diagnosis);

  const columnSchema = [
    {
      name: "S/N",
      key: "sn",
      description: "SN",
      selector: (row, i) => i + 1,
      sortable: true,
      inputType: "HIDDEN",
      width: "50px",
    },
    {
      name: "Type",
      key: "sn",
      description: "SN",
      selector: (row, i) => row["Diagnosis type"],
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "Diagnosis",
      key: "sn",
      description: "SN",
      selector: (row, i) => row.Diagnosis,
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "ICD 11 Code",
      key: "sn",
      description: "SN",
      selector: (row, i) => row.Code,
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "ICD11 Diagnosis",
      key: "sn",
      description: "SN",
      selector: (row, i) => row.Title,
      sortable: true,
      inputType: "HIDDEN",
    },
  ];

  return (
    <>
      <Box
        sx={{
          width: "600px",
        }}
      >
        <Grid container spacing={2} mb={2}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <CustomSelect
              important
              label="Diagnosis Type"
              control={control}
              //   register={register("Diagnosis type", {
              //     required: "Please enter Diagnosis",
              //   })}
              name="Diagnosis type"
              options={[
                "Associated diagnosis",
                "Co-morbidity Diagnosis",
                "Principal diagnosis",
                "Provisional Diagnosis",
                "Rule-Out Diagnosis ",
                "Working Diagnosis",
              ]}
            />
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Input
              important
              label="Diagnosis"
              register={register("Diagnosis")}
            />
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Icd11Search getSearchfacility={handleGetService} clear={clear} />
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            marginBottom: "10px",
          }}
        >
          <GlobalCustomButton onClick={handleSubmit(handleAddDiagnosis)}>
            Add
          </GlobalCustomButton>
        </Box>
      </Box>
      <CustomTable
        title={""}
        columns={columnSchema}
        data={diagnosis}
        pointerOnHover
        highlightOnHover
        striped
        progressPending={false}
        CustomEmptyData={
          <Typography sx={{ fontSize: "0.8rem" }}>
            You've not added a Diagnosis yet...
          </Typography>
        }
      />
    </>
  );
};

export default IcdCoding;
