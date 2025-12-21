import React, { useState, useContext, useEffect, useRef, forwardRef } from 'react';
import { Box, Typography, Tabs, Tab, Grid, Card, Avatar } from '@mui/material';
import dayjs from 'dayjs';
import { useReactToPrint } from 'react-to-print';
import client from '../../feathers';
import { UserContext, ObjectContext } from '../../context';
import CustomTable from '../../components/customtable';
import { FormsHeaderText } from '../../components/texts';
import GlobalCustomButton from '../../components/buttons/CustomButton';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const PrintableReport = forwardRef(({ title, columns, data, facility }, ref) => {
    return (
        <Box ref={ref} sx={{ p: 4, width: '100%', bgcolor: 'white' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, borderBottom: '2px solid #eee', pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={facility?.facilitylogo} sx={{ width: 60, height: 60 }} />
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0064CC' }}>
                            {facility?.facilityName}
                        </Typography>
                        <Typography variant="body2">{facility?.facilityAddress}</Typography>
                        <Typography variant="body2">{facility?.facilityCity}, {facility?.facilityState}</Typography>
                        <Typography variant="body2">{facility?.facilityEmail} | {facility?.facilityContactPhone}</Typography>
                    </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{title}</Typography>
                    <Typography variant="body2">Date: {dayjs().format('DD/MM/YYYY')}</Typography>
                </Box>
            </Box>

            {/* Table */}
            <CustomTable
                columns={columns}
                data={data}
                pagination={false}
            />
        </Box>
    );
});

export default function Report() {
    const [value, setValue] = useState(0);
    const { state } = useContext(ObjectContext);
    const { user } = useContext(UserContext);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="report tabs">
                    <Tab label="Consumption Trend" {...a11yProps(0)} />
                    <Tab label="Differential Consumption" {...a11yProps(1)} />
                    <Tab label="Appointments" {...a11yProps(2)} />
                    <Tab label="Lab" {...a11yProps(3)} />
                </Tabs>
            </Box>

            <CustomTabPanel value={value} index={0}>
                <ConsumptionTrend facilityId={user?.currentEmployee?.facilityDetail?._id} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <DifferentialConsumption facilityId={user?.currentEmployee?.facilityDetail?._id} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <AppointmentsReport facilityId={user?.currentEmployee?.facilityDetail?._id} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <LaboratoryReport facilityId={user?.currentEmployee?.facilityDetail?._id} />
            </CustomTabPanel>
        </Box>
    );
}

// 1. Consumption Trend
const ConsumptionTrend = ({ facilityId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const BillServ = client.service('bills');

    const fetchData = async () => {
        setLoading(true);
        // Dummy Data
        const dummyData = [
            {
                month: 'January 2025',
                drugName: 'Paracetamol 500mg',
                drugClassification: 'Analgesic',
                drugSubClassification: 'NSAIDs',
                noOfPatients: 24,
                totalQty: 120,
                dispensed: 110,
            },
            {
                month: 'January 2025',
                drugName: 'Amoxicillin 250mg',
                drugClassification: 'Antibiotic',
                drugSubClassification: 'Penicillins',
                noOfPatients: 15,
                totalQty: 45,
                dispensed: 45,
            },
        ];
        setData(dummyData);
        setLoading(false);

        /* Real data fetching logic kept for future reference
        try {
            const res = await BillServ.find({
                query: {
                    facility: facilityId,
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                    'orderInfo.orderObj.order_category': 'Pharmacy',
                    $limit: 200,
                },
            });

            // Basic client-side aggregation by Month and Drug
            const aggregated = {};
            res.data.forEach(bill => {
                const month = dayjs(bill.createdAt).format('MMMM YYYY');
                const drugName = bill.serviceInfo.name;
                const key = `${month}-${drugName}`;

                if (!aggregated[key]) {
                    aggregated[key] = {
                        month,
                        drugName,
                        drugClassification: bill.serviceInfo.category || 'N/A',
                        drugSubClassification: bill.serviceInfo.subCategory || 'N/A',
                        patientIds: new Set(),
                        totalQty: 0,
                        dispensed: 0
                    };
                }

                aggregated[key].patientIds.add(bill.participantInfo.client._id);
                aggregated[key].totalQty += bill.serviceInfo.quantity || 0;
                if (bill.billing_status === 'Paid') { // Assuming paid means dispensed for this trend
                    aggregated[key].dispensed += bill.serviceInfo.quantity || 0;
                }
            });

            const finalData = Object.values(aggregated).map(item => ({
                ...item,
                noOfPatients: item.patientIds.size
            }));

            setData(finalData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        */
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { name: 'Month', selector: row => row.month, sortable: true },
        { name: 'Drug Name', selector: row => row.drugName, sortable: true },
        { name: 'Classification', selector: row => row.drugClassification },
        { name: 'Sub Classification', selector: row => row.drugSubClassification },
        { name: 'No of Patients', selector: row => row.noOfPatients },
        { name: 'Total Qty', selector: row => row.totalQty },
        { name: 'Dispensed', selector: row => row.dispensed },
    ];

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <GlobalCustomButton onClick={handlePrint}>Download PDF</GlobalCustomButton>
            </Box>
            <CustomTable columns={columns} data={data} progressPending={loading} />
            <div style={{ display: 'none' }}>
                <PrintableReport
                    ref={componentRef}
                    title="Consumption Trend Report"
                    columns={columns}
                    data={data}
                    facility={user?.currentEmployee?.facilityDetail}
                />
            </div>
        </>
    );
};

// 2. Differential Consumption
const DifferentialConsumption = ({ facilityId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const BillServ = client.service('bills');

    const fetchData = async () => {
        setLoading(true);
        // Dummy Data
        const dummyData = [
            { drugName: 'Paracetamol 500mg', prescriptionVolume: 120, dispenseVolume: 110 },
            { drugName: 'Amoxicillin 250mg', prescriptionVolume: 50, dispenseVolume: 45 },
            { drugName: 'Metformin 500mg', prescriptionVolume: 80, dispenseVolume: 80 },
        ];
        setData(dummyData);
        setLoading(false);

        /* Real data fetching logic kept for future reference
        try {
            const res = await BillServ.find({
                query: {
                    facility: facilityId,
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                    'orderInfo.orderObj.order_category': 'Pharmacy',
                    $limit: 200,
                },
            });

            const aggregated = {};
            res.data.forEach(bill => {
                const drugName = bill.serviceInfo.name;
                if (!aggregated[drugName]) {
                    aggregated[drugName] = { drugName, prescriptionVolume: 0, dispenseVolume: 0 };
                }
                aggregated[drugName].prescriptionVolume += bill.serviceInfo.quantity || 0;
                if (bill.billing_status === 'Paid') {
                    aggregated[drugName].dispenseVolume += bill.serviceInfo.quantity || 0;
                }
            });

            setData(Object.values(aggregated));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        */
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { name: 'Drug Name', selector: row => row.drugName, sortable: true },
        { name: 'Prescription Volume', selector: row => row.prescriptionVolume },
        { name: 'Dispense Volume', selector: row => row.dispenseVolume },
    ];

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <GlobalCustomButton onClick={handlePrint}>Download PDF</GlobalCustomButton>
            </Box>
            <CustomTable columns={columns} data={data} progressPending={loading} />
            <div style={{ display: 'none' }}>
                <PrintableReport
                    ref={componentRef}
                    title="Differential Consumption Report"
                    columns={columns}
                    data={data}
                    facility={user?.currentEmployee?.facilityDetail}
                />
            </div>
        </>
    );
};

// 3. Appointments
const AppointmentsReport = ({ facilityId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const ApptServ = client.service('appointments');

    const fetchData = async () => {
        setLoading(true);
        // Dummy Data
        const dummyData = [
            { date: '15/12/2024', locationName: 'Main Clinic', patientVolume: 12, scheduled: 10, cancelled: 2 },
            { date: '16/12/2024', locationName: 'Main Clinic', patientVolume: 8, scheduled: 8, cancelled: 0 },
            { date: '17/12/2024', locationName: 'Pharmacy Outlet', patientVolume: 5, scheduled: 4, cancelled: 1 },
        ];
        setData(dummyData);
        setLoading(false);

        /* Real data fetching logic kept for future reference
        try {
            const res = await ApptServ.find({
                query: {
                    facility: facilityId,
                    start_time: {
                        $gte: startDate,
                        $lte: endDate,
                        $lt: new Date(), // appt date < today
                    },
                    $limit: 200,
                },
            });

            const aggregated = {};
            res.data.forEach(appt => {
                const dateStr = dayjs(appt.start_time).format('DD/MM/YYYY');
                const location = appt.location_name || 'N/A';
                const key = `${dateStr}-${location}`;

                if (!aggregated[key]) {
                    aggregated[key] = { date: dateStr, locationName: location, patientVolume: 0, scheduled: 0, cancelled: 0 };
                }
                aggregated[key].patientVolume += 1;
                if (appt.appointment_status === 'Cancelled') {
                    aggregated[key].cancelled += 1;
                } else {
                    aggregated[key].scheduled += 1;
                }
            });

            setData(Object.values(aggregated));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        */
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { name: 'Date', selector: row => row.date, sortable: true },
        { name: 'Location Name', selector: row => row.locationName, sortable: true },
        { name: 'Patient Volume', selector: row => row.patientVolume },
        { name: 'Scheduled', selector: row => row.scheduled },
        { name: 'Cancelled', selector: row => row.cancelled },
    ];

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <GlobalCustomButton onClick={handlePrint}>Download PDF</GlobalCustomButton>
            </Box>
            <CustomTable columns={columns} data={data} progressPending={loading} />
            <div style={{ display: 'none' }}>
                <PrintableReport
                    ref={componentRef}
                    title="Appointments Report"
                    columns={columns}
                    data={data}
                    facility={user?.currentEmployee?.facilityDetail}
                />
            </div>
        </>
    );
};

// 4. Lab
const LaboratoryReport = ({ facilityId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const BillServ = client.service('bills');

    const fetchData = async () => {
        setLoading(true);
        // Dummy Data
        const dummyData = [
            { testName: 'Malaria Parasite', ordered: 45, done: 40 },
            { testName: 'Full Blood Count', ordered: 30, done: 28 },
            { testName: 'Widal Test', ordered: 15, done: 10 },
            { testName: 'Urinalysis', ordered: 20, done: 18 },
        ];
        setData(dummyData);
        setLoading(false);

        /* Real data fetching logic kept for future reference
        try {
            const res = await BillServ.find({
                query: {
                    facility: facilityId,
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                    $or: [
                        { 'orderInfo.orderObj.order_category': 'Laboratory' },
                        { 'orderInfo.orderObj.order_category': 'Lab Order' }
                    ],
                    $limit: 200,
                },
            });

            const aggregated = {};
            res.data.forEach(bill => {
                const testName = bill.serviceInfo.name;
                if (!aggregated[testName]) {
                    aggregated[testName] = { testName, ordered: 0, done: 0 };
                }
                aggregated[testName].ordered += 1;
                if (bill.report_status === 'Final' || bill.report_status === 'Draft') {
                    aggregated[testName].done += 1;
                }
            });

            setData(Object.values(aggregated));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        */
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { name: 'Test Name', selector: row => row.testName, sortable: true },
        { name: 'Ordered', selector: row => row.ordered },
        { name: 'Done', selector: row => row.done },
    ];

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <GlobalCustomButton onClick={handlePrint}>Download PDF</GlobalCustomButton>
            </Box>
            <CustomTable columns={columns} data={data} progressPending={loading} />
            <div style={{ display: 'none' }}>
                <PrintableReport
                    ref={componentRef}
                    title="Laboratory Report"
                    columns={columns}
                    data={data}
                    facility={user?.currentEmployee?.facilityDetail}
                />
            </div>
        </>
    );
};
