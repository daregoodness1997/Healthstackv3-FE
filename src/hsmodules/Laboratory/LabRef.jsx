/* eslint-disable */
import React, { useState } from "react";
import { LabRefForm } from "../GlobalAdmin/LabRef/LabRefForm";
import { LabRefList } from "../GlobalAdmin/LabRef/LabRefList";
import { LabRefModify } from "../GlobalAdmin/LabRef/LabRefEdit";
import { useContext } from "react";
import { UserContext } from "../../context";

export default function LabRef() {
  const [createModal, setCreateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [modifyModal, setModifyModal] = useState(false);
  const { user } = useContext(UserContext);
  const facilityId = user.currentEmployee.facilityDetail._id;
  
  const handleShowDetailModal = () => {
    setDetailModal(true);
  };
  const handleHideDetailModal = () => {
    setDetailModal(false);
  };

  const handleShowCreateModal = () => {
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
    <section className="section remPadTop">
      <LabRefForm
        open={createModal}
        setOpen={handleHideCreateModal}
        facility={facilityId}
      />

      <LabRefList
        showCreateModal={handleShowCreateModal}
        showDetailModal={handleShowDetailModal}
        showEditModal={handleModifyModal}
        facility={facilityId}
      />
      <LabRefModify open={modifyModal} setOpen={handleHideModifyModal} />
    </section>
  );
}
