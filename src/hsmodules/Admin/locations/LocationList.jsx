import React, { useContext, useState } from 'react';
import { Modal } from 'antd';
import { UserContext, ObjectContext } from '../../../context';
import LocationView from './LocationView';
import LocationListRefactored from '../refactored/LocationListRefactored';
import { useLocationStore } from '../../../stores/locationStore';

export function LocationList({ showCreateModal }) {
  const { state, setState } = useContext(ObjectContext);
  const { user } = useContext(UserContext);
  const { selectedLocation, showModal, setShowModal, clearSelection } =
    useLocationStore();

  const handleDetailModal = () => {
    setShowModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowModal(false);
    clearSelection();
  };

  return (
    <>
      {user ? (
        <div style={{ padding: '24px' }}>
          <LocationListRefactored
            onOpenCreate={showCreateModal}
            onOpenDetail={handleDetailModal}
          />

          {/* Detail Modal */}
          <Modal
            title="Location Details"
            open={showModal}
            onCancel={handleCloseDetailModal}
            footer={null}
            width="80%"
            destroyOnClose
          >
            <LocationView
              location={selectedLocation}
              open={showModal}
              setOpen={handleCloseDetailModal}
            />
          </Modal>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
