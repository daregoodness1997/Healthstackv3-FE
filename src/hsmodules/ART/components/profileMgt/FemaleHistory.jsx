import { Box, Typography,Grid } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import Input from '../../../../components/inputs/basic/Input'
import client from '../../../../feathers'
import { ObjectContext, UserContext } from '../../../../context'
import { useContext } from 'react'
import { toast } from 'react-toastify'

const FemaleHistory = () => {
    const [stage, setStage] = useState(1)
    const { register, handleSubmit} = useForm()
    const femaleHxServ = client.service("clinicaldocument")
    const {state, setState,showActionLoader, hideActionLoader } = useContext(ObjectContext)
    const { user } = useContext(UserContext)

    const handleNext = () => {
        setStage(prevStage => prevStage + 1)
    }

    const handleBack = () => {
        setStage(prevStage => prevStage - 1)
    }

    const onSubmit = async (data) => {
        showActionLoader(); 
        const femaleHistoryData = {
            // patientId: state.ARTModule.selectedFamilyProfile._id, 
            // facilityId: user.currentEmployee.facilityDetail._id,
            // profileid: state.ARTModule.selectedFamilyProfile._id,
            femaleHistory: [{
                menarche: data.menarche,
                lmp: data.lmp,
                ketamenia: data.ketamenia,
                pelvicInfectionHistory: data.pelvicInfectionHistory,
                pelvicSurgeryHistory: data.pelvicSurgeryHistory,
                pregnancyHistory: data.pregnancyHistory,
                pregnancyHistoryMiscarriage: data.pregnancyHistoryMiscarriage,
                pregnancyHistoryDeliveries: data.pregnancyHistoryDeliveries,
                noOfLiveChildren: data.noOfLiveChildren,
                medicalIllnessHistory: data.medicalIllnessHistory,
                surgicalInterventionHistory: data.surgicalInterventionHistory,
                currentMedication: data.currentMedication,
                smokingHistory: data.smokingHistory,
                breastMilkDischargeHistory: data.breastMilkDischargeHistory,
                alcoholUseHistory: data.alcoholUseHistory,
            }],
            femaleInvestigations: [
               { hsg: data.hsg,
                laparoscopy: data.laparoscopy,
                sonohysterogram: data.sonohysterogram,
                hsysteroscopy: data.hsysteroscopy,
                hormonalProfile: data.hormonalProfile,
                }
            ], 
        fertilityTreatments: [
            {
                clompheneAndIntercourse: data.clompheneAndIntercourse,
                clompheneAndInsemination: data.clompheneAndInsemination,
                ivf: data.ivf,
                Icsi: data.Icsi,
                date: data.date
            }
        ],
        }

        const document = {
            facility: user.currentEmployee?.facilityDetail._id,
            facilityname: user.currentEmployee?.facilityDetail.facilityName,
            documentdetail: femaleHistoryData,
            documentname: "Female History",
            location: `${state.employeeLocation.locationName} ${state.employeeLocation.locationType}`,
            client: state.ARTModule.selectedFamilyProfile._id,
            clientname: `${state.ARTModule.selectedFamilyProfile.name}`,
            clientobj: state.ARTModule.selectedFamilyProfile,
            createdBy: user._id,
            createdByname: `${user.firstname} ${user.lastname}`,
            status: "completed"
          };

        try {
              await femaleHxServ.create(document);
              toast.success("Female history create successfully");
          } catch (err) {
            toast.error("Error submitting Female history: " + err);
          } finally {
            hideActionLoader();
          }
    }

    const historyData = [
        { label: 'Menarche:', name: 'menarche' },
        { label: 'L.M.P:', name: 'lmp' },
        { label: 'Ketamenia:', name: 'ketamenia' },
        { label: 'History of pelvic infection:', name: 'pelvicInfectionHistory' },
        { label: 'History of pelvic surgery:', name: 'pelvicSurgeryHistory' },
        { label: 'History of pregnancy:', name: 'pregnancyHistory' },
        { label: 'History of pregnancy- Miscarriage:', name: 'pregnancyHistoryMiscarriage' },
        { label: 'History of pregnancy- Deliveries:', name: 'pregnancyHistoryDeliveries' },
        { label: 'Number of live children:', name: 'noOfLiveChildren' },
        { label: 'History of medical illness:', name: 'medicalIllnessHistory' },
        { label: 'History of surgical intervention:', name: 'surgicalInterventionHistory' },
        { label: 'Any current medication:', name: 'currentMedication' },
        { label: 'History of smoking:', name: 'smokingHistory' },
        { label: 'History of milk discharge from breast:', name: 'breastMilkDischargeHistory' },
        { label: 'History of alcohol use:', name: 'alcoholUseHistory' },
    ]

    const investigationsData = [
        { label: 'HSG:', name: 'hsg' },
        { label: 'Laparoscopy:', name: 'laparoscopy' },
        { label: 'Sonohysterogram:', name: 'sonohysterogram' },
        { label: 'Hsysteroscopy:', name: 'hsysteroscopy' },
        { label: 'Hormonal profile:', name: 'hormonalProfile' },
    ]

    const fertilityTreatmentsData = [
        { label: 'Clomphene + Intercourse:', name: 'ClompheneAndIntercourse' },
        { label: 'Climphere + Insemination:', name: 'ClimphereAndInsemination' },
        { label: 'IVF/ICSI:', name: 'ivfAndIsci' },
        { label: 'Date:', name: 'date', type: 'date' }, 
    ]

    const StageOne = () => (
        <Box component="div">
            <Typography
                component="h3"
                sx={{
                    fontWeight: 'bold',
                    fontSize: 28,
                    mb: 2,
                }}
            >
                Female History
            </Typography>

            <Box>
                {historyData.map(item => (
                    <Box
                        key={item.label}
                        component="div"
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                    >
                          <Grid container spacing={1} justifyContent="center" alignItems="center" key={item.label}>
                        <Grid item xs={12}>
                        <Input register={register(item.name)} type="text" label={item.label} />
                        </Grid>
                        </Grid>
                    </Box>
                ))}
                <Box
                    component="div"
                    sx={{
                        display: 'flex',
                        alignItems: 'items-center',
                        justifyContent: 'end',
                        mt: 2,
                    }}
                >
                    <GlobalCustomButton
                        sx={{ ml: 1 }}
                        onClick={handleSubmit(handleNext)} 
                    >
                        Next
                    </GlobalCustomButton>
                </Box>
            </Box>
        </Box>
    )

    const StageTwo = () => (
        <Box component="div">
            <Typography
                component="h3"
                sx={{
                    fontWeight: 'bold',
                    fontSize: 28,
                    mb: 2,
                }}
            >
                Female Investigations
            </Typography>

            <Box>
                {investigationsData.map(item => (
                   <Box
                   key={item.label}
                   component="div"
                   sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
               >
                     <Grid container spacing={1} justifyContent="center" alignItems="center" key={item.label}>
                   <Grid item xs={12}>
                   <Input register={register(item.name)} type="text" label={item.label} />
                   </Grid>
                   </Grid>
               </Box>
                ))}
            </Box>

            <Typography
                component="h3"
                sx={{
                    fontWeight: 'bold',
                    fontSize: 28,
                    my: 2,
                }}
            >
                Fertility Treatments
            </Typography>

            <Box>
                {fertilityTreatmentsData.map(item => (
                   <Box
                   key={item.label}
                   component="div"
                   sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
               >
                     <Grid container spacing={1} justifyContent="center" alignItems="center" key={item.label}>
                   <Grid item xs={12}>
                   <Input register={register(item.name)} type={item.type || 'text'} label={item.label} /> 
                   </Grid>
                   </Grid>
               </Box>
                ))}
                <Box
                    component="div"
                    sx={{
                        display: 'flex',
                        alignItems: 'items-center',
                        justifyContent: 'end',
                    }}
                >
                    <GlobalCustomButton onClick={() => handleBack()}>Back</GlobalCustomButton>
                    <GlobalCustomButton sx={{ ml: 1 }} onClick={handleSubmit(onSubmit)}>Save</GlobalCustomButton>
                </Box>
            </Box>
        </Box>
    )

    return (
        <Box component="div">
            {stage === 1 && <StageOne />}
            {stage === 2 && <StageTwo />}
        </Box>
    )
}

export default FemaleHistory
