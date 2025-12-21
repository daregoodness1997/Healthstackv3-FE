import {
    Grid,
    Box,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { FormsHeaderText } from '../../components/texts'
import GlobalCustomButton from '../../components/buttons/CustomButton'
import Input from '../../components/inputs/basic/Input'
import CustomSelect from '../../components/inputs/basic/Select'
import Textarea from '../../components/inputs/basic/Textarea'
import CloseIcon from '@mui/icons-material/Close'
import React, { useContext, useEffect, useState } from 'react'
import { ObjectContext, UserContext } from '../../context'
import client from '../../feathers'
import { toast } from 'react-toastify'

const MedicalScreenForm = () => {
    const { register, handleSubmit, reset,setValue } = useForm()
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
        document.documentname = 'Medical Screening'
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

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1 }}>
                <FormsHeaderText text="Medical Screening, History & LumboPelvic Evaluation" />
                <IconButton onClick={closeForm}><CloseIcon fontSize="small" /></IconButton>
            </Box>

          
            <FormsHeaderText text="Medical Screening" />
            <Grid container spacing={2} my={1}>
                <Grid item xs={12} md={6}><Input label="Name" name="name" register={register('name')} /></Grid>
                <Grid item xs={12} md={6}><Input label="Occupation" name="occupation" register={register('occupation')} /></Grid>
                <Grid item xs={12} md={6}><Input label="Age" type="number" name="age" register={register('age')} /></Grid>
                <Grid item xs={12} md={6}><CustomSelect label="Sex" name="sex" options={["Male", "Female"]} register={register('sex')} /></Grid>
            </Grid>
             <FormsHeaderText text="Medical History" />
            <Grid container spacing={2} mt={1}>
               
                <Grid item xs={12}><Textarea label="Past Diagnoses / Conditions" name="medicalHistory" rows={4} register={register('medicalHistory')} /></Grid>
                <Grid item xs={12}><Textarea label="Surgeries / Hospitalizations" name="surgeries" rows={3} register={register('surgeries')} /></Grid>
                <Grid item xs={12}><Textarea label="Injuries (fractures, sprains, etc.)" name="injuries" rows={3} register={register('injuries')} /></Grid>
            </Grid>
             <FormsHeaderText text="Recent Symptoms (last 3 months)" />
            <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                    <Textarea label="Symptoms" name="recentSymptoms" rows={4} register={register('recentSymptoms')} /></Grid>
            </Grid>
            <FormsHeaderText text="Lifestyle" />
            <Grid container spacing={2} mt={2}>
                
                <Grid item xs={12} md={6}><CustomSelect label="Do you smoke?" name="smoke" options={["Yes", "No"]} register={register('smoke')} /></Grid>
                <Grid item xs={12} md={6}><CustomSelect label="Do you drink alcohol?" name="alcohol" options={["Yes", "No"]} register={register('alcohol')} /></Grid>
                <Grid item xs={12}><Textarea label="Current Medications" name="medications" rows={3} register={register('medications')} /></Grid>
            </Grid>

           
            <FormsHeaderText text="History Interview" />
            <Grid container spacing={2}>
                <Grid item xs={12}><Input label="When did the problem start?" name="problemStart" register={register('problemStart')} /></Grid>
                <Grid item xs={12}><CustomSelect label="Related to injury?" name="relatedToInjury" options={["Yes", "No"]} register={register('relatedToInjury')} /></Grid>
                <Grid item xs={12}><Textarea label="Describe pain pattern" name="painPattern" rows={3} register={register('painPattern')} /></Grid>
                <Grid item xs={12}><Textarea label="How pain affects function" name="painEffect" rows={3} register={register('painEffect')} /></Grid>
                <Grid item xs={12}><Textarea label="What makes it worse / better?" name="painFactors" rows={3} register={register('painFactors')} /></Grid>
                <Grid item xs={12}><Textarea label="Past similar conditions & treatments" name="pastConditions" rows={3} register={register('pastConditions')} /></Grid>
                <Grid item xs={12}><Textarea label="Patient’s main concerns & goals" name="concernsGoals" rows={3} register={register('concernsGoals')} /></Grid>
            </Grid>


            <FormsHeaderText text="LumboPelvicEvaluation" />
            <Grid container spacing={2}>
                <Grid item xs={12}><Input label="Patient Complaint" name="complaint" register={register('complaint')} /></Grid>
                <Grid item xs={12}><Input label="Date of Onset" type="date" name="onsetDate" register={register('onsetDate')} /></Grid>
                <Grid item xs={12}><Textarea label="System Review" name="systemReview" rows={3} register={register('systemReview')} /></Grid>
                <Grid item xs={12}><Textarea label="Recent Medical Tests & Results" name="medicalTests" rows={3} register={register('medicalTests')} /></Grid>
                <Grid item xs={12}><Textarea label="Objective Findings (ROM, Palpation, etc.)" name="objectiveFindings" rows={3} register={register('objectiveFindings')} /></Grid>
                <Grid item xs={12}><Textarea label="Assessment / Problem List" name="assessment" rows={3} register={register('assessment')} /></Grid>
                <Grid item xs={12}><Textarea label="Diagnosis" name="diagnosis" rows={2} register={register('diagnosis')} /></Grid>
                <Grid item xs={12}><Textarea label="Treatment Plan" name="treatmentPlan" rows={4} register={register('treatmentPlan')} /></Grid>
            </Grid>

            <Box ml={2} mt={4}>
                <RadioGroup row aria-label="document-status" name="status" value={docStatus} onChange={handleChangeStatus}>
                    <FormControlLabel value="Draft" control={<Radio {...register('status')} />} label="Draft" />
                    <FormControlLabel value="Final" control={<Radio {...register('status')} />} label="Final" />
                </RadioGroup>
            </Box>

            <Grid item xs={12}><GlobalCustomButton onClick={handleSubmit(onSubmit)}>Submit Document</GlobalCustomButton></Grid>
        </Box>
    )
}

export default MedicalScreenForm
