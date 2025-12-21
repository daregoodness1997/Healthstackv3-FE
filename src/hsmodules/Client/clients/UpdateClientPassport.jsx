import React, { useState, useContext } from 'react';
import client from '../../../feathers';
import { ObjectContext } from '../../../context';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, Typography } from '@mui/material';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import { getBase64 } from '../../helpers/getBase64';
import { FileUploader } from 'react-drag-drop-files';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { uploadFile } from '../../../utils/secureHttp';
import { getUploadUrl } from '../../../utils/env';

const UploadComponent = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        border: '1px dashed gray',
        cursor: 'pointer',
        borderRadius: '7.5px',
      }}
    >
      <FileUploadOutlinedIcon />
      <Typography>Select Logo Image or Drag and Drop here</Typography>
    </Box>
  );
};

export const UpdateClientPassport = ({ closeModal, selectedClient }) => {
  const ClientServ = client.service('client');
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);

  const [file, setFile] = useState(null);

  const handleChange = (file) => {
    getBase64(file)
      .then((res) => {
        setFile(res);
      })
      .catch((err) => {
        return err;
        //   console.log(err);
      });
  };

  const handleUploadLogo = async () => {
    if (file === null) return toast.error('Please select an Image to upload');
    showActionLoader();
    const token = localStorage.getItem('feathers-jwt');

    // ... in the upload function
    uploadFile(
      getUploadUrl(),
      { uri: file },
      { headers: { Authorization: `Bearer ${token}` } },
    )
      .then(async (res) => {
        const imageUrl = res.data.url;
        //const employee = user.currentEmployee;

        const newClient = {
          ...selectedClient,
          imageurl: imageUrl,
        };

        const documentId = selectedClient._id;

        await ClientServ.patch(documentId, newClient)
          .then((res) => {
            hideActionLoader();
            closeModal();
            toast.success('Patient Image Updated succesfully');
          })
          .catch((err) => {
            hideActionLoader();

            toast.error(
              `Error Updating Patient Image, probable network issues or ${err}`,
            );
          });
      })
      .catch((error) => {
        hideActionLoader();
        toast.error(
          `An error occured whilst updating your Patient Image ${error}`,
        );
        // console.log(error);
      });
  };

  return (
    <Box sx={{ width: '400px', maxHeight: '80vw' }}>
      {file ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={file}
            alt="logo"
            style={{ width: '200px', height: 'auto', display: 'block' }}
          />
        </Box>
      ) : (
        <FileUploader
          multiple={false}
          handleChange={handleChange}
          name="upload"
          types={['jpeg', 'png', 'jpg']}
          children={<UploadComponent />}
        />
      )}

      <Box sx={{ display: 'flex' }} gap={2} mt={2}>
        <GlobalCustomButton color="error" onClick={closeModal}>
          Cancel
        </GlobalCustomButton>

        <GlobalCustomButton onClick={handleUploadLogo} disabled={file === null}>
          Upload Image
        </GlobalCustomButton>
      </Box>
    </Box>
  );
};
