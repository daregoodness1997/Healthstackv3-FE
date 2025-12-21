import React, { useState, useContext } from 'react';
import { Modal } from 'antd';
import { UserContext, ObjectContext } from '../../context';
import BandView from './BandView';
import { BandForm } from './BandForm';
import BandListRefactored from './refactored/BandListRefactored';
import { useBandStore } from '../../stores/bandStore';

export default function Bands() {
  const { state } = useContext(ObjectContext);
  const { selectedBand, showModal, setShowModal, clearSelection } =
    useBandStore();
  const [createModal, setCreateModal] = useState(false);

  const handleCreateModal = () => {
    setCreateModal(true);
  };

  const handleHideCreateModal = () => {
    setCreateModal(false);
  };

  const handleDetailModal = () => {
    setShowModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowModal(false);
    clearSelection();
  };

  return (
    <div style={{ padding: '24px' }}>
      <BandListRefactored
        onOpenCreate={handleCreateModal}
        onOpenDetail={handleDetailModal}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={state.BandModule?.show === 'edit' ? 'Edit Band' : 'Create Band'}
        open={createModal}
        onCancel={handleHideCreateModal}
        footer={null}
        width={700}
        destroyOnClose
      >
        <BandForm open={createModal} setOpen={handleHideCreateModal} />
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Band Details"
        open={showModal}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={800}
        destroyOnClose
      >
        <BandView
          band={selectedBand}
          open={showModal}
          setOpen={handleCloseDetailModal}
        />
      </Modal>
    </div>
  );
}
