import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { Box, Grid, Menu, MenuItem, Typography } from '@mui/material';
import { useFieldArray, useForm } from 'react-hook-form';
import { Avatar, IconButton } from '@mui/material';
import { getBase64 } from '../helpers/getBase64';
import { FileUploader } from 'react-drag-drop-files';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { uploadFile } from '../../utils/secureHttp';
import { getUploadUrl } from '../../utils/env';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import SignaturePad from 'react-signature-canvas';
import SaveIcon from '@mui/icons-material/Save';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import PasswordIcon from '@mui/icons-material/Password';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import Input from '../../components/inputs/basic/Input';
import { UpdateProfilePhoto } from '../../components/profilemenu';
import ModalBox from '../../components/modal';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import { ObjectContext, UserContext } from '../../context';
import client from '../../feathers';
import './sign.css';
import { toast } from 'react-toastify';
import PasswordInput from '../../components/inputs/basic/Password';
import CustomSelect from '../../components/inputs/basic/Select';
import Textarea from '../../components/inputs/basic/Textarea';
import CheckboxGroup from '../../components/inputs/basic/Checkbox/CheckBoxGroup';
import CustomTable from '../../components/customtable';

const UserAccountPage = () => {
  const EmployeeServ = client.service('employee');
  const { user } = useContext(UserContext);
  const { state } = useContext(ObjectContext);
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [signatureModal, setSignatureModal] = useState(false);
  const [certificationsModal, setCertificationsModal] = useState(false);
  const [certifications, setCertifications] = useState([]);

  const [userData, setUserData] = useState({});
  const [edit, setEdit] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      certifications: [],
    },
  });

  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

  const handleOpenOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const getUserData = useCallback(() => {
    showActionLoader();
    const userId = user.currentEmployee._id;

    EmployeeServ.get({
      _id: userId,
    })
      .then((res) => {
        setUserData(res);
        const certifications =
          res.certifications && res.certifications.length > 0
            ? res.certifications.filter((cert) => cert && cert.name && cert.url)
            : [{ name: '', url: '' }];

        reset();
        setCertifications(certifications);
        hideActionLoader();
      })
      .catch((err) => {
        hideActionLoader();
        console.log(err);
      });
  }, [user, reset]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);
  // console.log(userData,"User Data")
  useEffect(() => {
    EmployeeServ.on('created', () => getUserData());
    EmployeeServ.on('updated', () => getUserData());
    EmployeeServ.on('patched', () => getUserData());
    EmployeeServ.on('removed', () => getUserData());

    return () => {};
  }, [getUserData]);

  const handleUpdateDetails = async (data) => {
    showActionLoader();
    const docId = user.currentEmployee._id;

    const transformedCertifications = certifications
      .filter(
        (cert) => cert && cert.name?.trim() !== '' && cert.url?.trim() !== '',
      )
      .map((cert) => ({
        name: cert.name,
        url: cert.url,
      }));

    const filteredData = {
      ...data,
      certifications: transformedCertifications,
    };

    EmployeeServ.patch(docId, filteredData)
      .then(() => {
        hideActionLoader();
        setEdit(false);
        toast.success('Employee Data successfully updated');
      })
      .catch((err) => {
        hideActionLoader();
        toast.error(
          'Error updating Employee, probable network issues or ' + err,
        );
      });
  };

  const columns = [
    {
      name: 'S/N',
      key: 'sn',
      description: 'SN',
      selector: (row) => row.sn,
      sortable: true,
      inputType: 'HIDDEN',
      width: '60px',
    },
    {
      name: 'Name',
      key: 'name',
      description: 'Name',
      selector: (row) => row.name,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'URL',
      key: 'url',
      description: 'URL',
      selector: (row) => row.url,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
  ];

  return (
    <Box p={2} sx={{ height: '90vh', overflowY: 'auto' }}>
      <ModalBox
        open={imageUploadModal}
        onClose={() => setImageUploadModal(false)}
        header="Upload New Profile Photo"
      >
        <UpdateProfilePhoto closeModal={() => setImageUploadModal(false)} />
      </ModalBox>

      <ModalBox
        open={passwordModal}
        onClose={() => setPasswordModal(false)}
        header="Change Your Password"
      >
        <ChangeEmployeePassword closeModal={() => setPasswordModal(false)} />
      </ModalBox>

      <ModalBox
        open={signatureModal}
        onClose={() => setSignatureModal(false)}
        header="Upload Signature"
      >
        <SignatureModal
          closeModal={() => setSignatureModal(false)}
          prevSignature={userData?.signatureUrl}
        />
      </ModalBox>
      <ModalBox
        open={certificationsModal}
        onClose={() => setCertificationsModal(false)}
        header="Upload Certifications"
      >
        <CertificationsModal
          closeModal={() => setCertificationsModal(false)}
          prevCertifications={userData?.certificationsUrl}
        />
      </ModalBox>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        mb={1.5}
      >
        <Box>
          <IconButton onClick={handleOpenOptions}>
            <Avatar sx={{ width: 80, height: 80 }} src={userData?.imageurl} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleCloseOptions}
            anchorOrigin={{ horizontal: 'right', vertical: 'center' }}
          >
            <MenuItem sx={{ fontSize: '0.85rem' }}>Remove Image</MenuItem>
            <MenuItem
              sx={{ fontSize: '0.85rem' }}
              onClick={() => {
                setImageUploadModal(true);
                handleCloseOptions();
              }}
            >
              Change Image
            </MenuItem>
          </Menu>
        </Box>

        <Box sx={{ display: 'flex' }} gap={1.5}>
          <GlobalCustomButton onClick={() => setSignatureModal(true)}>
            <DriveFileRenameOutlineIcon fontSize="small" />
            Signature
          </GlobalCustomButton>

          <GlobalCustomButton
            onClick={() => setPasswordModal(true)}
            color="info"
          >
            <DriveFileRenameOutlineIcon fontSize="small" />
            Change Password
          </GlobalCustomButton>

          {edit ? (
            <>
              <GlobalCustomButton onClick={() => setEdit(false)} color="error">
                Cancel Edit
              </GlobalCustomButton>

              <GlobalCustomButton
                onClick={handleSubmit(handleUpdateDetails)}
                color="success"
              >
                <SystemUpdateAltIcon
                  fontSize="small"
                  sx={{ marginRight: '5px' }}
                />
                Update Details
              </GlobalCustomButton>
            </>
          ) : (
            <GlobalCustomButton onClick={() => setEdit(true)} color="warning">
              Edit Details
            </GlobalCustomButton>
          )}
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Input
            label="First Name"
            register={register('firstname')}
            disabled={!edit}
          />
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Input
            label="Last Name"
            register={register('lastname')}
            disabled={!edit}
          />
        </Grid>

        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Input
            label="Email Address"
            register={register('email')}
            disabled={true}
          />
        </Grid>

        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Input
            label="Phone Number"
            register={register('phone')}
            disabled={!edit}
          />
        </Grid>

        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Input
            label="Profession"
            register={register('profession')}
            disabled={!edit}
          />
        </Grid>

        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Input
            label="Position"
            register={register('position')}
            disabled={!edit}
          />
        </Grid>

        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Input
            label="Department"
            register={register('department')}
            disabled={!edit}
          />
        </Grid>

        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Input
            label="Department Unit"
            register={register('deptunit')}
            disabled={!edit}
          />
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Input
            label="Years of Practice"
            register={register('years_of_practice')}
            type="date"
            disabled={!edit}
          />
        </Grid>
        <Grid item xs={12}>
          <Textarea label="Bio" register={register('bio')} disabled={!edit} />
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <Typography variant="p" sx={{ fontSize: '0.8rem' }}>
            {' '}
            Consultation Type
          </Typography>

          <CheckboxGroup
            control={control}
            name="consultation_type"
            register={register('consultation_type')}
            options={['On-site', 'Teleconsultation', 'Home Visit']}
            disabled={!edit}
          />
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="p" sx={{ fontSize: '0.8rem' }}>
              Certifications
            </Typography>
            <GlobalCustomButton
              onClick={() => setCertificationsModal(true)}
              disabled={!edit}
            >
              <DriveFileRenameOutlineIcon fontSize="small" />
              Add Certifications
            </GlobalCustomButton>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item lg={4} md={6} sm={6} xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Input
                      label={`Certification Name`}
                      register={register(`certificationName`)}
                      disabled={!edit}
                      placeholder="Enter certification name"
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} my={2}>
                <CustomTable
                  columns={columns}
                  data={certifications || userData.certifications}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserAccountPage;

export const CertificationsModal = ({ closeModal }) => {
  const EmployeeServ = client.service('employee');
  const [file, setFile] = useState(null);
  const [base64, setBase64] = useState(null);
  const { user } = useContext(UserContext);
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

  async function handleUploadFile() {
    if (file === null || base64 === null)
      return toast.error('Please select a File to upload');

    showActionLoader();

    try {
      const uploadResponse = await uploadFile(getUploadUrl(), { uri: base64 });

      const employee = user.currentEmployee;
      const documentId = employee._id;

      // Update certifications array instead of certificationsUrl
      const updatedCertifications = [
        ...(employee.certifications || []),
        {
          name: docType,
          url: uploadResponse.data.url,
          date: new Date().toISOString(),
        },
      ];
      // console.log(updatedCertifications,"Updated Certifications")
      const updateEmployee = {
        ...employee,
        certifications: updatedCertifications,
      };

      await EmployeeServ.patch(documentId, updateEmployee);

      hideActionLoader();
      closeModal();
      toast.success(`Document uploaded successfully!`);
    } catch (error) {
      hideActionLoader();
      console.error('Upload error:', error);
      toast.error(`Failed to upload document: ${error.message}`);
    }
  }

  return (
    <Box sx={{ width: '500px', maxHeight: '600px' }}>
      <Box mt={1} mb={2}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <CustomSelect
              options={['Image', 'Document', 'Archive']}
              label="Type"
              onChange={(e) => setDoctype(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
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
};

export const SignatureModal = ({ closeModal, prevSignature }) => {
  const employeeServer = client.service('employee');
  const { state, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const { user } = useContext(UserContext);
  const [tab, setTab] = useState('view');
  const [imageURL, setImageURL] = useState(null);

  const sigCanvas = useRef({});

  // console.log(state);

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const handleUploadSignature = async () => {
    showActionLoader();
    const empty =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC';
    const file =
      tab === 'upload'
        ? imageURL
        : sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');

    if (file === null || file === empty)
      return toast.error('You cannot save an empty Signature');

    uploadFile(getUploadUrl(), { uri: file })
      .then(async (res) => {
        const signatureUrl = res.data.url;
        const employee = user.currentEmployee;

        const documentId = employee._id;

        await employeeServer
          .patch(documentId, { signatureUrl: signatureUrl })
          .then((res) => {
            hideActionLoader();
            closeModal();
            toast.success("You've successfully updated your Signature");
          })
          .catch((err) => {
            hideActionLoader();
            toast.error(
              `Error Updating Signature, probable network issues or ${err}`,
            );
          });
      })
      .catch((error) => {
        hideActionLoader();
        toast.error(`An error occured whilst updating your Siganture ${error}`);
        console.log(error);
      });
  };

  //signatureUrl;
  return (
    <Box
      sx={{
        width: '800px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        gap={1.2}
        mb={1.5}
        mt={-1}
      >
        <GlobalCustomButton color="info" onClick={() => setTab('view')}>
          View
        </GlobalCustomButton>
        <GlobalCustomButton color="success" onClick={() => setTab('upload')}>
          Upload
        </GlobalCustomButton>
        <GlobalCustomButton color="secondary" onClick={() => setTab('draw')}>
          Draw
        </GlobalCustomButton>
        <GlobalCustomButton color="error">Remove</GlobalCustomButton>
      </Box>

      {tab === 'upload' && (
        <Box mb={2}>
          <UploadSignatureImage returnBase64={(file) => setImageURL(file)} />
        </Box>
      )}

      {tab === 'view' && (
        <Box
          sx={{
            height: '400px',
            width: '100%',
            border: '1px solid #2d2d2d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          mb={2}
        >
          {prevSignature ? (
            <img
              src={prevSignature}
              alt=""
              style={{ width: '250px', height: 'auto' }}
            />
          ) : (
            <Typography>You haven't upload a Signature yet...</Typography>
          )}
        </Box>
      )}

      {tab === 'draw' && (
        <Box>
          <SignaturePad
            ref={sigCanvas}
            canvasProps={{
              className: 'signatureCanvas',
            }}
          />

          <Box>
            <GlobalCustomButton
              variant="text"
              color="error"
              onClick={clearSignature}
            >
              Clear Signature
            </GlobalCustomButton>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <GlobalCustomButton
          onClick={handleUploadSignature}
          disabled={tab === 'view'}
        >
          <SaveIcon fontSize="small" sx={{ marginRight: '5px' }} />
          Save Signature
        </GlobalCustomButton>
      </Box>
    </Box>
  );
};

const UploadComponent = ({}) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '400px',
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

export const UploadSignatureImage = ({ returnBase64 }) => {
  const employeeServer = client.service('employee');
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const { user, setUser } = useContext(UserContext);

  const [file, setFile] = useState(null);

  const handleChange = (file) => {
    getBase64(file)
      .then((res) => {
        setFile(res);
        returnBase64(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box sx={{ width: '500px', maxHeight: '80vw' }}>
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
            alt="img"
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
    </Box>
  );
};

export const ChangeEmployeePassword = ({ closeModal }) => {
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const { register, handleSubmit } = useForm();
  const ClientServ = client.service('users');

  const handleChangePassword = async (data) => {
    showActionLoader();

    const postObject = {
      action: 'passwordChange',
      value: {
        user: {
          email: user.currentEmployee.email,
        },
        oldPassword: data.old_password,
        password: data.new_password,
      },
    };

    /*    axios
      .post(
        "https://healthstack-backend.herokuapp.com/auth-management",
        {
          ...postObject,
        },
        {headers: {Authorization: `Bearer ${token}`}}
      )
 */
    ClientServ.patch(user._id, { password: data.new_password })
      .then(() => {
        hideActionLoader();
        closeModal();
        toast.success('You have successfully updated your account password');
      })
      .catch((err) => {
        hideActionLoader();
        toast.error(`There was an error updating your account ${err}`);
      });
  };

  return (
    <Box
      sx={{
        width: '500px',
      }}
    >
      <form>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <PasswordInput
            label="Old Password"
            important
            register={register('old_password', {
              required: 'Please provide your old password',
            })}
          />

          <PasswordInput
            important
            label="New Password"
            register={register('new_password', {
              required: 'Please provide your new password',
            })}
          />
        </Box>
      </form>

      <Box mt={2}>
        <GlobalCustomButton
          color="success"
          onClick={handleSubmit(handleChangePassword)}
        >
          <PasswordIcon fontSize="small" sx={{ marginRight: '5px' }} /> Update
          Password
        </GlobalCustomButton>
      </Box>
    </Box>
  );
};
