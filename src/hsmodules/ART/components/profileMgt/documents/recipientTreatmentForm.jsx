import Grid from '@mui/material/Grid';
import React from 'react';
import CustomSelect from '../../../../../components/inputs/basic/Select';
import { useForm } from 'react-hook-form';
import { Box, Stack } from '@mui/material';
import { FormsHeaderText } from '../../../../../components/texts';
import GlobalCustomButton from '../../../../../components/buttons/CustomButton';
import { useFieldArray } from 'react-hook-form';
import ProtocolForm from './protocolForm';
import StimulationDays from './stimulationDays';
import Input from '../../../../../components/inputs/basic/Input';
import { ObjectContext, UserContext } from '../../../../../context';
import { useState, useContext } from 'react';
import client from '../../../../../feathers';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import EndometrialMeasurement from './endometrialMeasurement';

const RecipientTreatmentForm = () => {
  const [docStatus, setDocStatus] = useState('Draft');
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const ARTClinicalDocumentServ = client.service('clinicaldocument');
  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;
  const [follicleStimulationData, setFollicleStimulationData] = useState([]);
  const [endometrialMeasurementData, setEndometrialMeasurementData] = useState(
    [],
  );

  const { control, register, handleSubmit, setValue, reset, watch } = useForm();

  const stimulationData = watch('stimulationData');
  const endometrialData = watch('endometrialData');

  const {
    fields: allergyFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray({
    control,
    name: 'allergies',
  });

  const {
    fields: embryoFields,
    append: appendEmbryo,
    remove: removeEmbryo,
  } = useFieldArray({
    control,
    name: 'embryos',
  });

  const {
    fields: transferredFields,
    append: appendTransferred,
    remove: removeTransferred,
  } = useFieldArray({
    control,
    name: 'transferred',
  });

  const handleChangeStatus = (e) => {
    // setValue('documentStatus', e.target.value);
    setDocStatus(e.target.value);
  };

  const handleAddItem = (item) => {
    switch (item) {
      case 'Allergies':
        appendAllergy({ value: '' });
        break;
      case 'Embryo':
        appendEmbryo({ value: '' });
        break;
      case 'Transferred':
        appendTransferred({ value: '' });
        break;
    }
  };

  const handleRemoveItem = (item, index) => {
    switch (item) {
      case 'Allergies':
        removeAllergy(index);
        break;
      case 'Embryo':
        removeEmbryo(index);
        break;
      case 'Transferred':
        removeTransferred(index);
        break;
    }
  };

  const schema = [
    { name: 'Start Date', selector: (row) => row.startDate, sortable: true },
    { name: 'End Date', selector: (row) => row.endDate, sortable: true },
    { name: 'Time', selector: (row) => row.time, sortable: true },
    {
      name: 'Buselin (Suprefact)',
      selector: (row) => row.buselinSuprefact,
      sortable: true,
    },
    // { name: "Naferelin (Synarela)", selector: row => row.naferelinSynarela, sortable: true },
    { name: 'Progynova', selector: (row) => row.progynova, sortable: true },
    { name: 'Cyclogest', selector: (row) => row.cyclogest, sortable: true },
    { name: 'HCG', selector: (row) => row.hcg, sortable: true },
    {
      name: 'Follicles, Right',
      selector: (row) => row.folliclesRight,
      sortable: true,
    },
    {
      name: 'Follicles, Left',
      selector: (row) => row.folliclesLeft,
      sortable: true,
    },
  ];

  const endometrialMeasurementSchema = [
    {
      name: 'Measurement Date',
      selector: (row) => row.measurementDate,
      sortable: true,
    },
    { name: 'Measurement', selector: (row) => row.measurement, sortable: true },
  ];

  const inputFields = [
    { name: 'startDate', label: 'Start Date', type: 'date' },
    { name: 'endDate', label: 'End Date', type: 'date' },
    { name: 'time', label: 'Time', type: 'time' },
    { name: 'buselinSuprefact', label: 'Buselin (Suprefact)', type: 'text' },
    { name: 'naferelinSynarela', label: 'Naferelin (Synarela)', type: 'text' },
    { name: 'progynova', label: 'Progynova', type: 'text' },
    { name: 'cyclogest', label: 'Cyclogest', type: 'text' },
    { name: 'hcg', label: 'HCG', type: 'text' },
  ];
  const endometrialMeasurementInputFields = [
    { name: 'measurementDate', label: 'Measurement Date', type: 'date' },
    { name: 'measurement', label: 'Measurement', type: 'text' },
  ];

  const closeForm = async () => {
    let documentobj = {};
    documentobj.name = '';
    documentobj.facility = '';
    documentobj.document = '';
    const newDocumentClassModule = {
      selectedDocumentClass: documentobj,
      encounter_right: false,
    };
    await setState((prevstate) => ({
      ...prevstate,
      DocumentClassModule: newDocumentClassModule,
    }));
    reset();
  };

  const onSubmit = async (data) => {
    showActionLoader();
    let document = {
      documentdetail: data,
      documentname: 'Recipient Treatment',
      documentClassId: state.DocumentClassModule.selectedDocumentClass._id,
      createdBy: user._id,
      createdByname: `${user.firstname} ${user.lastname}`,
      locationId: state.employeeLocation.locationId || '',
      location: `${state.employeeLocation.locationName} ${state.employeeLocation.locationType}`,
      facility: user.currentEmployee.facilityDetail._id,
      facilityname: user.currentEmployee.facilityDetail.facilityName,
      familyprofileId: state.ARTModule.selectedFamilyProfile._id,
      client: state.ARTModule.selectedFamilyProfile._id,
      clientName: state.ARTModule.selectedFamilyProfile.name,
      status: docStatus === 'Draft' ? 'Draft' : 'completed',
      geolocation: {
        type: 'Point',
        coordinates: [state.coordinates.latitude, state.coordinates.longitude],
      },
    };

    if (!document.facilityname || !document.createdByname) {
      toast.error(
        'Documentation data missing, requires facility and creator details',
      );
      hideActionLoader();
      return;
    }

    if (document.locationId === '') {
      delete document.locationId;
    }

    try {
      if (!!draftDoc && draftDoc.status === 'Draft') {
        await ARTClinicalDocumentServ.patch(draftDoc._id, document);
        toast.success('Recipient Treatment updated successfully');
      } else {
        await ARTClinicalDocumentServ.create(document);
        toast.success('Recipient Treatment created successfully');
      }

      closeForm();
    } catch (err) {
      toast.error('Error submitting Recipient Treatment: ' + err);
    } finally {
      hideActionLoader();
    }
  };

  useEffect(() => {
    if (!!draftDoc && draftDoc.status === 'Draft') {
      Object.entries(draftDoc.documentdetail).map(([keys, value], i) =>
        setValue(keys, value, {
          shouldValidate: true,
          shouldDirty: true,
        }),
      );
    }
    setFollicleStimulationData(draftDoc?.documentdetail?.stimulationData);
    setEndometrialMeasurementData(draftDoc?.documentdetail?.endometrialData);
    return () => {
      draftDoc = {};
    };
  }, [draftDoc, follicleStimulationData, endometrialMeasurementData]);

  const handleDataUpdate = (newData) => {
    setFollicleStimulationData(newData);
    setValue('stimulationData', newData);
  };

  const handleEndometrialDataUpdate = (newData) => {
    setEndometrialMeasurementData(newData);
    setValue('endometrialData', newData);
  };

  return (
    <Box>
      <Stack paddingBlock={2}>
        <FormsHeaderText text="Recipient Treatment Form" />
      </Stack>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Input
            register={register('treatment_form')}
            name="treatment_form"
            label="Treatment Form"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register('indication_male')}
            name="indication_male"
            label="Indication Male"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register('registration')}
            name="registration"
            label="Registration"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register('indication_female')}
            name="indication_female"
            label="Indication Female"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register('treatment_cycle')}
            name="treatment_cycle"
            label="Treatment Cycle"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register('transfer_cycle')}
            name="transfer_cycle"
            label="Transfer Cycle"
            type="text"
          />
        </Grid>
      </Grid>
      <StimulationDays
        schema={schema}
        initialData={stimulationData || follicleStimulationData}
        onDataUpdate={handleDataUpdate}
        inputFields={inputFields}
      />

      <EndometrialMeasurement
        schema={endometrialMeasurementSchema}
        initialData={endometrialData || endometrialMeasurementData}
        onDataUpdate={handleEndometrialDataUpdate}
        inputFields={endometrialMeasurementInputFields}
      />

      <ProtocolForm
        control={control}
        register={register}
        allergyFields={allergyFields}
        embryoFields={embryoFields}
        transferredFields={transferredFields}
        handleAddItem={handleAddItem}
        handleRemoveItem={handleRemoveItem}
        docStatus={docStatus}
        handleChangeStatus={handleChangeStatus}
        showAllergies
        showEmbryo
        showTransferred
        showAdditionalFields
      />
      <Box mt={1}>
        <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
          Submit Recipient Form
        </GlobalCustomButton>
      </Box>
    </Box>
  );
};

export default RecipientTreatmentForm;
