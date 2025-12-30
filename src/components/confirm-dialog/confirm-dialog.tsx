import * as React from 'react';
import { Modal, Space } from 'antd';
import {
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import './styles.scss';

import { ObjectContext } from '../../context';
import GlobalCustomButton from '../buttons/CustomButton';

interface componentProps {
  open: boolean;
  confirmationAction: () => null;
  cancelAction: () => null;
  type?: string | 'danger' | 'update' | 'create' | 'neutral' | 'warning';
  message?: string;
  customActionButtonText?: string;
  customCancelButtonText?: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'danger':
      return <WarningOutlined style={{ color: '#ff4d4f', fontSize: '48px' }} />;
    case 'warning':
      return (
        <ExclamationCircleOutlined
          style={{ color: '#faad14', fontSize: '48px' }}
        />
      );
    case 'create':
    case 'update':
    case 'neutral':
      return (
        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '48px' }} />
      );
    default:
      return (
        <ExclamationCircleOutlined
          style={{ color: '#1890ff', fontSize: '48px' }}
        />
      );
  }
};

const CustomConfirmationDialog = ({
  open = false,
  confirmationAction,
  cancelAction,
  type = 'neutral',
  message = 'Are you sure you want to continue?',
  customActionButtonText = 'Continue',
  customCancelButtonText = 'Cancel',
}: componentProps) => {
  return (
    <Modal
      open={open}
      onCancel={cancelAction}
      centered
      footer={
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <GlobalCustomButton color="error" onClick={cancelAction}>
            {customCancelButtonText}
          </GlobalCustomButton>
          <GlobalCustomButton color="success" onClick={confirmationAction}>
            {customActionButtonText}
          </GlobalCustomButton>
        </Space>
      }
      width={450}
    >
      <div className="confirmation-dialog-container">
        <div className={`diaglog-color-head dialog-${type}`} />
        <div className="confirmation-dialog-content-container">
          <div className={`dialog-icon icon-${type}`}>{getIcon(type)}</div>
          <div style={{ fontSize: '0.95rem', marginTop: '16px' }}>
            {message}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomConfirmationDialog;
