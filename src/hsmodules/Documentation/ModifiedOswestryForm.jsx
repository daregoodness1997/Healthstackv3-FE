import {
    Grid,
    Box,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { FormsHeaderText } from '../../components/texts'
import GlobalCustomButton from '../../components/buttons/CustomButton'
import CloseIcon from '@mui/icons-material/Close'
import React, { useContext, useEffect, useState } from 'react'
import { ObjectContext, UserContext } from '../../context'
import client from '../../feathers'
import { toast } from 'react-toastify'
import Input from '../../components/inputs/basic/Input'

const ModifiedOswestryForm = () => {
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
        document.documentname = 'Modified Oswestry'
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

        if (!!draftDoc && draftDoc.status === "Draft") {
                     ClientServ.patch(draftDoc._id, document)
                       .then(() => {
                         Object.keys(data).forEach((key) => {
                           data[key] = "";
                         });
               
                         setDocStatus("Draft");
               
                         toast.success("Documentation updated succesfully");
                         reset(data);
                        //  setConfirmationDialog(false);
                        closeForm()
                         hideActionLoader();
                       })
                       .catch((err) => {
                         toast.error("Error updating Documentation " + err);
                         hideActionLoader();
                       });
               } else {
       
               await ClientServ.create(document)
                   .then(() => {
                       toast.success('Document created successfully')
                       reset(data)
                       closeForm()
                   })
                   .catch(err => toast.error('Error creating Document ' + err))
               hideActionLoader()
               }
           }
       

    const sections = [
        {
            title: 'Pain Intensity',
            options: [
                'I can tolerate the pain I have without having to use pain medication.',
                'The pain is bad, but I can manage without having to take pain medication.',
                'Pain medication provides me with complete relief from pain.',
                'Pain medication provides me with moderate relief from pain.',
                'Pain medication provides me with little relief from pain.',
                'Pain medication has no effect on my pain.',
            ],
        },
        {
            title: 'Personal Care',
            options: [
                'I can take care of myself normally without causing increased pain.',
                'I can take care of myself normally, but it increases my pain.',
                'It is painful to take care of myself, and I am slow and careful.',
                'I need help, but I am able to manage most of my personal care.',
                'I need help every day in most aspects of my care.',
                'I do not get dressed, I wash with difficulty, and I stay in bed.',
            ],
        },
        {
            title: 'Lifting',
            options: [
                'I can lift heavy weights without increased pain.',
                'I can lift heavy weights, but it causes increased pain.',
                'Pain prevents me from lifting heavy weights off the floor, but I can manage if the weights are conveniently positioned.',
                'Pain prevents me from lifting heavy weights, but I can manage light to medium weights if they are conveniently positioned.',
                'I can lift only very light weights.',
                'I cannot lift or carry anything at all.',
            ],
        },
        {
            title: 'Walking',
            options: [
                'Pain does not prevent me from walking any distance.',
                'Pain prevents me from walking more than 1 mile.',
                'Pain prevents me from walking more than 1/2 mile.',
                'Pain prevents me from walking more than 1/4 mile.',
                'I can walk only with crutches or a cane.',
                'I am in bed most of the time and have to crawl to the toilet.',
            ],
        },
        {
            title: 'Sitting',
            options: [
                'I can sit in any chair as long as I like.',
                'I can only sit in my favorite chair as long as I like.',
                'Pain prevents me from sitting for more than 1 hour.',
                'Pain prevents me from sitting for more than 1/2 hour.',
                'Pain prevents me from sitting for more than 10 minutes.',
                'Pain prevents me from sitting at all.',
            ],
        },
        {
            title: 'Standing',
            options: [
                'I can stand as long as I want without increased pain.',
                'I can stand as long as I want, but it increases my pain.',
                'Pain prevents me from standing for more than 1 hour.',
                'Pain prevents me from standing for more than 1/2 hour.',
                'Pain prevents me from standing for more than 10 minutes.',
                'Pain prevents me from standing at all.',
            ],
        },
        {
            title: 'Sleeping',
            options: [
                'Pain does not prevent me from sleeping well.',
                'I can sleep well only by using pain medication.',
                'Even when I take medication, I sleep less than 6 hours.',
                'Even when I take medication, I sleep less than 4 hours.',
                'Even when I take medication, I sleep less than 2 hours.',
                'Pain prevents me from sleeping at all.',
            ],
        },
        {
            title: 'Social Life',
            options: [
                'My social life is normal and does not increase my pain.',
                'My social life is normal, but it increases my level of pain.',
                'Pain prevents me from participating in more energetic activities.',
                'Pain prevents me from going out very often.',
                'Pain has restricted my social life to my home.',
                'I have hardly any social life because of my pain.',
            ],
        },
        {
            title: 'Traveling',
            options: [
                'I can travel anywhere without increased pain.',
                'I can travel anywhere, but it increases my pain.',
                'My pain restricts my travel over 2 hours.',
                'My pain restricts my travel over 1 hour.',
                'My pain restricts my travel to short necessary journeys under 1/2 hour.',
                'My pain prevents all travel except for visits to the physician / therapist or hospital.',
            ],
        },
        {
            title: 'Employment / Homemaking',
            options: [
                'My normal homemaking / job activities do not cause pain.',
                'My normal homemaking / job activities increase my pain, but I can still perform all that is required of me.',
                'I can perform most of my homemaking / job duties, but pain prevents me from performing more physically stressful activities.',
                'Pain prevents me from doing anything but light duties.',
                'Pain prevents me from doing even light duties.',
                'Pain prevents me from performing any job or homemaking chores.',
            ],
        },
    ]

    const responses = watch()

    const calculateScore = () => {
        let total = 0
        let answered = 0
        sections.forEach((section, idx) => {
            const val = parseInt(responses[`oswestry_${idx}`])
            if (!isNaN(val)) {
                total += val
                answered++
            }
        })
        if (answered === 0) return null
        const maxScore = answered * 5
        const percent = ((total / maxScore) * 100).toFixed(2)
        return `${total} / ${maxScore} (${percent}%)`
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1 }}>
                <FormsHeaderText text="Modified Oswestry Low Back Pain Disability Questionnaire" />
                <IconButton onClick={closeForm}><CloseIcon fontSize="small" /></IconButton>
            </Box>

            <Grid container spacing={2} mb={2}>
                          <Grid item xs={12} md={4}>
                              <Input label="Patient's Name" name="patientName" register={register('patientName')} />
                          </Grid>
                          <Grid item xs={12} md={4}>
                              <Input label="Date" type="date" name="date" register={register('date')} fullWidth InputLabelProps={{ shrink: true }} />
                          </Grid>
                      </Grid>

            <Grid container spacing={2}>
                {sections.map((section, idx) => (
                    <Grid item xs={12} key={idx}>
                        <Typography variant="h6">{section.title}</Typography>
                        <RadioGroup {...register(`oswestry_${idx}`)}>
                            {section.options.map((opt, i) => (
                                <FormControlLabel key={i} value={i} control={<Radio />} label={opt} />
                            ))}
                        </RadioGroup>
                    </Grid>
                ))}
            </Grid>

            <Box mt={2}>
                <Typography variant="body1">Oswestry Score: {calculateScore() || 'Incomplete'}</Typography>
            </Box>

            <Box ml={2} mt={4}>
                <RadioGroup row aria-label="document-status" name="status" value={docStatus} onChange={handleChangeStatus}>
                    <FormControlLabel value="Draft" control={<Radio {...register('status')} />} label="Draft" />
                    <FormControlLabel value="Final" control={<Radio {...register('status')} />} label="Final" />
                </RadioGroup>
            </Box>

            <Grid item xs={12}><GlobalCustomButton onClick={handleSubmit(onSubmit)}>Submit Oswestry</GlobalCustomButton></Grid>
        </Box>
    )
}

export default ModifiedOswestryForm
