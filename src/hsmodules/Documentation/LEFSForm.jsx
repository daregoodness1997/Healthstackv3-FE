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

const LEFSForm = () => {
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
        document.documentname = 'Lower Extremity Functional Scale'
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

    // LEFS Questions (20 items)
    const lefsQuestions = [
        'Any of your usual work, housework or school activities.',
        'Your usual hobbies, recreational or sporting activities.',
        'Getting into or out of the bath.',
        'Walking between rooms.',
        'Putting on your shoes or socks.',
        'Squatting.',
        'Lifting an object, like a bag of groceries from the floor.',
        'Performing light activities around your home.',
        'Performing heavy activities around your home.',
        'Getting into or out of a car.',
        'Walking 2 blocks.',
        'Walking a mile.',
        'Going up or down 10 stairs (about 1 flight of stairs).',
        'Standing for 1 hour.',
        'Sitting for 1 hour.',
        'Running on even ground.',
        'Running on uneven ground.',
        'Making sharp turns while running fast.',
        'Hopping.',
        'Rolling over in bed.',
    ]

    const responses = watch()

    const calculateLEFS = () => {
        const values = lefsQuestions.map((q, idx) => parseInt(responses[`lefs_${idx}`]) || 0)
        const valid = values.filter(v => v >= 0)
        if (valid.length < 20) return null
        const sum = valid.reduce((a, b) => a + b, 0)
        const percent = ((sum / 80) * 100).toFixed(2)
        return `${sum} / 80  (${percent}%)`
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1 }}>
                <FormsHeaderText text="Lower Extremity Functional Scale (LEFS)" />
                <IconButton onClick={closeForm}><CloseIcon fontSize="small" /></IconButton>
            </Box>

            {/* LEFS Questions */}
            <Grid container spacing={2}>
                {lefsQuestions.map((q, idx) => (
                    <Grid item xs={12} key={idx}>
                        <Typography>{idx + 1}. {q}</Typography>
                        <RadioGroup row {...register(`lefs_${idx}`)}>
                            {[0, 1, 2, 3, 4].map(v => (
                                <FormControlLabel key={v} value={v} control={<Radio />} label={v.toString()} />
                            ))}
                        </RadioGroup>
                    </Grid>
                ))}
            </Grid>

            <Box mt={2}>
                <Typography variant="body1">LEFS Score: {calculateLEFS() || 'Incomplete'}</Typography>
            </Box>

            <Box ml={2} mt={4}>
                <RadioGroup row aria-label="document-status" name="status" value={docStatus} onChange={handleChangeStatus}>
                    <FormControlLabel value="Draft" control={<Radio {...register('status')} />} label="Draft" />
                    <FormControlLabel value="Final" control={<Radio {...register('status')} />} label="Final" />
                </RadioGroup>
            </Box>

            <Grid item xs={12}><GlobalCustomButton onClick={handleSubmit(onSubmit)}>Submit LEFS</GlobalCustomButton></Grid>
        </Box>
    )
}

export default LEFSForm
