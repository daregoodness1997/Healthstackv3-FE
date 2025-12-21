import { Box, Grid, Typography } from '@mui/material'
import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import Input from '../../../../components/inputs/basic/Input'
import { useForm } from 'react-hook-form'
import client from '../../../../feathers'
import { useContext } from 'react'
import { ObjectContext, UserContext } from '../../../../context'
import { toast } from 'react-toastify'


const MaleHistory = () => {
    const { register, handleSubmit} = useForm()
    const maleHxServ = client.service("clinicaldocument")
    const {state, setState,showActionLoader, hideActionLoader } = useContext(ObjectContext)
    const { user } = useContext(UserContext)

    const historyData = [
        {
            label: 'D.O.B/Age:',
            value: "dob",
            
        },
        {
            label: 'No. of pregnancies with previous partners?:',
            value: "noOfPregnancies",
            
        },
        {
            label: 'Any Erectile/Ejaculatory concerns::',
            value: "erectileOrEjaculatoryConcerns",
            
        },
        {
            label: 'Sperm count (mil/m):',
            value: "spermCount",
            
        },
        {
            label: 'Sperm motility:',
            value: "spermMotility",
            
        },
        {
            label: 'History of medical illness:',
            value: "medicalIllnessHistory",
           
        },
        {
            label: 'History of surgery in the past:',
            value: "pastSurgeryHistory",
            
        },
        {
            label: 'History of smoking:',
            value: "smokingHistory",
           
        },
        {
            label: 'History of alcohol:',
            value: "alcoholHistory",
           
        },
        {
            label: 'History of smoking:',
            value: "smokingHistory",
            
        },
    ]

    const onSubmit = async (data) => {
        showActionLoader(); 
        const maleHistoryData = {
            // patientId: state.ARTModule.selectedFamilyProfile._id, 
            // facilityId: user.currentEmployee.facilityDetail._id,
            // profileid: state.ARTModule.selectedFamilyProfile._id,
              dob: data.dob,
              noOfPregnancies: data.noOfPregnancies,
              erectileOrEjaculatoryConcerns: data.erectileOrEjaculatoryConcerns,
              spermCount: data.spermCount,
              spermMotility: data.spermMotility,
              medicalIllnessHistory: data.medicalIllnessHistory,
              pastSurgeryHistory: data.pastSurgeryHistory,
              smokingHistory: data.smokingHistory,
              alcoholHistory: data.alcoholHistory, 
        }

        const document = {
            facility: user.currentEmployee?.facilityDetail._id,
            facilityname: user.currentEmployee?.facilityDetail.facilityName,
            documentdetail: maleHistoryData,
            documentname: "Male History",
            location: `${state.employeeLocation.locationName} ${state.employeeLocation.locationType}`,
            client: state.ARTModule.selectedFamilyProfile._id,
            clientname: `${state.ARTModule.selectedFamilyProfile.name}`,
            clientobj: state.ARTModule.selectedFamilyProfile,
            createdBy: user._id,
            createdByname: `${user.firstname} ${user.lastname}`,
            status: "completed"
          };

        try {
            await maleHxServ.create(document);
            toast.success("Male history create successfully");
        } catch (err) {
          toast.error("Error submitting Male history: " + err);
        } finally {
          hideActionLoader();
        }
    }

    return (
        <Box component="div">
            <Typography
                component="h3"
                sx={{
                    fontWeight: 'bold',
                    fontSize: 28,
                    mb: 2,
                }}
            >
                Male History
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
                     <Input register={register(item.value)} type="text" label={item.label} />
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
                    {/* <GlobalCustomButton>CANCEL</GlobalCustomButton> */}
                    <GlobalCustomButton sx={{ ml: 1 }} onClick={handleSubmit(onSubmit)}>Save</GlobalCustomButton>
                </Box>
            </Box>
        </Box>
    )
}

export default MaleHistory
