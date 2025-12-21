import { useState } from "react";
import ModalBox from "../../../components/modal";
import { ProductEntryCreate } from "../../inventory/ProductEntry";
import { InventoryCreate } from "./InventoryCreate";
import { InventoryList } from "./InventoryList";
import InventoryModify from "./InvenoryModify";
import InventoryDetail from "./InventoryDetail";
import InventoryReorder from "./InventoryReorder";
import InventoryBatches from "./InventoryBatches";

export default function BloodBankInventory() {
  // eslint-disable-next-line no-unused-vars
  const [selectedInventory, setSelectedInventory] = useState();
  const [createModal, setCreateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [modifyModal, setModifyModal] = useState(false);
  const [reorderModal, setRedorderModal] = useState(false);
  const [batchModal, setBatchModal] = useState(false);
  const [auditModal, setAuditModal] = useState(false);

  const handleCreateModal = () => {
    setCreateModal(true);
  };
  const handleHideCreateModal = () => {
    setCreateModal(false);
  };

  const handleOpenDetailModal = () => {
    setDetailModal(true);
  };

  const handleOpenModals = (type) => {
    switch (type) {
      case "modify":
        setModifyModal(true);
        break;

      case "reorder":
        setRedorderModal(true);
        break;

      case "batch":
        setBatchModal(true);
        break;

      case "audit":
        setAuditModal(true);
        break;

      default:
        null;
    }
  };

  const handleCloseModals = (type) => {
    switch (type) {
      case "modify":
        setModifyModal(false);
        setDetailModal(false);
        break;

      case "reorder":
        setRedorderModal(false);
        setDetailModal(false);
        break;

      case "batch":
        setBatchModal(false);
        setDetailModal(false);
        break;

      case "audit":
        setAuditModal(false);
        setDetailModal(false);
        break;

      default:
        null;
      // code block
    }
  };

  return (
    <section>
      <InventoryList
        showcreateModal={handleCreateModal}
        openDetailModal={handleOpenDetailModal}
      />

      <ModalBox
        open={createModal}
        onClose={handleHideCreateModal}
        header="Create Inventory: Product Entry- Initialization, Purchase Invoice, Audit"
      >
        <InventoryCreate closeModal={handleHideCreateModal} />
      </ModalBox>

      <ModalBox
        open={detailModal}
        onClose={() => setDetailModal(false)}
        header="Inventory Detail"
      >
        <InventoryDetail openModals={handleOpenModals} />
      </ModalBox>

      <ModalBox open={modifyModal}>
        <InventoryModify
          Inventory={selectedInventory}
          closeModal={() => handleCloseModals("modify")}
        />
      </ModalBox>

      <ModalBox open={reorderModal}>
        <InventoryReorder
          Inventory={selectedInventory}
          closeModal={() => handleCloseModals("reorder")}
        />
      </ModalBox>

      <ModalBox open={batchModal}>
        <InventoryBatches
          Inventory={selectedInventory}
          closeModal={() => handleCloseModals("batch")}
        />
      </ModalBox>

      <ModalBox
        open={auditModal}
        onClose={() => handleCloseModals("audit")}
        header="Create ProductEntry: Initialization, Purchase Invoice, Audit"
      >
        <ProductEntryCreate Inventory={selectedInventory} />
      </ModalBox>
    </section>
  );
}
