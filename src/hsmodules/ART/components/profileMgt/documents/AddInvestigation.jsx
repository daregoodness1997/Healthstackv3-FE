import { Box, Grid, Stack } from '@mui/material'
import { useState } from 'react'
import { FormsHeaderText } from '../../../../../components/texts'
import GlobalCustomButton from '../../../../../components/buttons/CustomButton'
import { AddCircleOutline } from '@mui/icons-material'
import CustomTable from '../../../../../components/customtable'
import ModalBox from '../../../../../components/modal'
import Input from '../../../../../components/inputs/basic/Input'

import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const AddInvestigation = ({
    schema,
    initialData = [],
    onDataInvestigationUpdate,
    showHeader = true,
    inputFields,
}) => {
    const [showModal, setShowModal] = useState(false)
    const { register, handleSubmit } = useForm();

    const handleShowModal = () => setShowModal(true)
    const handleHideModal = () => setShowModal(false)

    const handleSave = (formData) => {
        const updatedData = [...initialData, formData];
        onDataInvestigationUpdate(updatedData);
        handleHideModal();
        toast.success("Investigation added successfully");
    }

    return (
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                paddingBlock={2}
                spacing={2}
            >
                {showHeader && <FormsHeaderText text="Investigation" />}
                <GlobalCustomButton onClick={handleShowModal}>
                    <AddCircleOutline
                        fontSize="small"
                        sx={{ marginRight: '5px' }}
                    />
                    Add New Investigation
                </GlobalCustomButton>
            </Stack>

            <CustomTable
                title="Investigation"
                columns={schema}
                data={initialData}
                pointerOnHover
                highlightOnHover
                striped
                progressPending={false}
            />

            <ModalBox
                open={showModal}
                onClose={handleHideModal}
                header="Add New Investigation"
                width="60%"
            >
                <Box sx={{ width: '100%' }}>
                    <Box
                        mt={2}
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            py: '10px',
                        }}
                    >
                        <GlobalCustomButton onClick={handleSubmit(handleSave)}>
                            Save
                        </GlobalCustomButton>
                    </Box>
                    <Grid container spacing={2}>
                        {inputFields.map((field, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Input 
                                    register={register(field.name, { required: true })}
                                    name={field.name}
                                    label={field.label}
                                    type={field.type}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </ModalBox>
        </>
    )
}

export default AddInvestigation
