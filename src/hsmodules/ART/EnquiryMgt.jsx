import React from 'react'
import { PageWrapper } from '../app/styles'
import { TableMenu } from '../../ui/styled/global'
import GlobalCustomButton from '../../components/buttons/CustomButton'
import { AddCircleOutline } from '@mui/icons-material'
import CustomTable from '../../components/customtable'
import CreateEnquiryForm from './components/enquiryMgt/createEnquiryMgt'
import { useState } from 'react'
import FilterMenu from '../../components/utilities/FilterMenu'
import ModalBox from '../../components/modal'
import { IconButton } from '@mui/material'
import DeleteIcon from "@mui/icons-material/Delete";
import client from '../../feathers'
import { useContext } from 'react'
import { ObjectContext, UserContext } from '../../context'
import { useEffect } from 'react'
import CustomConfirmationDialog from '../../components/confirm-dialog/confirm-dialog'
import dayjs from 'dayjs'
import EnquiryDetailsForm from './components/enquiryMgt/enquiryMgtDetails'


export default function EnquiryMgt() {
    const [createModal, setCreateModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [confirmationDialog, setConfirmationDialog] = useState(false);
  const { showActionLoader, setState, hideActionLoader } =
    useContext(ObjectContext);
    const [enquiryToDelete,setEnquiryToDelete]=useState(null)
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const enquiryServ =client.service("enquiry")
    const [enquiryData,setEnquiryData] = useState([])
    const {user} = useContext(UserContext);
   
    const enquiryFormSchema = [
      {
        name: "S/N",
        key: "sn",
        description: "Serial Number",
        selector: (row, i) => i + 1,
        sortable: true,
        inputType: "HIDDEN",
        width: "50px",
      },
      {
        name: "Full Name",
        key: "fullName",
        description: "Enter full name",
        selector: (row) =>
          `${row?.type || ""} ${row?.firstname || ""} ${row?.surname || ""}`.trim(),
        sortable: true,
        required: true,
        inputType: "TEXT",
        style: {
          textTransform: "capitalize",
        },
      },
      {
        name: "Profession",
        key: "profession",
        description: "Enter profession",
        selector: (row) => row?.profession || "",
        sortable: true,
        required: true,
        inputType: "TEXT",
        style: {
          textTransform: "capitalize",
        },
      },
      {
        name: "Phone Number",
        key: "phoneNo",
        description: "Enter phone number",
        selector: (row) => row?.phone || "",
        sortable: true,
        required: true,
        inputType: "TEXT",
      },
      {
        name: "Email",
        key: "email",
        description: "Enter email address",
        selector: (row) => row?.email || "",
        sortable: true,
        required: true,
        inputType: "EMAIL",
      },
      {
        name: "Spouse's Name",
        key: "spouseName",
        description: "Enter spouse's name",
        selector: (row) => row?.spousename || "",
        sortable: true,
        required: true,
        inputType: "TEXT",
        style: {
          textTransform: "capitalize",
        },
      },
      {
        name: "Referral",
        key: "referral",
        description: "Enter referral details",
        selector: (row) => row?.referral || "",
        sortable: true,
        required: false,
        inputType: "TEXT",
      },
      {
        name: "Actions",
        key: "action",
        description: "Perform actions",
        selector: (row) => row.action,
        cell: (row) => (
        <span onClick={() => handleConfirmDelete(row)}>
          <DeleteIcon
            sx={{
              color: "#e57373",
              fontSize: "18px",
              ":hover": {
                color: "red",
              },
            }}
          />
        </span>
      ),
        sortable: false,
        inputType: "BUTTON",
        width: "80px",
        center: true,
      },
    ];
    
      const getEnquiryData = async () => {
        setLoading(true);
    
        try {
          const facId = user.currentEmployee.facilityDetail._id;
    
          let query = {
            facilityId: facId,
            $sort: {
              createdAt: -1,
            },
            $limit: limit,
            $skip: (page - 1) * limit,
          };
    
          const res = await enquiryServ.find(query);
          // console.log(res)
          setEnquiryData(res.data);
          setTotal(res.total || 0);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        getEnquiryData();
        enquiryServ.on("created", (obj) => getEnquiryData());
        enquiryServ.on("updated", (obj) => getEnquiryData());
        enquiryServ.on("patched", (obj) => getEnquiryData());
        enquiryServ.on("removed", (obj) => getEnquiryData());
      }, [limit, page]);

      const handleSearch = (val) => {
        enquiryServ
          .find({
            query: {
              $or: [
                {
                  surname: {
                    $regex: val,
                    $options: "i",
                  },
                },
    
                {
                  spouseName: {
                    $regex: val,
                    $options: "i",
                  },
                },
              ],
              facilityId: user.currentEmployee.facilityDetail._id,
              $limit: limit,
            },
          })
          .then((res) => {
            // console.log(res);
            setEnquiryData(res.data);
          })
          .catch((err) => {
            toast.error(`Something went wrong!!!! ${err}`);
            // console.log(err);
          });
      };

      const handleConfirmDelete = (data) => {
        setEnquiryToDelete(data);
        setConfirmationDialog(true);
      };
    
      const closeConfirmationDialog = () => {
        setEnquiryToDelete(null);
        setConfirmationDialog(false);
      };

      const handleHideEditModal = () => {
        setEditModal(false);
      };

      const handleDelete = () => {
        showActionLoader();
        enquiryServ
          .remove(enquiryToDelete._id)
          .then(() => {
            hideActionLoader();
            toast.success(`$Care team Deleted succesfully`);
            setConfirmationDialog(false);
          })
          .catch((err) => {
            hideActionLoader();
            toast.error("Error deleting task " + err);
          });
      };
     
      const handleCreateModal = () => {
        setCreateModal(true);
      };
    
      const handleHideCreateModal = () => {
        setCreateModal(false);
      };

    const onTableChangeRowsPerPage = (size) => {
        setLimit(size);
        setPage(1);
      };
    
      const onTablePageChange = (newPage) => {
        setPage(newPage);
      };
    
    
      const handleRow = (data) => {
        setState((prev) => ({
          ...prev,
          EnquiryModule: { ...prev.ARTModule, selectedEnquiryMgt: data },
        }));
        setEditModal(true);
      }
     

  return (
    <div>
        <PageWrapper
          style={{ flexDirection: "column", padding: "0.6rem 1rem" }}
        >
          <TableMenu>
            <div style={{ display: "flex", alignItems: "center" }}>
              {handleSearch && (
                <div className="inner-table">
                  <FilterMenu onSearch={handleSearch} />
                </div>
              )}
              <h2 style={{ margin: "0 10px", fontSize: "0.95rem" }}>Enquiry Management</h2>
            </div>

            <GlobalCustomButton onClick={handleCreateModal}>
              <AddCircleOutline fontSize="small" sx={{ marginRight: "5px" }} />
              Add Enquiry Management
            </GlobalCustomButton>
          </TableMenu>

          <div
            className="level"
            style={{
              overflow: "auto",
            }}
          >
            <CustomTable
              title={""}
              columns={enquiryFormSchema}
              data={enquiryData}
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
        <ModalBox
        width="60%"
          open={createModal}
          onClose={handleHideCreateModal}
          header="Create Enquiry Form"
        >
          <CreateEnquiryForm onClose={handleHideCreateModal} />
        </ModalBox>
        <ModalBox
        width="60%"
          open={editModal}
          onClose={handleHideEditModal}
          header="Modify Enquiry Mgt"
        >
          <EnquiryDetailsForm  onClose={handleHideEditModal} />
        </ModalBox>
        <CustomConfirmationDialog
          open={confirmationDialog}
          confirmationAction={() => handleDelete(enquiryToDelete)}
          cancelAction={closeConfirmationDialog}
          type="danger"
          message={`You are about to delete a enquiry
          } created on ${dayjs(enquiryToDelete?.createdAt).format("DD-MM-YYYY")}`}
        />
      </div>
  )
}
