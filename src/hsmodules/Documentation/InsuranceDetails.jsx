import { useContext, useEffect, useState } from 'react'
import {
    Box,
    FormControlLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material'
import CustomConfirmationDialog from '../../components/confirm-dialog/confirm-dialog'
import { FormsHeaderText } from '../../components/texts'
import CloseIcon from '@mui/icons-material/Close'
import { ObjectContext, UserContext } from '../../context'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import client from '../../feathers'
import Input from '../../components/inputs/basic/Input'
import GlobalCustomButton from '../../components/buttons/CustomButton'

const InsuranceDetails = () => {
    const { state, setState, hideActionLoader, showActionLoader } =
        useContext(ObjectContext)
    const [confirmDialog, setConfirmDialog] = useState(false)

    const { register, handleSubmit, reset, setValue } = useForm() //, watch, errors, reset
    const { user } = useContext(UserContext) //,setUser
    const [docStatus, setDocStatus] = useState('Draft')

    const handleChangeStatus = async e => {
        setDocStatus(e.target.value)
    }

    let draftDoc = state.DocumentClassModule.selectedDocumentClass.document
    const ClientServ = client.service('clinicaldocument')

    const closeEncounterRight = async () => {
        let documentobj = {}
        documentobj.name = ''
        documentobj.facility = ''
        documentobj.document = ''
        //  alert("I am in draft mode : " + Clinic.documentname)
        const newDocumentClassModule = {
            selectedDocumentClass: documentobj,
            encounter_right: false,
            show: 'detail',
        }
        await setState(prevstate => ({
            ...prevstate,
            DocumentClassModule: newDocumentClassModule,
        }))
    }


    useEffect(() => {
        if (!!draftDoc && draftDoc.status === 'Draft') {
            Object.entries(draftDoc.documentdetail).map(([keys, value], i) =>
                setValue(keys, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                }),
            )
        }

        return () => {
            draftDoc = {}
        }
    }, [draftDoc])

    const onSubmit = (data, e) => {
        showActionLoader()
        //e.preventDefault();

        let document = {}

        if (user.currentEmployee) {
            document.facility = user.currentEmployee.facilityDetail._id
            document.facilityname =
                user.currentEmployee.facilityDetail.facilityName // or from facility dropdown
        }
        document.documentdetail = data
        document.documentname = 'Insurance Details'
        document.location =
            state.employeeLocation.locationName +
            ' ' +
            state.employeeLocation.locationType
        document.locationId = state.employeeLocation.locationId
        document.client = state.ClientModule.selectedClient._id
        document.createdBy = user._id
        document.createdByname = user.firstname + ' ' + user.lastname
        document.status = docStatus === 'Draft' ? 'Draft' : 'completed'

        document.geolocation = {
            type: 'Point',
            coordinates: [
                state.coordinates.latitude,
                state.coordinates.longitude,
            ],
        }

        console.log(document)

        if (
            document.location === undefined ||
            !document.createdByname ||
            !document.facilityname
        ) {
            toast.error(
                'Documentation data missing, requires location and facility details',
            )
            return
        }

        //return console.log(document)

        if (!!draftDoc && draftDoc.status === 'Draft') {
            ClientServ.patch(draftDoc._id, document)
                .then(() => {
                    // e.target.reset();
                    Object.keys(data).forEach(key => {
                        data[key] = null
                    })
                    setConfirmDialog(false)
                    hideActionLoader()
                    reset(data)
                    toast.success('Insurance Details updated succesfully')
                    closeEncounterRight()
                })
                .catch(err => {
                    hideActionLoader()
                    setConfirmDialog(false)
                    toast.error('Error updating Insurance Details ' + err)
                })
        } else {
            ClientServ.create(document)
                .then(() => {
                    Object.keys(data).forEach(key => {
                        data[key] = null
                    })
                    hideActionLoader()
                    //e.target.reset();
                    reset(data)
                    setConfirmDialog(false)
                    toast.success('Insurance Details created succesfully')
                    closeEncounterRight()
                })
                .catch(err => {
                    setConfirmDialog(false)
                    hideActionLoader()
                    toast.error('Error creating Insurance Details ' + err)
                })
        }
    }

    return (
        <div>
            <Box sx={{ width: '100%' }}>
                <CustomConfirmationDialog
                    open={confirmDialog}
                    cancelAction={() => setConfirmDialog(false)}
                    confirmationAction={handleSubmit(onSubmit)}
                    type="create"
                    message="You're about to create an Insurance Details Document"
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                    mb={1}
                >
                    <FormsHeaderText text="Insurance Details" />

                    <IconButton onClick={closeEncounterRight}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Typography
                    sx={{
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        my: 1,
                    }}
                >
                    Only Complete this section if you are NOT the Primary Policy
                    Holder
                </Typography>
                <>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Input
                                register={register('primaryPolicyHolder')}
                                type="text"
                                label="Primary Policy Holder"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('relationship')}
                                type="text"
                                label="Relationship"
                            />
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                color: '#0364FF',
                                textTransform: 'uppercase',
                                my: 1,
                            }}
                        >
                            INSURANCE ACKNOWLEDGMENTS
                        </Typography>
                    </Grid>

                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                Insurance Benefits & Payments
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    my: 1,
                                }}
                            >
                                I hereby authorize the release of any
                                information concerning my (or my child’s) health
                                care, advice and treatment provided for the
                                purposes of evaluating and administering claims
                                for insurance benefits. I also hereby authorize
                                payment of insurance benefits otherwise payable
                                to me directly to Jeffrey R. Polito, M.D. I
                                understand that regardless of insurance coverage
                                and/or third-party involvement, I am ultimately
                                financially responsible for charges incurred for
                                care received from Jeffrey R. Polito, M.D. and
                                his staff. I understand that it is my
                                responsibility to provide current and correct
                                insurance information and I am responsible for
                                any charges that may result from incorrect or
                                outdated information. If my insurance is an HMO,
                                I understand that is my responsibility to ensure
                                that I am assigned appropriately. I am
                                responsible for any charges that I incur from
                                any unassigned facilities or unauthorized
                                physicians.
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                Insurance Changes
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    my: 1,
                                }}
                            >
                                There are many changes to health insurance
                                policies both for patients and providers.
                                Patients need to be sure to contact their
                                carriers to fully understand their plan and
                                their benefits. Any and all Co-pays are due at
                                the time of service.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    my: 1,
                                }}
                            >
                                This office is currently participating in the
                                Blue Shield “Covered California” plan. We are
                                not contracted with the Blue Cross “Covered
                                California” or “Pathway” plan. Your services may
                                be applied to an “out of network” deductible.
                                These plans tend to have high deductibles and
                                you will be asked to take care of the allowed
                                amount at the time of your visit.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    my: 1,
                                }}
                            >
                                For UC employees, it is our understanding that
                                you may use your Tier 2 benefit in our office.
                                We are not a part of the Tier 1 benefit,
                                however, and you will have a deductible and a
                                co-insurance amount with this coverage. UC
                                Students with coverage through the university
                                health plan must have a referral in hand from
                                student health prior to services.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    my: 1,
                                }}
                            >
                                Medi-Cal and Cencal services are provided on a
                                referral basis for sleep medicine conditions
                                only. You must have a referral from your primary
                                care physician. Other, Medical/Cencal/SBHI are
                                not accepted as primary or secondary insurance.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    my: 1,
                                }}
                            >
                                By signing below, you acknowledge receipt and
                                understanding of the above terms.
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                Understanding an HMO/POS
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    my: 1,
                                }}
                            >
                                When a patient belongs to an HMO/POS they are
                                assigned to a specific group of physicians. You
                                have chosen Jeffrey Polito, M.D. as your Primary
                                Care Physician who contracted with two groups:{' '}
                                <span style={{ fontWeight: 'bold' }}>
                                    Santa Barbara Select IPA (SBSIPA) and Sansum
                                    Clinic.{' '}
                                </span>
                                Your insurance card should have your assigned
                                group printed on your card. (if your card does
                                not indicate your medical group and assigned
                                provider, you will be asked to contact your
                                insurance to obtain that information).
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    my: 1,
                                }}
                            >
                                As the patient, it is ultimately your
                                responsibility to know which group you are
                                associated with and to make sure that you are
                                sent to the appropriate facilities and
                                specialists covered by your insurance. We will
                                try our best to send you to the appropriate
                                providers covered by your insurance, but we are
                                not responsible for any discrepancies that may
                                occur. You will be held responsible for payments
                                not received due to such discrepancies.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    my: 1,
                                }}
                            >
                                By signing below, you acknowledge receipt and
                                understanding of the above terms.
                            </Typography>
                        </Grid>
                        <Box ml={2} mt={4}>
                            <RadioGroup
                                row
                                aria-label="document-status"
                                name="status"
                                value={docStatus}
                                onChange={handleChangeStatus}
                            >
                                <FormControlLabel
                                    value="Draft"
                                    control={<Radio {...register('status')} />}
                                    label="Draft"
                                />
                                <FormControlLabel
                                    value="Final"
                                    control={<Radio {...register('status')} />}
                                    label="Final"
                                />
                            </RadioGroup>
                        </Box>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end">
                                <GlobalCustomButton
                                    onClick={handleSubmit(onSubmit)}
                                    type="submit"
                                >
                                    Submit
                                </GlobalCustomButton>
                            </Box>
                        </Grid>
                    </Grid>
                </>
            </Box>
        </div>
    )
}

export default InsuranceDetails
