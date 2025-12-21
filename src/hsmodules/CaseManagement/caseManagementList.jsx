import React from 'react';
import CustomTable from '../../components/customtable';
import { TableMenu } from '../../ui/styled/global';
import { PageWrapper } from '../app/styles';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import FilterMenu from '../../components/utilities/FilterMenu';
import { AddCircleOutline } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useContext } from 'react';
import { ObjectContext, UserContext } from '../../context';
import client from '../../feathers';
import { useEffect } from 'react';
import { format } from 'date-fns';
import CustomConfirmationDialog from '../../components/confirm-dialog/confirm-dialog';
import { toast } from 'react-toastify';

export default function CaseManagementList({ showDetail, showCreate }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const casemgtServ = client.service('casemgt');
  const [casemgt, setCaseMgt] = useState([]);
  const { setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [casemgtToDelete, setCaseMgtToDelete] =
    useState(null);
  const { user } = useContext(UserContext);
  const [confirmationDialog, setConfirmationDialog] = useState(false);

  const casemgtSchema = [
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

  const getcasemgt = async () => {
    const findFacilities = await casemgtServ.find({
      query: {
        facilityId: user.currentEmployee.facilityDetail._id,
        $sort: {
          createdAt: -1,
        },
        $limit: limit,
        $skip: (page - 1) * limit,
      },
    });
    // console.log(findFacilities);
    setTotal(findFacilities.total);
    setCaseMgt(findFacilities.data);
  };

  useEffect(() => {
    getcasemgt();
    casemgtServ.on('created', (obj) =>
      getcasemgt(),
    );
    casemgtServ.on('updated', (obj) =>
      getcasemgt(),
    );
    casemgtServ.on('patched', (obj) =>
      getcasemgt(),
    );
    casemgtServ.on('removed', (obj) =>
      getcasemgt(),
    );
    return () => {};
  }, [limit, page]);

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = () => {
    showActionLoader();
    casemgtServ.remove(casemgtToDelete._id)
      .then(() => {
        hideActionLoader();
        toast.success(`Enrollee Sensitization Deleted successfully`);
        setConfirmationDialog(false);
      })
      .catch((err) => {
        hideActionLoader();
        toast.error('Error deleting enrollee sensitization ' + err);
      });
  };

  const handleConfirmDelete = (data) => {
    setCaseMgtToDelete(data);
    setConfirmationDialog(true);
  };

  const closeConfirmationDialog = () => {
    setCaseMgtToDelete(null);
    setConfirmationDialog(false);
  };

  const handleSearch = () => {};

  const handleRow = (data) => {
    setState((prev) => ({
      ...prev,
      ProviderRelationshipModule: {
        ...prev.ProviderRelationshipModule,
        selectedCaseMgt: data,
      },
    }));
    showDetail();
  };

  const handleCreateNew = () => {
    showCreate();
  };

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
              Case Audit Management
            </h2>
          </div>

          <GlobalCustomButton onClick={handleCreateNew}>
            <AddCircleOutline fontSize="small" sx={{ marginRight: '5px' }} />
            Add Case Audit
          </GlobalCustomButton>
        </TableMenu>

        <div
          className="level"
          style={{
            overflow: 'auto',
          }}
        >
          <CustomTable
            title={''}
            columns={casemgtSchema}
            data={casemgt}
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
        confirmationAction={() => handleDelete(casemgtToDelete)}
        cancelAction={closeConfirmationDialog}
        type="danger"
        message={`You are about to delete an enrollee sensitization`}
      />
    </div>
  );
}
