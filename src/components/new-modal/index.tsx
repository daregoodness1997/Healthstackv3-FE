import { Drawer } from 'antd';
import React from 'react';

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  header?: string;
  width?: string | number;
  footer?: React.ReactNode;
}

const ModalBox: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  header,
  width,
  footer = null,
}) => (
  <Drawer
    title={
      header ? (
        <h1
          style={{
            color: '#33415C',
            fontWeight: '500',
            lineHeight: '1.5',
            fontSize: '18px',
            margin: 0,
          }}
        >
          {header}
        </h1>
      ) : null
    }
    open={open}
    onClose={onClose}
    footer={footer}
    width={width || 720}
    placement="right"
    destroyOnClose
    styles={{
      body: {
        paddingBottom: footer ? 60 : 24,
      },
    }}
  >
    {children}
  </Drawer>
);

export default ModalBox;
