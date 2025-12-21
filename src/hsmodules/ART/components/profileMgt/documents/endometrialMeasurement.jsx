import { useState } from 'react';
import ModalBox from '../../../../../components/modal';
import CustomTable from '../../../../../components/customtable';
import { FormsHeaderText } from '../../../../../components/texts';
import GlobalCustomButton from '../../../../../components/buttons/CustomButton';
import { AddCircleOutline } from '@mui/icons-material';
import Input from '../../../../../components/inputs/basic/Input';
import { Box, Stack, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function EndometrialMeasurement({
  schema,
  showHeader = true,
  onDataUpdate,
  initialData = [],
  inputFields,
}) {
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit } = useForm();
  const handleShowModal = () => setShowModal(true);
  const handleHideModal = () => setShowModal(false);

  const handleSave = (formData) => {
    const updatedData = [...initialData, formData];
    onDataUpdate(updatedData);
    handleHideModal();
    toast.success('Endometrial measurement captured successfully');
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        paddingBlock={2}
        spacing={2}
      >
        {showHeader && <FormsHeaderText text="Endometrial Measurement" />}
        <GlobalCustomButton onClick={handleShowModal}>
          <AddCircleOutline fontSize="small" sx={{ marginRight: '5px' }} />
          Add Measurement
        </GlobalCustomButton>
      </Stack>

      <CustomTable
        title="Endometrial Measurement"
        columns={schema}
        data={initialData}
        pointerOnHover
        highlightOnHover
        striped
        progressPending={false}
      />

      <ModalBox
        open={showModal}
        onClose={handleHideModal}
        header="Endometrial Measurement"
        width="60%"
      >
        <Box sx={{ width: '100%' }}>
          <Box
            mt={2}
            sx={{ display: 'flex', justifyContent: 'flex-end', py: '10px' }}
          >
            <GlobalCustomButton onClick={handleSubmit(handleSave)}>
              Save
            </GlobalCustomButton>
          </Box>
          <Grid container spacing={2}>
            {inputFields.map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Input
                  register={register(field.name)}
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
}
