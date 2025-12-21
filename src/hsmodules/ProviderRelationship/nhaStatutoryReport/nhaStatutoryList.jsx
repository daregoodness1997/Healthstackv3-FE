import React, { useContext, useEffect } from 'react';
import CustomTable from '../../../components/customtable';
import { TableMenu } from '../../../ui/styled/global';
import { PageWrapper } from '../../app/styles';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import FilterMenu from '../../../components/utilities/FilterMenu';
import { AddCircleOutline } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useState } from 'react';
import client from '../../../feathers';
import { ObjectContext, UserContext } from '../../../context';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import CustomConfirmationDialog from '../../../components/confirm-dialog/confirm-dialog';

export const NhiaStatutoryServ = client.service('nhiastatreport');

export default function NhaStatutoryList({ showDetail, showCreate }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [NhiaStatutory, setNhiaStatutory] = useState(
    // dummyProvisionMonitoringData,
    [],
  );

  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [NhiaStatutoryToDelete, setNhiaStatutoryToDelete] = useState(null);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const { user } = useContext(UserContext);

  //console.log(state);

  const NhiaStatutorySchema = [
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
      name: 'Organization Name',
      key: 'sn',
      description: 'Enter name of Company',
      selector: (row) => (
        <Typography
          sx={{ fontSize: '0.8rem', whiteSpace: 'normal' }}
          data-tag="allowRowEvents"
        >
          {row?.hmoname}
        </Typography>
      ),
      sortable: true,
      required: true,
      inputType: 'HIDDEN',
      style: {
        color: '#1976d2',
        textTransform: 'capitalize',
      },
    },
    {
      name: 'Staff Name',
      key: 'type',
      description: 'Enter Staff name',
      selector: (row) => row?.hmostaffname,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      style: {
        textTransform: 'capitalize',
      },
    },

    {
      name: 'Status',
      key: 'status',
      description: 'Status',
      selector: (row) => row?.status,
      sortable: true,
      required: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'Date',
      key: 'date',
      description: 'Date',
      selector: (row) =>
        row.updatedAt ? format(new Date(row.updatedAt), 'dd-MM-yy') : '',
      sortable: true,
      required: true,
      inputType: 'DATE',
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

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = () => {
    showActionLoader();
    NhiaStatutoryServ.remove(NhiaStatutoryToDelete._id)
      .then(() => {
        hideActionLoader();
        toast.success(`Nhis Statutory Report Deleted successfully`);
        setConfirmationDialog(false);
      })
      .catch((err) => {
        hideActionLoader();
        toast.error('Error deleting Nhia statutory ' + err);
      });
  };

  const handleConfirmDelete = (data) => {
    setNhiaStatutoryToDelete(data);
    setConfirmationDialog(true);
  };

  const closeConfirmationDialog = () => {
    setNhiaStatutoryToDelete(null);
    setConfirmationDialog(false);
  };

  const handleSearch = () => {};

  const handleRow = (data) => {
    setState((prev) => ({
      ...prev,
      ProviderRelationshipModule: {
        ...prev.ProviderRelationshipModule,
        selectedNhiaStatutory: data,
      },
    }));
    showDetail();
  };

  const handleCreateNew = () => {
    showCreate();
  };

  const getProviderMonitor = async () => {
    const findFacilities = await NhiaStatutoryServ.find({
      query: {
        facilityId: user.currentEmployee.facilityDetail._id,
        $sort: {
          createdAt: -1,
        },
        $limit: limit,
        $skip: (page - 1) * limit,
      },
    });
    console.log(findFacilities);
    setTotal(findFacilities.total);
    setNhiaStatutory(findFacilities.data);
  };

  useEffect(() => {
    getProviderMonitor();
    NhiaStatutoryServ.on('created', (obj) => getProviderMonitor());
    NhiaStatutoryServ.on('updated', (obj) => getProviderMonitor());
    NhiaStatutoryServ.on('patched', (obj) => getProviderMonitor());
    NhiaStatutoryServ.on('removed', (obj) => getProviderMonitor());
    return () => {};
  }, [limit, page]);

  return (
    <div className="level">
      <PageWrapper style={{ flexDirection: 'column', padding: '0.6rem 1rem' }}>
        <TableMenu>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {handleSearch && (
              <div className="inner-table">
                <FilterMenu onSearch={handleSearch} />
              </div>
            )}
            <h2 style={{ margin: '0 10px', fontSize: '0.95rem' }}>
              Nhia Statutory Report
            </h2>
          </div>

          <GlobalCustomButton onClick={handleCreateNew}>
            <AddCircleOutline fontSize="small" sx={{ marginRight: '5px' }} />
            Nhia Statutory Report
          </GlobalCustomButton>
        </TableMenu>

        <div
          className="level"
          style={{
            // height: "calc(100vh - 180px)",
            overflow: 'auto',
          }}
        >
          <CustomTable
            title={''}
            columns={NhiaStatutorySchema}
            data={NhiaStatutory}
            pointerOnHover
            highlightOnHover
            striped
            onChangeRowsPerPage={onTableChangeRowsPerPage}
            onChangePage={onTablePageChange}
            onRowClicked={handleRow}
            // progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={total}
          />
        </div>
      </PageWrapper>
      <CustomConfirmationDialog
        open={confirmationDialog}
        confirmationAction={() => handleDelete(NhiaStatutoryToDelete)}
        cancelAction={closeConfirmationDialog}
        type="danger"
        message={`You are about to delete a  Nhia Statutory report`}
      />
    </div>
  );
}
