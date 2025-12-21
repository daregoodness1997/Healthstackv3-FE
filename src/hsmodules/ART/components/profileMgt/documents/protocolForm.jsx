import { Box, Stack, Grid, FormControlLabel, RadioGroup, Radio } from '@mui/material'
import Input from '../../../../../components/inputs/basic/Input'
import CustomSelect from '../../../../../components/inputs/basic/Select'
import Textarea from '../../../../../components/inputs/basic/Textarea'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { FormsHeaderText } from '../../../../../components/texts'


const ProtocolForm = ({ 
  control, 
  register, 
  medicationFields, 
  allergyFields, 
  follicleFields, 
  oocyteFields, 
  embryoFields, 
  transferredFields, 
  handleAddItem, 
  handleRemoveItem, 
  docStatus, 
  handleChangeStatus,
  showMedication ,
    showAllergies,
    showFollicle,
    showOocyte,
    showEmbryo,
    showTransferred,
    showAdditionalFields
}) => {
  
  return (
    <Box mt={2}>
      {showMedication && (
        <Box mt={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" paddingBlock={2} spacing={2}>
            <FormsHeaderText text="Medication" />
            <Stack direction="row" spacing={1}>
              <AddCircleOutlineOutlinedIcon
                fontSize="small" 
                sx={{ cursor: 'pointer' }}
                onClick={() => handleAddItem('Medication')}
              />
            </Stack>
          </Stack>
          {medicationFields?.map((field, index) => (
            <Box key={field.id} mt={1}>
              <Grid container spacing={1} justifyContent="center" alignItems="center">
                <Grid item xs={11}>
                  <Input
                    register={register(`medications.${index}.value`)}
                    label={`Medication ${index + 1}`}
                    placeholder="Enter medication"
                    type="text"
                  />
                </Grid>
                <Grid item xs={1}>
                  <RemoveCircleOutlineOutlinedIcon 
                    fontSize="small" 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveItem('Medication', index)}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      {showAllergies && (
        <Box mt={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" paddingBlock={2} spacing={2}>
            <FormsHeaderText text="Allergies" />
            <Stack direction="row" spacing={1}>
              <AddCircleOutlineOutlinedIcon
                fontSize="small" 
                sx={{ cursor: 'pointer' }}
                onClick={() => handleAddItem('Allergies')}
              />
            </Stack>
          </Stack>
          {allergyFields?.map((field, index) => (
            <Box key={field.id} mt={1}>
              <Grid container spacing={1} justifyContent="center" alignItems="center">
                <Grid item xs={11}>
                  <Input
                    register={register(`allergies.${index}.value`)}
                    label={`Allergies ${index + 1}`}
                    placeholder="Enter allergies"
                    type="text"
                  />
                </Grid>
                <Grid item xs={1}>
                  <RemoveCircleOutlineOutlinedIcon 
                    fontSize="small" 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveItem('Allergies', index)}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      {showFollicle && (
        <Box mt={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" paddingBlock={2} spacing={2}>
            <FormsHeaderText text="Follicle" />
            <Stack direction="row" spacing={1}>
              <AddCircleOutlineOutlinedIcon
                fontSize="small" 
                sx={{ cursor: 'pointer' }}
                onClick={() => handleAddItem('Follicle')}
              />
            </Stack>
          </Stack>
          {follicleFields?.map((field, index) => (
            <Box key={field.id} mt={1}>
              <Grid container spacing={1} justifyContent="center" alignItems="center">
                <Grid item xs={11}>
                  <Input
                    register={register(`follicles.${index}.value`)}
                    label={`Follicle ${index + 1}`}
                    type="text"
                    placeholder="Enter follicle"
                  />
                </Grid>
                <Grid item xs={1}>
                  <RemoveCircleOutlineOutlinedIcon 
                    fontSize="small" 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveItem('Follicle', index)}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      {showOocyte && (
        <Box mt={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" paddingBlock={2} spacing={2}>
            <FormsHeaderText text="Oocyte" />
            <Stack direction="row" spacing={1}>
              <AddCircleOutlineOutlinedIcon
                fontSize="small" 
                sx={{ cursor: 'pointer' }}
                onClick={() => handleAddItem('Oocyte')}
              />
            </Stack>
          </Stack>
          {oocyteFields?.map((field, index) => (
            <Box key={field.id} mt={1}>
              <Grid container spacing={1} justifyContent="center" alignItems="center">
                <Grid item xs={11}>
                  <Input
                    register={register(`oocytes.${index}.value`)}
                    label={`Oocyte ${index + 1}`}
                    type="text"
                    placeholder="Enter oocyte"
                  />
                </Grid>
                <Grid item xs={1}>
                  <RemoveCircleOutlineOutlinedIcon 
                    fontSize="small" 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveItem('Oocyte', index)}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      {showEmbryo && (
        <Box mt={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" paddingBlock={2} spacing={2}>
            <FormsHeaderText text="Embryo" />
            <Stack direction="row" spacing={1}>
              <AddCircleOutlineOutlinedIcon
                fontSize="small" 
                sx={{ cursor: 'pointer' }}
                onClick={() => handleAddItem('Embryo')}
              />
            </Stack>
          </Stack>
          {embryoFields?.map((field, index) => (
            <Box key={field.id} mt={1}>
              <Grid container spacing={1} justifyContent="center" alignItems="center">
                <Grid item xs={11}>
                  <Input
                    register={register(`embryos.${index}.value`)}
                    label={`Embryo ${index + 1}`}
                    type="text"
                    placeholder="Enter embryo"
                  />
                </Grid>
                <Grid item xs={1}>
                  <RemoveCircleOutlineOutlinedIcon 
                    fontSize="small" 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveItem('Embryo', index)}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      {showTransferred && (
        <Box mt={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" paddingBlock={2} spacing={2}>
            <FormsHeaderText text="Transferred" />
            <Stack direction="row" spacing={1}>
              <AddCircleOutlineOutlinedIcon
                fontSize="small" 
                sx={{ cursor: 'pointer' }}
                onClick={() => handleAddItem('Transferred')}
              />
            </Stack>
          </Stack>
          {transferredFields?.map((field, index) => (
            <Box key={field.id} mt={1}>
              <Grid container spacing={1} justifyContent="center" alignItems="center">
                <Grid item xs={11}>
                  <Input
                    register={register(`transferred.${index}.value`)}
                    label={`Transferred ${index + 1}`}
                    type="text"
                    placeholder="Enter transferred"
                  />
                </Grid>
                <Grid item xs={1}>
                  <RemoveCircleOutlineOutlinedIcon 
                    fontSize="small" 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveItem('Transferred', index)}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      {showAdditionalFields && (
        <Grid container spacing={2} paddingBlock={2}>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("score")}
              label="Score"
              name="score"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("donated")}
              label="Donated"
              name="donated"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("frozen")}
              label="Frozen"
              name="frozen"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("plan_for_treatment")}
              name="plan_for_treatment"
              label="Plan for Treatment"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("outcome_of_treatment")}
              name="outcome_of_treatment"
              label="Outcome of Treatment"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Textarea
              register={register("additional_information")}
              name="additional_information"
              label="Additional Information"
              rows={4}
              type="text"
            />
          </Grid>
          <RadioGroup
              row
              aria-label="document-status"
              name="status"
              value={docStatus}
              onChange={handleChangeStatus}
            >
              <FormControlLabel value="Draft" control={<Radio {...register("status")} />} label="Draft" />
              <FormControlLabel value="Final" control={<Radio {...register("status")} />} label="Final" />
            </RadioGroup>
    
        </Grid>
      )}
    </Box>
  );
};

export default ProtocolForm;

