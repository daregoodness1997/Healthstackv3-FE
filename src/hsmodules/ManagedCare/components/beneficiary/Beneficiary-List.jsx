/* eslint-disable */
import React, { useState, useContext, useEffect, useRef } from "react";
import client from "../../../../feathers";
import { formatDistanceToNowStrict } from "date-fns";
import FilterMenu from "../../../../components/utilities/FilterMenu";
import { Avatar, Box, Button, IconButton } from "@mui/material";
import CustomTable from "../../../../components/customtable";
import { ObjectContext, UserContext } from "../../../../context";
import { toast } from "react-toastify";
import { returnAvatarString } from "../../../helpers/returnAvatarString";
import CustomConfirmationDialog from "../../../../components/confirm-dialog/confirm-dialog";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExcelJS from 'exceljs';
import { Download } from "@mui/icons-material";
import dayjs from "dayjs";
import GlobalCustomButton from "../../../../components/buttons/CustomButton";


const BeneficiariesList = ({ showDetail, corporate }) => {
  const policyServer = client.service("policy");
  const [beneficiaries, setBeneficiaries] = useState([]);
  const { state, setState } = useContext(ObjectContext);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]); 


  const handleCreateNew = () => {};

  const handleRow = (item) => {
   
    console.log(item)
    showDetail(item);
  };

  const handleExportToExcel = async (beneficiary) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Beneficiary');
    
    // Add data in vertical format
    const verticalData = [
      ["CustomerID", beneficiary._id],
      ["MemberShipID", beneficiary.policyNo],
      ["FamilyCode", beneficiary._id],
      ["MemberShipFullID", beneficiary.policyNo],
      ["PlanID", beneficiary.plan?._id || ""],
      ["EmployeeSurname", beneficiary.lastname || ""],
      ["EmployeeOtherName", beneficiary.firstname || ""],
      ["Gender", beneficiary.gender],
      ["DateOfBirth", dayjs(beneficiary.dob).format("YYYY-MM-DD")],
      ["MaritalStatus", beneficiary.maritalstatus],
      ["Address1", `${beneficiary.state}, ${beneficiary.country}, ${beneficiary.lga}`],
      ["Address2", `${beneficiary.state}, ${beneficiary.country}, ${beneficiary.lga}`],
      ["Address3", `${beneficiary.state}, ${beneficiary.country}, ${beneficiary.lga}`],
      ["Tel", beneficiary.phone],
      ["EMail", beneficiary.email],
      ["Designation", beneficiary.profession],
      ["HospitalID", beneficiary.sponsor?._id || ""],
      ["BloodTypeID", beneficiary.bloodgroup],
      ["Genotype", beneficiary.genotype],
      ["ActiveYN", beneficiary.active],
      ["PlanDescription", beneficiary.plan?.name || ""],
      ["CustomerName", `${beneficiary.firstname} ${beneficiary.lastname}`],
      ["HospitalName", beneficiary.sponsor?.facilityName || ""],
      ["PaymentStartDate", dayjs(beneficiary.policy.validitystarts).format("YYYY-MM-DD")],
      ["PaymentEndDate", dayjs(beneficiary.policy.validityEnds).format("YYYY-MM-DD")]
    ];
    
    verticalData.forEach(row => worksheet.addRow(row));
    
    // Set column widths
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 40;
    
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, "Beneficiary.xlsx");
  };



  const handleExportMultiple = async (beneficiaries) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Beneficiaries');
    
    // Define columns
    worksheet.columns = [
      { header: 'CustomerID', key: 'customerId', width: 20 },
      { header: 'MemberShipID', key: 'membershipId', width: 20 },
      { header: 'FamilyCode', key: 'familyCode', width: 20 },
      { header: 'MemberShipFullID', key: 'membershipFullId', width: 20 },
      { header: 'PlanID', key: 'planId', width: 20 },
      { header: 'EmployeeSurname', key: 'employeeSurname', width: 20 },
      { header: 'EmployeeOtherName', key: 'employeeOtherName', width: 20 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'DateOfBirth', key: 'dateOfBirth', width: 15 },
      { header: 'MaritalStatus', key: 'maritalStatus', width: 15 },
      { header: 'Address1', key: 'address1', width: 30 },
      { header: 'Address2', key: 'address2', width: 30 },
      { header: 'Address3', key: 'address3', width: 30 },
      { header: 'Tel', key: 'tel', width: 15 },
      { header: 'EMail', key: 'email', width: 25 },
      { header: 'Designation', key: 'designation', width: 20 },
      { header: 'HospitalID', key: 'hospitalId', width: 20 },
      { header: 'BloodTypeID', key: 'bloodTypeId', width: 15 },
      { header: 'Genotype', key: 'genotype', width: 10 },
      { header: 'ActiveYN', key: 'activeYN', width: 10 },
      { header: 'PlanDescription', key: 'planDescription', width: 30 },
      { header: 'CustomerName', key: 'customerName', width: 30 },
      { header: 'HospitalName', key: 'hospitalName', width: 30 },
      { header: 'PaymentStartDate', key: 'paymentStartDate', width: 15 },
      { header: 'PaymentEndDate', key: 'paymentEndDate', width: 15 },
    ];
    
    // Add data rows
    beneficiaries.forEach((beneficiary) => {
      worksheet.addRow({
        customerId: beneficiary._id,
        membershipId: beneficiary.policyNo,
        familyCode: beneficiary._id,
        membershipFullId: beneficiary.policyNo,
        planId: beneficiary.plan?._id || '',
        employeeSurname: beneficiary.lastname || '',
        employeeOtherName: beneficiary.firstname || '',
        gender: beneficiary.gender,
        dateOfBirth: dayjs(beneficiary.dob).format('YYYY-MM-DD'),
        maritalStatus: beneficiary.maritalstatus,
        address1: `${beneficiary.state}, ${beneficiary.country}, ${beneficiary.lga}`,
        address2: `${beneficiary.state}, ${beneficiary.country}, ${beneficiary.lga}`,
        address3: `${beneficiary.state}, ${beneficiary.country}, ${beneficiary.lga}`,
        tel: beneficiary.phone,
        email: beneficiary.email,
        designation: beneficiary.profession,
        hospitalId: beneficiary.sponsor?._id || '',
        bloodTypeId: beneficiary.bloodgroup,
        genotype: beneficiary.genotype,
        activeYN: beneficiary.active,
        planDescription: beneficiary.plan?.name || '',
        customerName: `${beneficiary.firstname} ${beneficiary.lastname}`,
        hospitalName: beneficiary.sponsor?.facilityName || '',
        paymentStartDate: dayjs(beneficiary.policy.validitystarts).format('YYYY-MM-DD'),
        paymentEndDate: dayjs(beneficiary.policy.validityEnds).format('YYYY-MM-DD'),
      });
    });
    
    // Style header row
    worksheet.getRow(1).font = { bold: true };
    
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Beneficiaries.xlsx');
  };


  const handleSearch = (val) => {
    if (val.length < 3 && val.trim() === "") return;
    policyServer
      .find({
        query: {
          $or: [
            {
              policyNo: {
                $regex: val,
                $options: "i",
              },
            },
            {
              "principal.lastname": {
                $regex: val,
                $options: "i",
              },
            },
            {
              status: {
                $regex: val,
                $options: "i",
              },
            },

            {
              "principal.firstname": {
                $regex: val,
                $options: "i",
              },
            },
            {
              "dependantBeneficiaries.type": {
                $regex: val,
                $options: "i",
              },
            },
            {
              "principal.type": {
                $regex: val,
                $options: "i",
              },
            },
            {
              "dependantBeneficiaries.firstname": {
                $regex: val,
                $options: "i",
              },
            },
            {
              "dependantBeneficiaries.lastname": {
                $regex: val,
                $options: "i",
              },
            },

            {
              "sponsor.facilityName": {
                $regex: val,
                $options: "i",
              },
            },
            {
              sponsorshipType: {
                $regex: val,
                $options: "i",
              },
            },
            {
              planType: {
                $regex: val,
                $options: "i",
              },
            },
            {
              "plan.planName": {
                $regex: val,
                $options: "i",
              },
            },
            {
              "providers.facilityName": {
                $regex: val,
                $options: "i",
              },
            },
            { "principal.gender": val },
            { "dependantBeneficiaries.gender": val },
          ],

          organizationId: user.currentEmployee.facilityDetail._id, // || "",

          $sort: {
            createdAt: -1,
          },
        },
      })
      .then((res) => {
        const policies = res.data;
        const data = returnBeneficiaries(policies);
        setBeneficiaries(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const returnBeneficiaries = (policies) => {
    const data = policies.map((policy) => {
      const dependents = policy?.dependantBeneficiaries?.map((item) => {
        return {
          ...item,
          policyNo: policy?.policyNo,
          sponsor: policy?.sponsor,
          plan: policy?.plan,
          clientType: "Dependent",
          sponsortype: policy?.sponsorshipType,
          approved: policy?.approved,
          policy: policy,
        };
      });
      return [
        {
          ...policy.principal,
          policyNo: policy?.policyNo,
          sponsor: policy?.sponsor,
          plan: policy?.plan,
          clientType: "Principal",
          sponsortype: policy?.sponsorshipType,
          approved: policy?.approved,
          policy: policy,
        },
        ...(dependents || []) 
      ];
    });

    const beneficiariesData = [].concat.apply([], data);

    return beneficiariesData;
  };

  const getFacilities = async () => {
    setLoading(true);
    let query = {
      organizationId: user.currentEmployee.facilityDetail._id,
      $sort: {
        createdAt: -1,
      },
    };

    if (corporate) {
      query = {
        organizationId: user.currentEmployee.facilityDetail._id,
        $or: [
          { "sponsor.facilityName": corporate.facilityName },
          { "sponsor._id": corporate._id },
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
      .then((res) => {
        const policies = res.data;
        const data = returnBeneficiaries(policies);
        setBeneficiaries(data);
        setTotal(data.length);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Something went wrong!");
        console.log(err);
      });
  };

  useEffect(() => {
    getFacilities();
    policyServer.on('created', (obj) => getFacilities());
    policyServer.on('updated', (obj) => getFacilities());
    policyServer.on('patched', (obj) => getFacilities());
    policyServer.on('removed', (obj) => getFacilities());
    return () => {};
  }, [limit,page]);

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [docToDel, setDocToDel] = useState({});

  const handleDelete = async (obj) => {
    await policyServer
      .remove(obj._id)
      .then((resp) => {
        toast.success("Sucessfuly deleted ProductEntry ");
        setConfirmDialog(false);
      })
      .catch((err) => {
        toast.error("Error deleting ProductEntry " + err);
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

  const BeneficiarySchema = [
    {
      name: "Select",
      key: "select",
      selector: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row._id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows([...selectedRows, row._id]);
            } else {
              setSelectedRows(selectedRows.filter((id) => id !== row._id));
            }
          }}
        />
      ),
      sortable: false,
      width: "60px",
      center: true
    },
    {
      name: "S/N",
      key: "sn",
      description: "SN",
      selector: (row) => row.sn,
      sortable: true,
      inputType: "HIDDEN",
      width: "50px",
    },
    {
      name: "Image",
      key: "sn",
      description: "Enter name of employee",
      selector: (row) => (
        <Avatar
          src={row.imageurl}
          {...returnAvatarString(
            `${row.firstname.replace(/\s/g, "")} ${row.lastname.replace(
              /\s/g,
              "",
            )}`,
          )}
        />
      ),
      sortable: true,
      inputType: "HIDDEN",
      width: "80px",
    },
    {
      name: "First Name",
      key: "firstname",
      description: "First Name",
      selector: (row) => row.firstname,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Last Name",
      key: "lastname",
      description: "Last Name",
      selector: (row) => row.lastname,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Age",
      key: "dob",
      description: "Age",
      selector: (row) =>
        row.dob ? formatDistanceToNowStrict(new Date(row?.dob)) : "",
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Gender",
      key: "gender",
      description: "Male",
      selector: (row) => row.gender,
      sortable: true,
      required: true,
      inputType: "SELECT_LIST",
      options: ["Male", "Female"],
    },

    {
      name: "Email",
      key: "email",
      description: "johndoe@mail.com",
      selector: (row) => row.email,
      sortable: true,
      required: true,
      inputType: "EMAIL",
    },
    {
      name: "Policy No",
      key: "policyNo",
      description: "Policy No",
      selector: (row) => row?.policyNo,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Client Type",
      key: "clientType",
      description: "Client Type",
      selector: (row) => row?.clientType,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Sponsor Type",
      key: "sponsorType",
      description: "Sponsor Type",
      selector: (row) => row?.sponsortype,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Export",
      key: "action",
      description: "Enter Action",
      selector: (row) => (
        <IconButton size="small" onClick={() => handleExportToExcel(row)}>
          <Download fontSize="small" sx={{ color: "blue" }} />
        </IconButton>
      ),
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "140px",
      center: true,
    },
    {
      name: "Actions",
      key: "action",
      description: "Enter Action",
      selector: (row) => (
        <IconButton size="small" onClick={() => handleConfirmDelete(row)}>
          <DeleteOutlineIcon fontSize="small" sx={{ color: "red" }} />
        </IconButton>
      ),
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "100px",
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
    <Box
      sx={{
        width: "100%",
      }}
      p={2}
    >
      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={handleCancelConfirm}
        confirmationAction={() => handleDelete(docToDel)}
        message={`Are you sure you want to delete this exit with No: ${docToDel?.sn}`}
      />
     <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="inner-table">
            <FilterMenu onSearch={handleSearch} />
          </div>

          <h2 style={{ marginLeft: '10px', fontSize: '0.95rem' }}>
            List of Beneficiaries ({total})
          </h2>
        </div>

        <GlobalCustomButton
          startIcon={<Download />}
          onClick={() => {
            const selectedBeneficiaries = beneficiaries.filter((b) =>
              selectedRows.includes(b._id),
            );
            handleExportMultiple(selectedBeneficiaries);
          }}
        >
          Export Selected ({selectedRows.length})
        </GlobalCustomButton>
      </div>

      {handleCreateNew && (
        <Button
          style={{ fontSize: "14px", fontWeight: "600px" }}
          label="Add New"
          onClick={handleCreateNew}
          showicon={true}
        />
      )}
      <Box
        className="level"
        style={{
          height: corporate ? "calc(100vh - 240px)" : "calc(100vh - 140px)",
          overflow: "scroll",
        }}
      >
         <CustomTable
          title={''}
          columns={BeneficiarySchema}
          data={beneficiaries}
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
      </Box>
    </Box>
  );
};

export default BeneficiariesList;