import { Avatar, Dropdown, Space, Typography, Button } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  CameraOutlined,
  DeleteOutlined,
  DownOutlined,
} from '@ant-design/icons';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FileUploader } from 'react-drag-drop-files';
import { UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { getBase64 } from '../../hsmodules/helpers/getBase64';
import client from '../../feathers';
import { ObjectContext, UserContext } from '../../context';
import GlobalCustomButton from '../buttons/CustomButton';
import ModalBox from '../modal';
import secureStorage from '../../utils/secureStorage';

const ProfileMenu = () => {
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const cleanup = async () => {
    let logObj = {
      user: user,
      facility: user.currentEmployee.facilityDetail,
      type: 'logout',
    };

    await client.service('logins').create(logObj);

    let onlineObj = {
      lastLogin: new Date(),
      online: false,
    };
    await client.service('users').patch(user._id, onlineObj);
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'View Profile',
      onClick: () => navigate('/app/user'),
    },
    {
      key: 'change-image',
      icon: <CameraOutlined />,
      label: 'Change Image',
      onClick: () => setImageUploadModal(true),
    },
    {
      key: 'remove-image',
      icon: <DeleteOutlined />,
      label: 'Remove Image',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: async () => {
        try {
          await cleanup();
          secureStorage.clearAll();
          await client.logout();
          navigate('/');
        } catch (error) {
          console.error('Logout error:', error);
          secureStorage.clearAll();
          navigate('/');
        }
      },
    },
  ];

  return (
    <>
      <ModalBox
        open={imageUploadModal}
        onClose={() => setImageUploadModal(false)}
        header="Upload New Profile Photo"
      >
        <UpdateProfilePhoto closeModal={() => setImageUploadModal(false)} />
      </ModalBox>

      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        placement="bottomRight"
      >
        <Space style={{ cursor: 'pointer', padding: '4px 8px' }}>
          <Avatar
            src={user.currentEmployee.imageurl}
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <Space direction="vertical" size={0} style={{ lineHeight: 1.2 }}>
            <Typography.Text strong style={{ fontSize: '13px' }}>
              {user.currentEmployee.firstname} {user.currentEmployee.lastname}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: '11px' }}>
              {user.currentEmployee.department || 'Staff'}
            </Typography.Text>
          </Space>
          <DownOutlined style={{ fontSize: '10px', color: '#8c8c8c' }} />
        </Space>
      </Dropdown>
    </>
  );
};

export default ProfileMenu;

const UploadComponent = ({}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        border: '2px dashed #d9d9d9',
        cursor: 'pointer',
        borderRadius: '8px',
        background: '#fafafa',
        transition: 'border-color 0.3s',
      }}
    >
      <UploadOutlined
        style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }}
      />
      <Typography.Text>Select Logo Image or Drag and Drop here</Typography.Text>
    </div>
  );
};

export const UpdateProfilePhoto = ({ closeModal }) => {
  const employeeServer = client.service('employee');
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const { user, setUser } = useContext(UserContext);

  const [file, setFile] = useState(null);

  const handleChange = (file) => {
    //console.log(file);
    //setFile(file);

    getBase64(file)
      .then((res) => {
        //console.log(res);
        setFile(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUploadLogo = async () => {
    if (file === null) return toast.error('Please select an Image to upload');
    showActionLoader();
    const { uploadFile } = await import('../../utils/secureHttp');
    const { getUploadUrl } = await import('../../utils/env');
    uploadFile(getUploadUrl(), { uri: file })
      .then(async (res) => {
        const imageUrl = res.data.url;
        const employee = user.currentEmployee;

        const documentId = employee._id;

        await employeeServer
          .patch(documentId, { imageurl: imageUrl })
          .then((res) => {
            hideActionLoader();
            closeModal();
            toast.success("You've successfully updated your profile photo");
          })
          .catch((err) => {
            hideActionLoader();

            toast.error(
              `Error Updating profile photo, probable network issues or ${err}`,
            );
          });
      })
      .catch((error) => {
        hideActionLoader();
        toast.error(
          `An error occured whilst updating your profile photo ${error}`,
        );
        console.log(error);
      });
  };

  return (
    <div style={{ width: '400px', maxHeight: '80vh' }}>
      {file ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <img
            src={file}
            alt="profile"
            style={{
              width: '200px',
              height: 'auto',
              display: 'block',
              borderRadius: '8px',
            }}
          />
        </div>
      ) : (
        <FileUploader
          multiple={false}
          handleChange={handleChange}
          name="upload"
          types={['jpeg', 'png', 'jpg']}
          children={<UploadComponent />}
        />
      )}

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <GlobalCustomButton color="error" onClick={closeModal}>
          Cancel
        </GlobalCustomButton>

        <GlobalCustomButton onClick={handleUploadLogo} disabled={file === null}>
          Upload Image
        </GlobalCustomButton>
      </div>
    </div>
  );
};
