import * as yup from "yup";
import dayjs from "dayjs";
import { formatDistanceToNowStrict } from "date-fns";
import { Box } from "@mui/system";
import { Avatar, Typography } from "antd";
import { returnAvatarString } from "../../helpers/returnAvatarString";

export const productItemSchema = [
  {
    name: "S/N",
    key: "sn",
    description: "S/N",
    selector: (row, i) => i + 1,
    sortable: true,
    required: true,
    inputType: "HIDDEN",
    width: "50px",
  },
  {
    name: "Category",
    key: "category",
    description: "Category",
    selector: (row) => (
      <Typography
        sx={{ fontSize: "0.75rem", whiteSpace: "normal" }}
        data-tag="allowRowEvents"
      >
        {row?.category}
      </Typography>
    ),
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Description",
    key: "comment",
    description: "Description",
    selector: (row) => (
      <Typography
        sx={{ fontSize: "0.75rem", whiteSpace: "normal" }}
        data-tag="allowRowEvents"
      >
        {row?.comments}
      </Typography>
    ),
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Duration",
    key: "duration",
    description: "Duration",
    selector: (row) => (
      <Typography
        sx={{ fontSize: "0.75rem", whiteSpace: "normal" }}
        data-tag="allowRowEvents"
      >
        {`${row?.duration} ${row?.durationType}`}
      </Typography>
    ),
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Frequency",
    key: "frequency",
    description: "Frequency",
    selector: (row) => (
      <Typography
        sx={{ fontSize: "0.75rem", whiteSpace: "normal" }}
        data-tag="allowRowEvents"
      >
        {row?.frequency}
      </Typography>
    ),
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Limit",
    key: "limit",
    description: "Limit",
    selector: (row) => (
      <Typography
        sx={{ fontSize: "0.75rem", whiteSpace: "normal" }}
        data-tag="allowRowEvents"
      >
        ₦{row?.limit}
      </Typography>
    ),
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Status",
    key: "status",
    description: "Status",
    selector: (row) => (
      <Typography
        sx={{ fontSize: "0.75rem", whiteSpace: "normal" }}
        data-tag="allowRowEvents"
      >
        {row?.status}
      </Typography>
    ),
    sortable: true,
    required: true,
    inputType: "TEXT",
  },

  {
    name: "Billing type",
    key: "billingtype",
    description: "Billing type",
    selector: (row) => row?.billing_type,
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
];

export const ClientRegisteredSchema = [
  {
    name: "S/N",
    key: "sn",
    description: "SN",

    selector: (row) => row.sn,
    sortable: true,
  },
  {
    name: "Last Name",
    key: "lastname",
    description: "Last Name",

    selector: (row) => row.lastname,
    sortable: true,
    required: true,
  },

  {
    name: "First Name",
    key: "firstname",
    description: "First Name",

    selector: (row) => row.firstname,
    sortable: true,
    required: true,
  },

  {
    name: "Age",
    key: "age",
    description: "age",

    selector: (row) => row.age,
    sortable: true,
    required: true,
  },

  {
    name: "Gender",
    key: "gender",
    description: "Gender",

    selector: (row) => row.gender,
    sortable: true,
    required: true,
  },

  {
    name: "Phome",
    key: "phone",
    description: "phone",

    selector: (row) => row.phone,
    sortable: true,
    required: true,
  },

  {
    name: "Email",
    key: "email",
    description: "Enter your name",

    selector: (row) => row.email,
    sortable: true,
    required: true,
  },
  {
    name: "Action",
    cell: (row) => {
      return (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button label="Duplicate" />
          <Button label="Register" />
          <Button label="Dependent" />
        </Box>
      );
    },
  },
];

export const ClientMiniSchema = [
  {
    name: "S/N",
    key: "sn",
    description: "SN",
    selector: (row, i) => i + 1,
    sortable: true,
    inputType: "HIDDEN",
    width: "50px",
  },

  {
    name: "Image",
    key: "imageurl",
    description: "Midlle Name",
    selector: (row) => (
      <Avatar
        src={row.imageurl}
        {...returnAvatarString(
          `${row.firstname.replace(/\s/g, "")} ${row.lastname.replace(
            /\s/g,
            ""
          )}`
        )}
      />
    ),
    sortable: true,
    required: true,
    inputType: "TEXT",
    width: "100px",
  },

  {
    name: "First Name",
    key: "firstname",
    description: "First Name",
    selector: (row) => row.firstname,
    sortable: true,
    required: true,
    inputType: "TEXT",
    style: {
      textTransform: "capitalize",
    },
  },

  // {
  //   name: "Middlle Name",
  //   key: "middlename",
  //   description: "Midlle Name",
  //   selector: row => (row?.dob),
  //   sortable: true,
  //   required: true,
  //   inputType: "TEXT",
  //   style: {
  //     textTransform: "capitalize",
  //   }, formatDistanceToNowStrict(new Date(option.dob))
  // },

  {
    name: "Last Name",
    key: "lastname",
    description: "Last Name",
    selector: (row) => row.lastname,
    sortable: true,
    required: true,
    inputType: "TEXT",
    style: {
      textTransform: "capitalize",
    },
  },
  {
    name: "Gender",
    key: "gender",
    description: "Gender",
    selector: (row) => (row.gender ? row.gender : "unspecified"),
    sortable: true,
    required: true,
    inputType: "SELECT_LIST",
    options: ["Male", "Female"],
    width: "100px",
    style: {
      textTransform: "capitalize",
    },
  },
  {
    name: "Age",
    key: "age",
    description: "Age",
    selector: row => row.dob ? formatDistanceToNowStrict(new Date(row.dob)) : "Not Stated",
    sortable: true,
    required: true,
    inputType: "TEXT",

  },
  {
    name: "MRN",
    key: "mrn",
    description: "Nigeria",
    selector: row => row.mrn,
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Phone Number",
    key: "phone",
    description: "0806478263",
    selector: (row) => row.phone,
    sortable: true,
    required: true,
    inputType: "PHONE",
    /*  width: "140px", */
  },

  {
    name: "Email",
    key: "email",
    description: "johndoe@mail.com",
    selector: (row) => (row.email ? row.email : "----------"),
    sortable: true,
    required: true,
    inputType: "EMAIL",
  },

  {
    name: "State",
    key: "state",
    description: "Lagos",
    selector: (row) => row.state,
    sortable: true,
    required: true,
    inputType: "TEXT",
    omit: true,
  },

  // {
  //   name: "Country",
  //   key: "country",
  //   description: "Nigeria",
  //   selector: row => row.country,
  //   sortable: true,
  //   required: true,
  //   inputType: "TEXT",
  // },

  {
    name: "Status",
    key: "active",
    description: "Next of Kin",
    selector: (row) => (row.alive ? "Alive" : "Dead"),
    sortable: true,
    required: true,
    inputType: "TEXT",
    omit: false,
    /*  width: "100px", */
  },

  // {
  //   name: "Next of kin Phone",
  //   key: "nextofkinphone",
  //   description: "Next of Kin",
  //   selector: row => row.nextofkinphone,
  //   sortable: true,
  //   required: true,
  //   inputType: "TEXT",
  //   omit: true,
  // },
];

export const clientsUploadColumns = [
  {
    name: "S/N",
    key: "sn",
    description: "SN",
    selector: (row, i) => i + 1,
    sortable: true,
    inputType: "HIDDEN",
    width: "50px",
  },

  {
    name: "Image",
    key: "imageurl",
    description: "Midlle Name",
    selector: (row) => (
      <Avatar
        src={row.imageurl}
        {...returnAvatarString(
          `${row.firstname.replace(/\s/g, "")} ${row.lastname.replace(
            /\s/g,
            ""
          )}`
        )}
      />
    ),
    sortable: true,
    required: true,
    inputType: "TEXT",
    width: "100px",
  },

  {
    name: "First Name",
    key: "firstname",
    description: "First Name",
    selector: (row) => row.firstname,
    sortable: true,
    required: true,
    inputType: "TEXT",
    style: {
      textTransform: "capitalize",
    },
  },

  {
    name: "Middlle Name",
    key: "middlename",
    description: "Midlle Name",
    selector: (row) => (row.middlename ? row.middlename : "----------"),
    sortable: true,
    required: true,
    inputType: "TEXT",
    style: {
      textTransform: "capitalize",
    },
  },

  {
    name: "Last Name",
    key: "lastname",
    description: "Last Name",
    selector: (row) => row.lastname,
    sortable: true,
    required: true,
    inputType: "TEXT",
    style: {
      textTransform: "capitalize",
    },
  },

  {
    name: "DOB",
    key: "dob",
    description: "Date of Birth",
    selector: (row) => dayjs(row.dob).format("MMMM DD, YYYY"),
    sortable: true,
    required: true,
    inputType: "TEXT",
    center: true,
  },

  {
    name: "Gender",
    key: "gender",
    description: "Gender",
    selector: (row) => (row.gender ? row.gender : "unspecified"),
    sortable: true,
    required: true,
    inputType: "SELECT_LIST",
    options: ["Male", "Female"],
    width: "100px",
    style: {
      textTransform: "capitalize",
    },
  },
  {
    name: "Phone Number",
    key: "phone",
    description: "0806478263",
    selector: (row) => row.phone,
    sortable: true,
    required: true,
    inputType: "PHONE",
    width: "140px",
  },

  {
    name: "Email",
    key: "email",
    description: "johndoe@mail.com",
    selector: (row) => (row.email ? row.email : "----------"),
    sortable: true,
    required: true,
    inputType: "EMAIL",
  },

  {
    name: "Residential Address",
    key: "residentialaddress",
    description: "Ozumba Mbadiwe",
    selector: (row) => row.residentialaddress,
    sortable: true,
    required: true,
    inputType: "TEXT",
    omit: true,
  },

  {
    name: "Town",
    key: "town",
    description: "Ikate Elegushi",
    selector: (row) => row.town,
    sortable: true,
    required: true,
    inputType: "TEXT",
    omit: true,
  },

  {
    name: "State",
    key: "state",
    description: "Lagos",
    selector: (row) => row.state,
    sortable: true,
    required: true,
    inputType: "TEXT",
    omit: true,
  },

  {
    name: "Country",
    key: "country",
    description: "Nigeria",
    selector: (row) => row.country,
    sortable: true,
    required: true,
    inputType: "TEXT",
  },

  {
    name: "Status",
    key: "active",
    description: "Next of Kin",
    selector: (row) => (row.alive ? "Alive" : "Dead"),
    sortable: true,
    required: true,
    inputType: "TEXT",
    omit: false,
    width: "100px",
  },

  {
    name: "Next of kin Phone",
    key: "nextofkinphone",
    description: "Next of Kin",
    selector: (row) => row.nextofkinphone,
    sortable: true,
    required: true,
    inputType: "TEXT",
    omit: true,
  },
];

const nigerianPhoneRegExp = /^([0]{1})[0-9]{10}$/;

export const createClientSchema = yup.object().shape({
  firstname: yup.string().required("Enter the first name of the client!"),
  lastname: yup.string().required("Enter the last name of the client!"),
  dob: yup.string().required("Enter the date of birth of the client!"),
  phone: yup
    .string()
    // .matches(nigerianPhoneRegExp, "Enter a valid phone number (0900000000000).")
    .required("Enter the phone number of the client!"),
  email: yup.string().email("Must be a valid email!"),
  //.required("Email is required!"),

  nok_email: yup.string().email("Must be a valid email!"),

  nok_phoneno: yup
    .string(),
  // .matches(
  //   nigerianPhoneRegExp,
  //   "Enter a valid phone number (0900000000000)."
  // ),
});
export const createClientSchema2 = yup.object().shape({
  firstname: yup.string().required("Enter the first name of the client!"),
  lastname: yup.string().required("Enter the last name of the client!"),
  phone: yup
    .string()
    // .matches(nigerianPhoneRegExp, "Enter a valid phone number (0900000000000).")
    .required("Enter the phone number of the client!"),
  email: yup.string().email("Must be a valid email!"),
  //.required("Email is required!"),

  nok_email: yup.string().email("Must be a valid email!"),

  nok_phoneno: yup
    .string(),
  // .matches(
  //   nigerianPhoneRegExp,
  //   "Enter a valid phone number (0900000000000)."
  // ),
});

export const resetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Must be a valid email!")
    .required("Email is required!"),
});
