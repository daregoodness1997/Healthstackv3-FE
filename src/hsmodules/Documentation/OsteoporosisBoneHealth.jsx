import React, { useState, useContext, useEffect } from "react";
import client from "../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../context";
import { toast } from "react-toastify";
import { Grid, IconButton, Typography, Box } from "@mui/material";

import Input from "../../components/inputs/basic/Input";
import { FormsHeaderText } from "../../components/texts";
import CloseIcon from "@mui/icons-material/Close";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import Textarea from "../../components/inputs/basic/Textarea";
import RadioButton from "../../components/inputs/basic/Radio";
import CustomSelect from "../../components/inputs/basic/Select";
import ReactSearchSelect from "../../components/react-custom-select/ReactSearchSelect";
import { nigerianEthnicGroups } from "../utils/ethnicityGroup";

export default function OsteoporosisBoneHealth() {
    const { register, handleSubmit, setValue, reset, getValues, watch, control } = useForm();
    const ClientServ = client.service("clinicaldocument");
    const { user } = useContext(UserContext);
    const { state, setState, hideActionLoader } = useContext(ObjectContext);
    const [docStatus, setDocStatus] = useState("Draft");
    const [confirmationDiaglog, setConfirmationDialog] = useState(false);

    // Watch pain_scale_visual to trigger re-renders when it changes
    const painScaleValue = watch("pain_scale_visual");
    const menopausalStatus = watch("menopausal_status");

    let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

    useEffect(() => {
        if (!!draftDoc && draftDoc.status === "Draft") {
            Object.entries(draftDoc.documentdetail).map(([keys, value], i) =>
                setValue(keys, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                })
            );
        }
        return () => {
            draftDoc = {};
        };
    }, [draftDoc]);

    const onSubmit = (data, e) => {
        e.preventDefault();
        let document = {};

        if (user.currentEmployee) {
            document.facility = user.currentEmployee.facilityDetail._id;
            document.facilityname = user.currentEmployee.facilityDetail.facilityName;
        }

        document.documentdetail = {
            ...data,
        };
        document.documentname = "Osteoporosis and Bone Health";
        document.documentType = "Osteoporosis and Bone Health";
        document.location =
            state.employeeLocation.locationName +
            " " +
            state.employeeLocation.locationType;
        document.locationId = state.employeeLocation.locationId;
        document.client = state.ClientModule.selectedClient._id;
        document.createdBy = user._id;
        document.createdByname = user.firstname + " " + user.lastname;
        document.status = docStatus === "Draft" ? "Draft" : "completed";
        document.appointment_id = state.AppointmentModule.selectedAllAppointment?._id || null;
        document.geolocation = {
            type: "Point",
            coordinates: [state.coordinates.latitude, state.coordinates.longitude],
        };

        if (
            document.location === undefined ||
            !document.createdByname ||
            !document.facilityname
        ) {
            toast.error(
                "Documentation data missing, requires location and facility details"
            );
            return;
        }

        if (!!draftDoc && draftDoc.status === "Draft") {
            ClientServ.patch(draftDoc._id, document)
                .then(() => {
                    Object.keys(data).forEach((key) => {
                        data[key] = "";
                    });
                    setConfirmationDialog(false);
                    hideActionLoader(true);
                    reset(data);
                    toast.success("Documentation updated successfully");
                    closeForm();
                })
                .catch((err) => {
                    toast.error("Error updating Documentation: " + err);
                    reset(data);
                    setConfirmationDialog(false);
                });
        } else {
            ClientServ.create(document)
                .then(() => {
                    Object.keys(data).forEach((key) => {
                        data[key] = "";
                    });
                    hideActionLoader();
                    reset(data);
                    setConfirmationDialog(false);
                    toast.success("Osteoporosis and Bone Health created successfully");
                    closeForm();
                })
                .catch((err) => {
                    toast.error("Error creating Osteoporosis and Bone Health: " + err);
                    setConfirmationDialog(false);
                });
        }
    };

    const closeEncounterRight = async () => {
        setState((prevstate) => ({
            ...prevstate,
            DocumentClassModule: {
                ...prevstate.DocumentClassModule,
                encounter_right: false,
            },
        }));
    };

    const closeForm = async () => {
        let documentobj = {};
        documentobj.name = "";
        documentobj.facility = "";
        documentobj.document = "";
        const newDocumentClassModule = {
            selectedDocumentClass: documentobj,
            encounter_right: false,
            show: "detail",
        };
        await setState((prevstate) => ({
            ...prevstate,
            DocumentClassModule: newDocumentClassModule,
        }));
    };

    const handleChangeStatus = async (e) => {
        setDocStatus(e.target.value);
    };

    return (
        <>
            <div className="card ">
                <CustomConfirmationDialog
                    open={confirmationDiaglog}
                    cancelAction={() => setConfirmationDialog(false)}
                    confirmationAction={handleSubmit(onSubmit)}
                    type="create"
                    message={`You are about to save this document?`}
                />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                    mb={1}
                >
                    <FormsHeaderText color="none" text={"OSTEOPOROSIS AND BONE HEALTH CLINICAL PATHWAY"} />

                    <IconButton onClick={closeEncounterRight}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <div className="card-content vscrollable remPad1">
                    <>
                        {/* INITIAL PATIENT ASSESSMENT */}
                        <Typography
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                            fontWeight="bold"
                            color="primary"
                            variant="body1"
                        >
                            INITIAL PATIENT ASSESSMENT
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">
                                    Name
                                </Typography>
                                <Box mb={1}>
                                    <Input
                                        register={register("patient_name")}
                                        name="text"
                                        type="text"
                                        placeholder="Name"
                                    />
                                </Box>
                            </Grid>
                        </Grid>


                        {/* Biodata */}
                        <Typography
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            fontWeight="bold"
                            variant="body2"
                        >
                            Biodata
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Typography color="primary" variant="body2">
                                    Age
                                </Typography>
                                <Box mb={1}>
                                    <Input
                                        register={register("age")}
                                        name="text"
                                        type="text"
                                        placeholder="Age"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography color="primary" variant="body2">
                                    Gender
                                </Typography>
                                <Box mb={1}>
                                    <CustomSelect
                                        register={register("gender")}
                                        options={["Male", "Female"]}
                                        placeholder="Select Gender"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography color="primary" variant="body2">
                                    Menopausal Status
                                </Typography>
                                <Box mb={1}>
                                    <CustomSelect
                                        register={register("menopausal_status")}
                                        options={["Pre-Menopausal", "Post-Menopausal"]}
                                        placeholder="Select Status"
                                    />
                                </Box>
                            </Grid>
                            {menopausalStatus === "Post-Menopausal" && (
                                <Grid item xs={4}>
                                    <Typography color="primary" variant="body2">
                                        Age of Menopause
                                    </Typography>
                                    <Box mb={1}>
                                        <Input
                                            register={register("age_of_menopause")}
                                            name="text"
                                            type="number"
                                            placeholder="Age of menopause"
                                        />
                                    </Box>
                                </Grid>
                            )}
                            <Grid item xs={4}>
                                <Typography color="primary" variant="body2">
                                    Ethnicity
                                </Typography>
                                <Box mb={1}>
                                    <ReactSearchSelect
                                        control={control}
                                        name="ethnicity"
                                        options={nigerianEthnicGroups}
                                        placeholder="Search or select ethnicity"
                                    />
                                </Box>
                            </Grid>
                        </Grid>


                        {/* Vital Signs */}
                        <Typography
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            fontWeight="bold"
                            variant="body2"
                        >
                            Vital Signs
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Typography color="primary" variant="body2">
                                    Blood Pressure
                                </Typography>
                                <Box mb={1}>
                                    <Input
                                        register={register("blood_pressure")}
                                        name="text"
                                        type="text"
                                        placeholder="BP"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography color="primary" variant="body2">
                                    Pulse Rate
                                </Typography>
                                <Box mb={1}>
                                    <Input
                                        register={register("pulse_rate")}
                                        name="text"
                                        type="text"
                                        placeholder="Pulse Rate"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography color="primary" variant="body2">
                                    Oxygen Saturation
                                </Typography>
                                <Box mb={1}>
                                    <Input
                                        register={register("oxygen_saturation")}
                                        name="text"
                                        type="text"
                                        placeholder="Oxygen Saturation"
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Occupation And Mobility History */}
                        <Typography
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                            fontWeight="bold"
                            color="primary"
                            variant="body1"
                        >
                            Occupation And Mobility History
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">
                                    Previous Occupation
                                </Typography>
                                <Box mb={1}>
                                    <Input
                                        register={register("previous_occupation")}
                                        name="text"
                                        type="text"
                                        placeholder="Previous Occupation"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">
                                    Current Occupation
                                </Typography>
                                <Box mb={1}>
                                    <Input
                                        register={register("current_occupation")}
                                        name="text"
                                        type="text"
                                        placeholder="Current Occupation"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="body2">
                                    Current Activity Level
                                </Typography>
                                <Box mb={1}>
                                    <CustomSelect
                                        register={register("activity_level")}
                                        options={[
                                            "Ambulating without any support or walking aid",
                                            "Ambulating with support or walking aid",
                                            "Not able to ambulate (Wheelchair bound or Bed Bound)"
                                        ]}
                                        placeholder="Select Activity Level"
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Pain History */}
                        <Typography
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                            fontWeight="bold"
                            color="primary"
                            variant="body1"
                        >
                            Pain History
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Typography color="primary" variant="body2">
                                    Pain Score (0-10)
                                </Typography>
                                <Box mb={1}>
                                    <Input
                                        register={register("pain_score")}
                                        name="text"
                                        type="number"
                                        placeholder="0-10"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography color="primary" variant="body2">
                                    Site of Pain
                                </Typography>
                                <Box mb={1}>
                                    <Input
                                        register={register("site_of_pain")}
                                        name="text"
                                        type="text"
                                        placeholder="Site of Pain"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography color="primary" variant="body2">
                                    Duration of Pain
                                </Typography>
                                <Box mb={1}>
                                    <Input
                                        register={register("duration_of_pain")}
                                        name="text"
                                        type="text"
                                        placeholder="Duration"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">
                                    Aggravating Factors
                                </Typography>
                                <Box mb={1}>
                                    <Input
                                        register={register("aggravating_factors")}
                                        name="text"
                                        type="text"
                                        placeholder="Aggravating Factors"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">
                                    Relieving Factors
                                </Typography>
                                <Box mb={1}>
                                    <Input
                                        register={register("relieving_factors")}
                                        name="text"
                                        type="text"
                                        placeholder="Relieving Factors"
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Fracture and Deformity History */}
                        <Typography
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                            fontWeight="bold"
                            color="primary"
                            variant="body1"
                        >
                            Fracture and Deformity History
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">
                                    Previous History of Fractures
                                </Typography>
                                <Box mb={1}>
                                    <RadioButton
                                        onChange={(e) => setValue("history_fractures", e.target.value)}
                                        name="history_fractures"
                                        options={["Yes", "No"]}
                                        value={getValues("history_fractures")}
                                    />
                                </Box>
                                {getValues("history_fractures") === "Yes" && (
                                    <Box mb={1}>
                                        <Input
                                            register={register("fracture_bone_affected")}
                                            name="text"
                                            type="text"
                                            placeholder="State bone affected"
                                        />
                                    </Box>
                                )}
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">
                                    Any Joint Deformity?
                                </Typography>
                                <Box mb={1}>
                                    <RadioButton
                                        onChange={(e) => setValue("joint_deformity_history", e.target.value)}
                                        name="joint_deformity_history"
                                        options={["Yes", "No"]}
                                        value={getValues("joint_deformity_history")}
                                    />
                                </Box>
                                {getValues("joint_deformity_history") === "Yes" && (
                                    <Box mb={1}>
                                        <Input
                                            register={register("deformity_type")}
                                            name="text"
                                            type="text"
                                            placeholder="State joint and type of deformity"
                                        />
                                    </Box>
                                )}
                            </Grid>
                        </Grid>

                        {/* Dietary Supplement History */}
                        <Typography
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                            fontWeight="bold"
                            color="primary"
                            variant="body1"
                        >
                            Dietary Supplement History
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography color="primary" variant="body2">Calcium</Typography>
                                <RadioButton
                                    onChange={(e) => setValue("supp_calcium", e.target.value)}
                                    name="supp_calcium"
                                    options={["Yes", "No"]}
                                    value={getValues("supp_calcium")}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography color="primary" variant="body2">Vitamin D3</Typography>
                                <RadioButton
                                    onChange={(e) => setValue("supp_vit_d3", e.target.value)}
                                    name="supp_vit_d3"
                                    options={["Yes", "No"]}
                                    value={getValues("supp_vit_d3")}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography color="primary" variant="body2">Vitamin K2</Typography>
                                <RadioButton
                                    onChange={(e) => setValue("supp_vit_k2", e.target.value)}
                                    name="supp_vit_k2"
                                    options={["Yes", "No"]}
                                    value={getValues("supp_vit_k2")}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography color="primary" variant="body2">Combination Calcium/K2/D3</Typography>
                                <RadioButton
                                    onChange={(e) => setValue("supp_combo", e.target.value)}
                                    name="supp_combo"
                                    options={["Yes", "No"]}
                                    value={getValues("supp_combo")}
                                />
                            </Grid>
                        </Grid>

                        {/* Medication History */}
                        <Typography
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                            fontWeight="bold"
                            color="primary"
                            variant="body1"
                        >
                            Medication History
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Typography color="primary" variant="body2">Steroids</Typography>
                                <RadioButton
                                    onChange={(e) => setValue("med_steroids", e.target.value)}
                                    name="med_steroids"
                                    options={["Yes", "No"]}
                                    value={getValues("med_steroids")}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Typography color="primary" variant="body2">NSAIDs</Typography>
                                <RadioButton
                                    onChange={(e) => setValue("med_nsaids", e.target.value)}
                                    name="med_nsaids"
                                    options={["Yes", "No"]}
                                    value={getValues("med_nsaids")}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Typography color="primary" variant="body2">Analgesics</Typography>
                                <RadioButton
                                    onChange={(e) => setValue("med_analgesics", e.target.value)}
                                    name="med_analgesics"
                                    options={["Yes", "No"]}
                                    value={getValues("med_analgesics")}
                                />
                            </Grid>
                        </Grid>

                        {/* History of Comorbidities */}
                        <Typography
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                            fontWeight="bold"
                            color="primary"
                            variant="body1"
                        >
                            History of Comorbidities
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography color="primary" variant="body2">Diabetes Mellitus</Typography>
                                <RadioButton
                                    onChange={(e) => setValue("comorb_diabetes", e.target.value)}
                                    name="comorb_diabetes"
                                    options={["Yes", "No"]}
                                    value={getValues("comorb_diabetes")}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography color="primary" variant="body2">Kidney/Renal Disease</Typography>
                                <RadioButton
                                    onChange={(e) => setValue("comorb_renal", e.target.value)}
                                    name="comorb_renal"
                                    options={["Yes", "No"]}
                                    value={getValues("comorb_renal")}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography color="primary" variant="body2">Hypertension</Typography>
                                <RadioButton
                                    onChange={(e) => setValue("comorb_hypertension", e.target.value)}
                                    name="comorb_hypertension"
                                    options={["Yes", "No"]}
                                    value={getValues("comorb_hypertension")}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography color="primary" variant="body2">Dialysis?</Typography>
                                <RadioButton
                                    onChange={(e) => setValue("comorb_dialysis", e.target.value)}
                                    name="comorb_dialysis"
                                    options={["Yes", "No"]}
                                    value={getValues("comorb_dialysis")}
                                />
                                {getValues("comorb_dialysis") === "Yes" && (
                                    <Box mt={1}>
                                        <CustomSelect
                                            register={register("dialysis_frequency")}
                                            options={["Daily", "Twice weekly", "Weekly", "Fortnightly", "Monthly"]}
                                            placeholder="Frequency"
                                        />
                                    </Box>
                                )}
                            </Grid>
                        </Grid>

                        {/* Physical Examination */}
                        <Typography
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                            fontWeight="bold"
                            color="primary"
                            variant="body1"
                        >
                            Physical Examination
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">Gait</Typography>
                                <CustomSelect
                                    register={register("exam_gait")}
                                    options={["Normal Gait", "Abnormal Gait"]}
                                    placeholder="Select Gait"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">Posture</Typography>
                                <CustomSelect
                                    register={register("exam_posture")}
                                    options={["Normal upright posture", "Bent Over"]}
                                    placeholder="Select Posture"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">Joint Deformity</Typography>
                                <CustomSelect
                                    register={register("exam_joint_deformity")}
                                    options={["No joint deformity", "Varus or Bow Knee", "Valgus or Knocked Knee"]}
                                    placeholder="Select Deformity"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">Tenderness</Typography>
                                <CustomSelect
                                    register={register("exam_tenderness")}
                                    options={["Localized", "On joint motion", "All over the joint"]}
                                    placeholder="Select Tenderness"
                                />
                                {getValues("exam_tenderness") === "Localized" && (
                                    <Box mt={1}>
                                        <Input
                                            register={register("exam_tenderness_location")}
                                            name="text"
                                            type="text"
                                            placeholder="State location"
                                        />
                                    </Box>
                                )}
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">Swelling</Typography>
                                <CustomSelect
                                    register={register("exam_swelling")}
                                    options={["Localized", "Swelling of the entire joint"]}
                                    placeholder="Select Swelling"
                                />
                                {getValues("exam_swelling") === "Localized" && (
                                    <Box mt={1}>
                                        <Input
                                            register={register("exam_swelling_location")}
                                            name="text"
                                            type="text"
                                            placeholder="State location"
                                        />
                                    </Box>
                                )}
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">Muscle Wasting</Typography>
                                <CustomSelect
                                    register={register("exam_muscle_wasting")}
                                    options={["Localized", "Affecting the entire limb"]}
                                    placeholder="Select Muscle Wasting"
                                />
                            </Grid>
                        </Grid>

                        <Typography
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            fontWeight="bold"
                            variant="body2"
                        >
                            Range of Motion (ROM)
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">Right Knee</Typography>
                                <Input register={register("rom_right_knee")} type="text" placeholder="Right Knee ROM" />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">Left Knee</Typography>
                                <Input register={register("rom_left_knee")} type="text" placeholder="Left Knee ROM" />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">Right Ankle</Typography>
                                <Input register={register("rom_right_ankle")} type="text" placeholder="Right Ankle ROM" />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">Left Ankle</Typography>
                                <Input register={register("rom_left_ankle")} type="text" placeholder="Left Ankle ROM" />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">Right Hip</Typography>
                                <Input register={register("rom_right_hip")} type="text" placeholder="Right Hip ROM" />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">Left Hip</Typography>
                                <Input register={register("rom_left_hip")} type="text" placeholder="Left Hip ROM" />
                            </Grid>
                        </Grid>

                        <Typography
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            fontWeight="bold"
                            variant="body2"
                        >
                            Stiffness
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">Any joint stiffness?</Typography>
                                <RadioButton
                                    onChange={(e) => setValue("joint_stiffness", e.target.value)}
                                    name="joint_stiffness"
                                    options={["Yes", "No"]}
                                    value={getValues("joint_stiffness")}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="primary" variant="body2">Affected Joint</Typography>
                                <Input register={register("stiffness_affected_joint")} type="text" placeholder="Indicate affected joint" />
                            </Grid>
                        </Grid>

                        {/* Functional Assessment */}
                        <Typography
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                            fontWeight="bold"
                            color="primary"
                            variant="body1"
                        >
                            Functional Assessment
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="body2">Mobility</Typography>
                                <CustomSelect
                                    register={register("func_mobility")}
                                    options={[
                                        "Without assistance",
                                        "With walking stick",
                                        "With a Zimmer / Pulpit frame",
                                        "Wheelchair bound"
                                    ]}
                                    placeholder="Select Mobility"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="body2" style={{ marginBottom: "10px" }}>ADLs (Activities of Daily Living)</Typography>

                                <Grid container spacing={1}>
                                    <Grid item xs={8}><Typography variant="body2">Can brush teeth without assistance</Typography></Grid>
                                    <Grid item xs={4}>
                                        <RadioButton onChange={(e) => setValue("adl_brush_teeth", e.target.value)} name="adl_brush_teeth" options={["Yes", "No"]} value={getValues("adl_brush_teeth")} />
                                    </Grid>

                                    <Grid item xs={8}><Typography variant="body2">Can brush hair without assistance</Typography></Grid>
                                    <Grid item xs={4}>
                                        <RadioButton onChange={(e) => setValue("adl_brush_hair", e.target.value)} name="adl_brush_hair" options={["Yes", "No"]} value={getValues("adl_brush_hair")} />
                                    </Grid>

                                    <Grid item xs={8}><Typography variant="body2">Can have shower without assistance</Typography></Grid>
                                    <Grid item xs={4}>
                                        <RadioButton onChange={(e) => setValue("adl_shower", e.target.value)} name="adl_shower" options={["Yes", "No"]} value={getValues("adl_shower")} />
                                    </Grid>

                                    <Grid item xs={8}><Typography variant="body2">Can feed self without assistance</Typography></Grid>
                                    <Grid item xs={4}>
                                        <RadioButton onChange={(e) => setValue("adl_feed", e.target.value)} name="adl_feed" options={["Yes", "No"]} value={getValues("adl_feed")} />
                                    </Grid>

                                    <Grid item xs={8}><Typography variant="body2">Can use the toilet without assistance</Typography></Grid>
                                    <Grid item xs={4}>
                                        <RadioButton onChange={(e) => setValue("adl_toilet", e.target.value)} name="adl_toilet" options={["Yes", "No"]} value={getValues("adl_toilet")} />
                                    </Grid>

                                    <Grid item xs={8}><Typography variant="body2">Can stand up from a sitting position</Typography></Grid>
                                    <Grid item xs={4}>
                                        <RadioButton onChange={(e) => setValue("adl_stand", e.target.value)} name="adl_stand" options={["Yes", "No"]} value={getValues("adl_stand")} />
                                    </Grid>

                                    <Grid item xs={8}><Typography variant="body2">Can only stand from a sitting position with assistance</Typography></Grid>
                                    <Grid item xs={4}>
                                        <RadioButton onChange={(e) => setValue("adl_stand_assist", e.target.value)} name="adl_stand_assist" options={["Yes", "No"]} value={getValues("adl_stand_assist")} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Pain Scale Visual */}
                        <Box sx={{ mt: 4, mb: 4, px: 2, py: 3, border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                            <Typography variant="h6" fontWeight="bold" color="primary" align="center" gutterBottom>
                                Pain Intensity Scale
                            </Typography>

                            {/* Scale Visual Container */}
                            <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
                                {/* Top Labels */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, px: 1 }}>
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                        <Typography
                                            key={num}
                                            variant="caption"
                                            fontWeight="bold"
                                            sx={{
                                                width: '20px',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                padding: '4px',
                                                borderRadius: '4px',
                                                backgroundColor: painScaleValue === num ? '#1976d2' : 'transparent',
                                                color: painScaleValue === num ? 'white' : 'inherit',
                                                '&:hover': {
                                                    backgroundColor: painScaleValue === num ? '#1976d2' : '#e3f2fd'
                                                }
                                            }}
                                            onClick={() => setValue("pain_scale_visual", num, { shouldValidate: true, shouldDirty: true })}
                                        >
                                            {num}
                                        </Typography>
                                    ))}
                                </Box>

                                {/* Gradient Bar */}
                                <Box
                                    sx={{
                                        height: '30px',
                                        background: 'linear-gradient(to right, #2e7d32 0%, #76ff03 20%, #ffea00 40%, #ff9100 60%, #ff3d00 80%, #d50000 100%)',
                                        borderRadius: '10px',
                                        mb: 2,
                                        position: 'relative',
                                        border: '1px solid #bdbdbd',
                                        cursor: 'pointer'
                                    }}
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        const percentage = x / rect.width;
                                        const painValue = Math.round(percentage * 10);
                                        setValue("pain_scale_visual", Math.min(10, Math.max(0, painValue)), { shouldValidate: true, shouldDirty: true });
                                    }}
                                >
                                    {/* Ticks */}
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num, i) => (
                                        <Box key={num} sx={{
                                            position: 'absolute',
                                            left: `${i * 10}%`,
                                            height: '30px',
                                            width: '2px',
                                            background: 'rgba(255,255,255,0.5)',
                                            pointerEvents: 'none'
                                        }} />
                                    ))}

                                    {/* Selected Indicator */}
                                    {painScaleValue !== undefined && (
                                        <Box sx={{
                                            position: 'absolute',
                                            left: `${(painScaleValue / 10) * 100}%`,
                                            top: '-8px',
                                            transform: 'translateX(-50%)',
                                            width: '0',
                                            height: '0',
                                            borderLeft: '8px solid transparent',
                                            borderRight: '8px solid transparent',
                                            borderTop: '12px solid #1976d2',
                                            pointerEvents: 'none'
                                        }} />
                                    )}
                                </Box>

                                {/* Descriptive Labels */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, fontSize: '0.75rem', fontWeight: 'bold', px: 1 }}>
                                    <span style={{ flex: 1, textAlign: 'left', color: '#2e7d32' }}>No Pain</span>
                                    <span style={{ flex: 1, textAlign: 'center', color: '#76ff03' }}>Mild</span>
                                    <span style={{ flex: 1, textAlign: 'center', color: '#fbc02d' }}>Moderate</span>
                                    <span style={{ flex: 1, textAlign: 'center', color: '#ff9100' }}>Severe</span>
                                    <span style={{ flex: 1, textAlign: 'center', color: '#ff3d00' }}>Very Severe</span>
                                    <span style={{ flex: 1, textAlign: 'right', color: '#d50000' }}>Worst Pain Possible</span>
                                </Box>

                                {/* Faces Row */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
                                    {[
                                        { face: '😊', label: '0', value: 0, color: '#2e7d32' },
                                        { face: '🙂', label: '1-3', value: 2, color: '#76ff03' },
                                        { face: '😐', label: '4-6', value: 5, color: '#fbc02d' },
                                        { face: '😟', label: '7-9', value: 8, color: '#ff9100' },
                                        { face: '😭', label: '10', value: 10, color: '#d50000' }
                                    ].map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                padding: '8px',
                                                borderRadius: '8px',
                                                border: '2px solid transparent',
                                                borderColor: painScaleValue === item.value ? '#1976d2' : 'transparent',
                                                backgroundColor: painScaleValue === item.value ? '#e3f2fd' : 'transparent',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    backgroundColor: '#f5f5f5',
                                                    transform: 'scale(1.05)'
                                                }
                                            }}
                                            onClick={() => setValue("pain_scale_visual", item.value, { shouldValidate: true, shouldDirty: true })}
                                        >
                                            <Typography sx={{ fontSize: '3rem', lineHeight: 1 }} role="img" aria-label="face">
                                                {item.face}
                                            </Typography>
                                            <Typography variant="h5" fontWeight="bold" sx={{ mt: 1, color: item.color }}>
                                                {item.label}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                {/* Selected Value Display */}
                                {painScaleValue !== undefined && (
                                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                                        <Typography variant="body1" color="primary">
                                            Selected Pain Level: <strong>{painScaleValue}/10</strong>
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* Integrated Bone Health Management Pathway */}
                        <Typography
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                            fontWeight="bold"
                            color="primary"
                            variant="body1"
                        >
                            Integrated Bone Health Management Pathway
                        </Typography>

                        <Typography fontWeight="bold" variant="body2" style={{ marginTop: "10px" }}>Investigations</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="body2">X-Ray (Initial Imaging)</Typography>
                                <Textarea register={register("inv_xray")} placeholder="Findings (Joint space narrowing, osteophytes, Looser's zones, Fragility Fractures)" />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="body2">DEXA Scan (T-Score)</Typography>
                                <Input register={register("inv_dexa_tscore")} placeholder="Enter T-Score" />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="body2">CT Scan/MRI</Typography>
                                <Textarea register={register("inv_ct_mri")} placeholder="Findings (Cartilage loss, bone marrow oedema, etc.)" />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="body2">Laboratory Results</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}><Input register={register("lab_calcium")} placeholder="Serum Calcium" /></Grid>
                                    <Grid item xs={6}><Input register={register("lab_phosphate")} placeholder="Serum Phosphate" /></Grid>
                                    <Grid item xs={6}><Input register={register("lab_alp")} placeholder="Serum ALP" /></Grid>
                                    <Grid item xs={6}><Input register={register("lab_vit_d")} placeholder="Vitamin D (25-OH)" /></Grid>
                                    <Grid item xs={6}><Input register={register("lab_pth")} placeholder="PTH" /></Grid>
                                    <Grid item xs={6}><Input register={register("lab_renal")} placeholder="Renal Functions" /></Grid>
                                    <Grid item xs={6}><Input register={register("lab_tft")} placeholder="TFT" /></Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="body2">Bone Biopsy (if applicable)</Typography>
                                <Textarea register={register("inv_biopsy")} placeholder="Histological examination results" />
                            </Grid>
                        </Grid>

                        <Typography fontWeight="bold" variant="body2" style={{ marginTop: "20px" }}>Diagnosis & Treatment Plan</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="body2">Diagnosis</Typography>
                                <CustomSelect
                                    register={register("diagnosis")}
                                    options={["Osteoporosis", "Osteomalacia / Osteopenia", "Osteoarthritis (OA)"]}
                                    placeholder="Select Diagnosis"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="body2">Treatment Plan / Management</Typography>
                                <Textarea register={register("treatment_plan")} placeholder="Enter detailed treatment plan..." />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="body2">Surgical Intervention (if any)</Typography>
                                <Textarea register={register("surgical_plan")} placeholder="Enter surgical details..." />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="body2">Rehabilitation Plan</Typography>
                                <Textarea register={register("rehab_plan")} placeholder="Physiotherapy, exercises, etc." />
                            </Grid>
                        </Grid>

                        <Box
                            sx={{
                                gap: "1rem",
                                marginTop: "20px"
                            }}
                        >
                            <RadioButton
                                onChange={handleChangeStatus}
                                name="status"
                                options={["Draft", "Final"]}
                                value={docStatus}
                            />
                        </Box>
                        <Box
                            spacing={3}
                            sx={{
                                display: "flex",
                                gap: "3rem",
                            }}
                        >
                            <GlobalCustomButton
                                color="secondary"
                                type="submit"
                                onClick={() => setConfirmationDialog(true)}
                            >
                                Submit Clinical Pathway Form
                            </GlobalCustomButton>
                        </Box>
                    </>
                </div>
            </div>
        </>
    );
}
