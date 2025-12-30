import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Input from '../../../components/inputs/basic/Input';
import CustomSelect from '../../../components/inputs/basic/Select';
import { ObjectContext, UserContext } from '../../../context';
import { yupResolver } from '@hookform/resolvers/yup';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import { Box } from '@mui/system';
import { GridBox } from '../../app/styles';
import PasswordInput from '../../../components/inputs/basic/Password';
import { createEmployeeSchema } from '../../GlobalAdmin/schema';
import { useCreateEmployee } from '../../../hooks/queries/useEmployees';

export const EmployeeForm = ({ open, setOpen }) => {
  const { user } = useContext(UserContext);
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);
  const createEmployee = useCreateEmployee();

  const professions = [
    'Medical Doctor',
    'Nurse',
    'Pharmacist',
    'Laboratory Scientist',
    'Radiographer',
    'Physiotherapist',
    'Dentist',
    'Optometrist',
    'Medical Records Officer',
    'Health Information Manager',
    'Administrator',
    'Accountant',
    'Human Resources Officer',
    'IT Specialist',
    'Other',
  ];

  const positions = [
    'Chief Executive Officer (CEO)',
    'Chief Medical Officer (CMO)',
    'Chief Nursing Officer (CNO)',
    'Medical Director',
    'Head of Department',
    'Senior Consultant',
    'Consultant',
    'Senior Registrar',
    'Registrar',
    'Medical Officer',
    'Administrator',
    'Manager',
    'Supervisor',
    'Officer',
    'Other',
  ];

  const departments = [
    'Administration',
    'Medical',
    'Nursing',
    'Pharmacy',
    'Laboratory',
    'Radiology',
    'Emergency',
    'Surgery',
    'Pediatrics',
    'Obstetrics & Gynecology',
    'Internal Medicine',
    'Orthopedics',
    'Cardiology',
    'Finance',
    'Human Resources',
    'IT',
    'Records',
    'Other',
  ];

  const departmentUnits = [
    'Executive',
    'Management',
    'Operations',
    'Clinical',
    'Support Services',
    'Administrative',
    'Technical',
    'Other',
  ];

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    control,
    formState: { isSubmitSuccessful, errors },
  } = useForm({
    resolver: yupResolver(createEmployeeSchema),
    defaultValues: {
      password: '',
      email: '',
    },
  });

  const submit = async (data) => {
    showActionLoader();
    
    const employeeData = {
      ...data,
      createdby: user._id,
      facility: user.currentEmployee.facility,
      imageurl: '',
      roles: ['Communication'],
    };

    try {
      await createEmployee.mutateAsync(employeeData);
      hideActionLoader();
      setOpen(false);
      reset();
    } catch (err) {
      hideActionLoader();
      toast.error(`Sorry, You weren't able to create an Employee. ${err}`);
    }
  };

  useEffect(() => {
    clearErrors();
  }, []);

  return (
    <Box>
      <form onSubmit={handleSubmit(submit)}>
        <GridBox>
          <Input
            control={control}
            name="firstname"
            type="text"
            label="First Name"
            errorText={errors?.firstname?.message}
            important
          />
          <Input
            control={control}
            name="lastname"
            type="text"
            label="Last Name"
            errorText={errors?.lastname?.message}
            important
          />

          <CustomSelect
            control={control}
            name="position"
            label="Position"
            options={positions}
            placeholder="Select position"
            errorText={errors?.position?.message}
            important
          />
        </GridBox>
        <GridBox>
          <CustomSelect
            control={control}
            name="profession"
            label="Profession"
            options={professions}
            placeholder="Select profession"
            errorText={errors?.profession?.message}
            important
          />

          <Input
            control={control}
            name="phone"
            type="tel"
            label="Phone No"
            errorText={errors?.phone?.message}
            important
          />
          <Input
            control={control}
            name="email"
            type="email"
            label="Email"
            errorText={errors?.email?.message}
            important
          />
        </GridBox>
        <GridBox>
          <CustomSelect
            control={control}
            name="department"
            label="Department"
            options={departments}
            placeholder="Select department"
            errorText={errors?.department?.message}
            important
          />
          <CustomSelect
            control={control}
            name="deptunit"
            label="Department Unit"
            options={departmentUnits}
            placeholder="Select unit"
            errorText={errors?.deptunit?.message}
          />
          <PasswordInput
            control={control}
            name="password"
            type="text"
            label="Password"
            errorText={errors?.password?.message}
            autoComplete="new-password"
            important
          />
        </GridBox>

        <Box display="flex" justifyContent="flex-end">
          <GlobalCustomButton
            type="submit"
            loading={createEmployee.isPending}
          >
            <ControlPointIcon fontSize="small" sx={{ marginRight: '5px' }} />
            Create New Employee
          </GlobalCustomButton>
        </Box>
      </form>
    </Box>
  );
};
