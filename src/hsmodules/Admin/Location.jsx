/* eslint-disable */
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ModalBox from "../../components/modal";
import { LocationForm } from "./locations/LocationForm";
import { LocationModify } from "./locations/LocationEdit";
import { LocationList } from "./locations/LocationList";


export default function Location() {
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
      <LocationForm open={createModal} setOpen={handleHideCreateModal} />

      <div className="columns ">
        <div className="column is-8">
          <LocationList
            showCreateModal={handleShowCreateModal}
            showDetailModal={handleShowDetailModal}
          />
        </div>
        <div className="column is-4 ">
          <ModalBox open={modifyModal} onClose={handleHideModifyModal}>
            <LocationModify />
          </ModalBox>
        </div>
      </div>
    </section>
  );
}







