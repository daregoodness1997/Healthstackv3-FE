/* eslint-disable */
import React, { useState } from "react";
import { LabRefForm } from "./LabRef/LabRefForm";
import { LabRefModify } from "./LabRef/LabRefEdit";
import { LabRefList } from "./LabRef/LabRefList";

export default function LabRef() {
  const [createModal, setCreateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [modifyModal, setModifyModal] = useState(false);

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
      <LabRefForm open={createModal} setOpen={handleHideCreateModal} />

      <LabRefList
        showCreateModal={handleShowCreateModal}
        showDetailModal={handleShowDetailModal}
        showEditModal={handleModifyModal}
      />
      <LabRefModify open={modifyModal} setOpen={handleHideModifyModal} />
    </section>
  );
}
