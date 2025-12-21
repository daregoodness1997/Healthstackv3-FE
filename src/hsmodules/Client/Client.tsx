/* eslint-disable */
// @ts-nocheck

import React, { useState, useContext, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import ModalBox from '../../components/modal';
import ClientForm from './clients/ClientForm';
import ClientListRefactored from './refactored/ClientListRefactored';
import ClientDetail from './clients/ClientDetail';
import UploadClients from './UploadClient';
import DashboardPageLayout from '../../components/layout/DashboardPageLayout';
import { ObjectContext } from '../../context';
import client from '../../feathers';
import { toast } from 'react-toastify';

export default function Client() {
  const { state, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [detailModal, setDetailModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);

  const ClientServ = client.service('client');

  const handleOpenDetailModal = () => {
    setDetailModal(true);
  };

  const handleOpenCreateModal = () => {
    setCreateModal(true);
  };

  const handleOpenUploadModal = () => {
    setUploadModal(true);
  };

  const createClients = async (uploads) => {
    try {
      showActionLoader('Creating clients...');
      const promises = uploads.map((upload) => ClientServ.create(upload));
      await Promise.all(promises);
      toast.success(`${uploads.length} client(s) created successfully`);
      setUploadModal(false);
    } catch (error) {
      console.error('Error creating clients:', error);
      toast.error('Failed to create some clients');
    } finally {
      hideActionLoader();
    }
  };

  // Get modal header based on ClientModule state
  const getCreateModalHeader = () => {
    const clientModule = state?.ClientModule;
    if (clientModule?.show === 'edit' && clientModule?.selectedClient?._id) {
      return 'Edit Client/Patient';
    }
    return 'Create a New Client/Patient';
  };

  return (
    <DashboardPageLayout>
      <ClientListRefactored
        onOpenCreate={handleOpenCreateModal}
        onOpenDetail={handleOpenDetailModal}
        onOpenUpload={handleOpenUploadModal}
      />

      <ModalBox
        open={createModal}
        onClose={() => setCreateModal(false)}
        header={getCreateModalHeader()}
      >
        <ClientForm
          closeModal={() => setCreateModal(false)}
          setOpen={setCreateModal}
        />
      </ModalBox>

      <ModalBox
        open={detailModal}
        onClose={() => setDetailModal(false)}
        header="Client Detail"
      >
        <ClientDetail
          closeModal={() => setDetailModal(false)}
          closeDetailModal={() => setDetailModal(false)}
        />
      </ModalBox>

      <ModalBox
        open={uploadModal}
        onClose={() => setUploadModal(false)}
        header="Upload Clients"
      >
        <UploadClients createClients={createClients} />
      </ModalBox>
    </DashboardPageLayout>
  );
}
