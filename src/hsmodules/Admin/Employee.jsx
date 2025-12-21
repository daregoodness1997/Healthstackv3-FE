/* eslint-disable */
import React, { useState } from 'react';
import { Modal } from 'antd';
import 'react-datepicker/dist/react-datepicker.css';
import { EmployeeForm } from './employee/EmployeeForm';
import { EmployeeList } from './employee/EmployeeList';
import { EmployeeModify } from './employee/EmployeeEdit';
import { EmployeeDetail } from './employee/EmployeeDetails';

export default function Employee() {
  const [createModal, setCreateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [modifyModal, setModifyModal] = useState(false);

  const handleShowDetailModal = () => {
    setDetailModal(true);
  };

  const handleHideDetailModal = () => {
    setDetailModal(false);
  };

  const handleCreateModal = () => {
    setCreateModal(true);
  };

  const handleHideCreateModal = () => {
    setCreateModal(false);
  };

  const handleModifyModal = () => {
    setModifyModal(true);
  };

  const handleHideModifyModal = () => {
    setModifyModal(false);
  };

  return (
    <>
      <Modal
        title="Create New Employee"
        open={createModal}
        onCancel={handleHideCreateModal}
        footer={null}
        width={800}
        destroyOnClose
      >
        <EmployeeForm open={createModal} setOpen={handleHideCreateModal} />
      </Modal>

      <Modal
        title="Employee Details"
        open={detailModal}
        onCancel={handleHideDetailModal}
        footer={null}
        width="90%"
        destroyOnClose
      >
        <EmployeeDetail showModifyModal={handleModifyModal} />
      </Modal>

      <Modal
        title="Edit Employee"
        open={modifyModal}
        onCancel={handleHideModifyModal}
        footer={null}
        width={800}
        destroyOnClose
      >
        <EmployeeModify />
      </Modal>

      <EmployeeList
        showCreateModal={handleCreateModal}
        showDetailModal={handleShowDetailModal}
      />
    </>
  );
}
