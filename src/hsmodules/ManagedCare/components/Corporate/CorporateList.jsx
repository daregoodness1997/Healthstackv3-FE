import React, { useState, useContext, useEffect, useCallback } from 'react';

import CustomTable from '../../../../components/customtable';
import FilterMenu from '../../../../components/utilities/FilterMenu';

import GlobalCustomButton from '../../../../components/buttons/CustomButton';
import { toast } from 'react-toastify';
import { FormsHeaderText } from '../../../../components/texts';
import { ObjectContext, UserContext } from '../../../../context';
import client from '../../../../feathers';
import { Box, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CustomConfirmationDialog from '../../../../components/confirm-dialog/confirm-dialog';

const CorporateListComponent = ({ showCreate, showDetails }) => {
  const orgClientServer = client.service('organizationclient');
  const { state, setState } = useContext(ObjectContext);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [organizationClients, setOrganizationClients] = useState([]);

  const handleCreateNew = async () => {
    showCreate();
  };

  const handleRow = async (data) => {
    //console.log(data);
    const getData = await orgClientServer.get(data._id);
    setState((prev) => ({
      ...prev,
      ManagedCareCorporate: {
        ...prev.ManagedCareCorporate,
        selectedCorporate: getData,
      },
    }));
    showDetails();
  };

  const handleSearch = (val) => {
    if (val.trim() === '' && val.length < 3) return;
    orgClientServer
      .find({
        query: {
          facility: user.currentEmployee.facilityDetail._id,
          relationshiptype: 'sponsor',
          $search: val,
          //$limit: 10,
          //$select: ['band', 'organizationDetail'],
          $sort: {
            createdAt: -1,
          },
        },
      })
      .then((res) => {
        console.log(res);
        setOrganizationClients(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(`Something went wrong! ${err}`);
      });
  };

  const getOrganizationClients = async () => {
    // const preservedList = state.ManagedCareCorporate.preservedList;
    // if (preservedList.length > 0) return setOrganizationClients(preservedList);

    setLoading(true);
    const res = await orgClientServer
      .find({
        query: {
          facility: user.currentEmployee.facilityDetail._id,
          relationshiptype: 'sponsor',
          //$limit: 1000,

          $limit: limit,
          $skip: (page - 1) * limit,
          //$select: ['band', 'organizationDetail'],
          $sort: {
            createdAt: -1,
          },
        },
      })
      .then((res) => {
        console.log(res.data);
        setOrganizationClients(res.data);
        setLoading(false);
        setTotal(res.total);
        setState((prev) => ({
          ...prev,
          ManagedCareCorporate: {
            ...prev.ManagedCareCorporate,
            preservedList: res.data,
          },
        }));
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error(`Something went wrong! ${err}`);
      });
  };

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    getOrganizationClients();

    orgClientServer.on('created', (obj) =>
      setOrganizationClients((prev) => [obj, ...prev]),
    );
    orgClientServer.on('updated', (obj) => getOrganizationClients());
    orgClientServer.on('patched', (obj) => getOrganizationClients());
    orgClientServer.on('removed', (obj) => getOrganizationClients());
    return () => {};
  }, [limit, page]);

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [docToDel, setDocToDel] = useState({});

  const handleDelete = async (obj) => {
    await orgClientServer
      .remove(obj._id)
      .then((resp) => {
        toast.success('Sucessfuly deleted ProductEntry ');
        setConfirmDialog(false);
      })
      .catch((err) => {
        toast.error('Error deleting ProductEntry ' + err);
        setConfirmDialog(false);
      });
  };

  const handleConfirmDelete = (doc) => {
    console.log(doc);
    setDocToDel(doc);
    setConfirmDialog(true);
  };

  const handleCancelConfirm = () => {
    setDocToDel({});
    setConfirmDialog(false);
  };

  const OrganizationClientSchema = [
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
      name: 'Organization',
      key: 'facilityName',
      description: 'Organization',
      selector: (row) => row?.organizationDetail?.facilityName,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Address',
      key: 'facilityAddress',
      description: 'Address',
      selector: (row) => row?.organizationDetail?.facilityAddress,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'City',
      key: 'facilityCity',
      description: 'City',
      selector: (row) => row?.organizationDetail?.facilityCity,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '120px',
    },
    {
      name: 'Band',
      key: 'band',
      description: 'Band',
      selector: (row) => row.band,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '100px',
    },

    {
      name: 'Phone',
      key: 'phone',
      description: 'Phone',
      selector: (row) => row?.organizationDetail?.facilityContactPhone,
      sortable: true,
      required: true,
      inputType: 'PHONE',
      width: '100px',
    },

    {
      name: 'Email',
      key: 'facilityEmail',
      description: 'simpa@gmail.com',
      selector: (row) => row?.organizationDetail?.facilityEmail,
      sortable: true,
      required: true,
      inputType: 'EMAIL',
      width: '120px',
    },

    {
      name: 'Type',
      key: 'facilityType',
      description: 'Facility Type',
      selector: (row) => row?.organizationDetail?.facilityType,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '120px',
    },

    {
      name: 'Category',
      key: 'facilityCategory',
      description: 'Category',
      selector: (row) => row?.organizationDetail?.facilityCategory,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '100px',
    },
    {
      name: 'Actions',
      key: 'action',
      description: 'Enter Action',
      selector: (row) => (
        <IconButton size="small" onClick={() => handleConfirmDelete(row)}>
          <DeleteOutlineIcon fontSize="small" sx={{ color: 'red' }} />
        </IconButton>
      ),
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '100px',
      center: true,
    },
  ];

  return (
    <Box p={2}>
      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={handleCancelConfirm}
        confirmationAction={() => handleDelete(docToDel)}
        message={`Are you sure you want to delete this exit with No: ${docToDel?.sn}`}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        mb={2}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          <FilterMenu onSearch={handleSearch} />
          <FormsHeaderText text="Lists of Corporate Organizations" />({total})
        </Box>

        <Box>
          <GlobalCustomButton onClick={handleCreateNew}>
            Add New Corporate
          </GlobalCustomButton>
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          height: 'calc(100vh - 150px)',
          overflowY: 'auto',
        }}
      >
        <CustomTable
          title={''}
          columns={OrganizationClientSchema}
          data={organizationClients}
          pointerOnHover
          highlightOnHover
          striped
          onRowClicked={handleRow}
          progressPending={loading}
          onChangeRowsPerPage={onTableChangeRowsPerPage}
          onChangePage={onTablePageChange}
          pagination
          paginationServer
          paginationTotalRows={total}
        />
      </Box>
    </Box>
  );
};

export default CorporateListComponent;
