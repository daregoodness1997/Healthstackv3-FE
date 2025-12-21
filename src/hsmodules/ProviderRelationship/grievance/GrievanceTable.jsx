/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { PageWrapper } from '../../../ui/styled/styles';
import { TableMenu } from '../../../ui/styled/global';
import FilterMenu from '../../../components/utilities/FilterMenu';
import CustomTable from '../../../components/customtable';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext, useEffect, useState } from 'react';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import { ObjectContext, UserContext } from '../../../context';
import client from '../../../feathers';
import CustomConfirmationDialog from '../../../components/confirm-dialog/confirm-dialog';
import { toast } from 'react-toastify';

export default function GrievanceTable({ setView }) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);
  const { user } = useContext(UserContext); //,setUser
  const ClientServ = client.service('grevianceresolution');
  const [grievanceData, setGrievanceData] = useState();
  const [grievanceToDelete, setGrievanceToDelete] = useState(null);
  const [confirmationDialog, setConfirmationDialog] = useState(false);

  console.log({ grievanceData });

  const handleSearch = () => {};

  const handleConfirmDelete = (grievance) => {
    setGrievanceToDelete(grievance);
    setConfirmationDialog(true);
  };

  const GrievanceSchema = [
    {
      name: 'S/N',
      key: 'sn',
      description: 'SN',
      selector: (row) => row.sn,
      sortable: true,
      inputType: 'HIDDEN',
      width: '100px',
    },
    {
      name: 'Organization Name',
      key: 'hmoname',
      description: 'Organization Name',
      selector: (row) => row.hmoname,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '200px',
    },
    {
      name: 'Staff Name',
      key: 'hmostaffname',
      description: 'Staff Name',
      selector: (row) => row.hmostaffname,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '200px',
    },
    {
      name: 'Status',
      key: 'status',
      description: 'Status',
      selector: (row) => row.status,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '200px',
    },
    {
      name: 'Date/Time',
      key: 'datedone',
      description: 'Date/Time',
      selector: (row) => row.datedone.split('T')[0],
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '200px',
    },
    {
      name: 'Action',
      key: 'action',
      selector: (row) => row.action,
      cell: (row) => (
        <span
          onClick={() => {
            handleConfirmDelete(row);
          }}
        >
          <DeleteIcon
            sx={{
              color: '#e57373',
              fontSize: '18px',
              ':hover': {
                color: 'red',
              },
            }}
          />
        </span>
      ),
      sortable: false,
      width: '50px',
    },
  ];

  const getGrievance = async () => {
    const facId = user.currentEmployee.facilityDetail._id;

    let query = {
      facilityId: facId,
      $sort: {
        createdAt: -1,
      },
      $limit: limit,
      $skip: (page - 1) * limit,
    };

    const res = await ClientServ.find({ query });

    setGrievanceData(res.data);
    setTotal(res.total || 0);
  };

  useEffect(() => {
    getGrievance();

    ClientServ.on('created', () => getGrievance());
    ClientServ.on('updated', () => getGrievance());
    ClientServ.on('patched', () => getGrievance());
    ClientServ.on('removed', () => getGrievance());
  }, [limit, page]);

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const closeConfirmationDialog = () => {
    setGrievanceToDelete(null);
    setConfirmationDialog(false);
  };

  const handleDelete = () => {
    showActionLoader();
    ClientServ.remove(grievanceToDelete._id)
      .then(() => {
        hideActionLoader();
        toast.success(`Grievance Deleted succesfully`);
        setConfirmationDialog(false);
      })
      .catch((err) => {
        hideActionLoader();
        toast.error('Error deleting grievance ' + err);
      });
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRow = async () => {
    setView('newGrievance');
  };

  return (
    <>
      <div className="level">
        <PageWrapper
          style={{ flexDirection: 'column', padding: '0.6rem 1rem' }}
        >
          <TableMenu>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',

                width: '100%',
              }}
            >
              {handleSearch && (
                <div className="inner-table">
                  <FilterMenu onSearch={handleSearch} />
                </div>
              )}
              <h2
                style={{
                  marginLeft: '10px',
                  fontSize: '0.95rem',
                }}
              >
                Grievance Resolution
              </h2>

              <GlobalCustomButton
                text="New Grievance"
                onClick={() => setView('newGrievance')}
                customStyles={{
                  float: 'right',
                  marginLeft: 'auto',
                }}
              />
            </div>
          </TableMenu>

          <CustomConfirmationDialog
            open={confirmationDialog}
            confirmationAction={() => handleDelete(grievanceToDelete)}
            cancelAction={closeConfirmationDialog}
            type="danger"
            message={`You are about to delete a grievance from: ${
              grievanceToDelete?.facilityname
            } generated by ${grievanceToDelete?.hmostaffname}?`}
          />

          <div
            className="level"
            style={{
              overflow: 'auto',
            }}
          >
            <CustomTable
              title={'Grievance List'}
              columns={GrievanceSchema}
              data={grievanceData}
              pointerOnHover
              highlightOnHover
              striped
              onChangeRowsPerPage={onTableChangeRowsPerPage}
              onChangePage={onTablePageChange}
              onRowClicked={handleRow}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={total}
            />
          </div>
        </PageWrapper>
      </div>
    </>
  );
}
