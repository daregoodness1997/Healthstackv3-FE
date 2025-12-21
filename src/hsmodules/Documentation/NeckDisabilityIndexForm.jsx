import {
    Grid,
    Box,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    Typography,
    TextField,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { FormsHeaderText } from '../../components/texts'
import GlobalCustomButton from '../../components/buttons/CustomButton'
import CloseIcon from '@mui/icons-material/Close'
import React, { useContext, useEffect, useState } from 'react'
import { ObjectContext, UserContext } from '../../context'
import client from '../../feathers'
import { toast } from 'react-toastify'
import Textarea from '../../components/inputs/basic/Textarea'
import Input from '../../components/inputs/basic/Input'


const NeckDisabilityIndexForm = () => {
    const { register, handleSubmit, reset, watch,setValue } = useForm()
    const [docStatus, setDocStatus] = useState('Draft')
    const ClientServ = client.service('clinicaldocument')
    const { user } = useContext(UserContext)
    const { state, setState, showActionLoader, hideActionLoader } = useContext(ObjectContext)

    const closeForm = async () => {
        let documentobj = { name: '', facility: '', document: '' }
        await setState(prevstate => ({
            ...prevstate,
            DocumentClassModule: { selectedDocumentClass: documentobj, encounter_right: false },
        }))
        reset()
    }


           let draftDoc = state.DocumentClassModule.selectedDocumentClass.document
    
           useEffect(() => {
            //    console.log(draftDoc);
               if (!!draftDoc && draftDoc.status === "Draft") {
                 Object.entries(draftDoc.documentdetail).map(([keys, value], i) => {
                   setValue(keys, value, {
                     shouldValidate: true,
                     shouldDirty: true,
                   });
                 });
               }
               return () => {
                 draftDoc = {};
               };
             }, [draftDoc]);
    
    
        const handleChangeStatus = async e => {
            setDocStatus(e.target.value)
        }

 
    const onSubmit = async data => {
        showActionLoader()
        let document = {}
        if (user.currentEmployee) {
            document.facility = user.currentEmployee.facilityDetail._id
            document.facilityname = user.currentEmployee.facilityDetail.facilityName
        }
        document.documentdetail = data
        document.documentname = 'Neck Disability Index'
        document.location = state.employeeLocation.locationName + ' ' + state.employeeLocation.locationType
        document.locationId = state.employeeLocation.locationId
        document.client = state.ClientModule.selectedClient._id
        document.createdBy = user._id
        document.createdByname = user.firstname + ' ' + user.lastname
          document.status = docStatus === 'Draft' ? 'Draft' : 'completed'

        document.geolocation = {
            type: 'Point',
            coordinates: [state.coordinates.latitude, state.coordinates.longitude],
        }

        if (!document.createdByname || !document.facilityname) {
            toast.error('Missing required details (location/facility)')
            hideActionLoader()
            return
        }

       if (!!draftDoc && draftDoc.status === 'Draft') {
             ClientServ.patch(draftDoc._id, document)
               .then(() => {
                 Object.keys(data).forEach((key) => {
                   data[key] = '';
                 });
       
                 setDocStatus('Draft');
       
                 toast.success('Documentation updated succesfully');
                 reset(data);
                //  setConfirmationDialog(false);
                 closeForm();
                 hideActionLoader();
               })
               .catch((err) => {
                 toast.error('Error updating Documentation ' + err);
                 hideActionLoader();
               });
           } else {
             await ClientServ.create(document)
               .then(() => {
                 toast.success('Document created successfully');
                 reset(data);
                 closeForm();
               })
               .catch((err) => toast.error('Error creating Document ' + err));
             hideActionLoader();
           }
         };

    const ndiSections = [
        { title: 'Pain Intensity', options: [
            'I have no pain at the moment.',
            'The pain is very mild at the moment.',
            'The pain is moderate at the moment.',
            'The pain is fairly severe at the moment.',
            'The pain is very severe at the moment.',
            'The pain is the worst imaginable at the moment.',
        ]},
        { title: 'Personal Care (Washing, Dressing, etc.)', options: [
            'I can look after myself normally without causing extra pain.',
            'I can look after myself normally but it causes extra pain.',
            'It is painful to look after myself and I am slow and careful.',
            'I need some help but manage most of my personal care.',
            'I need help every day in most aspects of self care.',
            'I do not get dressed, I wash with difficulty and stay in bed.',
        ]},
        { title: 'Lifting', options: [
            'I can lift heavy weights without extra pain.',
            'I can lift heavy weights but it gives extra pain.',
            'Pain prevents me from lifting heavy weights off the floor, but I can manage if they are conveniently positioned.',
            'Pain prevents me from lifting heavy weights, but I can manage light to medium weights if they are conveniently positioned.',
            'I can lift very light weights.',
            'I cannot lift or carry anything at all.',
        ]},
        { title: 'Reading', options: [
            'I can read as much as I want to with no pain in my neck.',
            'I can read as much as I want to with slight pain in my neck.',
            'I can read as much as I want with moderate pain.',
            "I can't read as much as I want because of moderate pain in my neck.",
            'I can hardly read at all because of severe pain in my neck.',
            'I cannot read at all.',
        ]},
        { title: 'Headaches', options: [
            'I have no headaches at all.',
            'I have slight headaches which come infrequently.',
            'I have slight headaches which come frequently.',
            'I have moderate headaches which come infrequently.',
            'I have severe headaches which come frequently.',
            'I have headaches almost all the time.',
        ]},
        { title: 'Concentration', options: [
            'I can concentrate fully when I want to with no difficulty.',
            'I can concentrate fully when I want to with slight difficulty.',
            'I have a fair degree of difficulty in concentrating when I want to.',
            'I have a lot of difficulty in concentrating when I want to.',
            'I have a great deal of difficulty in concentrating when I want to.',
            'I cannot concentrate at all.',
        ]},
        { title: 'Work', options: [
            'I can do as much work as I want to.',
            'I can only do my usual work, but no more.',
            'I can do most of my usual work, but no more.',
            'I cannot do my usual work.',
            'I can hardly do any work at all.',
            "I can't do any work at all.",
        ]},
        { title: 'Driving', options: [
            'I drive my car without any neck pain.',
            'I can drive my car as long as I want with slight pain in my neck.',
            'I can drive my car as long as I want with moderate pain in my neck.',
            "I can't drive my car as long as I want because of moderate pain in my neck.",
            'I can hardly drive my car at all because of severe pain in my neck.',
            "I can't drive my car at all.",
        ]},
        { title: 'Sleeping', options: [
            'I have no trouble sleeping.',
            'My sleep is slightly disturbed (less than 1 hr. sleepless).',
            'My sleep is moderately disturbed (1-2 hrs. sleepless).',
            'My sleep is moderately disturbed (2-3 hrs. sleepless).',
            'My sleep is greatly disturbed (3-4 hrs. sleepless).',
            'My sleep is completely disturbed (5-7 hrs. sleepless).',
        ]},
        { title: 'Recreation', options: [
            'I am able to engage in all my recreation activities with no neck pain at all.',
            'I am able to engage in all my recreation activities, with some pain in my neck.',
            'I am able to engage in most, but not all of my usual recreation activities because of pain in my neck.',
            'I am able to engage in a few of my usual recreation activities because of pain in my neck.',
            'I can hardly do any recreation activities because of pain in my neck.',
            "I can't do any recreation activities at all.",
        ]},
    ]

    const responses = watch()

    const calculateNDI = () => {
        let total = 0
        let answered = 0
        ndiSections.forEach((section, idx) => {
            const v = parseInt(responses[`ndi_${idx}`])
            if (!isNaN(v)) {
                total += v
                answered++
            }
        })
        if (answered === 0) return null
        const percent = ((total / (answered * 5)) * 100).toFixed(2)
        return `${total} / ${answered * 5} (${percent}%)`
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1 }}>
                <FormsHeaderText text="Neck Disability Index (NDI)" />
                <IconButton onClick={closeForm}><CloseIcon fontSize="small" /></IconButton>
            </Box>

           
           <Grid container spacing={2} mb={2}>
                <Grid item xs={12} md={4}>
                    <Input label="Patient's Name" name="patientName" register={register('patientName')} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Input label="Patient Number" name="patientNumber" register={register('patientNumber')} fullWidth />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Input label="Date" type="date" name="date" register={register('date')} fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                {ndiSections.map((section, idx) => (
                    <Grid item xs={12} key={idx}>
                        <Typography variant="h6">{idx + 1}. {section.title}</Typography>
                        <RadioGroup {...register(`ndi_${idx}`)}>
                            {section.options.map((opt, i) => (
                                <FormControlLabel key={i} value={i} control={<Radio />} label={opt} />
                            ))}
                        </RadioGroup>
                    </Grid>
                ))}
            </Grid>

            <Box mt={2}><Typography>NDI Score: {calculateNDI() || 'Incomplete'}</Typography></Box>

            {/* Comments */}
            <Box mt={3}>
                <Textarea label="Comments" rows={3} register={register('comments')} />
            </Box>

            <Box ml={2} mt={4}>
                <RadioGroup row aria-label="document-status" name="status" value={docStatus} onChange={handleChangeStatus}>
                    <FormControlLabel value="Draft" control={<Radio {...register('status')} />} label="Draft" />
                    <FormControlLabel value="Final" control={<Radio {...register('status')} />} label="Final" />
                </RadioGroup>
            </Box>

            <Grid item xs={12}><GlobalCustomButton onClick={handleSubmit(onSubmit)}>Submit NDI</GlobalCustomButton></Grid>
        </Box>
    )
}

export default NeckDisabilityIndexForm
