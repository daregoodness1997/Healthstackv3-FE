import { Box, Grid, Typography } from '@mui/material'
import Input from '../../components/inputs/basic/Input'
import GlobalCustomButton from '../../components/buttons/CustomButton'

export default function ViewRadRequest({ data, setModalOpen }) {
    console.log('this is the data', data)
    return (
        <Box>
            <Box
                container
                sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
                mb={1.5}
            >
                <GlobalCustomButton
                    text="Add Rad Request"
                    onClick={() => setModalOpen(true)}
                    customStyles={{
                        float: 'right',
                        marginLeft: 'auto',
                    }}
                />
            </Box>

            <Box>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <Input
                            type="text"
                            label="Client"
                            defaultValue={data.client}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            type="text"
                            label="Created By"
                            defaultValue={data.createdByname}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            type="text"
                            label="Created At"
                            defaultValue={data.createdAt.split('T')[0]}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            type="text"
                            label="Status"
                            defaultValue={data.status}
                            disabled
                        />
                    </Grid>
                    <Grid container ml={1} mt={1}>
                        <Typography sx={{ fontSize: '0.8rem' }}>
                            Details
                        </Typography>
                        {data.documentdetail.map(item => (
                            <Grid item xs={12} key={item.medication}>
                                <Input
                                    type="text"
                                    defaultValue={item.medication}
                                    disabled
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
