/* eslint-disable react/prop-types */
import { PageWrapper } from '../../../ui/styled/styles';
import { TableMenu } from '../../../ui/styled/global';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import { useForm } from 'react-hook-form';
import Input from '../../../components/inputs/basic/Input';
import { Box, Grid } from '@mui/material';
import Textarea from '../../../components/inputs/basic/Textarea';
import EmployeeSearch from '../../helpers/EmployeeSearch';
import { useContext, useEffect, useState } from 'react';
import CustomSelect from '../../../components/inputs/basic/Select';
import GrievanceChat from './GrievanceChat';
import client from '../../../feathers';
import { ObjectContext, UserContext } from '../../../context';
import { FacilitySearch } from '../../helpers/FacilitySearch';
import { toast } from 'react-toastify';
import ModalBox from '../../../components/modal';
import EscalateGrievance from './EscalateGrievance';

export default function NewGrievance({ setView }) {
  const { register, control, handleSubmit } = useForm();
  const [grievanceData, setGrievanceData] = useState();
  const [staff, setStaff] = useState('');
  const [organization, setOrganization] = useState('');
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);
  const { user } = useContext(UserContext); //,setUser
  const ClientServ = client.service('grevianceresolution');
  const [createModal, setCreateModal] = useState(false);

  const handleCreateModal = () => {
    setCreateModal(true);
    console.log('Modal created');
  };

  const handleHideCreateModal = () => {
    setCreateModal(false);
  };

  const handleGetSearchStaff = (obj) => {
    setStaff(obj);
  };
  const handleGetSearchOrganization = (obj) => {
    setOrganization(obj);
  };

  const getGrievance = async () => {
    const facId = user.currentEmployee.facilityDetail._id;

    let query = {
      facilityId: facId,
      $sort: {
        createdAt: -1,
      },
    };

    const res = await ClientServ.find({ query });

    setGrievanceData(res.data);
  };

  useEffect(() => {
    getGrievance();

    ClientServ.on('created', () => getGrievance());
    ClientServ.on('updated', () => getGrievance());
    ClientServ.on('patched', () => getGrievance());
    ClientServ.on('removed', () => getGrievance());
  }, []);

  const onSubmit = async (data) => {
    showActionLoader();
    if (user.currentEmployee) {
      data.facilityId = user.currentEmployee.facilityDetail._id;
      data.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
      data.createdByName = `${user.firstname} ${user.lastname}`;
      data.createdby = user.currentEmployee._id; // or from facility dropdown
    }

    console.log('Created by name', user.firstname, user.lastname);
    let done;
    if (data.status === 'Resolved') {
      done = true;
    } else {
      done = false;
    }
    const { stepname, datedone, comments, ...others } = data;
    const newGrievance = {
      ...others,
      hmostaffname: staff.firstname + ' ' + staff.lastname,
      hmo: organization._id,
      datedone,
      hmoname: organization.facilityName,
      process: {
        stepname,
        done,
        datedone,
        comments,
      },
    };
    console.log({ newGrievance });
    try {
      await ClientServ.create(newGrievance);
      toast.success('Grievance created successfully');
    } catch (err) {
      toast.error('Error creating grievance' + err);
    } finally {
      hideActionLoader();
    }
  };

  return (
    <>
      <div className="level">
        <PageWrapper
          style={{
            flexDirection: 'column',
            padding: '0.6rem 1rem',
          }}
        >
          <TableMenu>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',

                width: '100%',
              }}
            >
              <GlobalCustomButton
                text="Back"
                onClick={() => setView('GrievanceTable')}
                customStyles={{
                  float: 'right',
                }}
              />
              <h2
                style={{
                  marginLeft: '10px',
                  fontSize: '0.95rem',
                }}
              >
                Grievance Resolution
              </h2>
            </div>
          </TableMenu>

          <ModalBox
            open={createModal}
            onClose={handleHideCreateModal}
            header="Escalate Grievance"
          >
            <EscalateGrievance onClose={handleHideCreateModal} />
          </ModalBox>

          <form>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <FacilitySearch
                  getSearchfacility={handleGetSearchOrganization}
                  label={'Name of Organization'}
                />
              </Grid>
              <Grid item xs={4}>
                <EmployeeSearch
                  getSearchfacility={handleGetSearchStaff}
                  label="Lead Staff"
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  register={register('region')}
                  type="text"
                  label="Region"
                />
              </Grid>
              <Grid item xs={12}>
                <Textarea
                  register={register('issues')}
                  type="text"
                  label="Issue"
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  register={register('stepname')}
                  type="text"
                  label="Step Name"
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  register={register('datedone')}
                  type="date"
                  label="Date"
                />
              </Grid>
              <Grid item xs={4}>
                <CustomSelect
                  control={control}
                  name="status"
                  label="Status"
                  options={['Open', 'Closed', 'Resolved', 'Escalated']}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <Textarea
                  register={register('comments')}
                  type="text"
                  label="Comments"
                />
              </Grid> */}
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
              <GlobalCustomButton
                text="Submit"
                onClick={handleSubmit(onSubmit)}
              />
              <GlobalCustomButton
                text="Cancel"
                onClick={() => {
                  setView('GrievanceTable');
                }}
              />
            </Box>
          </form>

          <Box>
            <h2
              style={{
                fontSize: '0.95rem',
              }}
            >
              Conversation History
            </h2>

            {grievanceData && (
              <Box>
                {grievanceData.map((item, index) => (
                  <Box key={index}>
                    <GrievanceChat
                      id={item._id}
                      facilityName={item.facilityname}
                      issue={item.issues}
                      date={item.datedone.split('T')[0]}
                      status={item.status}
                      staff={item.hmostaffname}
                      facId={item._id}
                      comment={item.process[0].comments}
                      handleCreateModal={handleCreateModal}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </PageWrapper>
      </div>
    </>
  );
}
