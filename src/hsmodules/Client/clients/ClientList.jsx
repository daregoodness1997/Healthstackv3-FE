/* eslint-disable */
import React, { useState, useContext, useEffect } from 'react';
import client from '../../../feathers';
import { UserContext, ObjectContext } from '../../../context';
import { toast } from 'react-toastify';
import { UserAddOutlined, DeleteOutlined } from '@ant-design/icons';
import 'react-datepicker/dist/react-datepicker.css';
import UploadClients from '../UploadClient';
import dayjs from 'dayjs';
import FilterMenu from '../../../components/utilities/FilterMenu';
import { PageWrapper } from '../../../ui/styled/styles';
import { TableMenu } from '../../../ui/styled/global';
// import { ClientMiniSchema } from "../schema";
import { Avatar, Space, Button } from 'antd';
import { Box, IconButton } from '@mui/material';
import CustomTable from '../../../components/customtable';
import ModalBox from '../../../components/modal';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
// import MuiClearDatePicker from "../../../components/inputs/Date/MuiClearDatePicker";
import NewBeneficiaryModule from '../../ManagedCare/FindBeneficiary';
import {
  updateOnDeleted,
  updateOnPatched,
  updateOnUpdated,
} from '../../../functions/Updates';
import { returnAvatarString } from '../../helpers/returnAvatarString';
import { formatDistanceToNowStrict } from 'date-fns';
import CustomConfirmationDialog from '../../../components/confirm-dialog/confirm-dialog';

export default function ClientList({ openCreateModal, openDetailModal }) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const ClientServ = client.service('client');
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(); //
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [uploadModal, setUploadModal] = useState(false);
  const data = localStorage.getItem('user');
  // const user = JSON.parse(data);
  const { user } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [showHmo, setShowHmo] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [docToDel, setDocToDel] = useState({});
  const [viewBranchOnly, setViewBranchOnly] = useState(true);

  const handleCreateNew = async () => {
    const newClientModule = {
      selectedClient: {},
      show: 'create',
    };
    await setState((prevstate) => ({
      ...prevstate,
      ClientModule: newClientModule,
    }));
    openCreateModal(true);
  };

  // const handleCloseModal = () => {
  //   setOpen(false);
  // };
  // console.log(state);

  const handleRow = async (ClientId) => {
    const getClientbyId = await ClientServ.get(ClientId._id);
    const Client = getClientbyId;
    setSelectedClient(Client);
    const newClientModule = {
      selectedClient: Client,
      show: 'detail',
    };
    await setState((prevstate) => ({
      ...prevstate,
      ClientModule: newClientModule,
    }));

    openDetailModal();
  };

  const handleSearch = (val) => {
    const query = {
      $or: [
        {
          firstname: {
            $regex: val,
            $options: 'i',
          },
        },
        {
          lastname: {
            $regex: val,
            $options: 'i',
          },
        },
        {
          middlename: {
            $regex: val,
            $options: 'i',
          },
        },
        {
          phone: {
            $regex: val,
            $options: 'i',
          },
        },
        {
          clientTags: {
            $regex: val,
            $options: 'i',
          },
        },
        {
          mrn: {
            $regex: val,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: val,
            $options: 'i',
          },
        },
        {
          phone: {
            $regex: val,
            $options: 'i',
          },
        },
        {
          specificDetails: {
            $regex: val,
            $options: 'i',
          },
        },
        { gender: val },
      ],
      $limit: limit,
      $sort: {
        createdAt: -1,
      },
    };

    if (viewBranchOnly && user.currentEmployee) {
      query['relatedfacilities.facility'] =
        user.currentEmployee.facilityDetail._id;
    }

    ClientServ.find({ query })
      .then((res) => {
        setFacilities(res.data);
        toast.success(' Client  fetched successfully');
        setSuccess(true);
      })
      .catch((err) => {
        toast.error(err);
        setError(true);
      });
  };

  const getFacilities = async () => {
    try {
      const query = {
        query: {
          $limit: limit,
          $skip: (page - 1) * limit,
          $sort: { createdAt: -1 },
          $select: [
            'firstname',
            'lastname',
            'phone',
            'gender',
            'email',
            'alive',
            'dob',
            'mrn',
            'imageUrl',
          ],
        },
      };

      if (viewBranchOnly && user.currentEmployee) {
        query.query['relatedfacilities.facility'] =
          user.currentEmployee.facilityDetail._id;
      }

      const findClient = await ClientServ.find(query);
      // console.log(findClient.data)
      setFacilities(findClient.data);
      setTotal(findClient.total);
    } catch (error) {
      return error;
      // console.error("Error fetching facilities:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilities = async () => {
    await getFacilities();
  };

  useEffect(() => {
    getFacilities();
  }, [viewBranchOnly]);

  const handleDelete = async (obj) => {
    await ClientServ.remove(obj._id)
      .then((resp) => {
        toast.success('Sucessfuly deleted client ');
        setConfirmDialog(false);
      })
      .catch((err) => {
        toast.error('Error deleting client ' + err);
        setConfirmDialog(false);
      });
  };

  const handleConfirmDelete = (doc) => {
    setDocToDel(doc);
    setConfirmDialog(true);
  };

  const handleCancelConfirm = () => {
    setDocToDel({});
    setConfirmDialog(false);
  };

  const ClientMiniSchema = [
    {
      name: 'S/N',
      key: 'sn',
      description: 'SN',
      selector: (row, i) => i + 1,
      sortable: true,
      inputType: 'HIDDEN',
      width: '50px',
    },

    {
      name: 'Image',
      key: 'imageurl',
      description: 'Midlle Name',
      selector: (row) => (
        <Avatar
          src={row.imageurl}
          {...returnAvatarString(
            `${row.firstname.replace(/\s/g, '')} ${row.lastname.replace(
              /\s/g,
              '',
            )}`,
          )}
        />
      ),
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '100px',
    },

    {
      name: 'First Name',
      key: 'firstname',
      description: 'First Name',
      selector: (row) => row.firstname,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      style: {
        textTransform: 'capitalize',
      },
    },
    {
      name: 'Last Name',
      key: 'lastname',
      description: 'Last Name',
      selector: (row) => row.lastname,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      style: {
        textTransform: 'capitalize',
      },
    },
    {
      name: 'Gender',
      key: 'gender',
      description: 'Gender',
      selector: (row) => (row.gender ? row.gender : 'unspecified'),
      sortable: true,
      required: true,
      inputType: 'SELECT_LIST',
      options: ['Male', 'Female'],
      width: '100px',
      style: {
        textTransform: 'capitalize',
      },
    },
    {
      name: 'Age',
      key: 'age',
      description: 'Age',
      selector: (row) =>
        row.dob ? formatDistanceToNowStrict(new Date(row.dob)) : 'Not Stated',
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'MRN',
      key: 'mrn',
      description: 'Nigeria',
      selector: (row) => row.mrn,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Phone Number',
      key: 'phone',
      description: '0806478263',
      selector: (row) => row.phone,
      sortable: true,
      required: true,
      inputType: 'PHONE',
      /*  width: "140px", */
    },

    {
      name: 'Email',
      key: 'email',
      description: 'johndoe@mail.com',
      selector: (row) => (row.email ? row.email : '----------'),
      sortable: true,
      required: true,
      inputType: 'EMAIL',
    },

    {
      name: 'State',
      key: 'state',
      description: 'Lagos',
      selector: (row) => row.state,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      omit: true,
    },
    {
      name: 'Status',
      key: 'active',
      description: 'Next of Kin',
      selector: (row) => (row.alive ? 'Alive' : 'Dead'),
      sortable: true,
      required: true,
      inputType: 'TEXT',
      omit: false,
    },
    {
      name: 'Actions',
      key: 'action',
      description: 'Enter Action',
      selector: (row) => (
        <IconButton size="small" onClick={() => handleConfirmDelete(row)}>
          <DeleteOutlined fontSize="small" sx={{ color: 'red' }} />
        </IconButton>
      ),
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '100px',
      center: true,
    },
  ];

  useEffect(() => {
    if (user) {
      fetchFacilities();
    }
  }, [limit, page]);

  useEffect(() => {
    const handleDataCreated = () => fetchFacilities();
    const handleDataUpdated = (obj) =>
      setFacilities(updateOnUpdated(facilities, obj));
    const handleDataPatched = (obj) =>
      setFacilities(updateOnPatched(facilities, obj));
    const handleDataRemoved = (obj) =>
      setFacilities(updateOnDeleted(facilities, obj));

    ClientServ.on('created', handleDataCreated);
    ClientServ.on('updated', handleDataUpdated);
    ClientServ.on('patched', handleDataPatched);
    ClientServ.on('removed', handleDataRemoved);

    return () => {
      ClientServ.off('created', handleDataCreated);
      ClientServ.off('updated', handleDataUpdated);
      ClientServ.off('patched', handleDataPatched);
      ClientServ.off('removed', handleDataRemoved);
    };
  }, [facilities]);

  const conditionalRowStyles = [
    {
      when: (row) => row.alive === false,
      style: {
        backgroundColor: 'pink',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
  ];

  const createClient = async (data) => {
    const defaultEmail = `${data.firstname}-${data.lastname}-${dayjs(
      data.dob,
    ).format('DD/MM/YYY')}@healthstack.africa`;

    const clientData = {
      ...data,
      facility: user.currentEmployee.facility,
      email: data.email || defaultEmail,
    };

    await ClientServ.create(clientData)
      .then((res) => {
        toast.success(
          `Client ${data.firstname} ${data.lastname} successfully created`,
        );
      })
      .catch((err) => {
        toast.error(
          `Sorry, You weren't able to create client ${data.firstname} ${data.lastname} . ${err}`,
        );
      });
  };

  const handleCreateMultipleClients = async (data) => {
    showActionLoader();
    const promises = data.map(async (item) => {
      await createClient(item);
    });
    await Promise.all(promises);
    hideActionLoader();
    setUploadModal(false);
    toast.success(`Sucessfully created ${data.length} Client(s)`);
  };

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  // console.log(facilities);

  return (
    <>
      {user ? (
        <>
          <CustomConfirmationDialog
            open={confirmDialog}
            cancelAction={handleCancelConfirm}
            confirmationAction={() => handleDelete(docToDel)}
            message={`Are you sure you want to delete this`}
          />
          {/* <ModalBox open={open} onClose={handleCloseModal} width="75%">
            <ClientView
              user={selectedClient}
              open={open}
              setOpen={handleCloseModal}
            />
          </ModalBox> */}
          <ModalBox
            open={showHmo}
            onClose={() => setShowHmo(false)}
            width="85%"
            header="Find HMO Patient"
          >
            <NewBeneficiaryModule />
          </ModalBox>

          <ModalBox
            open={uploadModal}
            onClose={() => setUploadModal(false)}
            header="Upload and Create Multiple Clients"
          >
            <UploadClients
              closeModal={() => setUploadModal(false)}
              createClients={handleCreateMultipleClients}
            />
          </ModalBox>

          <PageWrapper
            style={{ flexDirection: 'column', padding: '0.6rem 1rem' }}
          >
            <TableMenu>
              <Box style={{ display: 'flex', alignItems: 'center' }} gap={1}>
                <div className="inner-table">
                  <FilterMenu onSearch={handleSearch} />
                </div>

                <h2 style={{ marginLeft: '10px', fontSize: '0.95rem' }}>
                  List of Clients
                </h2>

                <Box>
                  {/*  <MuiClearDatePicker
                    value={filterEndDate}
                    setValue={setFilterEndDate}
                  /> */}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/*  <GlobalCustomButton onClick={() => setShowHmo(true)}>
                  <UserAddOutlined fontSize="small" sx={{ marginRight: "5px" }} />
                  Find HMO Patients
                </GlobalCustomButton> */}
                <GlobalCustomButton onClick={() => setUploadModal(true)}>
                  Upload Sheet
                </GlobalCustomButton>

                <GlobalCustomButton onClick={handleCreateNew}>
                  <UserAddOutlined
                    fontSize="small"
                    sx={{ marginRight: '5px' }}
                  />
                  Create New Client
                </GlobalCustomButton>
              </Box>
            </TableMenu>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <label className="checkbox is-small">
                <input
                  type="checkbox"
                  checked={viewBranchOnly}
                  onChange={(e) => setViewBranchOnly(e.target.checked)}
                  style={{ marginRight: '5px' }}
                />
                View Branch Only
              </label>
            </Box>

            <div
              style={{
                width: '100%',

                overflow: 'auto',
              }}
            >
              <CustomTable
                title={''}
                columns={ClientMiniSchema}
                data={facilities}
                pointerOnHover
                highlightOnHover
                striped
                onRowClicked={handleRow}
                conditionalRowStyles={conditionalRowStyles}
                progressPending={loading}
                onChangeRowsPerPage={onTableChangeRowsPerPage}
                onChangePage={onTablePageChange}
                pagination
                paginationServer
                paginationTotalRows={total}
              />
            </div>
          </PageWrapper>
        </>
      ) : (
        <div>loading</div>
      )}
    </>
  );
}
