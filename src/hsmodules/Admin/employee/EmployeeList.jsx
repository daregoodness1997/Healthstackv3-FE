import React, { useState, useContext } from 'react';
import { Modal } from 'antd';
import { UserContext, ObjectContext } from '../../../context';
import EmployeeView from './EmployeeView';
import UploadEmployeeComponent from '../UploadEmployees';
import EmployeeListRefactored from '../refactored/EmployeeListRefactored';
import { useEmployeeStore } from '../../../stores/employeeStore';
import { toast } from 'react-toastify';
import client from '../../../feathers';

export function EmployeeList({ showCreateModal }) {
  const EmployeeServ = client.service('employee');
  const { setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const { user } = useContext(UserContext);
  const { selectedEmployee, showModal, setShowModal, clearSelection } =
    useEmployeeStore();
  const [uploadModal, setUploadModal] = useState(false);

  const handleDetailModal = () => {
    setShowModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowModal(false);
    clearSelection();
  };

  const createEmployee = async (data) => {
    const employeeData = {
      ...data,
      createdby: user._id,
      facility: user.currentEmployee.facility,
      imageurl: '',
      roles: ['Communication'],
    };

    await EmployeeServ.create(employeeData)
      .then(() => {
        toast.success(
          `Employee ${data.firstname} ${data.lastname} successfully created`,
        );
      })
      .catch((err) => {
        toast.error(
          `Sorry, You weren't able to create an Employee ${data.firstname} ${data.lastname}. ${err}`,
        );
      });
  };

  const createMultipleEmployees = async (data) => {
    showActionLoader();
    const promises = data.map(async (item) => {
      await createEmployee(item);
    });

    await Promise.all(promises);

    hideActionLoader();
    setUploadModal(false);
    toast.success(`Successfully created ${data.length} Employee(s)`);
  };

  return (
    <>
      {user ? (
        <div style={{ padding: '24px' }}>
          <EmployeeListRefactored
            onOpenCreate={showCreateModal}
            onOpenDetail={handleDetailModal}
            onOpenUpload={() => setUploadModal(true)}
          />

          {/* Upload Modal */}
          <Modal
            title="Upload and Create Multiple Employees"
            open={uploadModal}
            onCancel={() => setUploadModal(false)}
            footer={null}
            width={800}
            destroyOnClose
          >
            <UploadEmployeeComponent
              closeModal={() => setUploadModal(false)}
              createEmployees={createMultipleEmployees}
            />
          </Modal>

          {/* Detail Modal */}
          <Modal
            title="Employee Details"
            open={showModal}
            onCancel={handleCloseDetailModal}
            footer={null}
            width="90%"
            destroyOnClose
          >
            <EmployeeView
              employee={selectedEmployee}
              open={showModal}
              closeModal={handleCloseDetailModal}
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
