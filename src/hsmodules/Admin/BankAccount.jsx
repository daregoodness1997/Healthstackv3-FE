import { useEffect, useState, useContext } from 'react';
import {
  Modal,
  Button,
  Space,
  Table,
  Tag,
  Tooltip,
  Popconfirm,
  Row,
  Col,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import client from '../../feathers';
import { ObjectContext, UserContext } from '../../context';
import Input from '../../components/inputs/basic/Input';
import { useForm } from 'react-hook-form';
import { FormsHeaderText } from '../../components/texts';
import Textarea from '../../components/inputs/basic/Textarea';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const BankAccount = () => {
  const facilityServer = client.service('facility');
  const { setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const { user, setUser } = useContext(UserContext);
  const [bankAccountModal, setBankAccountModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    type: '',
    message: '',
  });

  useEffect(() => {
    // hideActionLoader();
    const orgBankAccounts =
      user.currentEmployee.facilityDetail.facilityBankAcct || [];
    setBankAccounts(orgBankAccounts);
  }, [user.currentEmployee.facilityDetail]);

  const handleView = (data) => {
    setState((prev) => ({
      ...prev,
      BankAccountModule: {
        ...prev.BankAccountModule,
        selectedBankAccount: data,
      },
    }));
    setDetailModal(true);
  };

  const deleteBankAccount = async (account) => {
    showActionLoader();
    const prevOrgDetail = user.currentEmployee.facilityDetail;

    const prevBankAccounts = prevOrgDetail.facilityBankAcct || [];

    const newBankAccounts = prevBankAccounts.filter(
      (item) => item._id !== account._id,
    );

    const newOrgDetail = {
      ...prevOrgDetail,
      facilityBankAcct: newBankAccounts,
    };

    const documentId = prevOrgDetail._id;

    await facilityServer
      .patch(documentId, { ...newOrgDetail })
      .then((resp) => {
        hideActionLoader();
        setUser((prev) => ({
          ...prev,
          currentEmployee: {
            ...prev.currentEmployee,
            facilityDetail: newOrgDetail,
          },
        }));

        toast.success(
          "You've successfully deleted a bank account from your Organization",
        );
      })
      .catch((error) => {
        toast.error(
          `Failed to delete the bank account from your organization; ${error}`,
        );
        hideActionLoader();
        console.error(error);
      });
  };

  const bankColumns = [
    {
      title: 'S/N',
      key: 'sn',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Bank Name',
      dataIndex: 'bankname',
      key: 'bankname',
      sorter: (a, b) => (a.bankname || '').localeCompare(b.bankname || ''),
      render: (text) => (
        <span style={{ color: '#1890ff', fontWeight: 500 }}>{text}</span>
      ),
    },
    {
      title: 'Account Name',
      dataIndex: 'accountname',
      key: 'accountname',
      sorter: (a, b) =>
        (a.accountname || '').localeCompare(b.accountname || ''),
      render: (text) => (
        <span style={{ color: '#1890ff', fontWeight: 500 }}>{text}</span>
      ),
    },
    {
      title: 'Account Number',
      dataIndex: 'accountnumber',
      key: 'accountnumber',
      sorter: (a, b) =>
        (a.accountnumber || '').localeCompare(b.accountnumber || ''),
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      sorter: (a, b) => (a.branch || '').localeCompare(b.branch || ''),
      render: (text) => text || '-',
    },
    {
      title: 'Sort Code',
      dataIndex: 'sortcode',
      key: 'sortcode',
      render: (text) => text || '-',
    },
    {
      title: 'Comments',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Bank Account"
            description={`Are you sure you want to delete ${record.bankname} account (${record.accountname})?`}
            onConfirm={() => deleteBankAccount(record)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <FormsHeaderText text="Organization Bank Accounts" />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setBankAccountModal(true)}
        >
          Add Bank Account
        </Button>
      </div>

      <Table
        columns={bankColumns}
        dataSource={bankAccounts}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} accounts`,
        }}
        locale={{
          emptyText: (
            <Empty description="You haven't added a bank account to your Organization yet..." />
          ),
        }}
        size="small"
        scroll={{ x: 1000 }}
      />

      <Modal
        title="Add a New Bank Account"
        open={bankAccountModal}
        onCancel={() => setBankAccountModal(false)}
        footer={null}
        width={800}
      >
        <AddNewBankAccount closeModal={() => setBankAccountModal(false)} />
      </Modal>

      <Modal
        title="Bank Account Details"
        open={detailModal}
        onCancel={() => setDetailModal(false)}
        footer={null}
        width={800}
      >
        <BankAccountDetail closeModal={() => setDetailModal(false)} />
      </Modal>
    </div>
  );
};

export default BankAccount;

export const AddNewBankAccount = ({ closeModal }) => {
  const facilityServer = client.service('facility');
  const { register, handleSubmit, control, reset } = useForm();
  const { user, setUser } = useContext(UserContext);
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);

  const addBankAccount = async (data) => {
    showActionLoader();
    const employee = user.currentEmployee;
    const prevOrgDetail = user.currentEmployee.facilityDetail;

    const document = {
      ...data,
      _id: uuidv4(),
      createdBy: employee.userId,
      createdByName: `${employee.firstname} ${employee.lastname}`,
    };

    const prevBankAccounts = prevOrgDetail.facilityBankAcct || [];

    const newBankAccounts = [document, ...prevBankAccounts];

    const newOrgDetail = {
      ...prevOrgDetail,
      facilityBankAcct: newBankAccounts,
    };

    //return console.log(newOrgDetail);

    const documentId = prevOrgDetail._id;

    await facilityServer
      .patch(documentId, { ...newOrgDetail })
      .then((resp) => {
        Object.keys(data).forEach((key) => {
          data[key] = null;
        });
        reset(data);
        hideActionLoader();
        setUser((prev) => ({
          ...prev,
          currentEmployee: {
            ...prev.currentEmployee,
            facilityDetail: newOrgDetail,
          },
        }));
        closeModal();

        toast.success(
          "You've succesfully Added a new bank account to your Organization",
        );
      })
      .catch((error) => {
        toast.error(
          `Error adding new bank account to your oragnization; ${error}`,
        );
        hideActionLoader();
        console.error(error);
      });
  };

  return (
    <div style={{ width: '100%' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col span={12}>
          <Input
            register={register('bankname', { required: true })}
            label="Bank Name"
            important
          />
        </Col>

        <Col span={12}>
          <Input
            register={register('accountname', { required: true })}
            label="Account Name"
            important
          />
        </Col>

        <Col span={8}>
          <Input
            register={register('accountnumber', { required: true })}
            label="Account Number"
            important
            type="number"
          />
        </Col>

        <Col span={8}>
          <Input register={register('sortcode')} label="Sort Code" />
        </Col>

        <Col span={8}>
          <Input register={register('branch')} label="Branch" />
        </Col>

        <Col span={24}>
          <Textarea
            register={register('comment')}
            label="Comment"
            placeholder="write here..."
          />
        </Col>
      </Row>

      <Space>
        <Button onClick={closeModal}>Cancel</Button>

        <Button type="primary" onClick={handleSubmit(addBankAccount)}>
          Add Account
        </Button>
      </Space>
    </div>
  );
};

export const BankAccountDetail = ({ closeModal }) => {
  const facilityServer = client.service('facility');
  const { register, handleSubmit, control, reset } = useForm();
  const { user, setUser } = useContext(UserContext);
  const [edit, setEdit] = useState(false);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);

  useEffect(() => {
    const accountDetail = state.BankAccountModule.selectedBankAccount;
    reset(accountDetail);
  }, []);

  const updateBankAccount = async (data) => {
    showActionLoader();
    //);
    const employee = user.currentEmployee;
    const prevOrgDetail = user.currentEmployee.facilityDetail;
    const currentAccount = state.BankAccountModule.selectedBankAccount;

    const document = {
      ...currentAccount,
      ...data,
      updatedBy: employee.userId,
      updatedByName: `${employee.firstname} ${employee.lastname}`,
    };

    const prevBankAccounts = prevOrgDetail.facilityBankAcct || [];

    //console.log(prevBankAccounts)

    const newBankAccounts = prevBankAccounts.map((item) => {
      if (item._id === document._id) {
        return document;
      } else {
        return item;
      }
    });

    const newOrgDetail = {
      ...prevOrgDetail,
      facilityBankAcct: newBankAccounts,
    };

    //return console.log(newBankAccounts);

    const documentId = prevOrgDetail._id;

    await facilityServer
      .patch(documentId, { ...newOrgDetail })
      .then((resp) => {
        hideActionLoader();
        setUser((prev) => ({
          ...prev,
          currentEmployee: {
            ...prev.currentEmployee,
            facilityDetail: newOrgDetail,
          },
        }));

        setState((prev) => ({
          ...prev,
          BankAccountModule: {
            ...prev.BankAccountModule,
            selectedBankAccount: document,
          },
        }));

        toast.success("You've succesfully updated the bank account");
      })
      .catch((error) => {
        toast.error(`Failed to updated the bank account; ${error}`);
        hideActionLoader();
        console.error(error);
      });
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '16px',
        }}
      >
        {!edit ? (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setEdit(true)}
          >
            Edit Account
          </Button>
        ) : (
          <Space>
            <Button onClick={() => setEdit(false)}>Cancel Edit</Button>
            <Button type="primary" onClick={handleSubmit(updateBankAccount)}>
              Update Account
            </Button>
          </Space>
        )}
      </div>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Input
            register={register('bankname')}
            label="Bank Name"
            disabled={!edit}
          />
        </Col>

        <Col span={12}>
          <Input
            register={register('accountname')}
            label="Account Name"
            disabled={!edit}
          />
        </Col>

        <Col span={8}>
          <Input
            register={register('accountnumber')}
            label="Account Number"
            disabled={!edit}
          />
        </Col>

        <Col span={8}>
          <Input
            register={register('sortcode')}
            label="Sort Code"
            disabled={!edit}
          />
        </Col>

        <Col span={8}>
          <Input
            register={register('branch')}
            label="Branch"
            disabled={!edit}
          />
        </Col>

        <Col span={24}>
          <Textarea
            register={register('comment')}
            label="Comment"
            placeholder="write here..."
            disabled={!edit}
          />
        </Col>
      </Row>
    </div>
  );
};
