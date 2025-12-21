import React, { useContext, useState, useEffect } from 'react';
import { ObjectContext } from '../../../context';
import client from '../../../feathers';
import CustomTable from '../../../components/customtable';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import * as yup from 'yup';
import { TableMenu } from '../../../ui/styled/global';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { PageWrapper } from '../../../ui/styled/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomConfirmationDialog from '../../../components/confirm-dialog/confirm-dialog';

export function LabRefList({ showCreateModal, facility, showEditModal }) {
  const labServ = client.service('labrefvalue');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [labToDelete, setLabToDelete] = useState(null);
  const [confirmationDialog, setConfirmationDialog] = useState(false);

  // console.log(facility,"FACILITY")

  const { state, setState } = useContext(ObjectContext);
  const [open, setOpen] = useState(false);

  const handleCreateNew = async () => {
    const newLocationModule = {
      selectedLocation: {},
      show: 'create',
    };
    await setState((prevstate) => ({
      ...prevstate,
      LocationModule: newLocationModule,
    }));
  };

  const handleRowClicked = async (labRef) => {
    const newLaboratoryModule = {
      selectedLaboratoryRef: labRef,
      show: 'details',
    };
    await setState((prevstate) => ({
      ...prevstate,
      LaboratoryModule: newLaboratoryModule,
    }));
    showEditModal();
  };

  const handleConfirmDelete = (data) => {
    setState((prevstate) => ({
      ...prevstate,
      LaboratoryModule: data,
    }));
    setLabToDelete(data);
    setConfirmationDialog(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  /*  const handleSearch = (val) => {
      setLoading(true);
      const field = "name";
      LocationServ.find({
        query: {
          [field]: {
            $regex: val,
            $options: "i",
          },
          facility: user.currentEmployee.facilityDetail._id || "",
          $limit: 100,
          $sort: {
            createdAt: -1,
          },
        },
      })
        .then((res) => {
          setFacilities(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
         return err;
        });
    }; */

  const getFacilities = async () => {
    setLoading(true);

    const findLabref = await labServ.find({
      query: {
        facilityId: facility || '',
        $limit: limit,
        $skip: (page - 1) * limit,
        $sort: {
          createdAt: -1,
        },
      },
    });

    setFacilities(findLabref.data);
    setTotal(findLabref.total);
    setLoading(false);
  };

  useEffect(() => {
    getFacilities();
    labServ.on('created', (obj) => getFacilities());
    labServ.on('updated', (obj) => getFacilities());
    labServ.on('patched', (obj) => getFacilities());
    labServ.on('removed', (obj) => getFacilities());
    return () => {};
  }, [limit, page]);

  // console.log(facilities, "lab");

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  const LocationSchema = [
    {
      name: 'Name of Test',
      key: 'name',
      description: 'Enter name of Location',
      selector: (row) => row.testname,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      validator: yup.string().required('Enter name of Location'),
    },
    {
      name: 'Class of Test',
      key: 'locationType',
      description: 'Enter name of Location',
      selector: (row) => row.testclass,
      sortable: true,
      required: true,
      inputType: 'SELECT_LIST',
      options: ['Front Desk', 'Clinic', 'Store', 'Laboratory', 'Finance'],
      validator: yup.string().required('Choose a Location Type'),
    },
    {
      name: 'Action',
      key: 'action',
      selector: (row) => row.action,
      cell: (row) => (
        <span onClick={() => handleConfirmDelete(row)}>
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

  const closeConfirmationDialog = () => {
    setLabToDelete(null);
    setConfirmationDialog(false);
  };

  /*  ); */
  return (
    <>
      {/* <Portal>
        <ModalBox
          open={open}
          header="Location Details"
          onClose={handleCloseModal}
          width="80%"
        >
          <LocationView
            location={selectedLocation}
            open={open}
            setOpen={handleCloseModal}
          />
        </ModalBox>
      </Portal> */}
      <PageWrapper style={{ flexDirection: 'column', padding: '0.6rem 1rem' }}>
        <TableMenu>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/*   {handleSearch && (
                    <div className="inner-table">
                      <FilterMenu onSearch={handleSearch} />
                    </div>
                  )} */}
            <h2 style={{ marginLeft: '10px', fontSize: '0.95rem' }}>
              Reference Lab Values
            </h2>
          </div>

          {handleCreateNew && (
            <GlobalCustomButton onClick={showCreateModal}>
              <ControlPointIcon fontSize="small" sx={{ marginRight: '5px' }} />
              Add New
            </GlobalCustomButton>
          )}
        </TableMenu>

        <div
          style={{
            width: '100%',
            overflow: 'auto',
          }}
        >
          <CustomTable
            title={''}
            columns={LocationSchema}
            data={facilities}
            pointerOnHover
            highlightOnHover
            striped
            onRowClicked={handleRowClicked}
            progressPending={loading}
            onChangeRowsPerPage={onTableChangeRowsPerPage}
            onChangePage={onTablePageChange}
            pagination
            paginationServer
            paginationTotalRows={total}
          />
        </div>
      </PageWrapper>
      <CustomConfirmationDialog
        open={confirmationDialog}
        confirmationAction={() => handleDelete(labToDelete)}
        cancelAction={closeConfirmationDialog}
        type="danger"
        message={`You are about to delete this laboratory reference value. This action cannot be undone.`}
      />
    </>
  );
}
