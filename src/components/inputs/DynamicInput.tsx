import { Controller } from 'react-hook-form';
import { Input, Select, Checkbox, Radio, DatePicker, Space, Form } from 'antd';
import dayjs from 'dayjs';

import { toAPIDate } from '../../hsmodules/app/DateUtils';
import ItemsInput from '../../hsmodules/app/generic/ItemsInput';
import { InputType } from '../../hsmodules/app/schema/util';
import AutoSuggestInput from './AutoSuggestInput';

const { TextArea } = Input;
const { Password } = Input;

// TODO: Anstract intp seperate components - the controller warapping
const DynamicInput = (props) => {
  const {
    inputType,
    label,
    name,
    data = {},
    options,
    control,
    errors = {},
    readonly,
    defaultValue,
  } = props;
  if (inputType === InputType.HIDDEN && data[name]) {
    return <input type="hidden" defaultValue={defaultValue} />;
  } else if (inputType === InputType.HIDDEN) {
    return <></>;
  }

  if (inputType === InputType.TEXT) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Form.Item
            label={label}
            validateStatus={errors[name] ? 'error' : ''}
            help={errors[name]?.message}
            style={{ marginBottom: 16 }}
          >
            <Input
              {...field}
              placeholder={label}
              disabled={readonly}
              status={errors[name] ? 'error' : ''}
            />
          </Form.Item>
        )}
      />
    );
  }

  if (inputType === InputType.NUMBER) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Form.Item
            label={label}
            validateStatus={errors[name] ? 'error' : ''}
            help={errors[name]?.message}
            style={{ marginBottom: 16 }}
          >
            <Input
              {...field}
              type="number"
              placeholder={label}
              disabled={readonly}
              status={errors[name] ? 'error' : ''}
            />
          </Form.Item>
        )}
      />
    );
  }

  if (inputType === InputType.PASSWORD) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Form.Item
            label={label}
            validateStatus={errors[name] ? 'error' : ''}
            help={errors[name]?.message}
            style={{ marginBottom: 16 }}
          >
            <Password
              {...field}
              placeholder={label}
              disabled={readonly}
              autoComplete="new-password"
              status={errors[name] ? 'error' : ''}
            />
          </Form.Item>
        )}
      />
    );
  }

  if (inputType === InputType.EMAIL) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Form.Item
            label={label}
            validateStatus={errors[name] ? 'error' : ''}
            help={errors[name]?.message}
            style={{ marginBottom: 16 }}
          >
            <Input
              {...field}
              type="email"
              placeholder={label}
              disabled={readonly}
              status={errors[name] ? 'error' : ''}
            />
          </Form.Item>
        )}
      />
    );
  }

  if (inputType === InputType.TEXT_AREA) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Form.Item
            label={label}
            validateStatus={errors[name] ? 'error' : ''}
            help={errors[name]?.message}
            style={{ marginBottom: 16 }}
          >
            <TextArea
              {...field}
              placeholder={label}
              disabled={readonly}
              rows={4}
              status={errors[name] ? 'error' : ''}
            />
          </Form.Item>
        )}
      />
    );
  }

  if (inputType === InputType.MULTIPLE_ADD && props.schema) {
    console.debug({ props });
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { ref: _re, value: __, ...field } }) => (
          <ItemsInput
            {...field}
            label={label}
            readonly={false}
            schema={props}
            defaultValue={data[name]}
          />
        )}
      />
    );
  }
  if (inputType === InputType.SELECT_RADIO) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Form.Item
            label={label}
            validateStatus={errors[name] ? 'error' : ''}
            help={errors[name]?.message}
            style={{ marginBottom: 16 }}
          >
            <Radio.Group
              {...field}
              disabled={readonly}
              options={options?.map((opt) => ({
                label: opt.label || opt.name,
                value: opt.value || opt.key,
              }))}
            />
          </Form.Item>
        )}
      />
    );
  }

  if (inputType === InputType.SELECT_CHECKBOX) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Form.Item
            label={label}
            validateStatus={errors[name] ? 'error' : ''}
            help={errors[name]?.message}
            style={{ marginBottom: 16 }}
          >
            <Checkbox.Group
              {...field}
              disabled={readonly}
              options={options?.map((opt) => ({
                label: opt.label || opt.name,
                value: opt.value || opt.key,
              }))}
            />
          </Form.Item>
        )}
      />
    );
  }

  if (inputType === InputType.BOOLEAN_CHECK) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Form.Item
            validateStatus={errors[name] ? 'error' : ''}
            help={errors[name]?.message}
            style={{ marginBottom: 16 }}
          >
            <Checkbox
              {...field}
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              disabled={readonly}
            >
              {label}
            </Checkbox>
          </Form.Item>
        )}
      />
    );
  }

  if (inputType === InputType.SELECT_LIST) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Form.Item
            label={label}
            validateStatus={errors[name] ? 'error' : ''}
            help={errors[name]?.message}
            style={{ marginBottom: 16 }}
          >
            <Select
              {...field}
              placeholder={`Select ${label}`}
              disabled={readonly}
              style={{ width: '100%' }}
              status={errors[name] ? 'error' : ''}
              options={options?.map((opt) => ({
                label: opt.label || opt.name,
                value: opt.value || opt.key,
              }))}
            />
          </Form.Item>
        )}
      />
    );
  }

  if (inputType === InputType.DATETIME) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Form.Item
            label={label}
            validateStatus={errors[name] ? 'error' : ''}
            help={errors[name]?.message}
            style={{ marginBottom: 16 }}
          >
            <DatePicker
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(value) => field.onChange(toAPIDate(value))}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabled={readonly}
              style={{ width: '100%' }}
              status={errors[name] ? 'error' : ''}
            />
          </Form.Item>
        )}
      />
    );
  }

  if (inputType === InputType.DATE) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Form.Item
            label={label}
            validateStatus={errors[name] ? 'error' : ''}
            help={errors[name]?.message}
            style={{ marginBottom: 16 }}
          >
            <DatePicker
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(value) => field.onChange(toAPIDate(value))}
              format="YYYY-MM-DD"
              disabled={readonly}
              style={{ width: '100%' }}
              status={errors[name] ? 'error' : ''}
            />
          </Form.Item>
        )}
      />
    );
  }

  if (
    inputType === InputType.SELECT_AUTO_SUGGEST ||
    inputType === InputType.SNOMED
  ) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { ref: _re, ...field } }) => (
          <AutoSuggestInput
            label={label}
            options={options}
            defaultValue={data[name]}
            readonly={readonly}
            error={errors[name]}
            inputType={inputType}
            {...field}
          />
        )}
      />
    );
  }

  if (inputType === InputType.JSON) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Form.Item
            label={label}
            validateStatus={errors[name] ? 'error' : ''}
            help={errors[name]?.message}
            style={{ marginBottom: 16 }}
          >
            <TextArea
              {...field}
              placeholder="JSON Input"
              disabled={readonly}
              rows={6}
              status={errors[name] ? 'error' : ''}
            />
          </Form.Item>
        )}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Form.Item
          label={label}
          validateStatus={errors[name] ? 'error' : ''}
          help={errors[name]?.message}
          style={{ marginBottom: 16 }}
        >
          <Input
            {...field}
            placeholder={label}
            disabled={readonly}
            status={errors[name] ? 'error' : ''}
          />
        </Form.Item>
      )}
    />
  );
};

export default DynamicInput;
