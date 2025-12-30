/* eslint-disable */
import React, { useState } from 'react';
import { Drawer } from 'antd';
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
      <Drawer
        title="Create New Employee"
        open={createModal}
        onClose={handleHideCreateModal}
        width={800}
        placement="right"
        destroyOnClose
      >
        <EmployeeForm open={createModal} setOpen={handleHideCreateModal} />
      </Drawer>

      <Drawer
        title="Employee Details"
        open={detailModal}
        onClose={handleHideDetailModal}
        width="90%"
        placement="right"
        destroyOnClose
      >
        <EmployeeDetail showModifyModal={handleModifyModal} />
      </Drawer>

      <Drawer
        title="Edit Employee"
        open={modifyModal}
        onClose={handleHideModifyModal}
        width={800}
        placement="right"
        destroyOnClose
      >
        <EmployeeModify />
      </Drawer>

      <EmployeeList
        showCreateModal={handleCreateModal}
        showDetailModal={handleShowDetailModal}
      />
    </>
  );
}
