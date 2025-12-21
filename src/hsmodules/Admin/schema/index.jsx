import * as yup from "yup";
import { Avatar } from "@mui/material";
import { returnAvatarString } from "../../helpers/returnAvatarString";


export const BandSchema = [
  {
    name: "S/N",
    key: "_id",
    description: "Enter name of band",
    sortable: true,
    inputType: "HIDDEN",
    width: "80px",
  },
  {
    name: "Name of Band",
    key: "name",
    description: "Enter name of band",
    selector: row => row.name,
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Band Type",
    key: "bandType",
    description: "Enter name of band",
    selector: row => row.bandType,
    sortable: true,
    required: true,
    inputType: "SELECT_LIST",
    options: ["Provider", "Company", "Patient", "Plan"],
  },
  {
    name: "Description of Band",
    key: "description",
    description: "Enter description of band",
    selector: row => row.description,
    sortable: true,
    required: false,
    inputType: "TEXT",
  },
];
// validation schema

const nigerianPhoneRegExp = /^([0]{1})[0-9]{10}$/;

export const createBandSchema = yup.object().shape({
  name: yup.string().required("Enter the  name of the band!"),
  bandType: yup.string().required("Enter the band type!"),
});
export const createLocationSchema = yup.object().shape({
  name: yup.string().required("Enter the  name of the location!"),
  locationType: yup.string().required("Enter the location type!"),
});

export const createEmployeeSchema = yup.object().shape({
  firstname: yup.string().required("First Name is required!"),
  middlename: yup.string(),
  lastname: yup.string().required("Last Name is required!"),
  profession: yup.string().required("Employee Profession is required!"),
  position: yup.string().required("Employee Position is required!"),
  phone: yup
    .string()
    .matches(nigerianPhoneRegExp, "Enter a valid phone number (0900000000000).")
    .required("Enter the phone number of the client!"),
  email: yup.string().required("Email is required!"),
  department: yup.string().required("Employee Department is required!"),
  depunit: yup.string(),
  password: yup.string().required("Password is required!"),
});


export const getEmployeeSchema = [
  {
    name: "S/N",
    key: "sn",
    description: "Enter name of employee",
    selector: (row) => row.sn,
    sortable: true,
    inputType: "HIDDEN",
    width: "60px",
  },
  {
    name: "Image",
    key: "sn",
    description: "Enter name of employee",
    selector: (row) => (
      <Avatar
        src={row.imageurl}
        {...returnAvatarString(
          `${row.firstname.toUpperCase()} ${row.lastname.toUpperCase()}`
        )}
      />
    ),
    sortable: true,
    inputType: "HIDDEN",
    width: "80px",
  },
  {
    name: "Firstname",
    key: "firstname",
    description: "Enter firstname",
    selector: (row) => row.firstname,
    sortable: true,
    required: true,
    inputType: "TEXT",
    validator: yup.string().required("Enter your Firstname"),
    style: {
      textTransform: "capitalize",
    },
  },
  {
    name: "Last Name",
    key: "lastname",
    description: "Enter lastname",
    selector: (row) => row.lastname,
    sortable: true,
    required: true,
    inputType: "TEXT",
    validator: yup.string().required("Enter your Lastname"),
    style: {
      textTransform: "capitalize",
    },
  },
  {
    name: "Profession",
    key: "profession",
    description: "Enter profession",
    selector: (row) => row.profession,
    sortable: true,
    required: true,
    inputType: "TEXT",
    validator: yup.string().required("Enter your Profession"),
    style: {
      textTransform: "capitalize",
    },
  },
  {
    name: "Phone number",
    key: "phone",
    description: "Enter phone number",
    selector: (row) => row.phone,
    sortable: true,
    required: true,
    inputType: "TEXT",
    validator: yup.string().required("Enter your Phone number"),
  },
  {
    name: "Email",
    key: "email",
    description: "Enter Email",
    selector: (row) => row.email,
    sortable: true,
    required: true,
    inputType: "TEXT",
    validator: yup.string().required("Enter your valid Email"),
  },
  {
    name: "Department",
    key: "facility",
    description: "Select facility",
    selector: (row) => row.department,
    sortable: true,
    required: true,
    inputType: "HIDDEN",
    //   defaultValue: facilityId,
    validator: yup.string().required("Facility not available"),
  },
  {
    name: "position",
    key: "department",
    description: "Enter department",
    selector: (row) => row.position,
    sortable: true,
    required: true,
    inputType: "TEXT",
    validator: yup.string().required("Enter your Department"),
  },
  {
    name: "Department Unit",
    key: "deptunit",
    description: "Enter department",
    selector: (row) => row.deptunit,
    sortable: true,
    required: true,
    inputType: "TEXT",
    validator: yup.string().required("Enter your Departmental Unit"),
  },
];


export const LocationDetailSchema = [
  {
    name: "S/N",
    key: "sn",
    description: "sn",
    sortable: true,
    selector: (row) => row.sn,
    inputType: "HIDDEN",
    width: "80px",
  },
  {
    name: "Type",
    key: "type Location",
    description: " Enter type Location",
    selector: (row) => row.type,
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Name",
    key: "key",
    description: "Enter name ",
    selector: (row) => row.typeName,
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
];