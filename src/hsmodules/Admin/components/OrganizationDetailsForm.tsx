/**
 * Organization Details Form Component
 *
 * Form for editing organization information
 */

import { Row, Col, Button, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Control } from 'react-hook-form';
// @ts-ignore - JS module without types
import Input from '../../../components/inputs/basic/Input';
import { FormsHeaderText } from '../../../components/texts';

interface OrganizationDetailsFormProps {
  control: Control<any>;
  edit: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const OrganizationDetailsForm: React.FC<OrganizationDetailsFormProps> = ({
  control,
  edit,
  onEdit,
  onCancel,
  onSubmit,
}) => {
  return (
    <>
      <div
        style={{
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <FormsHeaderText text="Organization Details" />
        <Space>
          {!edit ? (
            <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
              Edit Details
            </Button>
          ) : (
            <>
              <Button danger onClick={onCancel}>
                Cancel Edit
              </Button>
              <Button type="primary" icon={<EditOutlined />} onClick={onSubmit}>
                Update Organization
              </Button>
            </>
          )}
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ padding: '16px' }}>
        <Col lg={8} md={12} sm={12} xs={24}>
          <Input
            name="facilityOwner"
            control={control}
            label="Organization Owner"
            disabled={!edit}
          />
        </Col>

        <Col lg={8} md={12} sm={12} xs={24}>
          <Input
            name="facilityName"
            control={control}
            label="Organization Name"
            disabled={!edit}
          />
        </Col>

        <Col lg={8} md={12} sm={12} xs={24}>
          <Input
            name="facilityContactPhone"
            control={control}
            label="Phone Number"
            disabled={!edit}
          />
        </Col>

        <Col lg={8} md={12} sm={12} xs={24}>
          <Input
            name="facilityEmail"
            control={control}
            label="Email Address"
            disabled={!edit}
          />
        </Col>

        <Col lg={8} md={12} sm={12} xs={24}>
          <Input
            name="facilityType"
            control={control}
            label="Organization Type"
            disabled
          />
        </Col>

        <Col lg={8} md={12} sm={12} xs={24}>
          <Input
            name="facilityCategory"
            control={control}
            label="Organization Category"
            disabled
          />
        </Col>

        <Col lg={16} md={16} sm={24} xs={24}>
          <Input
            name="facilityAddress"
            control={control}
            label="Organization Address"
            disabled={!edit}
          />
        </Col>

        <Col lg={8} md={12} sm={12} xs={24}>
          <Input
            name="facilityCity"
            control={control}
            label="Organization City"
            disabled={!edit}
          />
        </Col>

        <Col lg={8} md={12} sm={12} xs={24}>
          <Input
            name="facilityLGA"
            control={control}
            label="Organization LGA"
            disabled={!edit}
          />
        </Col>

        <Col lg={8} md={12} sm={12} xs={24}>
          <Input
            name="facilityState"
            control={control}
            label="Organization State"
            disabled={!edit}
          />
        </Col>

        <Col lg={8} md={12} sm={12} xs={24}>
          <Input
            name="facilityCountry"
            control={control}
            label="Organization Country"
            disabled={!edit}
          />
        </Col>
      </Row>

      <div style={{ padding: '16px' }}>
        <FormsHeaderText text="Access Modality" />
        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col lg={12} md={12} sm={12} xs={24}>
            <Input
              name="accessMode"
              control={control}
              label="Payment Model"
              disabled
            />
          </Col>
          <Col lg={12} md={12} sm={12} xs={24}>
            <Input
              name="accessValue"
              control={control}
              label="Value"
              disabled
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default OrganizationDetailsForm;
