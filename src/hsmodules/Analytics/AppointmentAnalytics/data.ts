

const analyticsData = {
    "metrics": {
        "totalAppointments": {
            "value": "1,848",
            "delta": "+0.2%"
        },
        "scheduled": {
            "value": "1,848",
            "delta": "+0.2%"
        },
        "followUp": {
            "value": "658",
            "delta": "+0.2%"
        },
        "completed": {
            "value": "958",
            "delta": "+0.2%"
        },
        "waitTime": {
            "value": "18 mins",
            "delta": "+0.2%"
        },
        "utilizationRate": {
            "value": "63%",
            "delta": "+0.2%"
        },
        "conversionRate": {
            "value": "53%",
            "delta": "+0.2%"
        }
    }

    ,
    "chartData": {
        "categories": [
            "Oct 11",
            "Oct 18",
            "Oct 25",
            "Nov 1",
            "Nov 8",
            "Nov 15"
        ],
        "scheduled": [1200, 300, 2000, 500, 1900, 1700],
        "completed": [800, 700, 1759, 1200, 1500, 1200],
        "missed": [100, 150, 2, 300, 400, 700]
    }
};

const timelineData = {
    appointments: [
        // Michael Bayode (5 appointments)
        { id: 1,patientName: 'Michael Bayode', patientId: "1", startDate: '2025-10-11T10:00:00', endDate: '2025-10-11T10:30:00', status: 'completed' },
        { id: 2,patientName: 'Michael Bayode', patientId: "1", startDate: '2025-10-18T14:00:00', endDate: '2025-10-18T14:30:00', status: 'scheduled' },
        { id: 3,patientName: 'Michael Bayode', patientId: "1", startDate: '2025-10-25T09:00:00', endDate: '2025-10-25T09:30:00', status: 'missed' },
        { id: 4,patientName: 'Michael Bayode', patientId: "1", startDate: '2025-11-08T11:00:00', endDate: '2025-11-08T11:30:00', status: 'scheduled' },
        { id: 5,patientName: 'Michael Bayode', patientId: "1", startDate: '2025-11-15T13:00:00', endDate: '2025-11-15T13:30:00', status: 'completed' },

        // Albert Flores (1)
        { id: 6,patientName: 'Albert Flores', patientId:"2", startDate: '2025-10-23T10:00:00', endDate: '2025-10-23T10:30:00', status: 'scheduled' },

        // Theresa Webb (1)
        { id: 7,patientName: 'Theresa Webb', patientId:"3", startDate: '2025-10-15T08:00:00', endDate: '2025-10-15T08:30:00', status: 'completed' },

        // Ronald Richards (3)
        { id: 8, patientName: 'Ronald Richards',patientId:"4", startDate: '2025-10-20T12:00:00', endDate: '2025-10-20T12:30:00', status: 'missed' },
        { id: 9,patientName: 'Ronald Richards', patientId:"4", startDate: '2025-10-27T15:00:00', endDate: '2025-10-27T15:30:00', status: 'scheduled' },
        { id: 10, patientName: 'Ronald Richards',patientId:"4", startDate: '2025-11-05T09:30:00', endDate: '2025-11-05T10:00:00', status: 'completed' },

        // Dianne Russell (3)
        { id: 11,patientName: 'Dianne Russell', patientId:"5", startDate: '2025-10-18T11:00:00', endDate: '2025-10-18T11:30:00', status: 'completed' },
        { id: 12,patientName: 'Dianne Russell', patientId:"5", startDate: '2025-11-01T14:00:00', endDate: '2025-11-01T14:30:00', status: 'scheduled' },
        { id: 13,patientName: 'Dianne Russell', patientId:"5", startDate: '2025-11-14T16:00:00', endDate: '2025-11-14T16:30:00', status: 'missed' },
    ],

};

const distribubtion1Data = [
    {
        title: "Patient Visits by Age",
        data: [12, 22, 28, 24, 14, 25],
        labels: ["0-12 yrs", "13-19 yrs", "20-35 yrs", "36-55 yrs", "56+ yrs", "Others"],
        colors: ["#f87171", "#fb923c", "#fbbf24", "#34d399", "#60a5fa"],
    },
    {
        title: "Patient Visits by Gender",
        data: [58, 42, 50],
        labels: ["Female", "Male", "Others"],
        colors: ["#a78bfa", "#60a5fa"],
    },
    {
        title: "Patients by Marital Status",
        data: [52, 28, 12, 8, 4],
        labels: ["Married", "Single", "Divorced", "Widowed", "Others"],
        colors: ["#34d399", "#60a5fa", "#fb923c", "#f87171"],
    },
    {
        title: "Patients by Religion",
        data: [65, 25, 10, 30],
        labels: ["Christian", "Muslim", "Others"],
        colors: ["#14b8a6", "#8b5cf6", "#f59e0b"],
    }
];

// Existing Doughnut Charts
const doughnutCharts = [
    {
        title: "Appointment by Type",
        data: [42, 35, 23, 20],
        labels: ["New Patient", "Follow-up", "Emergency/Walk-in", "Others"],
        colors: ["#3b82f6", "#10b981", "#f59e0b"],
    },
    {
        title: "Appointment Class",
        data: [55, 30, 15, 10],
        labels: ["Standard", "VIP", "HMO", "Others"],
        colors: ["#10b981", "#3b82f6", "#f59e0b"],
    },
];

// New Horizontal Bar Charts from your screenshots
const barCharts = [
    {
        title: "Appointment Location",
        labels: [
            "Client",
            "Blood Bank",
            "Clinic",
            "Pharmacy",
            "Radiology",
            "Referral",
            "Theatre",
        ],
        data: [1300, 850, 125, 1050, 1050, 1050, 1050],
        backgroundColor: "#3b82f6",
    },
    {
        title: "Patients by Profession",
        labels: [
            "Engineer",
            "Banker",
            "Entrepreneur",
            "Accountant",
            "Civil Servant",
            "Freelancer",
            "Other",
        ],
        data: [1300, 850, 125, 1050, 1050, 1050, 1050],
        backgroundColor: "#6366f1",
    },
];

const distribution2Data = {
    doughnutCharts: [
        {
            title: "Appointment by Type",
            data: [42, 35, 23],
            labels: ["New Patient", "Follow-up", "Emergency/Walk-in"],
            colors: ["#3b82f6", "#10b981", "#f59e0b"],
        },
        {
            title: "Appointment Class",
            data: [55, 30, 15],
            labels: ["Standard", "VIP", "HMO"],
            colors: ["#10b981", "#3b82f6", "#f59e0b"],
        },
    ],
    barCharts: [
        {
            title: "Appointment Location",
            labels: [
                "Client",
                "Blood Bank",
                "Clinic",
                "Pharmacy",
                "Radiology",
                "Referral",
                "Theatre",
            ],
            data: [1300, 850, 125, 1050, 1050, 1050, 1050],
            backgroundColor: "#3b82f6",
        },
        {
            title: "Patients by Profession",
            labels: [
                "Engineer",
                "Banker",
                "Entrepreneur",
                "Accountant",
                "Civil Servant",
                "Freelancer",
                "Other",
            ],
            data: [1300, 850, 125, 1050, 1050, 1050, 1050],
            backgroundColor: "#6366f1",
        },
    ]
};

export { analyticsData, timelineData, distribubtion1Data, distribution2Data };