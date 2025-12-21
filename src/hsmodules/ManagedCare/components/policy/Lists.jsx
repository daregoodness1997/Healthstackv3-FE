import { Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ApprovalIcon from '@mui/icons-material/Approval';
import PendingIcon from '@mui/icons-material/Pending';
import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import GlobalCustomButton from '../../../../components/buttons/CustomButton';
import CustomTable from '../../../../components/customtable';
import FilterMenu from '../../../../components/utilities/FilterMenu';
import { ObjectContext, UserContext } from '../../../../context';
import client from '../../../../feathers';
import { TableMenu } from '../../../../ui/styled/global';
import { PageWrapper } from '../../../../ui/styled/styles';
import { updateOnCreated } from '../../../../functions/Updates';
import InvoiceCreate from '../invoice/InvoiceCreate';
import AddCircleOutlineOutlined from '@mui/icons-material/AddCircleOutlineOutlined';
import ModalBox from '../../../../components/modal';
import dayjs from 'dayjs';
import { useRef } from 'react';

const PoliciesList = ({
  createNewPolicy,
  showDetails,
  beneficiary,
  corporate,
  corporateOrg,
  origin,
}) => {
  const [config, setConfig] = useState([]);
  const policyServer = client.service('policy');
  const notificationsServer = client.service('email');
  const sendSmsServer = client.service('sendsms');
  const facilityConfigServer = client.service('facility-config');
  const [policies, setPolicies] = useState([]);
  const { state, setState } = useContext(ObjectContext);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [status, setStatus] = useState('Approved');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [createModal, setCreateModal] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const employee = user.currentEmployee;

  // console.log(employee,"EMPLOYEE")

  const handleCreateNew = async () => {
    createNewPolicy();
  };
  //console.log("origin", origin)

  const handleRow = async (policy) => {
    //  console.log(policy,"POLICY-HANDLEROW");
    const getData = await policyServer.get(policy._id);
    // console.log(getData,"GETDATA")
    setState((prev) => ({
      ...prev,
      PolicyModule: {
        ...prev.PolicyModule,
        selectedPolicy: getData,
        preservedPolicy: getData,
        plan: getData?.plan,
      },
    }));
    showDetails();
  };

  const fetchConfig = async () => {
    try {
      const configResponse = await facilityConfigServer.find({
        query: {
          organizationId: employee?.facility,
          $limit: 200,
          $sort: {
            createdAt: -1,
          },
        },
      });
      setConfig(configResponse.data);
    } catch (error) {
      // console.error('Error fetching facility config:', error);
      toast.error('Failed to load facility configuration');
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [employee]);

  // console.log(state.PolicyModule.selectedPolicy.plan,"PLAN")

  const handleSearch = (val) => {
    if (val.length < 3 || val.trim() === '') return;
    policyServer
      .find({
        query: {
          $or: [
            {
              policyNo: {
                $regex: val,
                $options: 'i',
              },
            },
            {
              'principal.lastname': {
                $regex: val,
                $options: 'i',
              },
            },
            {
              status: {
                $regex: val,
                $options: 'i',
              },
            },

            {
              'principal.firstname': {
                $regex: val,
                $options: 'i',
              },
            },
            {
              'dependantBeneficiaries.type': {
                $regex: val,
                $options: 'i',
              },
            },
            {
              'principal.type': {
                $regex: val,
                $options: 'i',
              },
            },
            {
              'dependantBeneficiaries.firstname': {
                $regex: val,
                $options: 'i',
              },
            },
            {
              'dependantBeneficiaries.lastname': {
                $regex: val,
                $options: 'i',
              },
            },

            {
              'sponsor.facilityName': {
                $regex: val,
                $options: 'i',
              },
            },
            {
              sponsorshipType: {
                $regex: val,
                $options: 'i',
              },
            },
            {
              planType: {
                $regex: val,
                $options: 'i',
              },
            },
            {
              'plan.planName': {
                $regex: val,
                $options: 'i',
              },
            },
            {
              'providers.facilityName': {
                $regex: val,
                $options: 'i',
              },
            },
            { 'principal.gender': val },
            { 'dependantBeneficiaries.gender': val },
          ],

          organizationId: user.currentEmployee.facilityDetail._id, // || "",

          $sort: {
            createdAt: -1,
          },
        },
      })
      .then((res) => {
        setPolicies(res.data);
      })
      .catch((err) => {
        toast.error('Something went wrong!');
      });
  };

  const handleChoseClient = (e, row) => {
    // console.log(plans)
    if (e.target.checked) {
      // console.log("checked", row._id);
      row.invRenwgen = true;
      setPlans(plans.concat(row)); // Concatenate and update the plans array
      // console.log(plans);
      //update facilities
    } else {
      //console.log("unchecked", row._id);
      row.invRenwgen = false;
      setPlans(plans.filter((el) => el._id !== row._id)); // Filter and update the plans array
      // console.log(plans.length);
    }
  };
  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDue = async () => {
    setStatus('Due');
    setLoading(true);
    setTotal(0);
    setPolicies([]);
    setIsLoading(true);
    // Get the current date
    const currentDate = dayjs();

    // Get the date three months from now
    const threeMonthsFromNow = currentDate.add(3, 'month').endOf('day');

    let query = {
      organizationId: user.currentEmployee.facilityDetail._id,
      approved: true,
      invRenwgen: {
        $ne: true,
      },
      validityEnds: {
        $lte: threeMonthsFromNow.toDate(),
      },
      $sort: {
        createdAt: -1,
      },
    };

    if (beneficiary) {
      query['principal._id'] = beneficiary._id;
    }

    if (corporate) {
      query = {
        organizationId: user.currentEmployee.facilityDetail._id,
        $or: [
          { 'sponsor.facilityName': corporate.facilityName },
          { 'sponsor._id': corporate._id },
        ],
        $sort: {
          createdAt: -1,
        },
      };
    }
    if (corporateOrg) {
      query = {
        $or: [
          { 'sponsor.facilityName': corporateOrg.facilityName },
          { 'sponsor._id': corporateOrg._id },
        ],
        $sort: {
          createdAt: -1,
        },
      };
    }
    policyServer
      .find({
        query: query,
      })
      .then((resp) => {
        setPolicies(resp.data);
        setLoading(false);
        setIsLoading(false);
        setTotal(resp.data.length);
      })
      .catch((err) => {
        toast.error(`Something went wrong! ${err}`);
        setIsLoading(false);
      });
  };

  const handleOverdue = async () => {
    setStatus('Overdue');
    setLoading(true);
    setTotal(0);
    setPolicies([]);
    setIsLoading(true);
    // Get the current date
    const currentDate = dayjs();

    // Get the date three months from now
    const threeMonthsFromNow = currentDate.add(3, 'month').endOf('day');

    let query = {
      organizationId: user.currentEmployee.facilityDetail._id,
      approved: true,
      invRenwgen: {
        $ne: true,
      },
      validityEnds: {
        $lte: currentDate,
      },
      $sort: {
        createdAt: -1,
      },
    };

    if (beneficiary) {
      query['principal._id'] = beneficiary._id;
    }

    if (corporate) {
      query = {
        organizationId: user.currentEmployee.facilityDetail._id,
        $or: [
          { 'sponsor.facilityName': corporate.facilityName },
          { 'sponsor._id': corporate._id },
        ],
        $sort: {
          createdAt: -1,
        },
      };
    }
    if (corporateOrg) {
      query = {
        $or: [
          { 'sponsor.facilityName': corporateOrg.facilityName },
          { 'sponsor._id': corporateOrg._id },
        ],
        $sort: {
          createdAt: -1,
        },
      };
    }
    policyServer
      .find({
        query: query,
      })
      .then((resp) => {
        setPolicies(resp.data);
        setLoading(false);
        setIsLoading(false);
        setTotal(resp.data.length);
      })
      .catch((err) => {
        toast.error(`Something went wrong! ${err}`);
        setIsLoading(false);
      });
  };

  function handleChosePolicy(e, row) {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedPolicies((prev) => [...prev, row]);
    } else {
      setSelectedPolicies((prev) => prev.filter((p) => p._id !== row._id));
    }
  }

  // console.log(config,"EMAIL-CONFIG")

  const handleBatchApprove = async () => {
    if (selectedPolicies.length === 0) {
      toast.error('Please select at least one policy to approve');
      return;
    }

    try {
      setIsLoading(true);
      const employee = user.currentEmployee;

      const promises = selectedPolicies.map((policy) => {
        const statusMsg = policy?.approved
          ? 'Policy is Disapproved'
          : 'Policy is Approved';
        const policyDetails = {
          ...policy,
          approved: true,
          approvalDate: new Date(),
          approvedby: {
            employeename: `${employee?.firstname} ${employee?.lastname}`,
            employeeId: employee?._id,
          },
          statushx: [
            ...(policy?.statushx || []),
            {
              date: new Date(),
              employeename: `${employee?.firstname} ${employee?.lastname}`,
              employeeId: employee?._id,
              status: statusMsg,
            },
          ],
        };

        const notificationObj = {
          organizationId: employee?.facility,
          organizationName: employee?.facilityDetail?.facilityName,
          html: `<p>Dear ${policy?.principal?.lastname || ''} ${policy?.principal?.firstname || ''}, Welcome to HCI healthcare. Your ${policy?.plan?.name || ''} has been approved (Policy ID: ${policy?.policyNo || ''}). Your primary care provider is ${policy?.providers?.map((p) => p.organizationDetail?.facilityName).join(', ') || 'N/A'}. Please use our chatbot (+234 915 430 0143) and mobile app for faster and better service. You can also reach your account office on ${policy?.organization?.email || 'N/A'} and ${policy?.organization?.phone || 'N/A'}.<br/><br/>Thank you,<br/>HCI healthcare</p>`,
          text: `Dear ${policy?.principal?.lastname || ''} ${policy?.principal?.firstname || ''}, Welcome to HCI healthcare. Your ${policy?.plan?.name || ''} has been approved (Policy ID: ${policy?.policyNo || ''}). Your primary care provider is ${policy?.providers?.map((p) => p.organizationDetail?.facilityName).join(', ') || 'N/A'}. Please use our chatbot (+234 915 430 0143) and mobile app for faster and better service. You can also reach your account office on ${policy?.organization?.email || 'N/A'} and ${policy?.organization?.phone || 'N/A'}.\n\nThank you,\nHCI healthcare`,
          status: 'pending',
          subject: `Welcome to HCI Healthcare - Policy Approved`,
          to: policy?.principal?.email || '',
          name: employee?.facilityDetail?.facilityName || '',
          from:
            (config && config.length > 0 && config[0]?.emailConfig?.username) ||
            '',
        };

        const smsObj = {
          type: 'Policy',
          title: 'Policy Approved',
          message: `Dear ${policy?.principal?.lastname || ''} ${policy?.principal?.firstname || ''}, Welcome to HCI healthcare. Your ${policy?.plan?.name || ''} has been approved (Policy ID: ${policy?.policyNo || ''}). Primary care provider: ${policy?.providers?.map((p) => p.organizationDetail?.facilityName).join(', ') || 'N/A'}. Chatbot: +234 915 430 0143. Account office: ${policy?.organization?.phone || 'N/A'}. Thank you, HCI healthcare`,
          receiver: policy?.principal?.phone || '',
          facilityName: employee?.facilityDetail?.facilityName || '',
          facilityId: employee?.facility || '',
        };

        return policyServer.patch(policy._id, policyDetails).then((res) => {
          if (res.approved === true) {
            notificationsServer.create(notificationObj);
            sendSmsServer.create(smsObj);
          }
          return res;
        });
      });

      await Promise.all(promises);
      toast.success(
        `${selectedPolicies?.length} policies approved successfully`,
      );
      setSelectedPolicies([]);
      getPolicies();
    } catch (err) {
      toast.error(`Error approving policies: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(selectedPolicies, 'POLICY');

  const PolicySchema = [
    {
      name: 'S/N',
      key: 'sn',
      description: 'SN',
      selector: (row, i) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            style={{ marginRight: '3px' }}
            onChange={(e) => handleChosePolicy(e, row)}
            checked={selectedPolicies.some((p) => p._id === row._id)}
          />
          {i + 1}
        </div>
      ),
      sortable: true,
      inputType: 'HIDDEN',
      width: '60px',
    },
    {
      name: 'Date Joined',
      key: 'createdAt',
      description: 'Date Created',
      selector: (row) => dayjs(row?.createdAt).format('DD-MM-YYYY'),
      sortable: true,
      required: true,
      inputType: 'DATE',
    },

    {
      name: "Principal's Name",
      key: 'principal',
      description: 'Principal Last Name',
      selector: (row) =>
        `${row?.principal?.firstname} - ${row?.principal?.lastname}`,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      style: {
        textTransform: 'capitalize',
      },
    },
    {
      name: 'Principal Phone',
      key: 'phone',
      description: 'Phone Number',
      selector: (row) => row?.principal?.phone,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
    },

    {
      name: 'Principal Email',
      key: 'email',
      description: 'simpa@email.com',
      selector: (row) => row?.principal?.email,
      sortable: true,
      required: true,
      inputType: 'EMAIL',
    },
    {
      name: 'Dependents',
      key: 'principal',
      description: 'No of dependents',
      selector: (row) => row?.dependantBeneficiaries?.length,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      style: {
        textTransform: 'capitalize',
      },
    },

    {
      name: 'Policy Number',
      key: 'policyNo',
      description: 'Phone Number',
      selector: (row) => row?.policyNo,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
    },
    {
      name: 'Sponsor Type',
      key: 'sponsorshipType',
      description: 'Sponsorship Type',
      selector: (row) => row?.sponsorshipType,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Sponsor Name',
      key: 'sponsor',
      description: 'Sponsor name',
      selector: (row) =>
        row?.sponsor?.organizationDetail?.facilityName
          ? row?.sponsor?.organizationDetail?.facilityName
          : row?.sponsor?.facilityName,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Plan',
      key: 'sponsorshipType',
      description: 'Sponsorship Type',
      selector: (row) => row?.plan?.name,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Plan Type',
      key: 'plan',
      description: 'Plan',
      selector: (row) => row?.planType,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    // {
    //   name: "Provider",
    //   key: "provider",
    //   description: "Provider",
    //   selector: row => row?.providers[0]?.facilityName,
    //   sortable: true,
    //   required: true,
    //   inputType: "TEXT",
    // },
    {
      name: 'Providers',
      key: 'provider',
      description: 'Provider',
      selector: (row) => row?.providers?.length,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Paid',
      key: 'isPaid',
      description: 'Paid',
      selector: (row) => (row?.isPaid ? 'Yes' : 'No'),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Active',
      key: 'active',
      description: 'Active',
      selector: (row) => (row?.active ? 'Yes' : 'No'),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
  ];

  // console.log(selectedPolicy,"SELECTED POLICY")

  const getPolicies = useCallback(async () => {
    if (status === 'Due' || status === 'Overdue') {
      return;
    }
    setLoading(true);
    setTotal(0);
    setIsLoading(true);

    let query = {
      organizationId: user.currentEmployee.facilityDetail._id,
      approved: status === 'Approved',
      $limit: limit,
      $skip: (page - 1) * limit,
      $select: [
        'createdAt',
        'principal',
        'policyNo',
        'dependantBeneficiaries',
        'sponsorshipType',
        'plan',
        'planType',
        'providers',
        'isPaid',
        'active',
        'sponsor',
      ],
      $sort: {
        createdAt: -1,
      },
    };

    if (beneficiary) {
      query['principal._id'] = beneficiary._id;
    }

    if (corporate) {
      query = {
        organizationId: user.currentEmployee.facilityDetail._id,
        $or: [
          { 'sponsor.facilityName': corporate.facilityName },
          { 'sponsor._id': corporate._id },
        ],
        $sort: {
          createdAt: -1,
        },
      };
    }
    if (corporateOrg) {
      query = {
        $or: [
          { 'sponsor.facilityName': corporateOrg.facilityName },
          { 'sponsor._id': corporateOrg._id },
        ],
        $sort: {
          createdAt: -1,
        },
      };
    }
    policyServer
      .find({
        query: query,
      })
      .then((resp) => {
        //console.log(resp);
        setPolicies(resp.data);
        setLoading(false);
        setIsLoading(false);
        setTotal(resp.total);
      })
      .catch((err) => {
        toast.error(`Something went wrong! ${err}`);
        setIsLoading(false);
      });
  }, [status]);

  useEffect(() => {
    getPolicies();

    policyServer.on('created', (obj) => getPolicies());
    policyServer.on('updated', (obj) => getPolicies());
    policyServer.on('patched', (obj) => getPolicies());
    policyServer.on('removed', (obj) => getPolicies());
    return () => {};
  }, [getPolicies, limit, page]);

  const OverdueSchema = [
    {
      name: 'S/N',
      key: 'sn',
      description: 'SN',
      selector: (row, i) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            //name={order._id}
            style={{ marginRight: '3px' }}
            onChange={(e) => handleChoseClient(e, row)}
            checked={row.nvRenwgen}
          />
          {row.sn}
        </div>
      ),
      sortable: true,
      inputType: 'HIDDEN',
      width: '60px',
    },
    {
      name: 'Date Joined',
      key: 'createdAt',
      description: 'Date Created',
      selector: (row) => dayjs(row?.createdAt).format('DD-MM-YYYY'),
      sortable: true,
      required: true,
      inputType: 'DATE',
    },

    {
      name: "Principal's Name",
      key: 'principal',
      description: 'Principal Last Name',
      selector: (row) =>
        `${row?.principal?.firstname} - ${row?.principal?.lastname}`,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      style: {
        textTransform: 'capitalize',
      },
    },
    {
      name: 'Principal Phone',
      key: 'phone',
      description: 'Phone Number',
      selector: (row) => row?.principal?.phone,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
    },

    {
      name: 'Principal Email',
      key: 'email',
      description: 'simpa@email.com',
      selector: (row) => row?.principal?.email,
      sortable: true,
      required: true,
      inputType: 'EMAIL',
    },
    {
      name: 'Dependents',
      key: 'principal',
      description: 'No of dependents',
      selector: (row) => row?.dependantBeneficiaries?.length,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      style: {
        textTransform: 'capitalize',
      },
    },

    {
      name: 'Policy Number',
      key: 'policyNo',
      description: 'Phone Number',
      selector: (row) => row?.policyNo,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
    },
    {
      name: 'Sponsor Type',
      key: 'sponsorshipType',
      description: 'Sponsorship Type',
      selector: (row) => row?.sponsorshipType,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Sponsor Name',
      key: 'sponsor',
      description: 'Sponsor name',
      selector: (row) =>
        row?.sponsor?.organizationDetail?.facilityName
          ? row?.sponsor?.organizationDetail?.facilityName
          : row?.sponsor?.facilityName,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Plan',
      key: 'sponsorshipType',
      description: 'Sponsorship Type',
      selector: (row) => row?.plan?.name,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Plan Type',
      key: 'plan',
      description: 'Plan',
      selector: (row) => row?.planType,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    // {
    //   name: "Provider",
    //   key: "provider",
    //   description: "Provider",
    //   selector: row => row?.providers[0]?.facilityName,
    //   sortable: true,
    //   required: true,
    //   inputType: "TEXT",
    // },
    {
      name: 'Providers',
      key: 'provider',
      description: 'Provider',
      selector: (row) => row?.providers?.length,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Paid',
      key: 'isPaid',
      description: 'Paid',
      selector: (row) => (row?.isPaid ? 'Yes' : 'No'),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Active',
      key: 'active',
      description: 'Active',
      selector: (row) => (row?.active ? 'Yes' : 'No'),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
  ];

  // console.log(policies[0]);

  return (
    <Box p={2}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        mb={2}
      >
        {/* <div  style={{display: "flex", alignItems: "center"}} > */}
        {handleSearch && (
          <div className="inner-table">
            <FilterMenu onSearch={handleSearch} />
          </div>
        )}
        <h2 style={{ margin: '0 10px', fontSize: '0.95rem' }}>
          {`${status}`} Policies ({total})
        </h2>

        {selectedPolicies.length > 0 && (
          <GlobalCustomButton
            onClick={handleBatchApprove}
            color="success"
            disabled={isLoading}
          >
            <ApprovalIcon fontSize="small" sx={{ marginRight: '5px' }} />
            {isLoading
              ? 'Approving...'
              : `Approve ${selectedPolicies.length} Selected`}
          </GlobalCustomButton>
        )}

        {status !== 'Pending' && (
          <GlobalCustomButton
            onClick={() => setStatus('Pending')}
            color="warning"
          >
            <PendingIcon fontSize="small" sx={{ marginRight: '5px' }} />
            Pending Policies
          </GlobalCustomButton>
        )}

        {status !== 'Approved' && (
          <GlobalCustomButton
            onClick={() => setStatus('Approved')}
            color="secondary"
          >
            <ApprovalIcon fontSize="small" sx={{ marginRight: '5px' }} />
            Approved Policies
          </GlobalCustomButton>
        )}

        {status !== 'Due' && (
          <GlobalCustomButton onClick={handleDue} color="primary">
            <PendingIcon fontSize="small" sx={{ marginRight: '5px' }} />
            Due Policies
          </GlobalCustomButton>
        )}
        {status !== 'Overdue' && (
          <GlobalCustomButton onClick={handleOverdue} color="primary">
            <PendingIcon fontSize="small" sx={{ marginRight: '5px' }} />
            Overdue Policies
          </GlobalCustomButton>
        )}

        {plans.length > 0 && (
          <GlobalCustomButton onClick={() => setCreateModal(true)}>
            <AddCircleOutlineOutlined
              fontSize="small"
              sx={{ marginRight: '5px' }}
            />
            Create Invoice
          </GlobalCustomButton>
        )}

        {/*   </div> */}
        {!beneficiary && !corporate && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {createNewPolicy && (
              <GlobalCustomButton onClick={handleCreateNew} color="success">
                <AddCircleOutlineIcon
                  fontSize="small"
                  sx={{ marginRight: '5px' }}
                />
                Create New Policy
              </GlobalCustomButton>
            )}
          </Box>
        )}
      </Box>

      <Box
        style={{
          height:
            beneficiary || corporate
              ? 'calc(100vh - 240px)'
              : 'calc(100vh - 140px)',
          overflowY: 'scroll',
        }}
      >
        <CustomTable
          title={''}
          columns={
            origin === 'corporate' && (status === 'Overdue' || status === 'Due')
              ? OverdueSchema
              : PolicySchema
          }
          data={policies}
          pointerOnHover
          highlightOnHover
          striped
          onRowClicked={handleRow}
          onChangeRowsPerPage={onTableChangeRowsPerPage}
          onChangePage={onTablePageChange}
          pagination
          paginationServer
          paginationTotalRows={total}
          //progressPending={isLoading}
          CustomEmptyData={
            status === 'Approved'
              ? 'No Approved Policies'
              : 'No Pending Policies'
          }
        />
      </Box>
      <ModalBox
        open={createModal}
        onClose={() => setCreateModal(false)}
        header="Create New Invoice"
        sx={{
          width: '80%',
        }}
      >
        <InvoiceCreate
          closeModal={() => setCreateModal(false)}
          policies={plans}
        />
      </ModalBox>
    </Box>
  );
};

export default PoliciesList;
