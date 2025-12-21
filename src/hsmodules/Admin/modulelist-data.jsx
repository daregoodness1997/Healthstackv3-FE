export const actionRoles = [
  {
    value: 'Adjust Price',
    label: 'Adjust Price',
  },
  {
    value: 'Attend to Client',
    label: 'Attend to Client',
  },
  {
    value: 'Delete Documents',
    label: 'Delete Documents',
  },
  {
    value: 'Complaints',
    label: 'Complaints',
  },
  {
    value: 'Bill Client',
    label: 'Bill Client',
  },
];

export const modulesList = [

  {
    value: 'Client',
    label: 'Client',
    children: [
      {
        value: 'Client Appointment',
        label: 'Appointment',
      },
      {
        value: 'Client Client',
        label: 'Client ',
      },

      {
        value: 'Client Bill Client',
        label: 'Bill Client ',
      },
    ],
  },

  {
    value: 'Clinic',
    label: 'Clinic',
    children: [
      {
        value: 'Clinic Appointment',
        label: 'Appointment',
      },
      {
        value: 'Clinic Checkin',
        label: 'Checkin',
      },
    ],
  },

  {
    value: 'Appointments',
    label: 'Appointments',
    //children: [],
  },

  {
    value: 'Laboratory',
    label: 'Laboratory',
    children: [
      {
        value: 'Laboratory Bill Client',
        label: ' Bill Client ',
      },
      {
        value: 'Laboratory Bill Lab Orders',
        label: 'Bill Lab Orders',
      },
      {
        value: 'Laboratory Lab Result',
        label: ' Lab Result ',
      },
    ],
  },

  {
    value: 'Pharmacy',
    label: 'Pharmacy',
    children: [
      {
        value: 'Pharmacy Bill Client',
        label: 'Bill Client ',
      },
      {
        value: 'Pharmacy Bill Prescription Sent',
        label: ' Bill Prescription Sent ',
      },
      {
        value: 'Pharmacy Pharmaco-vigilance',
        label: ' Pharmaco-vigilance ',
      },
      {
        value: 'Pharmcy Dispensary',
        label: 'Dispensary',
      },
      {
        value: 'Pharmacy Store Inventory',
        label: 'Store Inventory',
      },
      {
        value: 'Pharmacy Product Entry',
        label: 'Product Entry ',
      },
      {
        value: 'Pharmacy Product',
        label: 'Product',
      },
      {
        value: 'Pharmacy Authorization',
        label: ' Authorization',
      },
      {
        value: 'Pharmacy Issue Out',
        label: ' Issue Out',
      },
    ],
  },
  {
    value: 'Provider Relation Management',
    label: 'Provider Relation Management',
    children: [
      {
        value: 'Provider Accreditation',
        label: 'Provider Accreditation',
      },
      {
        value: 'Provider Monitoring',
        label: 'Provider Monitoring',
      },
      {
        value: 'NHIA Statutory Report',
        label: 'NHIA Statutory Report',
      },
      {
        value: 'Enrollee Sensitization',
        label: 'Enrollee Sensitization',
      },
      {
        value: 'Grievance',
        label: 'Grievance',
      },
    ],
  },
  {
    value: 'Finance',
    label: 'Finance',
    children: [
      {
        value: 'Finance Bill Services',
        label: 'Bill Services',
      },
      {
        value: 'Finance Payment',
        label: 'Payment',
      },
      {
        value: 'Finance Revenue',
        label: 'Revenue',
      },
      {
        value: 'Finance Collections',
        label: 'Collections',
      },
      {
        value: 'Finance Transactions',
        label: 'Transactions',
      },
      {
        value: 'Finance Services',
        label: 'Services',
      },
      {
        value: 'Finance HMO Authorization',
        label: 'HMO Authorization',
      },
      {
        value: 'Booked Services',
        label: 'Booked Services',
      },
    ],
  },

  {
    value: 'Radiology',
    label: 'Radiology',
    children: [
      {
        value: 'Radiology Bill Client',
        label: ' Bill Client ',
      },
      {
        value: 'Radiology Checked-In',
        label: ' Checked-In ',
      },
      {
        value: 'Radiology Appointment',
        label: 'Appointment',
      },
      {
        value: 'Radiology Bill Lab Orders',
        label: 'Bill Lab Orders',
      },
      {
        value: 'Radiology Result',
        label: 'Radiology Result',
      },
    ],
  },

  {
    value: 'Admin',
    label: 'Admin',
    children: [
      {
        value: 'Admin Bands',
        label: 'Bands',
      },
      {
        value: 'Admin Employees',
        label: 'Employees',
      },
      {
        value: 'Admin Location',
        label: 'Location',
      },
    ],
  },

  {
    value: 'Communication',
    label: 'Communication',
    // children: [
    //   {
    //     value: "Communication Chat",
    //     label: "Bands",
    //   },
    //   {
    //     value: "Communication SMS",
    //     label: "SMS",
    //   },
    //   {
    //     value: "Communication Location",
    //     label: "Location",
    //   },
    // ],
  },

  {
    value: 'Inventory',
    label: 'Inventory',
    children: [
      {
        value: 'Inventory Bill Client',
        label: 'Bill Client',
      },
      {
        value: 'Inventory Bill Prescription Sent',
        label: 'Bill Prescription Sent',
      },
      {
        value: 'Inventory Dispensary',
        label: 'Dispensary',
      },
      {
        value: 'Inventory Store Inventory',
        label: 'Store Inventory ',
      },
      {
        value: 'Inventory Product Entry',
        label: 'Product Entry ',
      },
      {
        value: 'Inventory Issue Out',
        label: 'Issue Out ',
      },
      {
        value: 'Inventory Authorization',
        label: 'Authorization',
      },
      {
        value: 'Inventory Requisition',
        label: 'Requisition',
      },
      {
        value: 'Inventory Transfer',
        label: 'Transfer',
      },
    ],
  },

  {
    value: 'Epidemiology',
    label: 'Epidemiology',
    children: [
      {
        value: 'Epidemiology Case Definition',
        label: 'Case Definition',
      },

      {
        value: 'Epidemiology Signals',
        label: 'Signals',
      },

      {
        value: 'Epidemiology Map',
        label: 'Map',
      },
    ],
  },

  {
    value: 'Ward',
    label: 'Ward',
    children: [
      {
        value: 'Ward Admission',
        label: 'Admission',
      },
      {
        value: 'Ward Discharge',
        label: 'Discharge',
      },
      {
        value: 'Ward In-Patient',
        label: 'In-Patient',
      },
    ],
  },

  {
    value: 'Theatre',
    label: 'Theatre',
    children: [
      {
        value: 'Theatre Appointment',
        label: 'Appointment',
      },
      {
        value: 'Theatre Check In',
        label: 'Check In',
      },
      {
        value: 'Theatre Bill Client',
        label: 'Bill Client',
      },
      {
        value: 'Theatre Bill Order Sent',
        label: 'Bill Order Sent',
      },
    ],
  },

  {
    value: 'Provider Payment',
    label: 'Provider Payment',
    children: [
      {
        value: 'Provider Payment Queued',
        label: 'Queued',
      },
      {
        value: 'Provider Payment Instructions',
        label: 'Instructions',
      },
      {
        value: 'Provider Payment Paid',
        label: 'Paid',
      },
    ],
  },

  {
    value: 'Managed Care',
    label: 'Managed Care',
    children: [
      {
        label: 'Policy',
        value: 'Managed Care Policy',
      },
      {
        label: 'Beneficiary',
        value: 'Managed Care Beneficiary',
      },
      {
        label: 'Provider',
        value: 'Managed Care Provider',
      },
      {
        label: 'Corporate',
        value: 'Managed Care Corporate',
      },
      {
        label: 'Complaints',
        value: 'Managed Care Complaints',
      },
      {
        label: 'HIA',
        value: 'Managed Care HIA',
      },
      {
        label: 'Premiums',
        value: 'Managed Care Premiums',
      },
      {
        label: 'Organization',
        value: 'Managed Care Organization',
      },
      {
        label: 'Referrals',
        value: 'Managed Care Referrals',
      },
      {
        label: 'Tarrif',
        value: 'Managed Care Tarrif',
      },
      {
        label: 'Claims',
        value: 'Managed Care Claims',
      },
      {
        label: 'Accreditation',
        value: 'Managed Care Accreditation',
      },
      {
        label: 'Preauthorization',
        value: 'Managed Care Preauthorization',
      },
      {
        label: 'Report',
        value: 'Managed Care Report',
      },
      {
        label: 'Check In',
        value: 'Managed Care Check In',
      },
      {
        label: 'Fund Management',
        value: 'Managed Care Fund Management',
      },
      {
        label: 'Provider monitoring',
        value: 'Managed Care Provider monitoring',
      },
      {
        label: 'NHIA Statutory Report',
        value: 'Managed Care NHIA Statutory Report',
      },

      {
        label: 'Health Plan',
        value: 'Managed Care Health Plan',
      },
      {
        label: 'Provider Payment',
        value: 'Managed Care Provider Payment',
      },
      {
        label: 'Assign Claim',
        value: 'Managed Care Assign Claim',
      },
      {
        label: 'Vet Claim',
        value: 'Managed Care Vet Claim',
      },
      {
        label: 'Audit Claim',
        value: 'Managed Care Audit Claim',
      },
      {
        label: 'Claim Authorization',
        value: 'Managed Care Claim Authorization',
      },
      {
        label: 'Assign Preauthorization Request',
        value: 'Managed Care Assign Preauthorization Request',
      },
      {
        label: 'Vet Preauthorization Request',
        value: 'Managed Care Vet Preauthorization Request',
      },
      {
        label: 'Audit Preauthorization Request',
        value: 'Managed Care Audit Preauthorization Request',
      },
      {
        label: 'Underwriting',
        value: 'Managed Care Underwriting',
      },
      {
        label: 'Review',
        value: 'Managed Care Review',
      },
    ],
  },

  {
    value: 'CRM',
    label: 'CRM',
    children: [
      {
        label: 'Lead',
        value: 'CRM Lead',
        children: [
          {
            label: 'Write',
          },
        ],
      },
      {
        label: 'Analytics',
        value: 'CRM Analytics',
      },
      {
        label: 'Proposal',
        value: 'CRM Proposal',
      },
      {
        label: 'Deal',
        value: 'CRM Deal',
      },
      {
        label: 'Invoice',
        value: 'CRM Invoice',
      },
      {
        label: 'SLA',
        value: 'CRM SLA',
      },
      {
        label: 'Appointment',
        value: 'CRM Appointment',
      },
      {
        label: 'Templates',
        value: 'CRM Templates',
      },
      {
        label: 'Assign Staff',
        value: 'CRM Assign Staff',
      },
      {
        label: 'Assign Task',
        value: 'CRM Assign Task',
      },
      {
        label: 'Authorization',
        value: 'CRM Authorization',
      },
    ],
  },

  {
    value: 'Case Management',
    label: 'Case Management',
    children: [
      {
        label: 'Case Audit Management',
        value: 'Case Audit Management',
      },
    ],
  },

  {
    label: 'Blood Bank',
    value: 'Blood Bank',

    children: [
      {
        label: 'Appointment',
        value: 'Blood Bank Appointment',
      },
      {
        label: 'Lab',
        value: 'Blood Bank Lab',
      },
      {
        label: 'Inventory',
        value: 'Blood Bank Inventory',
      },
    ],
  },

  {
    label: 'Referral',
    value: 'Referral',

    children: [
      {
        label: 'Incoming',
        value: 'Referral Incoming',
      },
      {
        label: 'Referral Account',
        value: 'Referral Referral Account',
      },
      {
        label: 'Setting',
        value: 'Referral Setting',
      },
    ],
  },

  {
    label: 'Commnunication',
    value: 'Commnunication',

    children: [
      {
        label: 'Email',
        value: 'Commnunication Email',
      },
      {
        label: 'IVR',
        value: 'Commnunication IVR',
      },
      {
        label: 'Setting',
        value: 'Commnunication SMS',
      },
      {
        label: 'USSD',
        value: 'Commnunication USSD',
      },
      {
        label: 'WhatsApp',
        value: 'Commnunication WhatsApp',
      },
      {
        label: 'Chats',
        value: 'Commnunication Chats',
      },
    ],
  },

  {
    label: 'Engagement',
    value: 'Engagement',

    children: [
      {
        label: 'Channel',
        value: 'Engagement Channel',
      },
      {
        label: 'Questionnaires',
        value: 'Engagement Questionnaires',
      },
      {
        label: 'Configuration',
        value: 'Engagement Configuration',
      },
      {
        label: 'Submissions',
        value: 'Engagement Submissions',
      },
    ],
  },

  {
    label: 'Documentation',
    value: 'Documentation',

    children: [
      {
        label: 'Adult Asthma Questionnaire',
        value: 'Adult Asthma Questionnaire',
      },
      {
        label: 'Clinical Note',
        value: 'Clinical Note',
      },
      {
        label: 'Clerking Form',
        value: 'Clerking Form',
      },
      {
        label: 'Eye Consultation',
        value: 'Eye Consultation',
      },
      {
        label: 'Preventive Unit',
        value: 'Preventive Unit',
      },
      {
        label: 'Eye Doctor Note',
        value: 'Eye Doctor Note',
      },

      {
        label: 'Lens Prescription',
        value: 'Lens Prescription',
      },
      {
        label: 'Visual Acuity',
        value: 'Visual Acuity',
      },
      {
        label: 'Pachymetry/Pulpillary Distance',
        value: 'Pachymetry/Pulpillary Distance',
      },

      {
        label: 'Discharge Summary',
        value: 'Discharge Summary',
      },
      {
        label: 'Ear,Nose & Throat',
        value: 'Ear,Nose & Throat',
      },
      {
        label: 'Pediatric Form',
        value: 'Pediatric Form',
      },
      {
        label: 'Doctor Note',
        value: 'Doctor Note',
      },
      {
        label: 'Lab Result',
        value: 'Lab Result',
      },
      {
        label: 'Medication List',
        value: 'Medication List',
      },
      {
        label: 'New Patient Consultation Form',
        value: 'New Patient Consultation Form',
      },
      {
        label: 'Nursing Note',
        value: 'Nursing Note',
      },

      {
        label: 'Progress Note',
        value: 'Progress Note',
      },
      {
        label: 'Vital Signs',
        value: 'Vital Signs',
      },
      {
        label: 'Eye Examination',
        value: 'Eye Examination',
      },
      {
        label: 'Dental Clinic',
        value: 'Dental Clinic',
      },
      {
        label: 'Orthodontic Analysis',
        value: 'Orthodontic Analysis',
      },
      {
        label: 'Preventive Care',
        value: 'Preventive Care',
      },
      {
        label: 'Dental Lab',
        value: 'Dental Lab',
      },
      {
        label: 'Physiotherapy Medical Screening',
        value: 'Physiotherapy Medical Screening',
      },
      {
        label: 'Physiotherapy History & Interview Form',
        value: 'Physiotherapy History & Interview Form',
      },
      {
        label: 'Back Pain Questionnaire',
        value: 'Back Pain Questionnaire',
      },
      {
        label: 'Fear-Avoidance Beliefs Questionnaire (FABQ)',
        value: 'Fear-Avoidance Beliefs Questionnaire (FABQ)',
      },
      {
        label: 'Charts',
        value: 'Charts',
      },
      {
        label: 'Radiology Request',
        value: 'Radiology Request',
      },
      {
        label: 'Laboratory Request',
        value: 'Laboratory Request',
      },
      {
        label: 'Prescription Request',
        value: 'Prescription Request',
      },
      {
        label: 'End Encounter',
        value: 'End Encounter',
      },
      {
        label: 'Operation Note',
        value: 'Operation Note',
      },
      {
        label: 'Heamodialysis Nursing Care',
        value: 'Heamodialysis Nursing Care',
      },
      {
        label: 'Obstetrics Assessment',
        value: 'Obstetrics Assessment',
      },
      {
        label: 'Sleep Medicine Referral Form',
        value: 'Sleep Medicine Referral Form',
      },
      {
        label: 'Pediatric Sleep Study Referral Form',
        value: 'Pediatric Sleep Study Referral Form',
      },
      {
        label: 'Epworth Sleepiness Scale',
        value: 'Epworth Sleepiness Scale',
      },
      {
        label: 'Sleep Study Authorization Form',
        value: 'Sleep Study Authorization Form',
      },
      {
        label: 'Patient Instruction For Sleep Study',
        value: 'Patient Instruction For Sleep Study',
      },
      {
        label: 'Insurance Details',
        value: 'Insurance Details',
      },
      {
        label: 'Privacy and Policies',
        value: 'Privacy and Policies',
      },
      {
        label: 'Sleep History And Intake',
        value: 'Sleep History And Intake',
      },
      {
        label: 'Fatigue Severity Scale',
        value: 'Fatigue Severity Scale',
      },
      {
        label: 'Sleep Questionnaire',
        value: 'Sleep Questionnaire',
      },
      {
        label: 'Sleep Questionnaire For Spouse',
        value: 'Sleep Questionnaire For Spouse',
      },
      {
        label: 'Weekly Sleep Log',
        value: 'Weekly Sleep Log',
      },
      {
        label: 'Nursing Processing',
        value: 'Nursing Processing',
      },
      {
        label: 'Surgical Cases',
        value: 'Surgical Cases',
      },
      {
        label: 'Anc Followup Form',
        value: 'Anc Followup Form',
      },
      {
        label: 'Anc Booking Form',
        value: 'Anc Booking Form',
      },
      {
        label: 'Nutrition & Dietetics Form',
        value: 'Nutrition & Dietetics Form',
      },
      {
        label: 'Theatre Operation List',
        value: 'Theatre Operation List',
      },
      {
        label: 'Caesarean Section',
        value: 'Caesarean Section',
      },
      {
        label: 'Operation Register',
        value: 'Operation Register',
      },
      {
        label: 'Nurses Continuation Sheet',
        value: 'Nurses Continuation Sheet',
      },
      {
        label: 'Nutrition And Dietetics Request Form',
        value: 'Nutrition And Dietetics Request Form',
      },
      {
        label: 'EchoCardio Form',
        value: 'EchoCardio Form',
      },
      {
        label: 'Medical Screening',
        value: 'Medical Screening',
      },
      {
        label: 'QuickDash Outcome Measure',
        value: 'QuickDash Outcome Measure'
      },
      {
        label: 'Lower Extremity Functional Scale',
        value: 'Lower Extremity Functional Scale'
      },
      {
        label: 'Modified Oswestry',
        value: 'Modified Oswestry'
      },
      {
        label: 'Neck Disability Index',
        value: 'Neck Disability Index'
      },
      {
        label: 'Neurological Physiotherapy',
        value: 'Neurological Physiotherapy'
      },
      {
        label: 'Functional Independence Measure',
        value: 'Functional Independence Measure'
      },
      {
        label: 'Berg Balance Scale',
        value: 'Berg Balance Scale'
      },
      {
        label: 'Osteoporosis and Bone Health',
        value: 'Osteoporosis and Bone Health'
      },
      {
        label: 'Integrated Bone Mgt (IBM) Info',
        value: 'Integrated Bone Mgt (IBM) Info'
      }
    ],
  },

  {
    label: 'Immunization',
    value: 'Immunization',

    children: [
      {
        label: 'Appointment',
        value: 'Immunization Appointment',
      },
      {
        label: 'Checkin/out',
        value: 'Immunization Checkin/out',
      },
      {
        label: 'Immunization schedule',
        value: 'Immunization Immunization schedule',
      },
      {
        label: 'Inventory',
        value: 'Immunization Inventory',
      },
      {
        label: 'Report',
        value: 'Immunization Report',
      },
      {
        label: 'Vaccine profile',
        value: 'Immunization Vaccine profile',
      },
    ],
  },

  {
    label: 'Accounting',
    value: 'Accounting',

    children: [
      {
        label: 'Account',
        value: 'Accounting Account',
      },
      {
        label: 'Chart of accounts',
        value: 'Accounting Chart of accounts',
      },
      {
        label: 'Expenses',
        value: 'Accounting Expenses',
      },
      {
        label: 'Journal',
        value: 'Accounting Journal',
      },
      {
        label: 'Payment',
        value: 'Accounting Payment',
      },
      {
        label: 'Report',
        value: 'Accounting Report',
      },
    ],
  },
  {
    label: 'Art',
    value: 'Art',

    children: [
      {
        label: 'Care Team',
        value: 'Art Care Team',
      },
      {
        label: 'Appointment',
        value: 'Art Appointment',
      },
      {
        label: 'Laboratory Mgt',
        value: 'Art Laboratory Mgt',
      },
      {
        label: 'Prescription Mgt',
        value: 'Art Prescription Mgt',
      },
      {
        label: 'Procedure Mgt',
        value: 'Art Procedure Mgt',
      },
      {
        label: 'Profile Mgt',
        value: 'Art Profile Mgt',
      },
      {
        label: 'Report',
        value: 'Art Report',
      },
      {
        label: 'Task',
        value: 'Art Task',
      },
      {
        label: 'Procedure Request',
        value: 'Art Procedure Request',
      },
      {
        label: 'Laboratory Request',
        value: 'Art Laboratory Request',
      },
      {
        label: 'Prescription Request',
        value: 'Art Prescription Request',
      },
      {
        label: 'Agonist Protocol',
        value: 'Art Agonist Protocol',
      },
      {
        label: 'Antagonist Protocol',
        value: 'Art Antagonist Protocol',
      },
      {
        label: 'Recipient Treatment Form',
        value: 'Art Recipient Treatment Form',
      },
      {
        label: 'Intrauterine Insemination (IUI) Form',
        value: 'Art Intrauterine Insemination (IUI) Form',
      },
      {
        label: 'Aspiration Notice',
        value: 'Art Aspiration Notice',
      },
      {
        label: 'Laboratory Treatment',
        value: 'Art Laboratory Treatment',
      },
      {
        label: 'Sonohysterogram',
        value: 'Art Sonohysterogram',
      },
      {
        label: 'Treatment Summary',
        value: 'Art Treatment Summary',
      },
      {
        label: 'Vital Signs',
        value: 'Art Vital Signs',
      },
      {
        label: 'Doctor Note',
        value: 'Art Doctor Note',
      },
      {
        label: 'Nurse Note',
        value: 'Art Nurse Note',
      },
      {
        label: 'Counsellor Note',
        value: 'Art Counsellor Note',
      },
      {
        label: 'Testicular Sperm',
        value: 'Art Testicular Sperm',
      },
    ],
  },
  {
    label: 'Analytics',
    value: 'Analytics',

    children: [
      {
        label: 'Account',
        value: 'Analytics Account',
      },
      {
        label: 'Admin',
        value: 'Analytics Admin',
      },
      {
        label: 'Appoinment',
        value: 'Analytics Appoinment',
      },
      {
        label: 'Art',
        value: 'Analytics Art',
      },
      {
        label: 'Blood Bank',
        value: 'Analytics Blood Bank',
      },
      {
        label: 'Client',
        value: 'Analytics Client',
      },
      {
        label: 'Clinic',
        value: 'Analytics Clinic',
      },
      {
        label: 'Communication',
        value: 'Analytics Communication',
      },
      {
        label: 'Complaints',
        value: 'Analytics Complaints',
      },
      {
        label: 'Corporate',
        value: 'Analytics Corporate',
      },
      {
        label: 'CRM',
        value: 'Analytics CRM',
      },
      {
        label: 'Engagement',
        value: 'Analytics Engagement',
      },
      {
        label: 'Epidemiology',
        value: 'Analytics Epidemiology',
      },
      {
        label: 'Finance',
        value: 'Analytics Finance',
      },
      {
        label: 'Immunization',
        value: 'Analytics Immunization',
      },
      {
        label: 'Inventory',
        value: 'Analytics Inventory',
      },
      {
        label: 'Laboratory',
        value: 'Analytics Laboratory',
      },
      {
        label: 'Managed Care',
        value: 'Analytics Managed Care',
      },
      {
        label: 'Market Place',
        value: 'Analytics Market Place',
      },
      {
        label: 'Patient Portal',
        value: 'Analytics Patient Portal',
      },
      {
        label: 'Pharmacy',
        value: 'Analytics Pharmacy',
      },
      {
        label: 'Provider Relationship',
        value: 'Analytics Provider Relationship',
      },
      {
        label: 'Radiology',
        value: 'Analytics Radiology',
      },
      {
        label: 'Referral',
        value: 'Analytics Referral',
      },
      {
        label: 'Theatre',
        value: 'Analytics Theatre',
      },
      {
        label: 'Ward',
        value: 'Analytics Ward',
      },
    ]
  }
];
