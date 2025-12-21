/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import { useState } from 'react';
import client from '../../../feathers';
import { toast } from 'react-toastify';
import ModalBox from '../../../components/modal';
import AddComment from './AddComment';

const GrievanceChat = ({
  id,
  facilityName,
  issue,
  date,
  status,
  staff,
  facId,
  comment,
  handleCreateModal,
}) => {
  const [grievanceStatus, setGrievanceStatus] = useState(status);
  const ClientServ = client.service('grevianceresolution');
  const [createCommentModal, setCreateCommentModal] = useState(false);
  const handleCreateCommentModal = () => {
    setCreateCommentModal(true);
  };

  const handleHideCreateCommentModal = () => {
    setCreateCommentModal(false);
  };

  const handleOpenClose = async (id, newStatus) => {
    if (newStatus === 'Resolved') {
      try {
        await ClientServ.patch(id, {
          status: 'Resolved',
        });
        setGrievanceStatus('Resolved');
        console.log(grievanceStatus);
      } catch (error) {
        toast.error('Error changing grievance status ' + error);
      }
      return;
    }

    if (status === 'Open') {
      try {
        await ClientServ.patch(id, {
          status: 'Closed',
        });
        setGrievanceStatus('Closed');
        console.log(grievanceStatus);
      } catch (error) {
        toast.error('Error changing grievance status ' + error);
      }
    } else {
      try {
        await ClientServ.patch(id, {
          status: 'Open',
        });
        setGrievanceStatus('Open');
        console.log(grievanceStatus);
      } catch (error) {
        toast.error('Error changing grievance status ' + error);
      }
    }
  };
  return (
    <Box
      sx={{
        borderRadius: '7px',
        px: 2,
        py: 3,
        mt: 4,
        background: '#EDEDED',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '7px',
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: '20%',
            background: 'white',
            p: 1,
            borderRadius: '7px',
          }}
        >
          <p>Staff: {staff}</p>
        </Box>
        <Box
          sx={{
            width: '40%',
            background: 'white',
            p: 1,
            borderRadius: '7px',
          }}
        >
          <p>Organization Name: {facilityName}</p>
        </Box>
        <Box
          sx={{
            width: '20%',
            background: 'white',
            p: 1,
            borderRadius: '7px',
          }}
        >
          <p>Date: {date}</p>
        </Box>
        <Box
          sx={{
            width: '20%',
            background: 'white',
            p: 1,
            borderRadius: '7px',
          }}
        >
          <p>Status: {status}</p>
        </Box>
      </Box>
      <Box
        sx={{
          background: '#0496FF',
          p: 2,
          mt: 2,
          borderRadius: '7px',
        }}
      >
        <p>{issue}</p>
      </Box>
      {comment && (
        <>
          <p style={{ mt: 2 }}>Comment:</p>
          <Box
            sx={{
              background: '#0496FF',
              p: 2,

              borderRadius: '7px',
            }}
          >
            <p>{comment}</p>
          </Box>
        </>
      )}

      <Box
        sx={{
          mt: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end',
          gap: 2,
        }}
      >
        <GlobalCustomButton
          text="Add Comment"
          onClick={handleCreateCommentModal}
        />
        <GlobalCustomButton
          text="Escalate"
          disabled={
            grievanceStatus === 'Closed' || grievanceStatus === 'Resolved'
          }
          onClick={handleCreateModal}
        />
        <GlobalCustomButton
          text={grievanceStatus === 'Open' ? 'Close' : 'Reopen'}
          onClick={() => handleOpenClose(facId, '')}
        />
        <GlobalCustomButton
          text="Resolve"
          disabled={
            grievanceStatus === 'Closed' || grievanceStatus === 'Resolved'
          }
          onClick={() => handleOpenClose(facId, 'Resolved')}
        />
        <ModalBox
          open={createCommentModal}
          onClose={handleHideCreateCommentModal}
          header="Add a comment"
        >
          <AddComment onClose={handleHideCreateCommentModal} id={id} />
        </ModalBox>
      </Box>
    </Box>
  );
};

export default GrievanceChat;
