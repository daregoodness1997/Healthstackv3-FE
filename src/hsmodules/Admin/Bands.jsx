import React, { useState, useContext } from 'react';
import { Drawer } from 'antd';
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

      {/* Create/Edit Drawer */}
      <Drawer
        title={state.BandModule?.show === 'edit' ? 'Edit Band' : 'Create Band'}
        open={createModal}
        onClose={handleHideCreateModal}
        width={700}
        placement="right"
        destroyOnClose
      >
        <BandForm open={createModal} setOpen={handleHideCreateModal} />
      </Drawer>

      {/* Detail Drawer */}
      <Drawer
        title="Band Details"
        open={showModal}
        onClose={handleCloseDetailModal}
        width={800}
        placement="right"
        destroyOnClose
      >
        <BandView
          band={selectedBand}
          open={showModal}
          setOpen={handleCloseDetailModal}
        />
      </Drawer>
    </div>
  );
}
