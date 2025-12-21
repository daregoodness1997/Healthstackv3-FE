import {useState, useEffect, useCallback, useContext} from "react";
import {Box, IconButton, Typography} from "@mui/material";
import client from "../../../feathers";
import {ObjectContext, UserContext} from "../../../context";
import FilterMenu from "../../../components/utilities/FilterMenu";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CustomTable from "../../../components/customtable";
import dayjs from "dayjs";
import {TableMenu} from "../../../ui/styled/global";
import {useForm} from "react-hook-form";
import CustomSelect from "../../../components/inputs/basic/Select";
import { toast } from "react-toastify";
import CustomConfirmationDialog from "../../../components/confirm-dialog/confirm-dialog";

const NotificationsListComponent = ({showDetail}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [total, setTotal] = useState(0);
  const notificationsServer = client.service("notification");
  const [notificationToDelete, setNotificationToDelete] =
    useState(null);
 
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const {control, watch} = useForm({
    defaultValues: {
      status: "All",
      priority: "All",
    },
  });
  const {user} = useContext(UserContext);
  const { setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notification_status = watch("status");
  const notification_priority = watch("priority");

  const getNotifications = useCallback(async () => {
    const userId = user.currentEmployee._id;
    //console.log(userId);
    setLoading(true);

    let query = {
      facilityId: user.currentEmployee.facilityDetail._id,
      
      senderId: {
        $ne: userId,
      },
      $sort: {
        createdAt: -1,
      },
      $limit: limit,
      $skip: (page - 1) * limit,
    };

    if (notification_priority !== "All") {
      query.priority = notification_priority.toLowerCase();
    }

    if (notification_status === "Seen") {
      query.isRead = {$in: [userId]};
    }

    if (notification_status === "Unseen") {
      query.isRead = {$nin: [userId]};
    }

    const response = await notificationsServer.find({
      query: query,
    });

    setNotifications(response.data);
    console.log(response);
    setTotal(response?.total)
    setLoading(false);
  }, [notification_status, notification_priority]);

  const handleSearch = val => {};

  const handleRow = item => {
    setState(prev => ({
      ...prev,
      NotificationModule: {
        ...prev.NotificationModule,
        selectedNotification: item,
      },
    }));
    showDetail();
  };

  const handleDelete = () => {
    showActionLoader();
    notificationsServer.remove(notificationToDelete._id)
      .then(() => {
        hideActionLoader();
        toast.success(`notification deleted successfully`);
        setConfirmationDialog(false);
      })
      .catch((err) => {
        hideActionLoader();
        toast.error('Error deleting notification ' + err);
      });
  };

  const handleConfirmDelete = (data) => {
    setNotificationToDelete(data);
    setConfirmationDialog(true);
  };

  const closeConfirmationDialog = () => {
    setNotificationToDelete(null);
    setConfirmationDialog(false);
  };

  useEffect(() => {
    getNotifications();
    notificationsServer.on('created', (obj) =>
      getNotifications(),
    );
    notificationsServer.on('updated', (obj) =>
      getNotifications(),
    );
    notificationsServer.on('patched', (obj) =>
      getNotifications(),
    );
    notificationsServer.on('removed', (obj) =>
      getNotifications(),
    );
  }, [getNotifications,limit,page]);

  const notificationColumns = [
    {
      name: "S/N",
      key: "sn",
      description: "Enter name of location",
      sortable: true,
      selector: (row, i) => i + 1,
      inputType: "HIDDEN",
      width: "60px",
    },

    {
      name: "Sender",
      key: "sn",
      width: "120px",
      description: "Enter name of location",
      sortable: true,
      selector: row => (
        <Typography
          sx={{fontSize: "0.75rem", whiteSpace: "normal"}}
          data-tag="allowRowEvents"
        >
          {row.sender}
        </Typography>
      ),
      inputType: "HIDDEN",
      style: {
        textTransform: "capitalize",
        color: "#0064CC",
      },
    },
    {
      name: "Date",
      key: "sn",
      width: "120px",
      description: "Enter name of location",
      sortable: true,
      selector: row => (
        <Typography
          sx={{fontSize: "0.75rem", whiteSpace: "normal"}}
          data-tag="allowRowEvents"
        >
          {dayjs(row.createdAt).format("DD/MM/YYYY HH:ss")}
        </Typography>
      ),
      //selector: row => dayjs(row.createdAt).format("DD/MM/YYYY HH:ss"),
      inputType: "HIDDEN",
    },
    {
      name: "Title",
      key: "sn",
      width: "120px",
      description: "Enter name of location",
      sortable: true,
      selector: row => (
        <Typography
          sx={{fontSize: "0.75rem", whiteSpace: "normal"}}
          data-tag="allowRowEvents"
        >
          {row.title}
        </Typography>
      ),
      inputType: "HIDDEN",
    },

    {
      name: "Priority",
      key: "sn",
      width: "120px",
      description: "Enter name of location",
      sortable: true,
      selector: row => (
        <Typography
          sx={{fontSize: "0.75rem", whiteSpace: "normal"}}
          data-tag="allowRowEvents"
        >
          {row.priority}
        </Typography>
      ),
      inputType: "HIDDEN",
      style: {
        textTransform: "capitalize",
      },
    },
    {
      name: "Seen",
      key: "sn",
      width: "120px",
      description: "Enter name of location",
      sortable: true,
      selector: row =>
        row.isRead.includes(user.currentEmployee._id) ? "Seen" : "Unseen",
      inputType: "HIDDEN",
    },
    {
      name: "Description",
      key: "sn",
      description: "Enter name of location",
      sortable: true,
      selector: row => (
        <Typography
          sx={{fontSize: "0.75rem", whiteSpace: "normal"}}
          data-tag="allowRowEvents"
        >
          {row.description}
        </Typography>
      ),
      inputType: "HIDDEN",
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

  return (
    <Box>
      <TableMenu>
        <div style={{display: "flex", alignItems: "center"}}>
          {handleSearch && (
            <div className="inner-table">
              <FilterMenu onSearch={handleSearch} />
            </div>
          )}
          <h2 style={{margin: "0 10px", fontSize: "0.95rem"}}>Notifications</h2>
        </div>

        <Box
          sx={{
            width: "300px",
            display: "flex",
            gap: 1.5,
          }}
        >
          <CustomSelect
            label="Status"
            control={control}
            options={["All", "Seen", "Unseen"]}
            name="status"
          />

          <CustomSelect
            label="Priority"
            control={control}
            options={["All", "Normal", "Urgent"]}
            name="priority"
          />
        </Box>
      </TableMenu>

      <Box
        sx={{
          width: "100%",
          // height: "calc(100vh - 170px)",
          // overflowY: "scroll",
        }}
      >
        <CustomTable
          title={""}
          columns={notificationColumns}
          data={notifications}
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
          //conditionalRowStyles={conditionalRowStyles}
        />
      </Box>
      <CustomConfirmationDialog
        open={confirmationDialog}
        confirmationAction={() => handleDelete(notificationToDelete)}
        cancelAction={closeConfirmationDialog}
        type="danger"
        message={`You are about to delete an notification`}
      />
    </Box>
  );
};

export default NotificationsListComponent;
