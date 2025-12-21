/* eslint-disable no-unused-vars */
import { renderToStaticMarkup } from 'react-dom/server';
import QRCode from 'qrcode';

import {
  useRef,
  forwardRef,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { Row, Col, Typography, Avatar, Divider, Space, Flex } from 'antd';
import { Box, Grid } from '@mui/material';
import { SendOutlined } from '@ant-design/icons';
import CustomTable from '../../components/customtable';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import client from '../../feathers';
import { ObjectContext, UserContext } from '../../context';
import { EmailsSourceList } from '../CRM/components/deals/SendLink';
import ModalBox from '../../components/modal';
import { useForm } from 'react-hook-form';
import Input from '../../components/inputs/basic/Input';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import axios from 'axios';
import dayjs from 'dayjs';
import styled from 'styled-components';
import Textarea from '../../components/inputs/basic/Textarea';

export const ClientIdCard = ({ data, action }) => {
  const EmployeeServ = client.service('employee');
  const [emailModal, setEmailModal] = useState(false);
  const [screenshot, setScreenshot] = useState('');
  const [beneficiaries, setBeneficiaries] = useState([]);
  const printRef = useRef(null);
  const screenshotRef = useRef(null);
  const [userData, setUserData] = useState({});
  const { user } = useContext(UserContext);
  const { state, setState } = useContext(ObjectContext);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [imgSrc, setImgSrc] = useState(
    'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg',
  );

  // Create enhanced data object without mutating the original prop
  const enhancedData = {
    ...data,
    organization: user?.currentEmployee?.facilityDetail,
    organizationName: user?.currentEmployee?.facilityDetail?.facilityName,
    qrCodeUrl: qrCodeUrl,
  };

  // With promises
  const getBarCodeUrl = async (clientData) => {
    QRCode.toDataURL(
      `https://app.healthstack.africa/client/${clientData?._id}`,
      /* `*** FullName : ${clientData?.firstname} ${clientData?.lastname} *** PolicyID: ${clientData?.policyNo} ***` */
    )
      .then((url) => {
        console.log('barcode', url);
        setQrCodeUrl(url);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const screenshotPrintout = async () => {
    const canvas = await html2canvas(screenshotRef.current, {
      logging: true,
      letterRendering: 1,
      useCORS: true,
    });
    const image = canvas.toDataURL('image/png', 1.0);
    setScreenshot(image);
    setEmailModal(true);
  };
  console.log('user client', user);

  const beneschema = [
    {
      name: 'S/N',
      key: 'sn',
      description: 'SN',
      selector: (row) => row.sn,
      sortable: true,
      inputType: 'HIDDEN',
      width: '50px',
    },
    {
      name: 'Beneficiary Name',
      key: 'beneficiaryname',
      description: 'Beneficiary Name',
      selector: (row) => `${row.firstname} ${row.lastname}`,
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'Policy Number',
      key: 'policynumber',
      description: 'Policy Number',
      selector: (row) => data?.policyNo,
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'Plan Name',
      key: 'planname',
      description: 'Plan Name',
      selector: (row) => data?.plan?.planName,
      sortable: true,
      inputType: 'HIDDEN',
    },
  ];

  console.log('DATA', data);
  const beneList = () => {
    let list = [];
    list = [data?.principal];
    setBeneficiaries(list);
  };

  const handleData = async () => {
    const newData = {
      selectedData: data,
    };
    await setState((prev) => ({ ...prev, data: newData }));
  };

  const getUserData = useCallback(() => {
    const userId = user.currentEmployee._id;
    EmployeeServ.get({
      _id: userId,
    })
      .then((res) => {
        setUserData(res);
        // console.log("USER DATA", res);
        //
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  useEffect(() => {
    getBarCodeUrl(data);
    beneList();
    handleData();
    getUserData();
  }, [data]);

  const ImgStyled = styled.img`
    width: 150px;
    height: 150px;
    margin-right: 50px;
    border-radius: 8px;
  `;

  const ImgStyledId = styled.img`
    width: 60px;
    height: 60px;
    margin-left: 50px;
    border-radius: 8px;
  `;

  return (
    <Box style={{ width: '60vw' }}>
      <Box
        sx={{
          width: '100%',
          //height: "40px",
          display: 'flex',
        }}
        gap={2}
        mb={2}
      >
        <ReactToPrint
          trigger={() => (
            <GlobalCustomButton color="info">Print Document</GlobalCustomButton>
          )}
          content={() => printRef.current}
        />

        <GlobalCustomButton onClick={screenshotPrintout}>
          Send Via Email
        </GlobalCustomButton>
      </Box>

      <ModalBox
        open={emailModal}
        onClose={() => setEmailModal(false)}
        header="Send Via Email Address"
      >
        <SendViaEmail
          closeModal={() => setEmailModal(false)}
          screenshot={screenshot}
          data={enhancedData}
        />
      </ModalBox>

      <Box
        sx={{
          display: 'none',
        }}
      >
        <ComponentToPrint ref={printRef} />
      </Box>

      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        ref={screenshotRef}
        p={1}
      >
        {/* <Box
					style={{
						marginTop: '0.2rem',
					}}>
					<Divider></Divider>
					 Find below your Policy ID Card 
				</Box> */}

        <Box
          sx={{
            maxWidth: '540px',
            minWidth: '540px',
            minHeight: '240px',
            maxHeight: '240px',
            margin: '1rem',
            borderRadius: '10px',
            // bgcolor: 'info.main',
            border: '2px solid blue',
          }}
          p={2}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Comapany Logo */}
            <Avatar
              sx={{ marginTop: '5px', marginRight: '10px' }}
              src={enhancedData?.organization?.facilitylogo}
              alt=""
            />
            <h1>{enhancedData?.organizationName}</h1>
          </Box>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid item xs={12} md={8}>
              <Typography sx={{ fontSize: '1rem', color: '#000000' }}>
                NAME: <b>{`${data?.firstname} ${data?.lastname}`}</b>
              </Typography>
              <Divider />
              <Typography sx={{ fontSize: '1rem', color: '#000000' }}>
                POLICY NO: <b>{data?.policyNo}</b>
              </Typography>
              <Divider />
              <Typography sx={{ fontSize: '1rem', color: '#000000' }}>
                SEX: <b>{data?.gender}</b>
              </Typography>
              <Divider />
              <Typography sx={{ fontSize: '1rem', color: '#000000' }}>
                DATE OF BIRTH: <b>{dayjs(data?.dob).format('DD/MM/YYYY')}</b>
              </Typography>
              <Divider />
              <Typography sx={{ fontSize: '1rem', color: '#000000' }}>
                GENOTYPE: <b>{data?.genotype}</b>
                <Divider orientation="vertical" flexItem />
              </Typography>
              <Divider />
              <Typography sx={{ fontSize: '1rem', color: '#000000' }}>
                BLOOD GROUP: <b>{data?.bloodgroup}</b>
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} pr={2}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ImgStyled
                  src={data?.imageurl ? data?.imageurl : imgSrc}
                  alt="Profile Pic"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            maxWidth: '540px',
            minWidth: '540px',
            minHeight: '240px',
            maxHeight: '240px',
            margin: '1rem',
            borderRadius: '10px',
            border: '2px solid blue',
          }}
          p={2}
        >
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid item xs={12} md={12}>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: '#000000',
                  textAlign: 'justify',
                }}
                mt={1}
              >
                The bearer of this card is a subscriber to
                {enhancedData?.organizationName} and entitled to receive
                appropriate medical care from his primary care provider and
                other referral centres as may be necessary.
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: '#000000',
                  textAlign: 'justify',
                }}
                mt={1}
              >
                This card MUST be presented at the point of service and remains
                the property of {enhancedData?.organizationName}.
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#000000' }} mt={1}>
                In the event of an emergency, kindly contact
                {enhancedData?.organizationName}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#000000' }} mt={1}>
                {`${enhancedData?.organization?.facilityAddress} ${
                  enhancedData?.organization?.facilityLGA || ''
                } ${enhancedData?.organization?.facilityCity || ''} ${
                  enhancedData?.organization?.facilityState || ''
                }`}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#000000' }}>
                CALL center: {enhancedData?.organization?.facilityContactPhone}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#000000' }}>
                EMAIL: {enhancedData?.organization?.facilityEmail}
              </Typography>
              <Grid
                container
                spacing={2}
                sx={{ alignItems: 'center', width: '100%' }}
              >
                <Grid item xs={6} md={6}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '60px',
                      float: 'left',
                      borderRadius: '10px',
                      //   bgcolor: "primary.main",
                      //   border: "2px solid red",
                    }}
                  >
                    <ImgStyledId
                      src={qrCodeUrl ? qrCodeUrl : imgSrc}
                      alt="QR Code"
                    />
                  </Box>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Box
                    sx={{
                      width: '100px',
                      height: '60px',
                      float: 'right',
                      borderRadius: '10px',
                      //   bgcolor: "info.main",
                      //   border: "2px solid blue",
                    }}
                  >
                    <img
                      src={userData?.signatureUrl}
                      alt=""
                      style={{
                        width: '60px',
                        height: '40px',
                      }}
                    />
                    <Divider></Divider>

                    <b>{userData?.profession}</b>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            {/* <Grid
							item
							xs={12}
							md={8}></Grid>
						<Grid
							item
							xs={12}
							md={4}>
							
						</Grid> */}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

const ComponentToPrint = forwardRef(({ action }, ref) => {
  const EmployeeServ = client.service('employee');
  const { state, setState } = useContext(ObjectContext);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [userData, setUserData] = useState({});
  const { user } = useContext(UserContext);
  const [imgSrc, setImgSrc] = useState(
    'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg',
  );

  const data = state?.data?.selectedData;

  // Create enhanced data object without mutating the original
  const enhancedData = {
    ...data,
    organization: user?.currentEmployee?.facilityDetail,
    organizationName: user?.currentEmployee?.facilityDetail?.facilityName,
  };

  console.log('selectedDataNew', data);

  const beneschema = [
    {
      name: 'S/N',
      key: 'sn',
      description: 'SN',
      selector: (row) => row.sn,
      sortable: true,
      inputType: 'HIDDEN',
      width: '50px',
    },
    {
      name: 'Beneficiary Name',
      key: 'beneficiaryname',
      description: 'Beneficiary Name',
      selector: (row) => `${row.firstname} ${row.lastname}`,
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'Policy Number',
      key: 'policynumber',
      description: 'Policy Number',
      selector: (row) => data?.policyNo,
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'Plan Name',
      key: 'planname',
      description: 'Plan Name',
      selector: (row) => data?.plan?.planName,
      sortable: true,
      inputType: 'HIDDEN',
    },
  ];

  const beneList = () => {
    let list = [];
    list = [data?.principal];
    setBeneficiaries(list);
  };

  // const handleData = async () => {
  // 	const newData = {
  // 		selectedData: data,
  // 	};
  // 	await setState((prev) => ({ ...prev, data: newData }));
  // };

  const getUserData = useCallback(() => {
    const userId = user.currentEmployee._id;
    EmployeeServ.get({
      _id: userId,
    })
      .then((res) => {
        setUserData(res);
        console.log('USER DATA', res);
        //
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      beneList();
      // handleData();
      getUserData();
    }, 2000);
  }, []);

  const ImgStyled = styled.img`
    width: 150px;
    height: 150px;
    margin-right: 50px;
    border-radius: 8px;
  `;

  const ImgStyledId = styled.img`
    width: 60px;
    height: 60px;
    margin-left: 50px;
    border-radius: 8px;
  `;

  return (
    <Box sx={{ width: '100%', height: '100%' }} p={4} ref={ref}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        p={1}
      >
        <Box
          sx={{
            maxWidth: '540px',
            minWidth: '540px',
            minHeight: '240px',
            maxHeight: '240px',
            margin: '2rem',
            borderRadius: '10px',
            // bgcolor: 'info.main',
            border: '2px solid blue',
          }}
          p={2}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Comapany Logo */}
            <Avatar
              sx={{ marginTop: '5px', marginRight: '10px' }}
              src={enhancedData?.organization?.facilitylogo}
              alt=""
            />
            <h1>{enhancedData?.organizationName}</h1>
          </Box>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid item xs={12} md={8}>
              <Typography sx={{ fontSize: '1rem', color: '#000000' }}>
                NAME: <b>{`${data?.firstname} ${data?.lastname}`}</b>
              </Typography>
              <Divider />
              <Typography sx={{ fontSize: '1rem', color: '#000000' }}>
                POLICY NO: <b>{data?.policyNo}</b>
              </Typography>
              <Divider />
              <Typography sx={{ fontSize: '1rem', color: '#000000' }}>
                SEX: <b>{data?.gender}</b>
              </Typography>
              <Divider />
              <Typography sx={{ fontSize: '1rem', color: '#000000' }}>
                DATE OF BIRTH: <b>{dayjs(data?.dob).format('DD/MM/YYYY')}</b>
              </Typography>
              <Divider />
              <Typography sx={{ fontSize: '1rem', color: '#000000' }}>
                GENOTYPE: <b>{data?.genotype}</b>
                <Divider orientation="vertical" flexItem />
              </Typography>
              <Divider />
              <Typography sx={{ fontSize: '1rem', color: '#000000' }}>
                BLOOD GROUP: <b>{data?.bloodgroup}</b>
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} pr={2}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ImgStyled
                  src={data?.imageurl ? data?.imageurl : imgSrc}
                  alt="Profile Pic"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            maxWidth: '540px',
            minWidth: '540px',
            minHeight: '240px',
            maxHeight: '240px',
            margin: '2rem',
            borderRadius: '10px',
            border: '2px solid blue',
            // bgcolor: 'info.main',
          }}
          p={2}
        >
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid item xs={12} md={12}>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: '#000000',
                  textAlign: 'justify',
                }}
                mt={1}
              >
                The bearer of this card is a subscriber to
                {enhancedData?.organizationName} and entitled to receive
                appropriate medical care from his primary care provider and
                other referral centres as may be necessary.
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: '#000000',
                  textAlign: 'justify',
                }}
                mt={1}
              >
                This card MUST be presented at the point of service and remains
                the property of {enhancedData?.organizationName}.
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#000000' }} mt={1}>
                In the event of an emergency, kindly contact
                {enhancedData?.organizationName}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#000000' }} mt={1}>
                {`${enhancedData?.organization?.facilityAddress} ${
                  enhancedData?.organization?.facilityLGA || ''
                } ${enhancedData?.organization?.facilityCity || ''} ${
                  enhancedData?.organization?.facilityState || ''
                }`}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#000000' }}>
                CALL center: {enhancedData?.organization?.facilityContactPhone}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#000000' }}>
                EMAIL: {enhancedData?.organization?.facilityEmail}
              </Typography>
              <Grid
                container
                spacing={2}
                sx={{ alignItems: 'center', width: '100%' }}
              >
                <Grid item xs={6} md={6}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '60px',
                      float: 'left',
                      borderRadius: '10px',
                      //   bgcolor: "primary.main",
                      //   border: "2px solid red",
                    }}
                  >
                    <ImgStyledId
                      src={data?.qrCodeUrl ? data?.qrCodeUrl : imgSrc}
                      alt="QR Code"
                    />
                  </Box>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Box
                    sx={{
                      width: '70px',
                      height: '60px',
                      float: 'right',
                      borderRadius: '10px',

                      //   bgcolor: "info.main",
                      //   border: "2px solid blue",
                    }}
                  >
                    <img
                      src={userData?.signatureUrl}
                      alt=""
                      style={{
                        width: '60px',
                        height: '40px',
                      }}
                    />
                    <Divider></Divider>

                    <b>{userData?.profession}</b>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            {/* <Grid
							item
							xs={12}
							md={8}></Grid>
						<Grid
							item
							xs={12}
							md={4}>
							
						</Grid> */}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
});

export const SendViaEmail = ({ closeModal, screenshot, data }) => {
  const emailServer = client.service('email');
  const { user } = useContext(UserContext);
  const { state, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [emailsModal, setEmailModals] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [destinationEmail, setDestinationEmail] = useState('');
  const [toEmailModal, setToEmailModal] = useState(false);

  // Create enhanced data object without mutating the original
  const enhancedData = {
    ...data,
    organization: user?.currentEmployee?.facilityDetail,
    organizationName: user?.currentEmployee?.facilityDetail?.facilityName,
  };

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    //const deal = state.DealModule.selectedDeal.email;
    reset({
      to: destinationEmail,
      name: user.currentEmployee.facilityDetail.facilityName,
      subject: `${enhancedData?.organizationName?.toUpperCase()} ID CARD`,
      from: selectedEmail,
    });
  }, [selectedEmail, destinationEmail, enhancedData?.organizationName]);

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    setEmailModals(false);
  };

  const handleSelectDestinationEmail = (email) => {
    setDestinationEmail(email);
    setToEmailModal(false);
  };

  const handleSendEmail = async (data) => {
    const facility = user.currentEmployee.facilityDetail;
    showActionLoader();

    const { uploadFile } = await import('../../utils/secureHttp');
    const { getUploadUrl } = await import('../../utils/env');
    uploadFile(getUploadUrl(), { uri: screenshot })
      .then(async (res) => {
        const imageUrl = res.data.url;

        const document = {
          organizationId: facility._id,
          organizationName: facility.facilityName,
          html: `<img src="${imageUrl}" alt="" >`,
          //attachments: attachments,
          text: data.message,
          status: 'pending',
          ...data,
        };

        await emailServer
          .create(document)
          .then((res) => {
            hideActionLoader();
            closeModal();
            toast.success(`The Document was sent successfully`);
          })
          .catch((err) => {
            hideActionLoader();
            console.log(err);
            toast.error(`Sorry, Failed to send Document ${err}`);
          });
      })
      .catch((err) => {
        toast.error(`Sorry, failed to send Document ${err}`);
      });

    //return console.log(document);
  };
  useEffect(() => {
    if (data) {
      setDestinationEmail(data?.email);
    }
  }, [data]);

  return (
    <Box
      sx={{
        width: '60vw',
      }}
    >
      <ModalBox
        open={emailsModal}
        //onClose={() => setEmailModals(false)}
        header="Plese Select Your Email Source"
      >
        <EmailsSourceList selectEmail={handleSelectEmail} />
      </ModalBox>

      <Box
        sx={{ display: 'flex', justifyContent: 'flex-end' }}
        mb={2}
        mt={-1}
        gap={1.5}
      >
        <GlobalCustomButton
          sx={{ marginTop: '5px' }}
          color="success"
          onClick={() => setEmailModals(true)}
        >
          Change Source Email
        </GlobalCustomButton>

        <GlobalCustomButton
          sx={{ marginTop: '5px' }}
          color="secondary"
          onClick={() => setToEmailModal(true)}
        >
          Change Destination Email
        </GlobalCustomButton>
      </Box>

      <Grid container spacing={1} mb={2}>
        <Grid item lg={6} md={6} sm={6}>
          <Input
            important
            label="Name"
            register={register('name', { require: 'Please enter Name' })}
            errorText={errors?.name?.message}
          />
        </Grid>

        <Grid item lg={6} md={6} sm={6}>
          <Input
            important
            label="Subject"
            register={register('subject', { require: 'Please enter Subject' })}
            errorText={errors?.subject?.message}
          />
        </Grid>

        <Grid item lg={6} md={6} sm={6} gap={1}>
          <Input
            important
            label="From"
            register={register('from', { require: 'Please Add Source Email' })}
            errorText={errors?.from?.message}
            disabled
          />
        </Grid>

        <Grid item lg={6} md={6} sm={6}>
          <Input
            important
            label="To"
            register={register('to', {
              require: 'Please Enter Destination Email',
            })}
            errorText={errors?.to?.message}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12}>
          <Textarea
            label="Message"
            register={register('message')}
            errorText={errors?.message?.message}
          />
        </Grid>
      </Grid>

      <Box>
        <GlobalCustomButton onClick={handleSubmit(handleSendEmail)}>
          Send Policy Via Email
          <SendOutlined fontSize="small" sx={{ marginLeft: '4px' }} />
        </GlobalCustomButton>
      </Box>
    </Box>
  );
};
