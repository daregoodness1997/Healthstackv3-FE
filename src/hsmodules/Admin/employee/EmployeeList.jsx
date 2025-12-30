import React, { useState, useContext } from 'react';
import { Drawer } from 'antd';
import { UserContext, ObjectContext } from '../../../context';
import EmployeeView from './EmployeeView';
import UploadEmployeeComponent from '../UploadEmployees';
import EmployeeListRefactored from '../refactored/EmployeeListRefactored';
import { useEmployeeStore } from '../../../stores/employeeStore';
import { toast } from 'react-toastify';
import { useCreateEmployee } from '../../../hooks/queries/useEmployees';

export function EmployeeList({ showCreateModal }) {
  const createEmployeeMutation = useCreateEmployee();
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

    try {
      await createEmployeeMutation.mutateAsync(employeeData);
    } catch (err) {
      toast.error(
        `Sorry, You weren't able to create an Employee ${data.firstname} ${data.lastname}. ${err}`,
      );
    }
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

          {/* Upload Drawer */}
          <Drawer
            title="Upload and Create Multiple Employees"
            open={uploadModal}
            onClose={() => setUploadModal(false)}
            width={1400}
            placement="right"
            destroyOnClose
          >
            <UploadEmployeeComponent
              closeModal={() => setUploadModal(false)}
              createEmployees={createMultipleEmployees}
            />
          </Drawer>

          {/* Detail Drawer */}
          <Drawer
            title="Employee Details"
            open={showModal && selectedEmployee}
            onClose={handleCloseDetailModal}
            width="90%"
            placement="right"
            destroyOnClose
          >
            {selectedEmployee && (
              <EmployeeView
                employee={selectedEmployee}
                open={showModal}
                closeModal={handleCloseDetailModal}
                setOpen={handleCloseDetailModal}
              />
            )}
          </Drawer>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
