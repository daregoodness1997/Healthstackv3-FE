import React, { useState, useEffect, useContext } from "react";
import client from "../../feathers";
import { UserContext, ObjectContext } from "../../context";
import { PageWrapper, HeadWrapper } from "../app/styles";
import CustomTable from "../../components/customtable";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { TableMenu } from "../../ui/styled/global";
import FilterMenu from "../../components/utilities/FilterMenu";

export default function BookedServices() {
    const [bookedServices, setBookedServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);

    const bookedServiceServ = client.service("bookedservice");

    const getBookedServices = async () => {
        setLoading(true);
        try {
            const res = await bookedServiceServ.find({
                query: {
                    facilityId: user.currentEmployee.facilityDetail._id,
                    $sort: {
                        createdAt: -1,
                    },
                },
            });
            setBookedServices(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Error fetching booked services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBookedServices();
        bookedServiceServ.on("created", (obj) => getBookedServices());
        bookedServiceServ.on("updated", (obj) => getBookedServices());
        bookedServiceServ.on("patched", (obj) => getBookedServices());
        bookedServiceServ.on("removed", (obj) => getBookedServices());
        return () => { };
    }, []);

    // console.log(bookedServices, "bookedServices");

    const columns = [
        {
            name: "S/N",
            key: "sn",
            description: "SN",
            selector: (row) => row.sn,
            sortable: true,
            inputType: "HIDDEN",
            width: "70px",
        },
        {
            name: "Service",
            key: "serviceName",
            description: "Service",
            selector: (row) => row?.data?.serviceName,
            sortable: true,
            required: true,
            inputType: "TEXT",
        },
        {
            name: "Appointment Date",
            key: "date",
            description: "Appointment Date",
            selector: (row) => dayjs(row?.data?.appointmentDate).format("DD-MM-YYYY HH:mm"),
            sortable: true,
            required: true,
            inputType: "DATE",
        },
        {
            name: "Patient Name",
            key: "patientName",
            description: "Patient Name",
            selector: (row) => `${row?.data?.firstname} ${row?.data?.lastname}`,
            sortable: true,
            required: true,
            inputType: "TEXT",
        },
        {
            name: "Phone",
            key: "phone",
            description: "Phone",
            selector: (row) => row?.data?.phone,
            sortable: true,
            required: true,
            inputType: "TEXT",
        },
        
        {
            name: "Amount",
            key: "amount",
            description: "Amount",
            selector: (row) => `₦${(row?.data?.amount || 0).toLocaleString()}`,
            sortable: true,
            required: true,
            inputType: "TEXT",
        },
    ];

    const handleSearch = (search) => {
        console.log(search);
    };

    return (
        <PageWrapper>
            <TableMenu>
                <div style={{ display: "flex", alignItems: "center" }}>
                    {handleSearch && (
                        <div className="inner-table">
                            <FilterMenu onSearch={handleSearch} />
                        </div>
                    )}
                    <h2 style={{ margin: "0 10px", fontSize: "0.95rem" }}>
                        List of  Booked Services
                    </h2>
                </div>
            </TableMenu>
            <Box sx={{ width: "100%", overflow: "auto" }}>
                <CustomTable
                    title={""}
                    columns={columns}
                    data={bookedServices}
                    pointerOnHover
                    highlightOnHover
                    striped
                    onRowClicked={(row) => console.log(row)}
                    progressPending={loading}
                />
            </Box>
        </PageWrapper>
    );
}
