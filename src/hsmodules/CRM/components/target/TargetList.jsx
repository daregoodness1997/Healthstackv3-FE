import React from 'react';
import { useContext, useState, useEffect, useCallback } from 'react';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import { Box, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import GlobalCustomButton from '../../../../components/buttons/CustomButton';
import CustomTable from '../../../../components/customtable';
import FilterMenu from '../../../../components/utilities/FilterMenu';
import { TableMenu } from '../../../../ui/styled/global';
import { PageWrapper } from '../../../../ui/styled/styles';
import client from '../../../../feathers';
import { ObjectContext, UserContext } from '../../../../context';
import CustomConfirmationDialog from '../../../../components/confirm-dialog/confirm-dialog';

export default function TargetList({ showDetail, showCreate }) {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [targets, setTargets] = useState([]);
  const { setState } = useContext(ObjectContext);
  const targetServer = client.service('crmtarget');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [docToDel, setDocToDel] = useState({});
  

  const handleRow = async () => {
  
  };

  const handleSearch = (search) => {
    console.log(search);
  };


  const handleDelete = async (obj) => {
    await targetServer
      .remove(obj._id)
      .then((resp) => {
        toast.success('Sucessfuly deleted target ');
        setConfirmDialog(false);
      })
      .catch((err) => {
        toast.error('Error deleting target ' + err);
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

  const getTargetsForPage = useCallback(async () => {
    try {
      setLoading(true);
      const facId = user.currentEmployee.facilityDetail._id;
      let query = {
        facility: facId,
        $sort: {
          createdAt: -1,
        },
        $limit: limit,
        $skip: (page - 1) * limit,
      };
      const res = await targetServer.find({ query });

      if (!res || !res.data) {
        throw new Error("Invalid response from server");
      }

      const targets = res.data;
      setTargets(targets);
      setTotal(res.total);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [limit, page]);

  const handleCreateNew = () => {
    showCreate();
  };
  // console.log(targets,"TARGETS")

  useEffect(() => {
    getTargetsForPage();

    const handleServerEvent = () => getTargetsForPage();

    targetServer.on("created", handleServerEvent);
    targetServer.on("updated", handleServerEvent);
    targetServer.on("patched", handleServerEvent);
    targetServer.on("removed", handleServerEvent);

    return () => {
      targetServer.off("created", handleServerEvent);
      targetServer.off("updated", handleServerEvent);
      targetServer.off("patched", handleServerEvent);
      targetServer.off("removed", handleServerEvent);
    };
  }, [getTargetsForPage]);

  const targetColumns = [
    {
      name: 'SN',
      key: 'sn',
      description: 'sn',
      selector: (row, i) => i + 1,
      sortable: true,
      required: true,
      inputType: 'HIDDEN',
      width: '50px',
    },

    {
      name: 'Employee Name',
      key: 'employee_name',
      description: 'Enter name of Company',
      selector: (row) => row?.employeeName,
      sortable: true,
      required: true,
      inputType: 'HIDDEN',
      width: '200px',
    },
    {
      name: 'Previous Target',
      key: 'timeline',
      description: 'Enter Timeline',
      selector: (row) => row.prevValue,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '200px',
    },

    {
      name: 'Current Target',
      key: 'timeline',
      description: 'Enter Timeline',
      selector: (row) => row.currValue,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '200px',
    },
    {
      name: 'Target Category',
      key: 'targetcategory',
      description: 'Enter Timeline',
      selector: (row) => row?.targetcategory,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '200px',
    },
    {
      name: 'Target Type',
      key: 'targettype',
      description: 'Enter Timeline',
      selector: (row) => row?.targettype,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '200px',
    },
    {
      name: 'Action',
      selector: (row) => (
        <IconButton size="small" onClick={() => handleConfirmDelete(row)}>
          <DeleteOutlineIcon fontSize="small" sx={{ color: 'red' }} />
        </IconButton>
      ),
      width: '200px',
    },
  ];

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={handleCancelConfirm}
        confirmationAction={() => handleDelete(docToDel)}
        message={`Are you sure you want to delete this`}
      />
      <div className="level">
        <PageWrapper
          style={{ flexDirection: 'column', padding: '0.6rem 1rem' }}
        >
          <TableMenu>
            <div style={{ display: "flex", alignItems: "center" }}>
              {handleSearch && (
                <div className="inner-table">
                  <FilterMenu onSearch={handleSearch} />
                </div>
              )}
              <h2 style={{ margin: "0 10px", fontSize: "0.95rem" }}>Target List</h2>
            </div>

            <GlobalCustomButton onClick={handleCreateNew}>
              <AddCircleOutline fontSize="small" sx={{ marginRight: "5px" }} />
              Add Target
            </GlobalCustomButton>
          </TableMenu>
          <Box style={{ width: '100%', overflow: 'auto' }}>
            <CustomTable
              title={''}
              columns={targetColumns}
              data={targets}
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
        
        </PageWrapper>
      </div>
    </>
  );
}
