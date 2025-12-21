/* eslint-disable react/prop-types */
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import { useForm } from 'react-hook-form';
import EmployeeSearch from '../../helpers/EmployeeSearch';
import { useState } from 'react';
import Textarea from '../../../components/inputs/basic/Textarea';

const EscalateGrievance = ({ onClose }) => {
  const { register, control, handleSubmit } = useForm();
  const [staff, setStaff] = useState('');
  const handleGetSearchStaff = (obj) => {
    setStaff(obj);
  };

  return (
    <Box
      sx={{
        width: '50vw',
      }}
    >
      <form>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <EmployeeSearch
              getSearchfacility={handleGetSearchStaff}
              label="Search Staff To Escalate To"
            />
          </Grid>
          <Grid item xs={12}>
            <Textarea
              register={register('issue')}
              type="text"
              label="Describe Reason For Escalation"
            />
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox {...register('am12')} />}
                label={
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    Send Email Notification
                  </Typography>
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            gap: 2,
          }}
        >
          <GlobalCustomButton text="Submit" />
          <GlobalCustomButton text="Cancel" onClick={onClose} />
        </Box>
      </form>
    </Box>
  );
};

export default EscalateGrievance;
