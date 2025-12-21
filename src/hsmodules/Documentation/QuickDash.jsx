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

const QuickDashForm = () => {
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
        document.documentname = 'QuickDash Outcome Measure'
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
                        //   setConfirmationDialog(false);
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
        

    // QuickDASH Questions
    const quickDashQuestions = [
        'Open a tight or new jar.',
        'Do heavy household chores (e.g., wash walls, floors).',
        'Carry a shopping bag or briefcase.',
        'Wash your back.',
        'Use a knife to cut food.',
        'Recreational activities with arm/shoulder/hand force (e.g., golf, hammering, tennis).',
        'Interference with normal social activities (past week).',
        'Limitation in work/daily activities (past week).',
        'Arm, shoulder or hand pain.',
        'Tingling (pins & needles) in arm, shoulder or hand.',
        'Difficulty sleeping due to arm/shoulder/hand pain.',
    ]

    const responses = watch()

    const calculateQuickDASH = () => {
        const values = quickDashQuestions.map((q, idx) => parseInt(responses[`quickdash_${idx}`]) || 0)
        const valid = values.filter(v => v > 0)
        if (valid.length < 10) return null
        const sum = valid.reduce((a, b) => a + b, 0)
        const score = ((sum / valid.length) - 1) * 25
        return score.toFixed(2)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1 }}>
                <FormsHeaderText text="QuickDASH Outcome Measure" />
                <IconButton onClick={closeForm}><CloseIcon fontSize="small" /></IconButton>
            </Box>

            {/* QuickDASH Section */}
            <Grid container spacing={2}>
                {quickDashQuestions.map((q, idx) => (
                    <Grid item xs={12} key={idx}>
                        <Typography>{idx + 1}. {q}</Typography>
                        <RadioGroup row {...register(`quickdash_${idx}`)}>
                            {[1, 2, 3, 4, 5].map(v => (
                                <FormControlLabel key={v} value={v} control={<Radio />} label={v.toString()} />
                            ))}
                        </RadioGroup>
                    </Grid>
                ))}
            </Grid>

            <Box mt={2}>
                <Typography variant="body1">QuickDASH Score: {calculateQuickDASH() || 'Incomplete'}</Typography>
            </Box>

            <Box ml={2} mt={4}>
                <RadioGroup row aria-label="document-status" name="status" value={docStatus} onChange={handleChangeStatus}>
                    <FormControlLabel value="Draft" control={<Radio {...register('status')} />} label="Draft" />
                    <FormControlLabel value="Final" control={<Radio {...register('status')} />} label="Final" />
                </RadioGroup>
            </Box>

            <Grid item xs={12}><GlobalCustomButton onClick={handleSubmit(onSubmit)}>Submit QuickDASH</GlobalCustomButton></Grid>
        </Box>
    )
}

export default QuickDashForm
