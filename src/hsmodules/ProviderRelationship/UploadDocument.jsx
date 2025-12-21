import React from 'react';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import { Box } from '@mui/system';
import { FileUploader } from 'react-drag-drop-files';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { getBase64 } from '../helpers/getBase64';
import { useState, useContext } from 'react';
import { ObjectContext } from '../../context';
import { toast } from 'react-toastify';
import { uploadFile } from '../../utils/secureHttp';
import { getUploadUrl } from '../../utils/env';
import { Grid, Typography } from '@mui/material';
import CustomSelect from '../../components/inputs/basic/Select';

const UploadComponent = ({}) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '200px',
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
      <Typography>Select File or Drag and Drop here</Typography>
    </Box>
  );
};

export default function UploadDocument({ closeModal, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [base64, setBase64] = useState(null);
  const [docType, setDoctype] = useState('');

  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);

  const docTypes = ['docx', 'doc', 'pdf', 'png', 'jpg', 'jpeg'];

  const handleChange = (file) => {
    getBase64(file[0])
      .then((res) => {
        setFile(file);
        setBase64(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function handleUploadFile() {
    if (file === null || base64 === null)
      return toast.error('Please select a File to upload');

    showActionLoader();

    uploadFile(getUploadUrl(), { uri: base64 })
      .then(async (res) => {
        console.log(res);
        if (onUploadSuccess) {
          onUploadSuccess({
            ...res.data,
            fileType: file[0].name.split('.').pop(),
          });
        }
        hideActionLoader();
        closeModal();
        toast.success(`You've successfully uploaded a document`);
      })
      .catch((error) => {
        hideActionLoader();
        toast.error(`An error occured whilst uploading the document ${error}`);
      });
  }

  return (
    <Box sx={{ width: '500px', maxHeight: '600px' }}>
      <Box mt={1} mb={2}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <CustomSelect
              options={['Image', 'Document']}
              label="Type"
              onChange={(e) => setDoctype(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
      {/* <Box>
        <Input
          type="text"
          label="Title"
          placeholder="write here..."
          onChange={(e) => setTitle(e.target.value)}
        />
      </Box> */}
      <Box>
        <FileUploader
          multiple={true}
          handleChange={handleChange}
          name="upload"
          types={docTypes}
          children={<UploadComponent />}
        />
      </Box>

      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        mt={2}
      >
        <Typography sx={{ fontSize: '0.8rem', color: '#000000' }}>
          {file
            ? `File name: ${file[0]?.name}`
            : "You haven't selected any file"}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }} mt={2} gap={2}>
        <GlobalCustomButton color="error" onClick={closeModal}>
          Cancel
        </GlobalCustomButton>

        <GlobalCustomButton
          variant="contained"
          onClick={handleUploadFile}
          disabled={file === null || base64 === null}
        >
          <UploadFileIcon fontSize="small" sx={{ marginRight: '5px' }} />
          Upload File
        </GlobalCustomButton>
      </Box>
    </Box>
  );
}
