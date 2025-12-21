/* eslint-disable */
import React, { useState, useContext, useEffect } from 'react';
import client from '../../feathers';
import { format, formatDistanceToNowStrict } from 'date-fns';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { UserContext, ObjectContext } from '../../context';
import { toast } from 'react-toastify';
import Input from '../../components/inputs/basic/Input';
import { PageWrapper } from '../../ui/styled/styles';
import { TableMenu } from '../../ui/styled/global';
import FilterMenu from '../../components/utilities/FilterMenu';
import CustomTable from '../../components/customtable';
import 'react-datepicker/dist/react-datepicker.css';
import ModalBox from '../../components/modal';
import TextField from '@mui/material/TextField';
//import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

const useStyles = makeStyles({
  root: {
    width: 12,
    height: 12,
    paddingTop: 0,
    paddingBottom: 0,
  },
  label: {
    fontSize: 12,
  },
});

// const filter = createFilterOptions();
import { Box, Grid, Button as MuiButton } from '@mui/material';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import { FormsHeaderText } from '../../components/texts';
import CustomConfirmationDialog from '../../components/confirm-dialog/confirm-dialog';
import { makeStyles } from '@mui/styles';
import MuiCustomDatePicker from '../../components/inputs/Date/MuiDatePicker';
import { ClientSearch } from '../helpers/ClientSearch';

function validateReportObjectFields(obj) {
  // Check if the input is actually an object
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('Input must be a non-null object');
  }

  // Iterate through all keys in the object
  for (const key in obj) {
    // Check if the current field is an own property of the object
    if (obj.hasOwnProperty(key)) {
      // Check if the value is a string and is empty
      if (typeof obj[key] === 'string' && obj[key].trim() === '') {
        return {
          isValid: false,
          emptyField: key,
        };
      }
    }
  }

  // If no empty strings found, return true
  return {
    isValid: true,
  };
}

//export default function ProductEntry() {
export default function Pharmacovigilance() {
  const { state } = useContext(ObjectContext); //,setState
  const [createModal, setCreateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);

  const PharmacovigilanceData =
    state.PharmacovigilanceModule.selectedPharmacovigilanceList;
  const handleOpenCreateModal = () => {
    setCreateModal(true);
  };
  const handleCloseCreateModal = () => {
    setCreateModal(false);
  };

  const handleOpenDetailModal = () => {
    setDetailModal(true);
  };
  const handleCloseDetailModal = () => {
    setDetailModal(false);
  };

  return (
    <section className="section remPadTop">
      <PharmacovigilanceList
        openCreateModal={handleOpenCreateModal}
        openDetailModal={handleOpenDetailModal}
      />

      <ModalBox
        open={createModal}
        onClose={handleCloseCreateModal}
        header="Adverse Drug Reaction(ADR)"
      >
        <CreatePharmacovigilance closeModal={handleCloseCreateModal} />
      </ModalBox>

      <ModalBox
        open={detailModal}
        onClose={handleCloseDetailModal}
        header="Adverse Drug Reaction (ADR) Details"
      >
        {/* <PharmacovigilanceDetail openModifyModal={handleOpenModifyModal} /> */}
        <PharmacovigilanceDetails
          closeModal={handleCloseDetailModal}
          DetailEntry={PharmacovigilanceData}
        />
      </ModalBox>
    </section>
  );
}

export function CreatePharmacovigilance({ closeModal }) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const PharmacovigServ = client.service('pharmacovig');
  const { user } = useContext(UserContext);
  const [productItem, setProductItem] = useState([]);
  const [pharmacovigilanceItem, setPharmacovigilanceItem] = useState([]);

  const { state, hideActionLoader } = useContext(ObjectContext);
  const [confirmDialog, setConfirmDialog] = useState(false);

  // Concomitant Medicine
  const [concomitantName, setConcomitantName] = useState('');
  const [concomitantDosage, setConcomitantDosage] = useState('');
  const [concomitantRoute, setConcomitantRoute] = useState('');
  const [concomitantStartDate, setConcomitantStartDate] = useState(null);
  const [concomitantEndDate, setConcomitantEndDate] = useState(null);
  const [reasonForUse, setReasonForUse] = useState('');

  const [suspectedDrugs, setSuspectedDrugs] = useState([]);
  const [concomitantMedicines, setConcomitantMedicines] = useState([]);
  const [patient, setPatient] = useState(null);

  const initialState = {
    clientName: '',
    mrn: '',
    age: '',
    sex: '',
    weight: '',
    descriptionRxn: '',
    dateStartRxn: '',
    dateStopRxn: '',
    outcome: [],
    others: '',
    admitted: '',
    prolonged: '',
    admissionDuration: '',
    treatment: '',
    brandName: '',
    generic: '',
    bacthNo: '',
    nafdacNo: '',
    expirydate: '',
    manufName: '',
    indication: '',
    dosage: '',
    route: '',
    dateStartDrug: '',
    dateStopDrug: '',
    // reporterName: "",
    // profession: "",
    // date: "",
  };

  const [objectState, setObjectState] = useState(initialState);

  const [reportState, setReportState] = useState({
    reporterName: 'Dr. Smith',
    profession: 'Physician',
    date: '',
  });

  const drugReactionData = {
    facilityId: user.currentEmployee.facilityDetail._id,
    facilityname: user.currentEmployee.facilityDetail.facilityName,
    facilityAddress: user.currentEmployee.facilityDetail.facilityAddress,
    telephone: user.currentEmployee.facilityDetail.facilityContactPhone,
    email: user.currentEmployee.facilityDetail.facilityEmail,
    org_storeId: state.employeeLocation.locationId,
    ...objectState,
    createdby: user._id,
  };

  const classes = useStyles();
  const customRadio = <Radio size="small" classes={{ root: classes.root }} />;

  function checkObjectValues(obj) {
    const emptyFields = Object.keys(obj).filter(
      (key) =>
        obj[key] === '' || obj[key] === null || obj[key].toString() === '',
    );
    console.log(emptyFields);
    if (emptyFields.length === 0) {
      return;
    }

    let errorMessage = '';
    switch (emptyFields.length) {
      case 1:
        errorMessage = `${emptyFields[0]} is required.`;
        break;
      case 2:
        errorMessage = `${emptyFields[0]} and ${emptyFields[1]} are required.`;
        break;
      case 3:
        errorMessage = `${emptyFields[0]}, ${emptyFields[1]}, and ${emptyFields[2]} are required.`;
        break;
      default:
        errorMessage = 'Please fill in all required fields.';
    }

    toast.error(errorMessage);
    return false;
  }

  const concomitantDrugReactionData = {
    name: concomitantName,
    dosage: concomitantDosage,
    route: concomitantRoute,
    dateStartDrug: concomitantStartDate,
    dateStopDrug: concomitantEndDate,
    reason: reasonForUse,
  };

  const addSuspectedDrugs = async () => {
    if (checkObjectValues(drugReactionData) !== undefined) {
      return; // Return if there are empty fields in the formData object
    }
    setSuspectedDrugs([drugReactionData]);
    setObjectState(initialState);
    setSuccess(true);
  };

  const addConcomitantDrug = async () => {
    if (checkObjectValues(concomitantDrugReactionData) !== undefined) {
      return; // Return if there are empty fields in the formData object
    }

    setConcomitantMedicines((prevProd) => {
      const existingItemIndex = prevProd.findIndex(
        (item) =>
          item.name === concomitantName &&
          item.dosage === concomitantDosage &&
          item.route === concomitantRoute &&
          item.dateStartDrug === concomitantStartDate &&
          item.dateStopDrug === concomitantEndDate &&
          item.reason === reasonForUse,
      );
      if (existingItemIndex === -1) {
        // Item doesn't exist, safe to add
        return [...prevProd, concomitantDrugReactionData];
      } else {
        return [...prevProd];
      }
    });

    //console.log(concomitantMedicines);

    setConcomitantDosage('');
    setConcomitantEndDate('');
    setConcomitantName('');
    setConcomitantStartDate('');
    setConcomitantRoute('');
    setReasonForUse('');

    setSuccess(true);
  };

  //console.log(concomitantMedicines);

  const resetform = () => {
    setObjectState(initialState);
    setPharmacovigilanceItem([]);
  };

  const handleForm = (e) => {
    setObjectState({
      ...objectState,
      [e.target.name]: e.target.value,
    });
  };

  const handleReportForm = (e) => {
    setReportState({
      ...reportState,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheck = (e, outcome) => {
    if (e.target.checked) {
      setObjectState((objectState) => ({
        ...objectState,
        outcome: [...objectState.outcome, e.target.value],
      }));
    } else {
      const indexToRemove = outcome?.indexOf(e.target.value);
      setObjectState((prevState) => ({
        ...prevState,
        outcome: prevState.outcome.filter(
          (_, index) => index !== indexToRemove,
        ),
      }));
    }
  };

  const handleGetPatient = (patient) => {
    setPatient(patient);
    setObjectState({
      ...objectState,
      clientName: `${patient.firstname} ${patient.middlename} ${patient.lastname}`,
      mrn: patient.mrn !== '' ? patient.mrn : 'Not Available',
      sex: patient.gender !== '' ? patient.gender : 'Not Available',
      age: patient.dob ? formatDistanceToNowStrict(new Date(patient.dob)) : '',
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setSuccess(false);

    //console.log(pharmacovigilanceItem);
    let transferEntry = {
      ...pharmacovigilanceItem[0],
      clientId: state.ClientModule.selectedClient._id,
    };

    //console.log(transferEntry);
    let action = {
      actorname: user.firstname + ' ' + user.lastname,
      actorId: user._id,
      action: 'Created Transfer',
      description: '',
      comments: '',
      createdat: transferEntry.org_date,
    };
    transferEntry.action_hx = [];
    transferEntry.action_hx.push(action);

    PharmacovigServ.create(transferEntry)
      .then(async (res) => {
        //console.log(res);
        hideActionLoader();
        resetform();
        toast.success('Drug Reaction Data Successfully Created');
        setConfirmDialog(false);
        setPharmacovigilanceItem([]);
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        hideActionLoader();
        toast.error('Error creating data' + err);
        setConfirmDialog(false);
      });
  };

  const removeConcomitantEntity = (entity, i) => {
    setConcomitantMedicines((prev) => prev.filter((obj, index) => index !== i));
    //console.log(entity);
  };

  const AdverseDrugCreateSchema = [
    {
      name: 'S/N',
      key: 'sn',
      width: '100px',
      center: true,
      description: 'SN',
      selector: (row) => row.sn,
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'Brand Name',
      key: 'brandName',
      description: 'Enter BrandName',
      selector: (row) => row.brandName,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Generic Name',
      key: 'genericName',
      description: 'Enter Generic Name',
      selector: (row) => row.generic,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Batch No.',
      key: 'batchNumber',
      description: 'Enter Batch No.',
      selector: (row) => row.bacthNo,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'NAFDAC No.',
      key: 'nafdacNumber',
      description: 'Enter NAFDAC No.',
      selector: (row) => row.nafdacNo,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Manufacturer',
      key: 'Manufacturer',
      description: 'Enter Manufacturer',
      selector: (row) => row.manufName,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Indication',
      key: 'indication',
      description: 'Enter Indication',
      selector: (row) => row.indication,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Dosage',
      key: 'dosage',
      description: 'Enter Dosage',
      selector: (row) => row.dosage,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Route',
      key: 'route',
      description: 'Enter Route',
      selector: (row) => row.route,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Start Date',
      key: 'start date',
      description: 'Enter Start Date',

      selector: (row) =>
        row.dateStartRxn ? format(new Date(row.dateStartRxn), 'dd-MM-yy') : '',
      sortable: true,
      required: true,
      inputType: 'TEXT',
      center: true,
    },

    {
      name: 'End Date',
      key: 'end date',
      description: 'Enter End Date',
      selector: (row) =>
        row.dateStopRxn ? format(new Date(row.dateStopRxn), 'dd-MM-yy') : '',
      sortable: true,
      required: true,
      inputType: 'TEXT',
      center: true,
    },
  ];

  const concomitantMedicineSchema = [
    {
      name: 'S/N',
      key: 'sn',
      width: '100px',
      center: true,
      description: 'SN',
      selector: (row) => row.sn,
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'Drug Name',
      key: 'drugName',
      description: 'Enter Drug Name',
      selector: (row) => row.name,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Dosage',
      key: 'dosage',
      description: 'Enter Dosage',
      selector: (row) => row.dosage,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Route',
      key: 'route',
      description: 'Enter Route',
      selector: (row) => row.route,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Start Date',
      key: 'start date',
      description: 'Enter Start Date',
      selector: (row) =>
        row.dateStartDrug
          ? format(new Date(row.dateStartDrug), 'dd-MM-yy')
          : '',
      sortable: true,
      required: true,
      inputType: 'TEXT',
      center: true,
    },

    {
      name: 'End Date',
      key: 'end date',
      description: 'Enter End Date',
      selector: (row) =>
        row.dateStopDrug ? format(new Date(row.dateStopDrug), 'dd-MM-yy') : '',
      sortable: true,
      required: true,
      inputType: 'TEXT',
      center: true,
    },

    {
      name: 'Reason for use',
      key: 'route',
      description: 'Enter Route',
      selector: (row) => row.reason,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Actions',
      key: 'costprice',
      width: '70px',
      description: 'costprice',
      selector: (row, i) => (
        <IconButton
          size="small"
          onClick={() => removeConcomitantEntity(row, i)}
        >
          <DeleteOutlineIcon fontSize="small" sx={{ color: 'red' }} />
        </IconButton>
      ),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
  ];

  const {
    clientName,
    mrn,
    age,
    sex,
    weight,
    // Reaction details
    descriptionRxn,
    dateStartRxn,
    dateStopRxn,
    outcome,

    others,
    admitted,
    prolonged,
    admissionDuration,
    treatment,

    // Medication details
    brandName,
    generic,
    bacthNo,
    nafdacNo,
    expirydate,
    manufName,
    indication,
    dosage,
    route,
    dateStartDrug,
    dateStopDrug,
  } = objectState;

  const { reporterName, profession, date } = reportState;

  // console.log(validateReportObjectFields(reportState));
  // console.log(reportState);

  return (
    <Box
      sx={{
        width: '80vw',
        maxHeight: '85vh',
        overflowY: 'auto',
        paddingRight: ' 20px',
      }}
    >
      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={() => setConfirmDialog(false)}
        type="create"
        confirmationAction={onSubmit}
      />
      <Grid containe spacing={1}>
        <Grid item lg={12} md={12} sm={12}>
          <Box mb={1} sx={{ height: '40px' }}>
            {/* <FormsHeaderText text="Requisition Detail" /> */}
            <FormsHeaderText text="Patient Information" />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={4} sm={4} xs={6}>
              <ClientSearch
                getSearchfacility={handleGetPatient}
                id={patient?._id}
                value={clientName}
              />
            </Grid>

            <Grid item md={4} sm={4} xs={6}>
              <Input
                value={age}
                name="age"
                type="text"
                placeholder={'age'}
                onChange={handleForm}
                disabled
                label=" Age/D.O.B"
              />
            </Grid>

            <Grid item md={4} sm={4} xs={6}>
              <Input
                value={mrn}
                name="mrn"
                type="text"
                onChange={handleForm}
                placeholder={'patient number'}
                disabled
                label=" Patient No."
              />
            </Grid>

            <Grid item md={4} sm={4} xs={6}>
              <Input
                value={sex}
                name="sex"
                type="text"
                placeholder={'gender...'}
                disabled
                onChange={handleForm}
                label=" Gender"
              />
            </Grid>
            <Grid item md={4} sm={4} xs={6}>
              <Input
                value={weight}
                name="weight"
                type="text"
                placeholder={'Weight'}
                onChange={handleForm}
                label=" Weight"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item lg={12} md={12} sm={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '40px',
            }}
            mt={1}
          >
            <FormsHeaderText text="Adverse Drug Reaction (ADR) Details" />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '40px',
            }}
            mb={1}
          >
            <FormsHeaderText
              text="A. Reaction Details"
              textTransform="Capitalize"
              color="black"
            />
          </Box>
          <Grid container spacing={1}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextField
                sx={{ width: '100%' }}
                id="outlined-multiline-static"
                label="Reaction Description"
                name="descriptionRxn"
                multiline
                rows={3}
                value={descriptionRxn}
                onChange={handleForm}
              />
            </Grid>

            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Input
                value={dateStartRxn}
                type={'date'}
                onChange={(e) => {
                  setObjectState({
                    ...objectState,
                    dateStartRxn: e.target.value,
                  });
                  //console.log();
                }}
                format="dd/MM/yyyy"
                label="Date Reaction Started"
                name="dateStartRxn"
              />
            </Grid>

            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Input
                value={dateStopRxn}
                type={'date'}
                onChange={(e) => {
                  setObjectState({
                    ...objectState,
                    dateStopRxn: e.target.value,
                  });
                  //console.log();
                }}
                format="dd/MM/yyyy"
                label="Date Reaction Stopped"
                name="dateStopRxn"
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '40px',
                }}
                mb={1}
              >
                <FormsHeaderText
                  text="B. Admission Details"
                  textTransform="Capitalize"
                  color="black"
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '20px 0px',
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    width: '55%',
                  }}
                >
                  <Typography fontSize={'15px'}>
                    Was patient admitted due to ADR?
                  </Typography>
                </Box>

                <RadioGroup
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-evenly',
                  }}
                  row
                  name="admitted"
                  value={admitted}
                  onChange={handleForm}
                >
                  <Box>
                    <FormControlLabel
                      classes={{ label: classes.label }}
                      sx={{ fontSize: 'small' }}
                      value="yes"
                      //checked={false}
                      control={customRadio}
                      label="Yes"
                    />
                  </Box>
                  <Box>
                    <FormControlLabel
                      classes={{ label: classes.label }}
                      sx={{ fontSize: 'small' }}
                      value="no"
                      control={customRadio}
                      //checked={true}
                      label="No"
                    />
                  </Box>
                </RadioGroup>
              </Box>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '20px 0px',
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    width: '55%',
                  }}
                >
                  <Typography fontSize={'15px'}>
                    if already hospitalized, was it prolonged due to ADR:
                  </Typography>
                </Box>
                <RadioGroup
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-evenly',
                  }}
                  row
                  name="prolonged"
                  value={prolonged}
                  onChange={handleForm}
                >
                  <Box>
                    <FormControlLabel
                      classes={{ label: classes.label }}
                      sx={{ fontSize: 'small' }}
                      value="yes"
                      //checked={false}
                      control={customRadio}
                      label="Yes"
                    />
                  </Box>
                  <Box>
                    <FormControlLabel
                      classes={{ label: classes.label }}
                      sx={{ fontSize: 'small' }}
                      value="no"
                      control={customRadio}
                      //checked={true}
                      label="No"
                    />
                  </Box>
                </RadioGroup>
              </Box>
            </Grid>

            {/* <Grid container spacing={2}> */}
            <Grid
              sx={{
                marginTop: '10px',
              }}
              item
              md={12}
              sm={12}
              xs={12}
            >
              <Input
                value={admissionDuration}
                name="admissionDuration"
                type="text"
                onChange={handleForm}
                label="Duration of Hospitalization "
              />
            </Grid>
            {/* </Grid> */}

            <Grid item md={12} sm={12} xs={12}>
              <TextField
                sx={{ width: '100%' }}
                id="outlined-multiline-static"
                value={treatment}
                name="treatment"
                onChange={handleForm}
                label="Treatment of Reaction"
                multiline
                rows={5}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Treatment outcome */}

        <Grid
          sx={{
            marginBottom: '20px',
          }}
          md={6}
          sm={6}
          xs={12}
          item
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',

              // height: "40px",

              width: '60%',
            }}
            mb={1}
            mt={3}
          >
            <FormsHeaderText
              textTransform="Capitalize"
              text=" C. Outcome Of Reaction"
              color="black"
            />

            <FormsHeaderText
              textTransform="Capitalize"
              text="  (check  as appropriate)"
              color="black"
              fontWeight="500"
            />
          </Box>

          <Grid container spacing={1}>
            <Grid item lg={4} md={4} sm={4} xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={outcome}
                    value="Recover Fully"
                    onChange={(e) => {
                      handleCheck(e, outcome);
                    }}
                    size="small"
                  />
                }
                label="Recover Fully"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '14px', // or any size you prefer
                  },
                }}
              />
            </Grid>

            <Grid item lg={4} md={4} sm={4} xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={outcome}
                    value="Recover with Disability"
                    onChange={(e) => {
                      handleCheck(e, outcome);
                    }}
                    size="small"
                  />
                }
                label="Recover with Disability(specify)"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '14px', // or any size you prefer
                  },
                }}
              />
            </Grid>

            <Grid item lg={4} md={4} sm={4} xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={outcome}
                    value="Congenital Abnormally"
                    onChange={(e) => {
                      handleCheck(e, outcome);
                    }}
                    size="small"
                  />
                }
                label="Congenital Abnormally(specify)"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '14px', // or any size you prefer
                  },
                }}
              />
            </Grid>

            <Grid item lg={4} md={4} sm={4} xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={outcome}
                    value="Life Threatening"
                    onChange={(e) => {
                      handleCheck(e, outcome);
                    }}
                    size="small"
                  />
                }
                label="Life Threatening"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '14px', // or any size you prefer
                  },
                }}
              />
            </Grid>

            <Grid item lg={4} md={4} sm={4} xs={6}>
              <Input
                value={others}
                name="others"
                type="text"
                onChange={handleForm}
                label="Specify"
              />
            </Grid>
          </Grid>
        </Grid>

        {/*Suspected Drugs */}

        <Grid item lg={12} md={12} sm={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '40px',
            }}
            mb={1}
          >
            <FormsHeaderText text="Suspected Drugs " />
            <FormsHeaderText
              text="(including Biologicals, Traditional Medicine and Cosmetics)"
              fontWeight="500"
              textTransform="Capitalize"
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {/* <UploadExcelSheet updateState={setProductItem} /> */}

              <GlobalCustomButton onClick={addSuspectedDrugs}>
                <AddCircleOutline
                  sx={{ marginRight: '5px' }}
                  fontSize="small"
                />
                Add
              </GlobalCustomButton>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '40px',
            }}
            mb={1}
          >
            <FormsHeaderText
              text="A. Drug Details"
              textTransform="Capitalize"
              color="black"
            />
          </Box>

          <Grid container spacing={1}>
            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                value={brandName}
                name="brandName"
                type="text"
                onChange={handleForm}
                label="Brand Name "
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                value={generic}
                name="generic"
                type="text"
                onChange={handleForm}
                label="Generic Name "
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                value={bacthNo}
                name="bacthNo"
                type="text"
                onChange={handleForm}
                label="Batch Number"
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                value={nafdacNo}
                name="nafdacNo"
                type="text"
                onChange={handleForm}
                label="NAFDAC No."
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              {/* <MuiCustomDatePicker
                label="ExpiryDate"
                value={expirydate}
                name="expiryDate"
                handleChange={(value) =>
                  setObjectState({
                    ...objectState,
                    expirydate: value,
                  })
                }
                format="dd/MM/yyyy"
              /> */}
              <Input
                type={'date'}
                label="ExpiryDate"
                value={expirydate}
                name="expiryDate"
                onChange={(e) =>
                  setObjectState({
                    ...objectState,
                    expirydate: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                value={manufName}
                name="manufName"
                type="text"
                onChange={handleForm}
                label="Name of Manufacturer"
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '40px',
            }}
            my={1}
          >
            <FormsHeaderText
              text="B. Drug Intolerance"
              textTransform="Capitalize"
              color="black"
            />
          </Box>

          <Grid container spacing={1}>
            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                value={indication}
                name="indication"
                type="text"
                onChange={handleForm}
                label="Indication for use"
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                value={dosage}
                name="dosage"
                type="text"
                onChange={handleForm}
                label="Dosage"
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                value={route}
                name="route"
                type="text"
                onChange={handleForm}
                label="Route  of Administration"
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              {/* <MuiCustomDatePicker
                label="Date Started"
                value={dateStartDrug}
                // handleChange={(value) => setIntoleranceStart(value)}
                handleChange={(value) =>
                  setObjectState({
                    ...objectState,
                    dateStartDrug: value,
                  })
                }
                format="dd/MM/yyyy"
              /> */}
              <Input
                label="Date Started"
                value={dateStartDrug}
                type={'date'}
                onChange={(e) =>
                  setObjectState({
                    ...objectState,
                    dateStartDrug: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              {/* <MuiCustomDatePicker
                label="Date Stopped"
                value={dateStopDrug}
                //handleChange={(value) => setIntoleranceStop(value)}
                handleChange={(value) =>
                  setObjectState({
                    ...objectState,
                    dateStopDrug: value,
                  })
                }
                format="dd/MM/yyyy"
              /> */}
              <Input
                label="Date Stopped"
                value={dateStopDrug}
                type={'date'}
                onChange={(e) =>
                  setObjectState({
                    ...objectState,
                    dateStopDrug: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {suspectedDrugs.length > 0 && (
        <Box mt={2}>
          <CustomTable
            title={''}
            columns={AdverseDrugCreateSchema}
            // data={productItem}
            data={suspectedDrugs}
            //onRowClicked={handleExtraRow}
            pointerOnHover
            highlightOnHover
            striped
          />
        </Box>
      )}

      {/* Concomitant Medicine */}

      <Grid item lg={12} md={12} sm={12}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '40px',
            marginTop: '30px',
          }}
          mb={1}
        >
          <FormsHeaderText text="Concomitant Medicine " />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* <UploadExcelSheet updateState={setProductItem} /> */}

            <GlobalCustomButton onClick={addConcomitantDrug}>
              <AddCircleOutline sx={{ marginRight: '5px' }} fontSize="small" />
              Add
            </GlobalCustomButton>
          </Box>
        </Box>

        <Grid container spacing={1}>
          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input
              value={concomitantName}
              name="concomitantName"
              type="text"
              //disabled={true}
              onChange={async (e) => setConcomitantName(e.target.value)}
              label="Brand/Generic Name"
            />
          </Grid>

          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input
              value={concomitantDosage}
              name="concomitantDosage"
              type="text"
              //disabled={true}
              onChange={async (e) => setConcomitantDosage(e.target.value)}
              label="Dosage"
            />
          </Grid>

          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input
              value={concomitantRoute}
              name="concomitantRoute"
              type="text"
              //disabled={true}
              onChange={async (e) => setConcomitantRoute(e.target.value)}
              label="Route"
            />
          </Grid>
          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input
              label="Date started"
              value={concomitantStartDate}
              type={'date'}
              onChange={(e) => {
                setConcomitantStartDate(e.target.value);
                console.log(concomitantStartDate);
              }}
            />
          </Grid>

          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input
              type={'date'}
              label="Date stopped"
              value={concomitantEndDate}
              onChange={(e) => {
                setConcomitantEndDate(e.target.value);
                console.log(concomitantEndDate);
              }}
            />
          </Grid>

          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input
              value={reasonForUse}
              name="reasonForUse"
              type="text"
              //disabled={true}
              onChange={async (e) => setReasonForUse(e.target.value)}
              label="Reason For Use"
            />
          </Grid>
        </Grid>
      </Grid>

      {concomitantMedicines.length > 0 && (
        <Box mt={2}>
          <CustomTable
            title={''}
            columns={concomitantMedicineSchema}
            // data={productItem}
            data={concomitantMedicines}
            //onRowClicked={handleRow}
            pointerOnHover
            highlightOnHover
            striped
          />
        </Box>
      )}
      <Grid item lg={12} md={12} sm={12}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '40px',
            marginTop: '30px',
          }}
          mb={1}
        >
          <FormsHeaderText text="Source of Report" />
        </Box>

        <Grid container spacing={1}>
          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input
              value={reporterName}
              name="reporterName"
              type="text"
              onChange={handleReportForm}
              label="Name of Reporter"
            />
          </Grid>

          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input
              value={profession}
              name="profession"
              type="text"
              onChange={handleReportForm}
              label="Profession"
            />
          </Grid>

          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input
              label="Date"
              value={date}
              type={'date'}
              onChange={(e) =>
                setReportState({
                  ...reportState,
                  date: e.target.value,
                })
              }
              format="dd/MM/yyyy"
            />
          </Grid>
        </Grid>
      </Grid>

      <Box
        container
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
        mt={2}
      >
        <GlobalCustomButton
          disabled={
            !concomitantMedicines.length > 0 ||
            !suspectedDrugs.length > 0 ||
            !validateReportObjectFields(reportState).isValid
          }
          onClick={() => {
            setConfirmDialog(true);
            if (
              concomitantMedicines.length > 0 &&
              suspectedDrugs.length > 0 &&
              validateReportObjectFields(reportState).isValid
            ) {
              setPharmacovigilanceItem([
                {
                  ...suspectedDrugs[0],
                  ...reportState,
                  concomitantdrugs: concomitantMedicines,
                },
              ]);
            }
            console.log(pharmacovigilanceItem);
          }}
          sx={{
            marginRight: '10px',
          }}
        >
          Create Pharmacovigilance
        </GlobalCustomButton>

        <GlobalCustomButton color="error" onClick={closeModal}>
          Cancel
        </GlobalCustomButton>
      </Box>
    </Box>
  );
}

export function PharmacovigilanceList({ openCreateModal, openDetailModal }) {
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const PharmacovigServ = client.service('pharmacovig');
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);

  const { state, setState } = useContext(ObjectContext);
  const { user, setUser } = useContext(UserContext);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [docToDel, setDocToDel] = useState({});

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20); //LIMITATIONS FOR THE NUMBER OF FACILITIES FOR SERVER TO RETURN PER PAGE
  const [total, setTotal] = useState(0); //TOTAL NUMBER OF FACILITIES AVAILABLE IN THE SERVER

  const handleCreateNew = async () => {
    const newProductEntryModule = {
      selectedPharmacovigilanceList: {},
      show: 'create',
    };
    await setState((prevstate) => ({
      ...prevstate,
      PharmacovigilanceModule: newProductEntryModule,
    }));
    openCreateModal();
  };

  //console.log(state);

  const handleRow = async (data) => {
    const individualData = await PharmacovigServ.get(data._id);
    const newProductEntryModule = {
      selectedPharmacovigilanceList: individualData,
      show: 'detail',
    };
    await setState((prevstate) => ({
      ...prevstate,
      PharmacovigilanceModule: newProductEntryModule,
    }));
    openDetailModal();
  };

  const handleSearch = async (val) => {
    PharmacovigServ.find({
      query: {
        $or: [
          {
            clientName: {
              $regex: val,
              // $options: "i",
            },
          },
        ],
        $select: [
          'clientName',
          'generic',
          'descriptionRxn',
          'outcome',
          'reporterName',
        ],
        facilityId: user.currentEmployee.facilityDetail._id,
        $limit: 100,
        $sort: {
          createdAt: -1,
        },
      },
    })
      .then((res) => {
        setFacilities(res.data);
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        setMessage(
          'Error fetching ProductEntry, probable network issues ' + err,
        );
      });
  };

  const getFacilities = async () => {
    const findFacilities = await PharmacovigServ.find({
      query: {
        $select: [
          'clientName',
          'generic',
          'descriptionRxn',
          'outcome',
          'reporterName',
        ],
        facilityId: user.currentEmployee.facilityDetail._id,
        $sort: {
          createdAt: -1,
        },
        $limit: limit,
        // $skip: (page - 1) * limit,
      },
    });
    // console.log(findFacilities);
    setFacilities(findFacilities.data);
    setTotal(findFacilities.total);
  };

  useEffect(() => {
    getFacilities();
    PharmacovigServ.on('created', (obj) => getFacilities());
    PharmacovigServ.on('updated', (obj) => getFacilities());
    PharmacovigServ.on('patched', (obj) => getFacilities());
    PharmacovigServ.on('removed', (obj) => getFacilities());
    return () => {};
  }, [limit,page]);

  useEffect(() => {
    //setFacilities([])
    getFacilities();
    return () => {};
  }, [state.StoreModule.selectedStore._id]);

  const handleDelete = async (obj) => {
    await PharmacovigServ.remove(obj._id)
      .then((resp) => {
        toast.success('Sucessfuly deleted ProductEntry ');
        setConfirmDialog(false);
      })
      .catch((err) => {
        toast.error('Error deleting ProductEntry ' + err);
        setConfirmDialog(false);
      });
  };

  const handleConfirmDelete = (doc) => {
    console.log(doc);
    setDocToDel(doc);
    setConfirmDialog(true);
  };

  const handleCancelConfirm = () => {
    setDocToDel({});
    setConfirmDialog(false);
  };

  const transferEntrySchema = [
    {
      name: 'S/N',
      width: '100px',
      key: 'sn',
      description: 'Enter name of Disease',
      selector: (row, i) => i + 1,
      sortable: true,
      required: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'Client ',
      key: 'dest_quantity',
      description: 'Enter Source',
      selector: (row) => row.clientName,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Drug Name ',
      key: 'dest_quantity',
      description: 'Enter Source',
      selector: (row) => row.generic,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'ADR description',
      key: 'costprice',
      description: 'Enter Document Number',
      selector: (row) => row.descriptionRxn,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Treatment Outcome',
      key: 'org_totalamount',
      description: 'Enter Total Amount',
      selector: (row) => row?.outcome,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
    },
    {
      name: 'Reported By',
      key: 'org_totalamount',
      description: 'Enter Total Amount',
      selector: (row) => row.reporterName,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
    },
    {
      name: 'Actions',
      key: 'action',
      description: 'Enter Action',
      selector: (row) => (
        <IconButton size="small" onClick={() => handleConfirmDelete(row)}>
          <DeleteOutlineIcon fontSize="small" sx={{ color: 'red' }} />
        </IconButton>
      ),
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '100px',
      center: true,
    },
  ];

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={handleCancelConfirm}
        confirmationAction={() => handleDelete(docToDel)}
        message={`Are you sure you want to delete this?`}
      />
      {state.StoreModule.selectedStore ? (
        <>
          <PageWrapper
            style={{ flexDirection: 'column', padding: '0.6rem 1rem' }}
          >
            <TableMenu>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {handleSearch && (
                  <div className="inner-table">
                    <FilterMenu onSearch={handleSearch} />
                  </div>
                )}
                <h2 style={{ marginLeft: '10px', fontSize: '0.95rem' }}>
                  Pharmaco-vigilance
                </h2>
              </div>

              {handleCreateNew && (
                <GlobalCustomButton
                  //onClick={openCreateModal}
                  onClick={handleCreateNew}
                >
                  <AddCircleOutline
                    fontSize="small"
                    sx={{ marginRight: '5px' }}
                  />
                  Add New
                </GlobalCustomButton>
              )}
            </TableMenu>

            <Box
              sx={{
                width: '100%',
                height: 'calc(100vh - 100px)',
                overflowY: 'auto',
              }}
            >
              <CustomTable
                title={''}
                columns={transferEntrySchema}
                data={facilities}
                pointerOnHover
                highlightOnHover
                striped
                onRowClicked={handleRow}
                progressPending={loading}
                onChangeRowsPerPage={onTableChangeRowsPerPage}
                onChangePage={onTablePageChange}
                pagination
              paginationServer
              paginationTotalRows={total}
              />
            </Box>
          </PageWrapper>
        </>
      ) : (
        <div>loading... </div>
      )}
    </>
  );
}

export function PharmacovigilanceDetails({ closeModal, DetailEntry }) {
  const [reasonForUse, setReasonForUse] = useState('');
  const [suspectedDrugs, setSuspectedDrugs] = useState([]);
  const [concomitantMedicines, setConcomitantMedicines] = useState([]);
  const [objectState, setObjectState] = useState(DetailEntry);

  useEffect(() => {
    setConcomitantMedicines(DetailEntry.concomitantdrugs);
    setSuspectedDrugs([DetailEntry]);
  }, [DetailEntry]); //

  console.log(DetailEntry);

  const classes = useStyles();
  const customRadio = <Radio size="small" classes={{ root: classes.root }} />;
  const AdverseDrugCreateSchema = [
    {
      name: 'S/N',
      key: 'sn',
      width: '100px',
      center: true,
      description: 'SN',
      selector: (row) => row.sn,
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'Brand Name',
      key: 'brandName',
      description: 'Enter BrandName',
      selector: (row) => row.brandName,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Generic Name',
      key: 'genericName',
      description: 'Enter Generic Name',
      selector: (row) => row.generic,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Batch No.',
      key: 'batchNumber',
      description: 'Enter Batch No.',
      selector: (row) => row.bacthNo,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'NAFDAC No.',
      key: 'nafdacNumber',
      description: 'Enter NAFDAC No.',
      selector: (row) => row.nafdacNo,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Manufacturer',
      key: 'Manufacturer',
      description: 'Enter Manufacturer',
      selector: (row) => row.manufName,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Indication',
      key: 'indication',
      description: 'Enter Indication',
      selector: (row) => row.indication,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Dosage',
      key: 'dosage',
      description: 'Enter Dosage',
      selector: (row) => row.dosage,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Route',
      key: 'route',
      description: 'Enter Route',
      selector: (row) => row.route,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Start Date',
      key: 'start date',
      description: 'Enter Start Date',

      selector: (row) =>
        row.dateStartRxn ? format(new Date(row.dateStartRxn), 'dd-MM-yy') : '',
      sortable: true,
      required: true,
      inputType: 'TEXT',
      center: true,
    },

    {
      name: 'End Date',
      key: 'end date',
      description: 'Enter End Date',
      selector: (row) =>
        row.dateStopRxn ? format(new Date(row.dateStopRxn), 'dd-MM-yy') : '',
      sortable: true,
      required: true,
      inputType: 'TEXT',
      center: true,
    },
  ];

  const concomitantMedicineSchema = [
    {
      name: 'S/N',
      key: 'sn',
      width: '100px',
      center: true,
      description: 'SN',
      selector: (row) => row.sn,
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'Drug Name',
      key: 'drugName',
      description: 'Enter Drug Name',
      selector: (row) => row.name,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Dosage',
      key: 'dosage',
      description: 'Enter Dosage',
      selector: (row) => row.dosage,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Route',
      key: 'route',
      description: 'Enter Route',
      selector: (row) => row.route,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Start Date',
      key: 'start date',
      description: 'Enter Start Date',
      selector: (row) =>
        row.dateStartDrug
          ? format(new Date(row.dateStartDrug), 'dd-MM-yy')
          : '',
      sortable: true,
      required: true,
      inputType: 'TEXT',
      center: true,
    },

    {
      name: 'End Date',
      key: 'end date',
      description: 'Enter End Date',
      selector: (row) =>
        row.dateStopDrug ? format(new Date(row.dateStopDrug), 'dd-MM-yy') : '',
      sortable: true,
      required: true,
      inputType: 'TEXT',
      center: true,
    },

    {
      name: 'Reason for use',
      key: 'route',
      description: 'Enter Route',
      selector: (row) => row.reason,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
  ];

  const {
    clientName,
    mrn,
    age,
    sex,
    weight,
    // Reaction details
    descriptionRxn,
    dateStartRxn,
    dateStopRxn,
    outcome,

    others,
    admitted,
    prolonged,
    admissionDuration,
    treatment,

    // Medication details
    brandName,
    generic,
    bacthNo,
    nafdacNo,
    expirydate,
    manufName,
    indication,
    dosage,
    route,
    dateStartDrug,
    dateStopDrug,
    // Reporter info
    reporterName,
    profession,
    date,
  } = objectState;

  //console.log(format(new Date(dateStartRxn), "dd-MM-yy"));

  return (
    <Box
      sx={{
        width: '80vw',
        maxHeight: '85vh',
        overflowY: 'auto',
        paddingRight: ' 20px',
      }}
    >
      <Grid containe spacing={1}>
        <Grid item lg={12} md={12} sm={12}>
          <Box mb={1} sx={{ height: '40px' }}>
            {/* <FormsHeaderText text="Requisition Detail" /> */}
            <FormsHeaderText text="Patient Information" />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={4} sm={4} xs={6}>
              <ClientSearch
                // getSearchfacility={handleGetPatient}
                //id={patient?._id}
                value={clientName}
                disabled={true}
              />
            </Grid>

            <Grid item md={4} sm={4} xs={6}>
              <Input
                value={age}
                name="age"
                type="text"
                placeholder={'age'}
                disabled
                label=" Age/D.O.B"
              />
            </Grid>

            <Grid item md={4} sm={4} xs={6}>
              <Input
                value={mrn}
                name="mrn"
                type="text"
                placeholder={'patient number'}
                disabled
                label=" Patient No."
              />
            </Grid>

            <Grid item md={4} sm={4} xs={6}>
              <Input
                value={sex}
                name="sex"
                type="text"
                placeholder={'gender...'}
                disabled
                //onChange={handleForm}
                label=" Gender"
              />
            </Grid>
            <Grid item md={4} sm={4} xs={6}>
              <Input
                value={weight}
                name="weight"
                type="text"
                placeholder={'Weight'}
                //onChange={handleForm}
                label=" Weight"
                disabled
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item lg={12} md={12} sm={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '40px',
            }}
            mt={1}
          >
            <FormsHeaderText text="Adverse Drug Reaction (ADR) Details" />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              //height: "40px",
            }}
            mb={1}
          >
            <FormsHeaderText
              text="A. Reaction Details"
              textTransform="Capitalize"
              color="black"
            />
          </Box>
          <Grid container spacing={1}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextField
                sx={{ width: '100%' }}
                id="outlined-multiline-static"
                label="Reaction Description"
                name="descriptionRxn"
                multiline
                rows={3}
                value={descriptionRxn}
                disabled
              />
            </Grid>

            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Input
                label="Date Reaction Started"
                name="dateStartRxn"
                disabled
                //value={dateStartRxn}
                defaultValue="2024-01-01"
                value={format(new Date(dateStartRxn), 'dd-MM-yyyy')}
              />
            </Grid>

            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Input
                label="Date Reaction Stopped"
                name="dateStopRxn"
                disabled
                value={format(new Date(dateStopRxn), 'dd-MM-yyyy')}
                format="dd/MM/yyyy"
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  //height: "40px",
                }}
                mb={1}
              >
                <FormsHeaderText
                  text="B. Admission Details"
                  textTransform="Capitalize"
                  color="black"
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '20px 0px',
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    width: '55%',
                  }}
                >
                  <Typography fontSize={'15px'}>
                    Was patient admitted due to ADR?
                  </Typography>
                </Box>

                <RadioGroup
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-evenly',
                  }}
                  row
                  name="admitted"
                  value={admitted}
                >
                  <Box>
                    <FormControlLabel
                      classes={{ label: classes.label }}
                      sx={{ fontSize: 'small' }}
                      value="yes"
                      checked={admitted === 'yes' || admitted === 'Yes'}
                      control={customRadio}
                      label="Yes"
                    />
                  </Box>
                  <Box>
                    <FormControlLabel
                      classes={{ label: classes.label }}
                      sx={{ fontSize: 'small' }}
                      value="no"
                      control={customRadio}
                      checked={admitted === 'no' || admitted === 'No'}
                      label="No"
                    />
                  </Box>
                </RadioGroup>
              </Box>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '20px 0px',
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    width: '55%',
                  }}
                >
                  <Typography fontSize={'15px'}>
                    if already hospitalized, was it prolonged due to ADR:
                  </Typography>
                </Box>
                <RadioGroup
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-evenly',
                  }}
                  row
                  name="prolonged"
                  value={prolonged}
                >
                  <Box>
                    <FormControlLabel
                      classes={{ label: classes.label }}
                      sx={{ fontSize: 'small' }}
                      value="yes"
                      //checked={false}
                      checked={prolonged === 'yes' || prolonged === 'Yes'}
                      control={customRadio}
                      label="Yes"
                    />
                  </Box>
                  <Box>
                    <FormControlLabel
                      classes={{ label: classes.label }}
                      sx={{ fontSize: 'small' }}
                      value="no"
                      control={customRadio}
                      checked={prolonged === 'no' || prolonged === 'No'}
                      //checked={true}
                      label="No"
                    />
                  </Box>
                </RadioGroup>
              </Box>
            </Grid>

            {/* <Grid container spacing={2}> */}
            <Grid item md={12} sm={12} xs={12}>
              <Input
                value={admissionDuration}
                name="admissionDuration"
                type="text"
                label="Duration of Hospitalization "
                disabled
              />
            </Grid>
            {/* </Grid> */}

            <Grid item md={12} sm={12} xs={12}>
              <TextField
                sx={{ width: '100%' }}
                id="outlined-multiline-static"
                value={treatment}
                name="treatment"
                label="Treatment of Reaction"
                multiline
                rows={5}
                disabled
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Treatment outcome */}

        <Grid
          sx={{
            marginBottom: '20px',
          }}
          md={6}
          sm={6}
          xs={12}
          item
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',

              // height: "40px",

              width: '60%',
            }}
            mb={1}
            mt={3}
          >
            <FormsHeaderText
              textTransform="Capitalize"
              text=" C. Outcome Of Reaction"
              color="black"
            />

            <FormsHeaderText
              textTransform="Capitalize"
              text="  (check  as appropriate)"
              color="black"
              fontWeight="500"
            />
          </Box>

          <Grid container spacing={1}>
            <Grid item lg={4} md={4} sm={4} xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={outcome}
                    value="Recover Fully"
                    checked={outcome?.includes('Recover Fully')}
                    size="small"
                  />
                }
                label="Recover Fully"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '14px', // or any size you prefer
                  },
                }}
              />
            </Grid>

            <Grid item lg={4} md={4} sm={4} xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={outcome}
                    value="Recover with Disability"
                    checked={outcome?.includes('Recover with Disability')}
                    size="small"
                  />
                }
                label="Recover with Disability(specify)"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '14px', // or any size you prefer
                  },
                }}
              />
            </Grid>

            <Grid item lg={4} md={4} sm={4} xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={outcome}
                    value="Congenital Abnormally"
                    checked={outcome?.includes('Congenital Abnormally')}
                    size="small"
                  />
                }
                label="Congenital Abnormally(specify)"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '14px', // or any size you prefer
                  },
                }}
              />
            </Grid>

            <Grid item lg={4} md={4} sm={4} xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={outcome}
                    value="Life Threatening"
                    checked={outcome?.includes('Life Threatening')}
                    size="small"
                  />
                }
                label="Life Threatening"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '14px', // or any size you prefer
                  },
                }}
              />
            </Grid>

            <Grid item lg={4} md={4} sm={4} xs={6}>
              <Input
                value={others}
                name="others"
                type="text"
                label="Specify"
                disabled
              />
            </Grid>
          </Grid>
        </Grid>

        {/*Suspected Drugs */}

        <Grid item lg={12} md={12} sm={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '40px',
            }}
            mb={1}
          >
            <FormsHeaderText text="Suspected Drugs " />
            <FormsHeaderText
              text="(including Biologicals, Traditional Medicine and Cosmetics)"
              fontWeight="500"
              textTransform="Capitalize"
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '40px',
            }}
            mb={1}
          >
            <FormsHeaderText
              text="A. Drug Details"
              textTransform="Capitalize"
              color="black"
            />
          </Box>

          <Grid container spacing={1}>
            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                value={brandName}
                name="brandName"
                type="text"
                label="Brand Name "
                disabled
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                value={generic}
                name="generic"
                type="text"
                label="Generic Name "
                disabled
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                value={bacthNo}
                name="bacthNo"
                type="text"
                label="Batch Number"
                disabled
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                value={nafdacNo}
                name="nafdacNo"
                type="text"
                label="NAFDAC No."
                disabled
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                label="ExpiryDate"
                value={format(new Date(expirydate), 'dd-MM-yyyy')}
                name="expiryDate"
                disabled
                format="dd/MM/yyyy"
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                value={manufName}
                disabled
                name="manufName"
                type="text"
                label="Name of Manufacturer"
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              //height: "40px",
            }}
            my={1}
          >
            <FormsHeaderText
              text="B. Drug Intolerance"
              textTransform="Capitalize"
              color="black"
            />
          </Box>

          <Grid container spacing={1}>
            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                value={indication}
                name="indication"
                disabled
                type="text"
                label="Indication for use"
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                value={dosage}
                disabled
                name="dosage"
                type="text"
                label="Dosage"
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                value={route}
                disabled
                name="route"
                type="text"
                label="Route  of Administration"
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                label="Date Started"
                value={format(new Date(dateStartDrug), 'dd-MM-yyyy')}
                disabled
              />
            </Grid>

            <Grid item lg={4} md={3} sm={4} xs={6}>
              <Input
                label="Date Stopped"
                value={format(new Date(dateStopDrug), 'dd-MM-yyyy')}
                disabled
                format="dd/MM/yyyy"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {suspectedDrugs.length > 0 && (
        <Box mt={2}>
          <CustomTable
            title={''}
            columns={AdverseDrugCreateSchema}
            data={suspectedDrugs}
            pointerOnHover
            highlightOnHover
            striped
          />
        </Box>
      )}

      {/* Concomitant Medicine */}

      <Grid item lg={12} md={12} sm={12}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '40px',
            marginTop: '30px',
          }}
          mb={1}
        >
          <FormsHeaderText text="Concomitant Medicine " />
        </Box>

        {/* <Grid container spacing={1}>
          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input type="text" disabled label="Brand/Generic Name" />
          </Grid>

          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input type="text" disabled label="Dosage" />
          </Grid>

          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input type="text" disabled label="Route" />
          </Grid>
          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input
              label="Date started"
              //value={new Date(concomitantStartDate)}
              disabled
              format="dd/MM/yyyy"
            />
          </Grid>

          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input
              label="Date stopped"
              //value={format(new Date(dateStartDrug), "dd-MM-yyyy")}
              //value={new Date(concomitantEndDate)}
              disabled
              format="dd/MM/yyyy"
            />
          </Grid>

          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input
              value={reasonForUse}
              name="reasonForUse"
              type="text"
              disabled
              label="Reason For Use"
            />
          </Grid>
        </Grid> */}
      </Grid>

      {concomitantMedicines?.length > 0 && (
        <Box>
          <CustomTable
            title={''}
            columns={concomitantMedicineSchema}
            // data={productItem}
            data={concomitantMedicines}
            //onRowClicked={handleRow}
            pointerOnHover
            highlightOnHover
            striped
          />
        </Box>
      )}
      <Grid item lg={12} md={12} sm={12}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '40px',
            marginTop: '30px',
          }}
          mb={1}
        >
          <FormsHeaderText text="Source of Report" />
        </Box>

        <Grid container spacing={1}>
          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input
              value={reporterName}
              disabled
              name="reporterName"
              type="text"
              label="Name of Reporter"
            />
          </Grid>

          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input
              value={profession}
              disabled
              name="profession"
              type="text"
              label="Profession"
            />
          </Grid>

          <Grid item lg={4} md={3} sm={4} xs={6}>
            <Input
              label="Date"
              disabled
              value={format(new Date(date), 'dd-MM-yyyy')}
              format="dd/MM/yyyy"
            />
          </Grid>
        </Grid>
      </Grid>

      <Box
        container
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '20px',
        }}
      >
        <GlobalCustomButton color="error" onClick={closeModal}>
          Cancel
        </GlobalCustomButton>
      </Box>
    </Box>
  );
}
