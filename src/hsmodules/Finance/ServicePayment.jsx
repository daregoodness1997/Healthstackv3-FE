import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Box, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { usePaystackPayment } from "react-paystack";
import client from "../../feathers";
import Input from "../../components/inputs/basic/Input";
import CustomSelect from "../../components/inputs/basic/Select";
import MuiCustomDatePicker from "../../components/inputs/Date/MuiDatePicker";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import { PageWrapper, HeadWrapper } from "../app/styles";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useEffect as useReactEffect } from "react";

// Add this validation logger inside the component but before return
// useEffect(() => {
//     console.log("Validation Errors:", errors);
// }, [errors]);

import GoogleAddressInput from "../../components/google-autocomplete";

// Validation schema
const paymentSchema = yup.object().shape({
    firstname: yup.string().required("First name is required"),
    lastname: yup.string().required("Last name is required"),
    middlename: yup.string(),
    phone: yup.string().required("Phone number is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    dob: yup.string().required("Date of birth is required"),
    gender: yup.string().required("Gender is required"),
    maritalstatus: yup.string().required("Marital Status is required"),
    residentialaddress: yup.string().required("Address is required"),
    town: yup.string().required("Town/City is required"),
    lga: yup.string().required("LGA is required"),
    state: yup.string().required("State is required"),
    country: yup.string().required("Country is required"),
    nextofkin: yup.string().required("Next of Kin is required"),
    nextofkinphone: yup.string().required("Next of Kin Phone is required"),
    appointmentDate: yup.string().required("Appointment date is required"),
    amount: yup.number().positive("Amount must be positive").required("Amount is required"),
});

export default function ServicePayment() {
    const { serviceId } = useParams();
    const [loading, setLoading] = useState(false);
    const [serviceDetails, setServiceDetails] = useState(null);
    const [showPaystack, setShowPaystack] = useState(false);
    const [priceLinkData, setPriceLinkData] = useState(null);
    const [bookedService, setBookedService] = useState(null);
    const PriceLinkServ = client.service('pricelink');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch
    } = useForm({
        resolver: yupResolver(paymentSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            middlename: "",
            phone: "",
            email: "",
            gender: "",
            dob: "",
            maritalstatus: "",
            residentialaddress: "",
            town: "",
            lga: "",
            state: "",
            country: "",
            nextofkin: "",
            nextofkinphone: "",
            appointmentDate: "",
            amount: "",
        },
    });

    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const resetForm = () => {
        setPaymentSuccess(false);
        setBookedService(null);
        // setShowPaystack(false);
        reset();
    };

    // Debugging: Log validation errors
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.log("Form Validation Errors:", errors);
        }
    }, [errors]);

    // Fetch service details
    useEffect(() => {
        const fetchServiceDetails = async () => {
            setLoading(true);
            try {
                const response = await PriceLinkServ.find({
                    query: {
                        'data.serviceId': serviceId,
                        $sort: { createdAt: -1 },
                        $limit: 1
                    }
                });

                const data = response.data?.[0];

                if (data?.data) {
                    setPriceLinkData(data);
                    setServiceDetails({
                        name: data.data.serviceName,
                        costprice: data.data.amount,
                        hospitalInfo: data.data.hospitalInfo
                    });

                    if (data.data.amount) {
                        setValue("amount", data.data.amount);
                    }
                }
            } catch (err) {
                toast.error("Error loading service details");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (serviceId) {
            fetchServiceDetails();
        }
    }, [serviceId]);

    // Paystack configuration
    const [paystackConfig, setPaystackConfig] = useState({
        reference: new Date().getTime().toString(),
        email: "customer@email.com",
        amount: 100,
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_live_17f1c290e61fc1b1f2bf42838da42c7cdb8e2d33"
    });

    const initializePayment = usePaystackPayment(paystackConfig);

    // Watch email field and update paystackConfig in real-time
    const watchedEmail = watch("email");

    useEffect(() => {
        if (watchedEmail || serviceDetails?.costprice) {
            setPaystackConfig(prev => ({
                ...prev,
                reference: new Date().getTime().toString(),
                email: watchedEmail || prev.email,
                amount: (serviceDetails?.costprice || 0) * 100,
            }));
        }
    }, [watchedEmail, serviceDetails?.costprice]);




    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const bookingPayload = {
                ...data,
                serviceId: serviceId,
                serviceName: serviceDetails?.name,
                amount: serviceDetails?.costprice,
                facilityName: priceLinkData?.data?.hospitalInfo?.facilityName,
            };

            const payload = {
                facilityId: priceLinkData?.facilityId,
                data: bookingPayload
            };

            // Generate client ID: 2 letters + 4 numbers
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const numbers = '0123456789';
            let newClientId = '';
            for (let i = 0; i < 2; i++) {
                newClientId += letters.charAt(Math.floor(Math.random() * letters.length));
            }
            for (let i = 0; i < 4; i++) {
                newClientId += numbers.charAt(Math.floor(Math.random() * numbers.length));
            }

            const clientPayload = {
                ...bookingPayload,
                facilityId: priceLinkData?.facilityId,
                hs_id: newClientId
            };
            // Create bookedservice and client in parallel
            const [bookedServiceRes, clientRes] = await Promise.all([
                client.service("bookedservice").create(payload),
                client.service("client").create(clientPayload),
            ]);

            // Create appointment with clientId from client response
            await client.service("appointments").create({
                ...payload,
                clientId: clientRes._id,
            });

            setBookedService(bookedServiceRes);

            // Update Paystack config with fresh values
            setPaystackConfig({
                reference: new Date().getTime().toString(),
                email: data.email,
                amount: (serviceDetails?.costprice || 0) * 100,
                publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_live_17f1c290e61fc1b1f2bf42838da42c7cdb8e2d33"
            });
            resetForm();
            setShowPaystack(true);
            toast.success("Details submitted. Please complete payment.");

            // Initialize payment after successful submission
            setTimeout(() => {
                initializePayment(handlePaystackSuccess, handlePaystackClose);
            }, 300);
            setLoading(false);
        } catch (err) {
            console.error("Error submitting details:", err);
            toast.error("Error submitting details: " + err.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handlePaystackSuccess = async (reference) => {
        // console.log("=== PAYSTACK SUCCESS TRIGGERED ===");
        // console.log("Reference:", reference);
        // console.log("Booked Service State:", bookedService);

        setLoading(true);
        try {
            if (bookedService && bookedService._id) {
                // console.log("Updating booking with ID:", bookedService._id);
                await client.service("bookedservice").patch(bookedService._id, {
                    paymentReference: reference.reference,
                    paymentStatus: "successful",
                });
                // console.log("Payment updated successfully");
                toast.success("Payment successful! Booking confirmed.");
                setPaymentSuccess(true);
                setShowPaystack(false);
            } else {
                console.error("No booking record found:", bookedService);
                toast.error("Booking record not found.");
            }
        } catch (err) {
            console.error("Error updating payment:", err);
            toast.error("Error updating payment status: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePaystackClose = () => {
        // console.log("=== PAYSTACK CLOSED ===");
        toast.info("Payment cancelled");
        setShowPaystack(false);
    };

    const handleGoogleAddressSelect = (obj) => {
        setValue("residentialaddress", obj.address);
        setValue("state", obj.state);
        setValue("town", obj.lga);
        setValue("lga", obj.lga);
        setValue("country", obj.country);
    };



    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                width: "100%",
            }}
        >
            {/* Left Side - Image */}
            <Box
                sx={{
                    width: { xs: "0%", md: "50%" },
                    display: { xs: "none", md: "block" },
                    backgroundImage: 'url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                    },
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        padding: "40px",
                        color: "white",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                        Book Your Appointment
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4 }}>
                        Quality healthcare services at your convenience
                    </Typography>
                    {/* {serviceDetails && (
                        <Box
                            sx={{
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                padding: "20px",
                                borderRadius: "8px",
                                color: "#2d2d2d",
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: "600", mb: 1 }}>
                                {serviceDetails.name}
                            </Typography>
                            <Typography variant="h4" sx={{ color: "#0064CC", fontWeight: "bold" }}>
                                ₦{serviceDetails.costprice?.toLocaleString()}
                            </Typography>
                        </Box>
                    )} */}
                </Box>
            </Box>

            {/* Right Side - Form */}
            <Box
                sx={{
                    width: { xs: "100%", md: "60%" },
                    padding: { xs: "20px", md: "40px" },
                    overflowY: "auto",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <Box sx={{ maxWidth: "700px", marginTop: "30px", marginLeft: "auto", marginRight: "auto" }}>
                    {!paymentSuccess ? (
                        <>
                            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1, textTransform: "capitalize" }} >
                                {priceLinkData?.data?.hospitalInfo?.facilityName}
                            </Typography>
                            {serviceDetails && (
                                <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                                    {serviceDetails.name} - ₦{serviceDetails.costprice?.toLocaleString() || ""}
                                </Typography>
                            )}

                            <div>
                                <Grid container spacing={2}>
                                    {/* First Name */}
                                    <Grid item xs={12} sm={6}>
                                        <Input
                                            label="First Name"
                                            register={register("firstname")}
                                            errorText={errors?.firstname?.message}
                                            important={true}
                                        />
                                    </Grid>

                                    {/* Middle Name */}
                                    <Grid item xs={12} sm={6}>
                                        <Input
                                            label="Middle Name"
                                            register={register("middlename")}
                                            errorText={errors?.middlename?.message}
                                        />
                                    </Grid>

                                    {/* Last Name */}
                                    <Grid item xs={12} sm={6}>
                                        <Input
                                            label="Last Name"
                                            register={register("lastname")}
                                            errorText={errors?.lastname?.message}
                                            important={true}
                                        />
                                    </Grid>

                                    {/* Phone */}
                                    <Grid item xs={12} sm={6}>
                                        <Input
                                            label="Phone"
                                            register={register("phone")}
                                            type="tel"
                                            errorText={errors?.phone?.message}
                                            important={true}
                                        />
                                    </Grid>

                                    {/* Email */}
                                    <Grid item xs={12} sm={6}>
                                        <Input
                                            label="Email"
                                            register={register("email")}
                                            type="email"
                                            errorText={errors?.email?.message}
                                            important={true}
                                        />
                                    </Grid>

                                    {/* Date of Birth */}
                                    <Grid item xs={12} sm={6}>
                                        <Input
                                            label="Date of Birth"
                                            register={register("dob")}
                                            type="date"
                                            errorText={errors?.dob?.message}
                                            important={true}
                                        />
                                    </Grid>

                                    {/* Gender */}
                                    <Grid item xs={12} sm={6}>
                                        <CustomSelect
                                            label="Gender"
                                            register={register("gender")}
                                            options={[
                                                { label: "Male", value: "Male" },
                                                { label: "Female", value: "Female" },
                                            ]}
                                            errorText={errors?.gender?.message}
                                            important={true}
                                        />
                                    </Grid>

                                    {/* Marital Status */}
                                    <Grid item xs={12} sm={6}>
                                        <CustomSelect
                                            label="Marital Status"
                                            register={register("maritalstatus")}
                                            options={[
                                                { label: "Single", value: "Single" },
                                                { label: "Married", value: "Married" },
                                                { label: "Widowed", value: "Widowed" },
                                                { label: "Divorced/Separated", value: "Divorced/Separated" },
                                            ]}
                                            errorText={errors?.maritalstatus?.message}
                                            important={true}
                                        />
                                    </Grid>

                                    {/* Google Address Input */}
                                    <Grid item xs={12} sm={6}>
                                        <GoogleAddressInput
                                            label="Residential Address"
                                            register={register("residentialaddress")}
                                            getSelectedAddress={handleGoogleAddressSelect}
                                            errorText={errors?.residentialaddress?.message}
                                            important={true}
                                        />
                                    </Grid>

                                    {/* Town/City */}
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Input
                                            label="Town/City"
                                            register={register("town")}
                                            errorText={errors?.town?.message}
                                            important={true}
                                        />
                                    </Grid>

                                    {/* LGA */}
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Input
                                            label="LGA"
                                            register={register("lga")}
                                            errorText={errors?.lga?.message}
                                            important={true}
                                        />
                                    </Grid>

                                    {/* State */}
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Input
                                            label="State"
                                            register={register("state")}
                                            errorText={errors?.state?.message}
                                            important={true}
                                        />
                                    </Grid>

                                    {/* Country */}
                                    <Grid item xs={12} sm={6}>
                                        <Input
                                            label="Country"
                                            register={register("country")}
                                            errorText={errors?.country?.message}
                                            important={true}
                                        />
                                    </Grid>

                                    {/* Next of Kin */}
                                    <Grid item xs={12} sm={6}>
                                        <Input
                                            label="Next of Kin"
                                            register={register("nextofkin")}
                                            errorText={errors?.nextofkin?.message}
                                            important={true}
                                        />
                                    </Grid>

                                    {/* Next of Kin Phone */}
                                    <Grid item xs={12} sm={6}>
                                        <Input
                                            label="Next of Kin Phone"
                                            register={register("nextofkinphone")}
                                            type="tel"
                                            errorText={errors?.nextofkinphone?.message}
                                            important={true}
                                        />
                                    </Grid>


                                    {/* Appointment Date */}
                                    <Grid item xs={12} sm={6}>
                                        <Input
                                            label="Appointment Date"
                                            register={register("appointmentDate")}
                                            type="datetime-local"
                                            errorText={errors?.appointmentDate?.message}
                                            InputLabelProps={{ shrink: true }}
                                            important={true}
                                        />
                                    </Grid>

                                    {/* Amount */}
                                    <Grid item xs={12} sm={6}>
                                        <Input
                                            label="Amount"
                                            register={register("amount")}
                                            type="number"
                                            errorText={errors?.amount?.message}
                                            InputLabelProps={{ shrink: true }}
                                            important={true}
                                            disabled={true}
                                            large={true}
                                        />
                                    </Grid>
                                </Grid>

                                {/* Pay Now Button */}
                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        marginTop: "30px",
                                    }}
                                >
                                    <GlobalCustomButton
                                        type="button"
                                        loading={loading}
                                        color="primary"
                                        sx={{ width: { xs: "100%", sm: "auto" } }}
                                        onClick={handleSubmit(onSubmit)}
                                    >
                                        <PaymentsIcon fontSize="small" sx={{ marginRight: "5px" }} />
                                        Pay Now
                                    </GlobalCustomButton>

                                </Box>
                            </div>
                        </>
                    ) : (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            py: 5
                        }}>
                            <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: '#4caf50',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 3
                            }}>
                                <PaymentsIcon sx={{ fontSize: 40, color: 'white' }} />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#4caf50' }}>
                                Payment Successful!
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxWidth: 400 }}>
                                Thank you for your payment. Your appointment has been successfully booked with <strong>{priceLinkData?.data?.hospitalInfo?.facilityName}</strong>.
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <GlobalCustomButton
                                    onClick={resetForm}
                                    color="primary"
                                >
                                    Book Another Appointment
                                </GlobalCustomButton>
                            </Box>
                        </Box>
                    )}

                </Box>
            </Box>
        </Box>
    );
}