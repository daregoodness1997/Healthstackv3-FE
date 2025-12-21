import { useContext, useState } from 'react'
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
import { useEffect } from 'react'
import GroupedRadio from '../../components/inputs/basic/Radio/GroupedRadio'

const SleepQuestionnaire = () => {
    const { state, setState, showActionLoader, hideActionLoader } =
        useContext(ObjectContext)
    const [confirmDialog, setConfirmDialog] = useState(false)
    const { register, handleSubmit, setValue, reset, control } = useForm() //, watch, errors, reset
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
        document.documentname = 'Sleep Questionnaire'
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

        // console.log(document)

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
                    toast.success('Sleep Questionnaire updated succesfully')
                    closeEncounterRight()
                })
                .catch(err => {
                    hideActionLoader()
                    setConfirmDialog(false)
                    toast.error('Error updating Sleep Questionnaire ' + err)
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
                    toast.success('Sleep Questionnaire created succesfully')
                    closeEncounterRight()
                })
                .catch(err => {
                    setConfirmDialog(false)
                    hideActionLoader()
                    toast.error('Error creating Sleep Questionnaire ' + err)
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
                    message="You're about to create an Sleep Questionnaire Document"
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                    mb={1}
                >
                    <FormsHeaderText text="Sleep Questionnaire" />

                    <IconButton onClick={closeEncounterRight}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <>
                    {/* Patient Info  */}
                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                color: '#0364FF',
                                textTransform: 'uppercase',
                                mb: 1,
                            }}
                        >
                            SLEEP-WAKE SCHEDULE
                        </Typography>
                    </Grid>

                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Input
                                name={'bedtime'}
                                register={register('bedtime')}
                                type="date"
                                label="What is your bedtime?"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                name={'waketime'}
                                register={register('waketime')}
                                type="date"
                                label="Awakening time?"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'alarmClock'}
                                    label="Do you use an alarm clock?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'wakeAtNight'}
                                    label="Do you wake up during the night?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('noOfWakingUpTimes')}
                                type="text"
                                label="If yes, how many times per night?"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('durationOfWakingUpTimes')}
                                type="text"
                                label="For how long? "
                            />
                        </Grid>

                        {/* Physician Info  */}
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
                                DISTURBED SLEEP
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'snore'}
                                    label="Do you snore?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'lostBedPartner'}
                                    label="Have you lost your bed partner because of your snoring?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'breathPauses'}
                                    label="Have your breathing pauses been observed?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'limbKicks'}
                                    label="Have you ever been told that your limbs kick or twitch?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'sleepTalk'}
                                    label="Do you talk in your sleep?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'sleepWalk'}
                                    label="Do you walk in your sleep?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'sleepAct'}
                                    label="Do you act out vivid or violent dreams in your sleep?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Sleep Services  */}
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
                            Insomnia
                        </Typography>
                    </Grid>

                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'troubleSleeping'}
                                    label="Do you have trouble falling asleep?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('durationToSleep')}
                                type="text"
                                label="If, yes how long does it take you?"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('insomniaWeeklyCount')}
                                type="text"
                                label="How many nights per week?"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'troubleFallingBackAsleep'}
                                    label="If you wake up in the night, do you have trouble falling back asleep?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('durationToFallBackAsleep')}
                                type="text"
                                label="If, yes how long does it take you?"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register(
                                    'troubleFallingBackAsleepWeeklyCount',
                                )}
                                type="text"
                                label="How many nights per week?"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'unfamiliarEnv'}
                                    label="Do you sleep better in an unfamiliar bedroom (such as a hotel room)?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'achingSensationBeforeSleep'}
                                    label="Do you have an aching or squirmy sensation in your legs that stops you from sleeping?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'lightSleeper'}
                                    label="Are you a light sleeper (easily awakened)?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Medical History */}
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
                            DAYTIME SLEEPINESS
                        </Typography>
                    </Grid>

                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'daytimeTiredness'}
                                    label="Are you sleepy or tired all day?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'sleepWatchingTV'}
                                    label="Do you fall asleep watching TV or reading?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'sleepAtInappropriateTimes'}
                                    label="Have you ever fallen asleep at an inappropriate time (such as meetings, conversations, etc.)?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'accidentFromSleepiness'}
                                    label="Have you ever had accidents or near-accidents because of sleepiness?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'suddenAlertness'}
                                    label="Have you ever “come to” or become alert suddenly and you were doing things without being aware of having started them or remembering how you got there?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'suddenWeakness'}
                                    register={register('suddenWeakness')}
                                    label="Have you experienced sudden weakness in your body or legs while awake, perhaps after being startled or in an emotional situation?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'hallucinations'}
                                    label="Have you ever had hallucinations or dream like images while awake?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'dayNaps'}
                                    label="Do you take naps during the day?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('weeklyNoOfNapTimes')}
                                type="text"
                                label="If yes, how many times per week?"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('durationOfNapTimes')}
                                type="text"
                                label="How long are the naps?"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'refreshingNaps'}
                                    label="If yes, are your naps refreshing?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'dreamDuringNaps'}
                                    label="If yes, do you dream during your naps?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'oftenSleepAsAdolescent'}
                                    label="Did you fall asleep, or often fight the urge to sleep in school as a child/adolescent?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
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
                                PAST SLEEP HISTORY
                            </Typography>
                        </Grid>

                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Box>
                                    <GroupedRadio
                                        control={control}
                                        name={'childhoodSleepProblems'}
                                        label="Did your current sleep problem begin in your childhood years?"
                                        options={['Yes', 'No']}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box>
                                    <GroupedRadio
                                        control={control}
                                        name={'hyperActiveAsKid'}
                                        label="Were you considered hyperactive or hyperkinetic as a child/teen (Attention Deficit Disorder)?"
                                        options={['Yes', 'No']}
                                    />
                                </Box>
                            </Grid>
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

export default SleepQuestionnaire
