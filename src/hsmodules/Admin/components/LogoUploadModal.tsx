/**
 * Logo Upload Modal Component
 *
 * Modal for uploading organization logo
 */

import { useState, useContext } from 'react';
import { Button, Space, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { FileUploader } from 'react-drag-drop-files';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
// @ts-ignore - JS module without types
import { UserContext } from '../../../context';
import { useUIStore } from '../../../stores/uiStore';
import { useUpdateOrganization } from '../../../hooks/queries/useOrganizations';
// @ts-ignore - JS module without types
import { getBase64 } from '../../helpers/getBase64';
import { uploadBase64File } from '../../../services/uploadService';

const { Title: AntTitle } = Typography;

interface LogoUploadModalProps {
  closeModal: () => void;
}

const UploadComponent = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        border: '1px dashed #d9d9d9',
        cursor: 'pointer',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
      }}
    >
      <UploadOutlined
        style={{ fontSize: '48px', color: '#1890ff', marginBottom: '8px' }}
      />
      <AntTitle level={5}>Select Logo Image or Drag and Drop here</AntTitle>
    </div>
  );
};

const LogoUploadModal: React.FC<LogoUploadModalProps> = ({ closeModal }) => {
  const { showActionLoader, hideActionLoader } = useUIStore();
  const { user, setUser } = useContext(UserContext) as any;
  const updateMutation = useUpdateOrganization();
  const [file, setFile] = useState<string | null>(null);

  const handleChange = (file: File) => {
    getBase64(file)
      .then((res: any) => {
        setFile(res);
      })
      .catch((err: any) => {
        console.error('Error converting file to base64:', err);
        toast.error('Failed to process the image file');
      });
  };

  const handleUploadLogo = async () => {
    if (!file) {
      return toast.error('Please select a Logo to upload');
    }

    showActionLoader('Uploading logo...');

    try {
      // Upload file to backend
      const uploadResponse = await uploadBase64File(file);
      const logoUrl = uploadResponse.url;

      // Update organization with new logo
      const employee = user.currentEmployee;
      const prevOrgDetail = user.currentEmployee.facilityDetail;

      const updateData = {
        facilitylogo: logoUrl,
        updatedAt: dayjs().toISOString(),
        updatedBy: employee.userId,
        updatedByName: `${employee.firstname} ${employee.lastname}`,
      };

      updateMutation.mutate(
        {
          id: prevOrgDetail._id,
          data: updateData,
        },
        {
          onSuccess: (resp) => {
            hideActionLoader();
            setUser((prev: any) => ({
              ...prev,
              currentEmployee: {
                ...prev.currentEmployee,
                facilityDetail: resp,
              },
            }));
            closeModal();
            toast.success("You've successfully updated your Organization Logo");
          },
          onError: (error: any) => {
            hideActionLoader();
            toast.error(
              `An error occurred whilst updating your Organization Logo: ${error.message}`,
            );
          },
        },
      );
    } catch (error: any) {
      hideActionLoader();
      toast.error(
        `An error occurred whilst uploading the logo: ${error.message}`,
      );
      console.error('Logo upload error:', error);
    }
  };

  return (
    <div style={{ width: '100%', maxHeight: '80vh' }}>
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
            alt="logo preview"
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
        >
          <UploadComponent />
        </FileUploader>
      )}

      <Space style={{ marginTop: '16px' }}>
        <Button onClick={closeModal}>Cancel</Button>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={handleUploadLogo}
          disabled={!file}
          loading={updateMutation.isPending}
        >
          Upload Logo
        </Button>
      </Space>
    </div>
  );
};

export default LogoUploadModal;
