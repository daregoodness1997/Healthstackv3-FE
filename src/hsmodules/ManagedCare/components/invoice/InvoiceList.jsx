import { useState, useContext, useEffect } from 'react';

import { UserContext, ObjectContext } from '../../../../context';
import AddCircleOutlineOutlined from '@mui/icons-material/AddCircleOutlineOutlined';
import GlobalCustomButton from '../../../../components/buttons/CustomButton';
import CustomTable from '../../../../components/customtable';
import FilterMenu from '../../../../components/utilities/FilterMenu';
import { TableMenu } from '../../../../ui/styled/global';
import { PageWrapper } from '../../../app/styles';
import client from '../../../../feathers';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { toast } from 'react-toastify';
import { IconButton, List, ListItem } from '@mui/material';
import CustomConfirmationDialog from '../../../../components/confirm-dialog/confirm-dialog';

const InvoiceList = ({ showCreateView, showDetailView, isTab, corporate }) => {
  const dealServer = client.service('corpinvoices');
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const { user, setUser } = useContext(UserContext);
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [total, setTotal] = useState(0);

  const getInvoicesForPage = async () => {
    const facId = user.currentEmployee.facilityDetail._id;
    setLoading(true);
    let query = {};
    if (corporate) {
      query = {
        customerId: corporate._id,
      };
    }

    const res = await dealServer.find({
      query: {
        ...query,
        facilityId: facId,
        $limit: limit,
        $skip: (page - 1) * limit,
        $select: [
          'customerName',
          'invoice_number',
          'payment_mode',
          'payment_option',
          'plans',
          'total_amount',
          'status',
        ],
        $sort: {
          createdAt: -1,
        },
      },
    });

    const deals = res.data;
    console.log(res);
    console.log(deals);
    await setInvoices(deals);

    setLoading(false);
    setTotal(res.total);
  };

  useEffect(() => {
    getInvoicesForPage();
  }, [limit, page]);

  const handleRow = async (data) => {
    const getData = await dealServer.get(data._id);
    setState((prev) => ({
      ...prev,
      InvoiceModule: { ...prev.InvoiceModule, selectedInvoice: getData },
    }));
    showDetailView();
  };

  const handleSearch = () => {};

  const returnCell = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <span style={{ color: '#17935C' }}>{status}</span>;

      case 'inactive':
        return <span style={{ color: '#0364FF' }}>{status}</span>;

      default:
        break;
    }
  };

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [docToDel, setDocToDel] = useState({});

  const handleDelete = async (obj) => {
    await dealServer
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

  // Start
  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  const InvoiceSchema = [
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
      name: 'Name',
      key: 'name',
      description: 'Enter name of Company',
      selector: (row) => row.customerName,
      sortable: true,
      required: true,
      inputType: 'HIDDEN',
      style: {
        textTransform: 'capitalize',
      },
    },
    {
      name: 'Invoice No',
      key: 'invoice_no',
      description: 'Enter Telestaff name',
      selector: (row) => row.invoice_number,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Payment Mode',
      key: 'payment_type',
      description: 'Enter Telestaff name',
      selector: (row) => row.payment_mode,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      style: {
        textTransform: 'capitalize',
      },
    },
    {
      name: 'Payment Option',
      key: 'payment_option',
      description: 'Enter name of Disease',
      selector: (row, i) => row.payment_option,
      sortable: true,
      required: true,
      inputType: 'DATE',
      style: {
        textTransform: 'capitalize',
      },
    },
    {
      name: 'Plans',
      key: 'plan',
      description: 'Enter bills',
      selector: (row) => (
        <List
          sx={{
            listStyleType: 'disc',
            pl: 2,
            '& .MuiListItem-root': {
              display: 'list-item',
            },
          }}
        >
          {row.plans.map((item) => (
            <ListItem
              sx={{
                margin: 0,
              }}
            >
              {item.name}
            </ListItem>
          ))}
        </List>
      ),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Amount',
      key: 'amount',
      description: 'Enter name of Disease',
      selector: (row, i) => row.total_amount,
      sortable: true,
      required: true,
      inputType: 'DATE',
    },

    {
      name: 'Status',
      key: 'status',
      description: 'Enter bills',
      selector: 'status',
      cell: (row) => (row.status ? row.status : '----------'),
      sortable: true,
      required: true,
      inputType: 'TEXT',
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
    <>
      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={handleCancelConfirm}
        confirmationAction={() => handleDelete(docToDel)}
        message={`Are you sure you want to delete this exit with No: ${docToDel?.sn}`}
      />
      <div className="level">
        <PageWrapper
          style={{ flexDirection: 'column', padding: '0.6rem 1rem' }}
        >
          <TableMenu>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {handleSearch && (
                <div className="inner-table">
                  <FilterMenu onSearch={handleSearch} />
                </div>
              )}
              <h2 style={{ margin: '0 10px', fontSize: '0.95rem' }}>Invoice</h2>
            </div>

            {isTab && (
              <GlobalCustomButton onClick={showCreateView}>
                <AddCircleOutlineOutlined
                  fontSize="small"
                  sx={{ marginRight: '5px' }}
                />
                Create Invoice
              </GlobalCustomButton>
            )}
          </TableMenu>
          {/* <div style={{width: '100%', overflow: 'auto'}}> */}
          <div
            style={{
              width: '100%',
              height: 'calc(100vh - 100px)',
              overflow: 'auto',
            }}
          >
            <CustomTable
              title={''}
              columns={InvoiceSchema}
              data={invoices}
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
          </div>
        </PageWrapper>
      </div>
    </>
  );
};

export default InvoiceList;
