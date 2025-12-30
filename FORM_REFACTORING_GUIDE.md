# Form Refactoring Guide

This guide provides a consistent pattern for refactoring all forms in modals to match the Organization form style from the sign-up flow.

## Standard Form Pattern

### 1. Imports
```jsx
import { Space, Typography, Divider } from 'antd';
import Input from '../../../../components/inputs/basic/Input';
import CustomSelect from '../../../../components/inputs/basic/Select';
import Textarea from '../../../../components/inputs/basic/Textarea';
import PasswordInput from '../../../../components/inputs/basic/Password';
import GlobalCustomButton from '../../../../components/buttons/CustomButton';

const { Text } = Typography;
```

### 2. Form Structure
```jsx
<div style={{ width: '100%' }}>
  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
    
    {/* Section Header (optional) */}
    <div>
      <Text
        strong
        style={{
          fontSize: '0.9rem',
          marginBottom: '0.5rem',
          display: 'block',
        }}
      >
        Section Title
      </Text>
    </div>

    {/* Single column inputs */}
    <Input
      label="Field Label"
      control={control}
      name="fieldName"
      errorText={errors?.fieldName?.message}
      placeholder="Enter value"
      important  // For required fields
    />

    {/* Two-column grid for paired fields */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <Input
        label="First Field"
        control={control}
        name="firstName"
        errorText={errors?.firstName?.message}
        placeholder="Enter first value"
        important
      />
      
      <Input
        label="Second Field"
        control={control}
        name="secondName"
        errorText={errors?.secondName?.message}
        placeholder="Enter second value"
      />
    </div>

    {/* Divider between sections */}
    <Divider style={{ margin: '8px 0' }} />

    {/* Another section */}
    <div>
      <Text strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
        Another Section
      </Text>
    </div>

    {/* Select dropdown */}
    <CustomSelect
      label="Select Field"
      control={control}
      name="selectField"
      errorText={errors?.selectField?.message}
      options={['Option 1', 'Option 2', 'Option 3']}
      placeholder="Select option"
      important
    />

    {/* Textarea */}
    <Textarea
      label="Description"
      control={control}
      name="description"
      errorText={errors?.description?.message}
      placeholder="Enter description"
      rows={4}
      important
    />

    {/* Password field */}
    <PasswordInput
      label="Password"
      control={control}
      name="password"
      errorText={errors?.password?.message}
      placeholder="Enter password"
      important
    />

    {/* Submit button */}
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
      <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
        Submit
      </GlobalCustomButton>
    </div>

  </Space>
</div>
```

## Key Refactoring Rules

### 1. **Replace MUI Components with Ant Design**
- Remove all `Box`, `Grid`, `TextField`, etc.
- Use `Space` for vertical spacing
- Use inline styles for grids: `display: 'grid', gridTemplateColumns: '1fr 1fr'`
- Use `Divider` for section separators

### 2. **Use Control Pattern (Not Register)**
```jsx
// ❌ OLD - register pattern
<Input
  label="Name"
  register={register("name", { required: "Name is required" })}
  errorText={errors?.name?.message}
/>

// ✅ NEW - control pattern
<Input
  label="Name"
  control={control}
  name="name"
  errorText={errors?.name?.message}
  important
/>
```

### 3. **Required Fields**
- Use `important` prop instead of `required`
- This shows "Required" badge instead of star
- Move validation to Yup schema

### 4. **Two-Column Layouts**
```jsx
// Use grid layout for paired fields
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
  <Input label="First" control={control} name="first" />
  <Input label="Second" control={control} name="second" />
</div>
```

### 5. **Section Headers**
```jsx
<div>
  <Text
    strong
    style={{
      fontSize: '0.9rem',
      marginBottom: '0.5rem',
      display: 'block',
    }}
  >
    Section Title
  </Text>
</div>
```

### 6. **Consistent Spacing**
- Use `Space` component with `direction="vertical"` and `size="middle"`
- Use `Divider` with `style={{ margin: '8px 0' }}` between sections

### 7. **Modal Footer**
```jsx
// In modal component
<ModalBox
  open={open}
  onClose={onClose}
  header="Form Title"
  footer={
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
      <GlobalCustomButton color="error" onClick={onClose}>
        Cancel
      </GlobalCustomButton>
      <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
        Save
      </GlobalCustomButton>
    </div>
  }
>
  {/* Form content */}
</ModalBox>
```

## Conversion Checklist

For each form in a modal:

- [ ] Replace MUI Grid with Space/inline grid
- [ ] Convert all inputs to control pattern
- [ ] Add `important` prop to required fields
- [ ] Group related fields in two-column grids
- [ ] Add section headers with Text component
- [ ] Add Dividers between major sections
- [ ] Move buttons to modal footer
- [ ] Remove inline validation, use Yup schema
- [ ] Update imports to Ant Design
- [ ] Test form submission and validation

## Common Patterns

### Client/Patient Forms
- Personal info (2-column): firstname, lastname, middlename, dob
- Contact info (2-column): phone, email, address
- Additional info: gender, blood group, etc.

### Appointment Forms
- Client selection (autocomplete)
- Date/time picker (2-column)
- Location/practitioner selection
- Appointment type/class
- Notes (textarea)

### Product/Inventory Forms  
- Product name, category (2-column)
- Base unit, quantity (2-column)
- Description (textarea)

### Employee/Admin Forms
- Personal info (2-column)
- Professional info (dropdowns)
- Contact info (2-column)
- Credentials (password fields)

## Files to Refactor

Priority files with forms in modals:
1. `/src/hsmodules/GlobalAdmin/LabRef/LabRefForm.jsx`
2. `/src/hsmodules/Admin/Facility.jsx` - FacilityModify
3. `/src/hsmodules/Admin/Employee.jsx` - EmployeeModify
4. `/src/hsmodules/Pharmacy/Products.jsx` - ProductModify
5. `/src/hsmodules/ManagedCare/externalPolicy.jsx` - ClientCreate
6. `/src/hsmodules/Appointment/*.jsx` - AppointmentCreate/Modify
7. `/src/hsmodules/Radiology/*.jsx` - RadAppointmentModify
8. `/src/hsmodules/Laboratory/Labs.jsx` - StoreModify
9. `/src/hsmodules/Documentation/*.jsx` - Various forms
10. `/src/hsmodules/Complaints/*.jsx` - ComplaintModify

## Example: Before and After

### Before (MUI with register)
```jsx
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>
    <TextField
      fullWidth
      label="First Name"
      {...register("firstname", { required: "Required" })}
      error={!!errors.firstname}
      helperText={errors.firstname?.message}
    />
  </Grid>
  <Grid item xs={12} md={6}>
    <TextField
      fullWidth
      label="Last Name"
      {...register("lastname", { required: "Required" })}
      error={!!errors.lastname}
      helperText={errors.lastname?.message}
    />
  </Grid>
</Grid>
```

### After (Ant Design with control)
```jsx
<Space direction="vertical" size="middle" style={{ width: '100%' }}>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
    <Input
      label="First Name"
      control={control}
      name="firstname"
      errorText={errors?.firstname?.message}
      placeholder="Enter first name"
      important
    />
    <Input
      label="Last Name"
      control={control}
      name="lastname"
      errorText={errors?.lastname?.message}
      placeholder="Enter last name"
      important
    />
  </div>
</Space>
```

## Notes

- This refactoring improves consistency, reduces code, and provides better UX
- All forms should look and behave similarly across the application
- Validation should be centralized in Yup schemas
- Required badges are clearer than asterisks for users
- Two-column layouts make better use of space
