import {
    Grid,
    Box,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    Stack,
} from '@mui/material'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import CustomSelect from '../../components/inputs/basic/Select'
import Input from '../../components/inputs/basic/Input'
import { FormsHeaderText } from '../../components/texts'
import GlobalCustomButton from '../../components/buttons/CustomButton'
import Textarea from '../../components/inputs/basic/Textarea'
import AddPregnancy from './modal/addPregnancy'
import { ObjectContext, UserContext } from '../../context'
import { useContext } from 'react'
import client from '../../feathers'
import { toast } from 'react-toastify'
import React, { useEffect } from 'react'
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'

const ObstetricsAssessment = () => {
    const { register, handleSubmit, reset, setValue, watch, control } = useForm(
        {
            defaultValues: {
                medicalHistory: [{ medicalCondition: '', familyRelation: '' }],
            },
        },
    )
    const [docStatus, setDocStatus] = useState('Draft')
    const [pregnancyData, setPregnancyData] = useState([])
    const ClientServ = client.service('clinicaldocument')
    const { user } = useContext(UserContext)
    const { state, setState, showActionLoader, hideActionLoader } =
        useContext(ObjectContext)

    const pregnancyTableData = watch('pregnancyTableData')

    let draftDoc = state.DocumentClassModule.selectedDocumentClass.document

    useEffect(() => {
        if (!!draftDoc && draftDoc.status === 'Draft') {
            Object.entries(draftDoc.documentdetail).map(([keys, value], i) =>
                setValue(keys, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                }),
            )
        }
        if (
            !pregnancyData?.length &&
            draftDoc?.documentdetail?.pregnancyTableData
        ) {
            setPregnancyData(draftDoc?.documentdetail?.pregnancyTableData)
        }

        return () => {
            draftDoc = {}
        }
    }, [draftDoc])

    const handleDataUpdate = newData => {
        const updatedData = [...pregnancyData, newData]
        setPregnancyData(updatedData)
        setValue('pregnancyTableData', updatedData)
    }

    const closeForm = async () => {
        let documentobj = {}
        documentobj.name = ''
        documentobj.facility = ''
        documentobj.document = ''
        const newDocumentClassModule = {
            selectedDocumentClass: documentobj,
            encounter_right: false,
        }
        await setState(prevstate => ({
            ...prevstate,
            DocumentClassModule: newDocumentClassModule,
        }))
        reset()
    }

    const handleChangeStatus = async e => {
        setDocStatus(e.target.value)
    }

    const columns = [
        {
            name: 'Date of Birth',
            selector: row => row.dateOfBirth,
            sortable: true,
            width: '120px',
        },
        {
            name: 'Duration of Pregnancy',
            selector: row => row.durationOfPregnancy,
            sortable: true,
            width: '120px',
        },
        {
            name: 'Pregnancy, Labor & Puerperium',
            selector: row => row.pregnancyDetails,
            width: '120px',
        },
        {
            name: 'Birth Weight',
            selector: row => row.birthWeight,
            width: '120px',
        },
        {
            name: 'Baby A/SB/NND/ID',
            selector: row => row.babyStatus,
            width: '120px',
        },
    ]

    const inputFields = [
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
        {
            name: 'durationOfPregnancy',
            label: 'Duration of Pregnancy',
            type: 'text',
        },
        {
            name: 'pregnancyDetails',
            label: 'Pregnancy, Labor & Puerperium',
            type: 'text',
        },
        { name: 'birthWeight', label: 'Birth Weight', type: 'text' },
        { name: 'babyStatus', label: 'Baby A/SB/NND/ID', type: 'text' },
    ]

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'medicalHistory',
    })

    const onSubmit = async data => {
        showActionLoader()
        let document = {}
        if (user.currentEmployee) {
            document.facility = user.currentEmployee.facilityDetail._id
            document.facilityname =
                user.currentEmployee.facilityDetail.facilityName
        }
        document.documentdetail = data
        document.documentname = 'Anc Booking'
        // document.documentType = "Obstetrics Assessment";
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

        if (
            document.location === undefined ||
            !document.createdByname ||
            !document.facilityname
        ) {
            toast.error(
                'Documentation data missing, requires location and facility details',
            )
            hideActionLoader()
            return
        }

        if (!!draftDoc && draftDoc.status === 'Draft') {
            await ClientServ.patch(draftDoc._id, document)
                .then(res => {
                    toast.success(
                        'Obstetrics Assessment Document succesfully updated',
                    )
                    reset(data)
                })
                .catch(err => {
                    toast.error('Error updating Documentation ' + err)
                })
            hideActionLoader()
            closeForm()
        } else {
            await ClientServ.create(document)
                .then(res => {
                    toast.success('Obstetrics Assessment created succesfully')
                    reset(data)
                    closeForm()
                })
                .catch(err => {
                    toast.error('Error creating Obstetrics Assessment ' + err)
                })
            hideActionLoader()
        }
        //}
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    my: 1,
                }}
            >
                <FormsHeaderText text="Obstetrics Assessment" />

                <IconButton onClick={closeForm}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Input
                        label="Surname"
                        name="surname"
                        register={register('surname')}
                        placeholder="Surname"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Input
                        label="First Name"
                        name="firstName"
                        register={register('firstName')}
                        placeholder="First Name"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Input
                        label="X-Ray No."
                        name="xRayNumber"
                        register={register('xRayNumber')}
                        placeholder="X-Ray No."
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Input
                        label="Hospital No."
                        name="hospitalNumber"
                        register={register('hospitalNumber')}
                        placeholder="Hospital No."
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Input
                        label="Special Points"
                        name="specialPoints"
                        register={register('specialPoints')}
                        placeholder="Special Points"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CustomSelect
                        label="Consultant"
                        name="consultant"
                        options={['Consultant A', 'Consultant B']}
                        register={register('consultant')}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Input
                        label="Indication for Booking"
                        name="indicationForBooking"
                        register={register('indicationForBooking')}
                        placeholder="Indication for Booking"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Input
                        label="L.M.P."
                        name="lmp"
                        type="date"
                        register={register('lmp')}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Input
                        label="E.D.D."
                        name="edd"
                        type="date"
                        register={register('edd')}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Input
                        label="Age"
                        name="age"
                        type="number"
                        register={register('age')}
                        placeholder="Age"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CustomSelect
                        label="Ethnic Group"
                        name="ethnicGroup"
                        options={['Group A', 'Group B']}
                        register={register('ethnicGroup')}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormsHeaderText text="Husband" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Input
                        label="Names"
                        name="names"
                        register={register('names')}
                        placeholder="Names"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Input
                        label="Occupation"
                        name="occupation"
                        register={register('occupation')}
                        placeholder="Occupation"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Input
                        label="Employer"
                        name="employer"
                        register={register('employer')}
                        placeholder="Employer"
                    />
                </Grid>
            </Grid>

            <Stack
                direction="row"
                justifyContent="space-between"
                paddingBlock={1}
                spacing={2}
            >
                <FormsHeaderText text="Previous Medical History" />

                <Grid item xs={4}>
                    <IconButton
                        onClick={() =>
                            append({ medicalCondition: '', familyRelation: '' })
                        }
                    >
                        <AddCircleOutline color="primary" />
                    </IconButton>
                    <span>Add New Condition</span>
                </Grid>
            </Stack>
            <Grid container spacing={2} paddingBlock={2}>
                {fields.map((field, index) => (
                    <React.Fragment key={field.id}>
                        <Grid item xs={12} md={6}>
                            <Input
                                label="Medical Conditions"
                                name={`medicalHistory[${index}].medicalCondition`}
                                register={register(
                                    `medicalHistory[${index}].medicalCondition`,
                                )}
                                placeholder="Medical Condition"
                            />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Input
                                label="Family/Relation"
                                name={`medicalHistory[${index}].familyRelation`}
                                register={register(
                                    `medicalHistory[${index}].familyRelation`,
                                )}
                                placeholder="Relation"
                            />
                        </Grid>

                        <Grid item xs={12} md={1}>
                            <IconButton onClick={() => remove(index)}>
                                <RemoveCircleOutline color="error" />
                            </IconButton>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Input
                        label="Previous Pregnancies Total"
                        name="previousPregnanciesTotal"
                        register={register('previousPregnanciesTotal')}
                        type="number"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Input
                        label="No. of Living Children"
                        name="noOfLivingChildren"
                        register={register('noOfLivingChildren')}
                        type="number"
                    />
                </Grid>
            </Grid>
            <Grid>
                <AddPregnancy
                    schema={columns}
                    inputFields={inputFields}
                    initialData={pregnancyTableData || pregnancyData}
                    onDataUpdate={handleDataUpdate}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    label="Additional Info"
                    name="additionalInfo"
                    multiline
                    rows={4}
                    register={register('additionalInfo')}
                />
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
                <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
                    Submit Assessment
                </GlobalCustomButton>
            </Grid>
        </Box>
    )
}

export default ObstetricsAssessment
