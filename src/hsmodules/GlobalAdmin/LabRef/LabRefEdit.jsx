import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import Input from '../../../components/inputs/basic/Input';
import client from '../../../feathers';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { BottomWrapper } from '../../app/styles';
import ModalBox from '../../../components/modal';
import { ObjectContext } from '../../../context';
import { useContext } from 'react';
import { Box } from '@mui/material';
import CheckboxInput from '../../../components/inputs/basic/Checkbox';
import SingleCheckbox from '../../../components/inputs/basic/Checkbox/SingleCheckbox';

export function LabRefModify({ open, setOpen }) {
  const labServ = client.service('labrefvalue');
  const { state } = useContext(ObjectContext);
  const labData = state.LaboratoryModule.selectedLaboratoryRef;
  console.log(labData,"LAB-DATA")
  const { register, control, handleSubmit, reset,watch } = useForm({
    defaultValues: labData
      ? {
          testname: labData?.testname || '',
          testclass: labData?.testclass || '',
          tests:
            labData?.tests?.map((test) => ({
              test: test?.test || '',
              texttype: test?.texttype || false,
              normalValues:
                test?.normalValues?.map((val) => ({
                  unitMeasure: val?.unitMeasure || '',
                  upperLimit: val?.upperLimit || '',
                  lowerLimit: val?.lowerLimit || '',
                })) || [],
            })) || [],
        }
      : {
          testname: '',
          testclass: '',
          tests: [
            {
              test: '',
              texttype: false,
              normalValues: [
                { unitMeasure: '', upperLimit: '', lowerLimit: '' },
              ],
            },
          ],
        },
  });

  useEffect(() => {
    if (labData) {
      reset(labData);
    }
  }, [labData, reset]);

  // Manage dynamic field arrays for tests
  const {
    fields: testFields,
    append: appendTest,
    remove: removeTest,
  } = useFieldArray({
    control,
    name: 'tests',
  });

  // Manage dynamic field arrays for normal bounds inside each test

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    await labServ
      .patch(labData._id, formData)
      .then((res) => {
        toast.success(`Lab reference successfully updated`);
        setOpen(false);
      })
      .catch((err) => {
        toast.error(
          `Sorry, You weren't able to update the lab reference. ${err}`,
        );
      });
  };

  return (
    <ModalBox
      width="50%"
      open={open}
      onClose={setOpen}
      header="Create Lab Reference Value"
    >
      <div>
        {/* Test Name and Test Class */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginBlock: '16px',
          }}
        >
          <GlobalCustomButton
            size="small"
            sx={{ height: '5%', width: '20%' }}
            onClick={() =>
              appendTest({
                test: '',

                normalValues: [
                  { unitMeasure: '', lowerLimit: '', upperLimit: '' },
                ],
              })
            }
          >
            <ControlPointIcon
              fontSize="small"
              sx={{ marginRight: '5px', width: '20%' }}
            />
            Add Test
          </GlobalCustomButton>

          <GlobalCustomButton
            size="small"
            color="error"
            sx={{ height: '5%', width: '20%' }}
            onClick={() => removeTest(testFields.length - 1)}
          >
            Remove Test
          </GlobalCustomButton>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* <label>Test Name:</label> */}
          <Input
            type="text"
            label="Test Name"
            register={register('testname', { required: true })}
          />

          {/*   <label>Test Class:</label> */}
          <Input
            type="text"
            label="Test Class"
            register={register('testclass')}
          />
        </div>

        {/* Dynamic Test Fields */}
        {testFields.map((test, testIndex) => (
          <TestField
            key={test.id}
            testIndex={testIndex}
            register={register}
            control={control}
            watch={watch}
            removeTest={() => removeTest(testIndex)}
          />
        ))}

        {/* Add New Test Button */}
        {/*    <button type="button" onClick={() => appendTest({
      test: '',
      displayName: '',
      normalValues: [{ unitMeasure: '', lowerLimit: '', upperLimit: '' }]
    })}>
      Add Test
    </button> */}

        {/* Submit Form */}
        {/*  <button type="submit">Submit</button>  */}
        <BottomWrapper>
          <GlobalCustomButton type="submit" onClick={handleSubmit(onSubmit)}>
            <ControlPointIcon fontSize="small" sx={{ marginRight: '5px' }} />
            Update
          </GlobalCustomButton>
        </BottomWrapper>
      </div>
    </ModalBox>
  );
}

// Normal Bound Component
const NormalValuesField = ({ nestIndex, boundIndex, register }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      marginLeft: '2rem',
    }}
  >
    <Input
      label={`Unit Measure ${boundIndex + 1}:`}
      type="text"
      register={register(
        `tests.${nestIndex}.normalValues.${boundIndex}.unitMeasure`,
      )}
    />

    <Input
      label="Lower Limit:"
      type="number"
      register={register(
        `tests.${nestIndex}.normalValues.${boundIndex}.lowerLimit`,
      )}
    />

    <Input
      label="Upper Limit:"
      type="number"
      register={register(
        `tests.${nestIndex}.normalValues.${boundIndex}.upperLimit`,
      )}
    />
  </div>
);

// Test Component
const TestField = ({ testIndex, register, control,watch }) => {
  const { fields: normalValuesFields, append: appendnormalValues } =
    useFieldArray({
      control,
      name: `tests.${testIndex}.normalValues`,
    });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        margin: '2rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <GlobalCustomButton
          size="small"
          sx={{ height: '5%', width: '30%', marginTop: '0.5rem' }}
          onClick={() =>
            appendnormalValues({
              unitMeasure: '',
              lowerLimit: '',
              upperLimit: '',
            })
          }
        >
          <ControlPointIcon
            fontSize="small"
            sx={{ marginRight: '5px', width: '20%' }}
          />
          Add Unit Measure
        </GlobalCustomButton>
      </div>
      <Input
        label={`Test ${testIndex + 1}:`}
        type="text"
        register={register(`tests.${testIndex}.test`)}
      />

    <Box flexDirection="row" alignItems="flex-start">
    {/* <Input
        // sx={{ width: '10%' }}
        label="Type is text"
        type="checkbox"
        register={register(`tests.${testIndex}.texttype`)}
      /> */}
     <SingleCheckbox label="Type is text" register={register(`tests.${testIndex}.texttype`)}/>
    </Box>

      {/* Normal Boundaries for Each Test */}
      {!watch(`tests.${testIndex}.texttype`) &&
        normalValuesFields.map((bound, boundIndex) => (
          <div key={bound.id}>
            <NormalValuesField
              nestIndex={testIndex}
              boundIndex={boundIndex}
              register={register}
            />
          </div>
        ))}
    </div>
  );
};
