import React, { useContext, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Input from '../../components/inputs/basic/Input';
import TextArea from '../../components/inputs/basic/Textarea';
import CustomSelect from '../../components/inputs/basic/Select';
import { UserContext } from '../../context';
import { yupResolver } from '@hookform/resolvers/yup';
import { bandTypeOptions } from '../../dummy-data';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import CreateIcon from '@mui/icons-material/Create';
import { Box } from '@mui/system';
import { Grid } from '@mui/material';
import { createBandSchema } from './schema';
import { useCreateBand } from '../../hooks/queries/useBands';

export const BandForm = ({ open, setOpen }) => {
  const createBand = useCreateBand();
  const data = localStorage.getItem('band');
  const { user } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitSuccessful, errors },
  } = useForm({
    resolver: yupResolver(createBandSchema),

    defaultValues: {
      name: '',
      bandType: '',
      facility: user.currentEmployee.facilityDetail._id,
    },
  });

  const submit = useCallback(
    async (formData) => {
      try {
        await createBand.mutateAsync(formData);
        setOpen(false);
        reset();
      } catch (err) {
        toast.error(`Sorry, You weren't able to create a band. ${err}`);
      }
    },
    [createBand, setOpen, reset],
  );

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Grid>
        <Box mb="1rem">
          <Input
            label="Name of Band"
            control={control}
            name="name"
            errorText={errors?.name?.message}
            sx={{ marginBottom: '2rem' }}
            important={true}
          />
        </Box>
        <Box mb="1rem">
          <CustomSelect
            label="Choose Band Type"
            name="bandType"
            options={bandTypeOptions}
            control={control}
            errorText={errors?.bandType?.message}
            important={true}
          />
        </Box>
        <Box>
          <TextArea
            label="Description"
            control={control}
            name="description"
            errorText={errors?.description?.message}
          />
        </Box>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mb="1rem">
        <GlobalCustomButton
          type="submit"
          style={{ marginTop: '1rem' }}
        >
          <CreateIcon fontSize="small" sx={{ marginRight: '5px' }} />
          Create Band
        </GlobalCustomButton>
      </Box>
    </form>
  );
};
