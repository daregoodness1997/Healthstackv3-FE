import { Box, Grid } from '@mui/material';
import Textarea from '../../../components/inputs/basic/Textarea';
import { useForm } from 'react-hook-form';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import { useContext } from 'react';
import { ObjectContext } from '../../../context';
import client from '../../../feathers';
import { toast } from 'react-toastify';

const AddComment = ({ onClose, id }) => {
  const { register, handleSubmit } = useForm();
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);
  const ClientServ = client.service('grevianceresolution');

  const onSubmit = (data) => {
    showActionLoader();
    ClientServ.patch(id, {
      'process.0.comments': data.comments,
    })
      .then(() => {
        hideActionLoader();
        toast.success(`Comment added succesfully`);
      })
      .catch((err) => {
        hideActionLoader();
        toast.error('Error adding comment to grievance' + err);
      });
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
            <Textarea
              register={register('comments')}
              type="text"
              label="Add Comment"
            />
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
          <GlobalCustomButton text="Submit" onClick={handleSubmit(onSubmit)} />
          <GlobalCustomButton text="Cancel" onClick={onClose} />
        </Box>
      </form>
    </Box>
  );
};

export default AddComment;
