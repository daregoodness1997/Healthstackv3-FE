import { Modal } from "antd";
import React from "react";

// interface ModalProps {
//   open: boolean;
//   onClose?: () => void;
//   children?: React.ReactNode | undefined;
//   header?: string;
//   width?: string | number;
//   footer?: React.ReactNode;
// }

const ModalBox = ({
  open,
  onClose,
  children,
  header,
  width,
  footer = null,
  ...props
}) => {
  const modalWidth = width || "auto";

  return (
    <Modal
      title={
        header ? (
          <h1
            style={{
              color: "#33415C",
              fontWeight: "500",
              lineHeight: "1.5",
              fontSize: "18px",
              margin: 0,
            }}
          >
            {header}
          </h1>
        ) : null
      }
      open={open}
      onCancel={onClose}
      footer={footer}
      width={modalWidth}
      centered
      destroyOnClose
      styles={{
        body: {
          maxHeight: "70vh",
          overflowY: "auto",
          padding: "10px",
        },
      }}
      {...props}
    >
      {children}
    </Modal>
  );
};

export default ModalBox;
