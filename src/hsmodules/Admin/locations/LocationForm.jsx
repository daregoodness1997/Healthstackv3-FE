import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import Input from '../../../components/inputs/basic/Input';
import CustomSelect from '../../../components/inputs/basic/Select';
import { UserContext } from '../../../context';
import { yupResolver } from '@hookform/resolvers/yup';
import { locationTypeOptions } from '../../../dummy-data';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { BottomWrapper } from '../../app/styles';
import { createLocationSchema } from '../schema';
import ModalBox from '../../../components/modal';
import {
  useCreateLocation,
  useLocations,
} from '../../../hooks/queries/useLocations';

export const LocationForm = ({ open, setOpen }) => {
  const { user } = useContext(UserContext);
  const createLocation = useCreateLocation();
  const { data: branchData } = useLocations({
    facilityId: user.currentEmployee.facilityDetail._id,
    locationType: 'Branch',
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(createLocationSchema),
    defaultValues: {
      name: '',
      locationType: '',
      facility: user.currentEmployee.facilityDetail._id,
    },
  });

  const submit = async (data) => {
    try {
      await createLocation.mutateAsync(data);
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(`Sorry, You weren't able to create a location. ${err}`);
    }
  };

  return (
    <ModalBox open={open} onClose={setOpen} header="Create Location">
      <form onSubmit={handleSubmit(submit)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Name of Location"
            control={control}
            name="name"
            errorText={errors?.name?.message}
            sx={{ marginBottom: '2rem' }}
          />
          <CustomSelect
            label="Choose Location Type"
            name="locationType"
            options={locationTypeOptions}
            control={control}
            errorText={errors?.locationType?.message}
            sx={{ marginBottom: '2rem' }}
          />
          <CustomSelect
            label="Choose Branch"
            name="branch"
            options={branchData?.data || []}
            control={control}
            errorText={errors?.branch?.message}
            sx={{ marginBottom: '2rem' }}
          />
        </div>
        <BottomWrapper>
          <GlobalCustomButton type="submit" loading={createLocation.isPending}>
            <ControlPointIcon fontSize="small" sx={{ marginRight: '5px' }} />
            Create Location
          </GlobalCustomButton>
        </BottomWrapper>
      </form>
    </ModalBox>
  );
};
