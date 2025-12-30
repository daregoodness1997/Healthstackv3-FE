import { Drawer } from 'antd';

const ModalBox = ({
  open,
  onClose,
  children,
  header,
  width,
  footer = null,
  ...props
}) => {
  const drawerWidth = width || 720;

  return (
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
      width={drawerWidth}
      placement="right"
      destroyOnClose
      styles={{
        body: {
          paddingBottom: footer ? 60 : 24,
        },
      }}
      {...props}
    >
      {children}
    </Drawer>
  );
};

export default ModalBox;
