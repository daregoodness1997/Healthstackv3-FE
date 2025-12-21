/* eslint-disable */
import React, { useState, useContext, useEffect } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import client from "../../feathers";
import { useForm } from "react-hook-form";
//import {useNavigate} from 'react-router-dom'
import { UserContext, ObjectContext } from "../../context";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "react-datepicker/dist/react-datepicker.css";
import ModalBox from "../../components/modal";
import { PageWrapper } from "../../ui/styled/styles";
import { TableMenu } from "../../ui/styled/global";
import FilterMenu from "../../components/utilities/FilterMenu";
import CustomTable from "../../components/customtable";
import EmptyData from "../../components/empty";
import { ExpiredInventoryStoreSchema, InventoryStoreSchema } from "./schema";
import Input from "../../components/inputs/basic/Input";
import { Box, Grid, Typography } from "@mui/material";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import { customStyles } from "../../components/customtable/styles";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import MuiCustomDatePicker from "../../components/inputs/Date/MuiDatePicker";
import PrintIcon from '@mui/icons-material/Print';

export default function Inventory() {
  const [selectedInventory, setSelectedInventory] = useState();
  const [detailModal, setDetailModal] = useState(false);
  const [expiredDetailModal, setExpiredDetailModal] = useState(false);
  const [modifyModal, setModifyModal] = useState(false);
  const [reorderModal, setRedorderModal] = useState(false);
  const [batchModal, setBatchModal] = useState(false);
  const [auditModal, setAuditModal] = useState(false);

  const [openExpiredPage, setOpenExpiredPage] = useState(false);
  const [openNearExpiredPage, setOpenNearExpiredPage] = useState(false);

  const handleOpenDetailModal = () => {
    setDetailModal(true);
  };

  const handleOpenExpiredDetailModal = () => {
    setExpiredDetailModal(true);
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
      {openExpiredPage ? (
        <ExpiredInventoryList
          setOpenExpiredPage={setOpenExpiredPage}
          setOpenNearExpiredPage={setOpenNearExpiredPage}
          //showcreateModal={handleCreateModal}
          openDetailModal={handleOpenExpiredDetailModal}
        />
      ) : openNearExpiredPage ? (
        <NearExpiredInventoryList
          setOpenExpiredPage={setOpenExpiredPage}
          setOpenNearExpiredPage={setOpenNearExpiredPage}
          //showcreateModal={handleCreateModal}
          openDetailModal={handleOpenDetailModal}
        />
      ) : (
        <InventoryList
          setOpenExpiredPage={setOpenExpiredPage}
          setOpenNearExpiredPage={setOpenNearExpiredPage}
          //showcreateModal={handleCreateModal}
          openDetailModal={handleOpenDetailModal}
        />
      )}

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
    </section>
  );
}

const CustomLoader = () => (
  <div style={{ padding: "24px" }}>
    <img src="/loading.gif" width={400} />
  </div>
);

export function InventoryList({
  // showcreateModal,
  openDetailModal,
  setOpenExpiredPage,
  setOpenNearExpiredPage,
}) {
  // const { register, handleSubmit, watch, errors } = useForm();

  const [error, setError] = useState(false);

  const [success, setSuccess] = useState(false);

  const [message, setMessage] = useState("");
  const InventoryServ = client.service("inventory");

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoadidng] = useState(false);

  const [selectedInventory, setSelectedInventory] = useState(); //

  const { state, setState } = useContext(ObjectContext);

  const { user, setUser } = useContext(UserContext);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  const handleRow = async (Inventory) => {
    //console.log(Inventory);
    const getInventoryById = await InventoryServ.get(Inventory._id);
    console.log(getInventoryById);
    setSelectedInventory(Inventory);
    const newInventoryModule = {
      selectedInventory: getInventoryById,
      show: "detail",
    };
    await setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
    //console.log(state)
    openDetailModal();
  };

  const handleSearch = (val) => {
    //console.log(val)
    InventoryServ.find({
      query: {
        $select: [
          "name",
          "quantity",
          "baseunit",
          "stockvalue",
          "costprice",
          "sellingprice",
          "reorder_level",
          "batches",
          "classification",
          "subclassification",
          "generic",
        ],
        $or: [
          {
            name: {
              $regex: val,
              $options: "i",
            },
          },
          {
            classification: {
              $regex: val,
              $options: "i",
            },
          },
          {
            subclassification: {
              $regex: val,
              $options: "i",
            },
          },
          {
            generic: {
              $regex: val,
              $options: "i",
            },
          },
        ],
        facility: user.currentEmployee.facilityDetail._id || "",
        storeId: state.StoreModule.selectedStore._id,
        $limit: 100,
        $sort: {
          name: 1,
        },
      },
    })
      .then((res) => {
        console.log(res);
        setFacilities(res.data);
        setTotal(res.total);
        setMessage(" Inventory  fetched successfully");
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        setMessage("Error fetching Inventory, probable network issues " + err);
        setError(true);
      });
  };

  const getNewInventories = async () => {
    if (state.StoreModule.selectedStore._id === undefined) {
      return
    }
    setLoadidng(true);
    if (user.currentEmployee) {
      const allInventory = await InventoryServ.find({
        query: {
          $select: [
            "name",
            "quantity",
            "baseunit",
            "stockvalue",
            "costprice",
            "sellingprice",
            "reorder_level",
            "batches",
          ],
          facility: user.currentEmployee.facilityDetail._id,
          storeId: state.StoreModule.selectedStore._id,
          $limit: limit,
          /*  $skip:page * limit, */
          $sort: {
            name: 1,
          },
        },
      });
      //console.log(allInventory.data);
      setFacilities(allInventory.data);
      setTotal(allInventory.total);
      setLoadidng(false);
    }
  };

  useEffect(() => {
    InventoryServ.on("created", (obj) => rest());
    InventoryServ.on("updated", (obj) => rest());
    InventoryServ.on("patched", (obj) => rest());
    InventoryServ.on("removed", (obj) => rest());
    return () => { };
  }, [limit, page]);

  const rest = async () => {
    //console.log("starting rest")
    setPage(0);
    setTotal(0);
    getNewInventories();
    //await  setPage(0)
  };

  useEffect(() => {
    rest();
    return () => { };
  }, [state.StoreModule.selectedStore]);

  useEffect(() => {
    console.log(page);
    return () => { };
  }, [page]);

  //todo: pagination and vertical scroll bar
  const handleCreate = () => { };
  const onRowClicked = () => { };

  //*******************CONDITION THAT SHOWS DIFFERENT ROW BACKGROUND COLOR BASED ON  A CERTAIN CONDITION MET************
  const conditionalRowStyles = [
    {
      when: (row) => row.buy,
      style: {
        backgroundColor: "pink",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];

  const totalStockValue =
    facilities.length > 0 &&
    facilities
      .map((item) => item.stockvalue)
      .reduce((prev, next) => Number(prev) + Number(next));

  const totalCostPrice =
    facilities.length > 0 &&
    facilities
      .map((item) => item.costprice)
      .reduce((prev, next) => Number(prev) + Number(next));

  const totalQuantity =
    facilities.length > 0 &&
    facilities
      .map((item) => item.quantity)
      .reduce((prev, next) => Number(prev) + Number(next));

  const footer = {
    name: "Sum Total",
    stockvalue: totalStockValue,
    costprice: totalCostPrice,
    quantity: totalQuantity,
    reorder_level: "",
  };

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  // generate printable HTML for current inventory list
  const generateInventoryHtml = (items = []) => {
    const rows = items
      .map((it, i) => {
        const qty = it.quantity ?? '';
        const unit = it.baseunit ?? '';
        const stockvalue = it.stockvalue != null ? Number(it.stockvalue).toLocaleString() : '';
        const costprice = it.costprice != null ? Number(it.costprice).toLocaleString() : '';
        const sellingprice = it.sellingprice != null ? Number(it.sellingprice).toLocaleString() : '';
        const reorder = it.reorder_level ?? '';
        return `
          <tr>
            <td style="padding:8px;border:1px solid #ddd;text-align:center">${i + 1}</td>
            <td style="padding:8px;border:1px solid #ddd">${it.name || ''}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center">${qty}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center">${unit}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right">${stockvalue}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right">${costprice}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right">${sellingprice}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center">${reorder}</td>
          </tr>
        `;
      })
      .join('');

    return `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Inventory Store</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; margin: 16px; color: #222; }
            h2 { margin: 0 0 12px 0; }
            table { border-collapse: collapse; width: 100%; margin-top: 8px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background:#f5f5f5; text-align:left; }
            .right { text-align:right; }
            .meta { margin-bottom:12px; font-size: 0.95rem; }
          </style>
        </head>
        <body>
          <h2>Inventory Store Report</h2>
          <div class="meta"><strong>Total Items:</strong> ${items.length}</div>
          <table>
            <thead>
              <tr>
                <th style="width:40px">#</th>
                <th>Name</th>
                <th style="width:80px">Quantity</th>
                <th style="width:80px">Unit</th>
                <th style="width:120px" class="right">Stock Value</th>
                <th style="width:120px" class="right">Cost Price</th>
                <th style="width:120px" class="right">Selling Price</th>
                <th style="width:100px">Reorder Level</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>`;
  };

  // print current facilities list
  const handlePrint = () => {
    if (!facilities || facilities.length === 0) {
      toast.info('No inventory to print');
      return;
    }
    const html = generateInventoryHtml(facilities);
    const w = window.open('', '_blank', 'width=1000,height=800');
    if (!w) {
      toast.error('Unable to open print window. Please allow popups for this site.');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    // allow rendering, then trigger print
    setTimeout(() => {
      w.print();
    }, 400);
  };

  return (
    <>
      {user ? (
        <>
          <PageWrapper
            style={{ flexDirection: "column", padding: "0.6rem 1rem" }}
          >
            <TableMenu>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {handleSearch && (
                  <div className="inner-table">
                    <FilterMenu onSearch={handleSearch} />
                  </div>
                )}
                <h2 style={{ marginLeft: "10px", fontSize: "0.95rem" }}>
                  Inventory Store
                </h2>
              </div>

              {facilities.length > 0 && (
                <Box sx={{ display: "flex" }} gap={0.5}>
                  <Typography sx={{ fontWeight: "600", fontSize: "0.85rem" }}>
                    Total Stock Value:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "0.85rem",
                      color: "#000000",
                    }}
                  >
                    {totalStockValue}
                  </Typography>
                </Box>
              )}
              {/* </div> */}
              <div style={{ display: "flex" }}>
                <GlobalCustomButton
                  onClick={() => {
                    setOpenNearExpiredPage(true);
                  }}
                  sx={{ marginRight: "15px" }}
                  size={"100%"}
                >
                  Near Expired Drugs
                </GlobalCustomButton>

                <GlobalCustomButton
                  onClick={() => {
                    setOpenExpiredPage(true);
                  }}
                  sx={{ marginRight: '15px' }}
                  size={"100%"}
                >
                  Expired Drugs
                </GlobalCustomButton>
                <GlobalCustomButton onClick={handlePrint} >
                  <PrintIcon fontSize="small" sx={{ marginRight: '5px' }} />
                  Print
                </GlobalCustomButton>
              </div>
            </TableMenu>

            <div
              style={{
                width: "100%",
                height: "calc(100vh - 170px)",
                overflowY: "auto",
              }}
            >
              <CustomTable
                title={""}
                columns={InventoryStoreSchema.filter(
                  (obj) => obj.selector && obj.inputType
                )}
                data={facilities.map((obj, i) => ({ ...obj, sn: i + 1 }))} //TODO: only add sn if it's in the schema, to improve performance here
                pointerOnHover={true}
                highlightOnHover={true}
                striped={true}
                customStyles={customStyles}
                onRowClicked={handleRow}
                fixedHeader={true}
                selectableRows={false}
                //onSelectedRowsChange={handleRow}
                fixedHeaderScrollHeight="100%"
                responsive
                dense={false}
                style={{
                  width: "100%",
                }}
                progressComponent={<CustomLoader />}
                progressPending={loading}
                noDataComponent={<EmptyData />}
                conditionalRowStyles={conditionalRowStyles}
                onChangeRowsPerPage={onTableChangeRowsPerPage}
                onChangePage={onTablePageChange}
                pagination
                paginationServer
                paginationTotalRows={total}
              />
            </div>
          </PageWrapper>
          ;
        </>
      ) : (
        <div>loading</div>
      )}
    </>
  );
}

//////Near Expiry

export function NearExpiredInventoryList({
  setOpenExpiredPage,
  setOpenNearExpiredPage,
}) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const InventoryServ = client.service("inventory");
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoadidng] = useState(false);

  const { state, setState } = useContext(ObjectContext);

  const { user, setUser } = useContext(UserContext);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  const returnNewData = (inventoryData) => {
    const currentDate = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    const data = inventoryData?.data.flatMap((item) => {
      // Filter batches that are either expired or near expiry
      return item.batches
        .filter((batch) => {
          const expiryDate = new Date(batch.expirydate);
          //return expiryDate <= sixMonthsFromNow;
          return expiryDate >= currentDate && expiryDate <= sixMonthsFromNow;
        })
        .map((batch) => {
          //const expiryDate = new Date(batch.expirydate);
          return {
            ...item,
            name: item.name,
            quantity: batch.quantity,
            batchNo: batch.batchNo,
            expiryDate: batch.expirydate,
            status: "Near Expiration",
          };
        });
    });
    return data;
  };

  const handleSearch = (val) => {
    //console.log(val)
    InventoryServ.find({
      query: {
        $select: [
          "name",
          "quantity",
          "batchNo",
          "expiryDate",
          "status",
          "reorder_level",
          "batches",
          "classification",
          "subclassification",
          "generic",
        ],
        $or: [
          {
            name: {
              $regex: val,
              $options: "i",
            },
          },
          {
            classification: {
              $regex: val,
              $options: "i",
            },
          },
          {
            subclassification: {
              $regex: val,
              $options: "i",
            },
          },
          {
            generic: {
              $regex: val,
              $options: "i",
            },
          },
        ],
        facility: user.currentEmployee.facilityDetail._id || "",
        storeId: state.StoreModule.selectedStore._id,
        $limit: 100,
        $sort: {
          name: 1,
        },
      },
    })
      .then((res) => {
        returnNewData(res);
        setFacilities(returnNewData(res));
        setTotal(returnNewData(res).length);
        setMessage(" Inventory  fetched successfully");
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        setMessage("Error fetching Inventory, probable network issues " + err);
        setError(true);
      });
  };

  const getNewInventories = async () => {
    setLoadidng(true);
    if (user.currentEmployee) {
      const allInventory = await InventoryServ.find({
        query: {
          $select: [
            "name",
            "quantity",
            "batchNo",
            "expiryDate",
            "status",
            "reorder_level",
            "batches",
          ],
          facility: user.currentEmployee.facilityDetail._id,
          storeId: state.StoreModule.selectedStore._id,

          $limit: 2000, //limit,
          /*  $skip:page * limit, */
          $sort: {
            name: 1,
          },
        },
      });
      const formattedItems = returnNewData(allInventory);
      setTotal(formattedItems.length);
      setFacilities(formattedItems);
      setLoadidng(false);

      if (allInventory.total > allInventory.data.length) {
        // setNext(true)
        setPage((page) => page + 1);
      } else {
        //setNext(fals
      }
    } else {
      if (user.stacker) {
        const findInventory = await InventoryServ.find({
          query: {
            $limit: 20,
            $sort: {
              createdAt: -1,
            },
          },
        });
        setFacilities(findInventory.data);
        setLoadidng(false);
      }
    }
  };

  useEffect(() => {
    InventoryServ.on("created", (obj) => rest());
    InventoryServ.on("updated", (obj) => rest());
    InventoryServ.on("patched", (obj) => rest());
    InventoryServ.on("removed", (obj) => rest());
    return () => { };
  }, []);

  const rest = async () => {
    //console.log("starting rest")
    setPage(0);
    setTotal(0);
    getNewInventories();
    //await  setPage(0)
  };

  // const updatelist = async (data) => {
  //   await setFacilities((prevdata) => prevdata.concat(data));
  // };

  useEffect(() => {
    rest();
    return () => { };
  }, [state.StoreModule.selectedStore]);

  useEffect(() => {
    console.log(page);
    return () => { };
  }, [page]);

  //*******************CONDITION THAT SHOWS DIFFERENT ROW BACKGROUND COLOR BASED ON  A CERTAIN CONDITION MET************
  const conditionalRowStyles = [
    {
      when: (row) => row.buy,
      style: {
        backgroundColor: "pink",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];

  return (
    <>
      {user ? (
        <>
          <PageWrapper
            style={{ flexDirection: "column", padding: "0.6rem 1rem" }}
          >
            <TableMenu>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <GlobalCustomButton
                  sx={{ marginRight: "10px" }}
                  onClick={() => {
                    setOpenNearExpiredPage(false);
                  }}
                >
                  <ArrowBackIcon sx={{ marginRight: "3px" }} fontSize="small" />
                  Back
                </GlobalCustomButton>

                {handleSearch && (
                  <div className="inner-table">
                    <FilterMenu onSearch={handleSearch} />
                  </div>
                )}
                <h2 style={{ marginLeft: "10px", fontSize: "0.95rem" }}>
                  Near Expired Drugs
                </h2>
              </div>

              <GlobalCustomButton
                sx={{ marginRight: "10px" }}
                onClick={() => {
                  setOpenExpiredPage(true);
                }}
              >
                Expired Drugs
              </GlobalCustomButton>
            </TableMenu>

            <div
              style={{
                width: "100%",
                height: "calc(100vh - 170px)",
                overflowY: "auto",
              }}
            >
              <CustomTable
                title={""}
                columns={ExpiredInventoryStoreSchema.filter(
                  (obj) => obj.selector && obj.inputType
                )}
                data={facilities.map((obj, i) => ({ ...obj, sn: i + 1 }))} //TODO: only add sn if it's in the schema, to improve performance here
                pointerOnHover={true}
                highlightOnHover={true}
                striped={true}
                customStyles={customStyles}
                //onRowClicked={handleRow}
                fixedHeader={true}
                selectableRows={false}
                //onSelectedRowsChange={handleRow}
                fixedHeaderScrollHeight="100%"
                responsive
                dense={false}
                style={{
                  width: "100%",
                }}
                progressComponent={<CustomLoader />}
                progressPending={loading}
                noDataComponent={<EmptyData />}
                conditionalRowStyles={conditionalRowStyles}
              />
            </div>
          </PageWrapper>
          ;
        </>
      ) : (
        <div>loading</div>
      )}
    </>
  );
}

//////////////Expired
export function ExpiredInventoryList({
  setOpenNearExpiredPage,
  setOpenExpiredPage,
}) {
  const [error, setError] = useState(false);

  const [success, setSuccess] = useState(false);

  const [message, setMessage] = useState("");
  const InventoryServ = client.service("inventory");
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoadidng] = useState(false);

  const { state, setState } = useContext(ObjectContext);

  const { user, setUser } = useContext(UserContext);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  const returnNewData = (inventoryData) => {
    const currentDate = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    //console.log(inventoryData);

    const data = inventoryData?.data.flatMap((item) => {
      // Filter batches that are either expired or near expiry
      return item.batches
        .filter((batch) => {
          const expiryDate = new Date(batch.expirydate);
          return expiryDate < currentDate;
        })
        .map((batch) => {
          //const expiryDate = new Date(batch.expirydate);
          return {
            ...item,
            name: item.name,
            quantity: batch.quantity,
            batchNo: batch.batchNo,
            expiryDate: batch.expirydate,
            status: "Expired",
          };
        });
    });
    return data;
  };

  const handleSearch = (val) => {
    //console.log(val)
    InventoryServ.find({
      query: {
        $select: [
          "name",
          "quantity",
          "batchNo",
          "expiryDate",
          "status",
          "reorder_level",
          "batches",
          "classification",
          "subclassification",
          "generic",
        ],
        $or: [
          {
            name: {
              $regex: val,
              $options: "i",
            },
          },
          {
            classification: {
              $regex: val,
              $options: "i",
            },
          },
          {
            subclassification: {
              $regex: val,
              $options: "i",
            },
          },
          {
            generic: {
              $regex: val,
              $options: "i",
            },
          },
        ],
        facility: user.currentEmployee.facilityDetail._id || "",
        storeId: state.StoreModule.selectedStore._id,
        $limit: 100,
        $sort: {
          name: 1,
        },
      },
    })
      .then((res) => {
        returnNewData(res);
        setFacilities(returnNewData(res));
        setTotal(returnNewData(res).length);
        setMessage(" Inventory  fetched successfully");
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        setMessage("Error fetching Inventory, probable network issues " + err);
        setError(true);
      });
  };

  const getNewInventories = async () => {
    setLoadidng(true);
    if (user.currentEmployee) {
      const allInventory = await InventoryServ.find({
        query: {
          $select: [
            "name",
            "quantity",
            "batchNo",
            "expiryDate",
            "status",
            "reorder_level",
            "batches",
          ],
          facility: user.currentEmployee.facilityDetail._id,
          storeId: state.StoreModule.selectedStore._id,
          $limit: 2000, //limit,
          /*  $skip:page * limit, */
          $sort: {
            name: 1,
          },
        },
      });
      const formattedItems = returnNewData(allInventory);
      console.log("Formatted items:", formattedItems);
      setTotal(formattedItems.length);
      setFacilities(formattedItems);
      setLoadidng(false);

      if (allInventory.total > allInventory.data.length) {
        // setNext(true)
        setPage((page) => page + 1);
      } else {
      }
    }
  };

  useEffect(() => {
    InventoryServ.on("created", (obj) => rest());
    InventoryServ.on("updated", (obj) => rest());
    InventoryServ.on("patched", (obj) => rest());
    InventoryServ.on("removed", (obj) => rest());
    return () => { };
  }, []);

  const rest = async () => {
    //console.log("starting rest")
    setPage(0);
    setTotal(0);
    getNewInventories();
    //await  setPage(0)
  };

  useEffect(() => {
    rest();
    return () => { };
  }, [state.StoreModule.selectedStore]);

  //*******************CONDITION THAT SHOWS DIFFERENT ROW BACKGROUND COLOR BASED ON  A CERTAIN CONDITION MET************
  const conditionalRowStyles = [
    {
      when: (row) => row.buy,
      style: {
        backgroundColor: "pink",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];

  return (
    <>
      {user ? (
        <>
          <PageWrapper
            style={{ flexDirection: "column", padding: "0.6rem 1rem" }}
          >
            <TableMenu>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <GlobalCustomButton
                  sx={{ marginRight: "10px" }}
                  onClick={() => {
                    setOpenExpiredPage(false);
                    setOpenNearExpiredPage(false);
                  }}
                >
                  <ArrowBackIcon sx={{ marginRight: "3px" }} fontSize="small" />
                  Back
                </GlobalCustomButton>

                {handleSearch && (
                  <div className="inner-table">
                    <FilterMenu onSearch={handleSearch} />
                  </div>
                )}
                <h2 style={{ marginLeft: "10px", fontSize: "0.95rem" }}>
                  Expired Drugs
                </h2>
              </div>

              <GlobalCustomButton
                sx={{ marginRight: "10px" }}
                onClick={() => {
                  setOpenExpiredPage(false);
                  setOpenNearExpiredPage(true);
                }}
              >
                Near Expiration Drugs
              </GlobalCustomButton>
            </TableMenu>

            <div
              style={{
                width: "100%",
                height: "calc(100vh - 170px)",
                overflowY: "auto",
              }}
            >
              <CustomTable
                title={""}
                columns={ExpiredInventoryStoreSchema.filter(
                  (obj) => obj.selector && obj.inputType
                )}
                data={facilities.map((obj, i) => ({ ...obj, sn: i + 1 }))} //TODO: only add sn if it's in the schema, to improve performance here
                pointerOnHover={true}
                highlightOnHover={true}
                striped={true}
                customStyles={customStyles}
                //onRowClicked={handleRow}
                fixedHeader={true}
                selectableRows={false}
                //onSelectedRowsChange={handleRow}
                fixedHeaderScrollHeight="100%"
                responsive
                dense={false}
                style={{
                  width: "100%",
                }}
                progressComponent={<CustomLoader />}
                progressPending={loading}
                noDataComponent={<EmptyData />}
                conditionalRowStyles={conditionalRowStyles}
              />
            </div>
          </PageWrapper>
          ;
        </>
      ) : (
        <div>loading</div>
      )}
    </>
  );
}

export function InventoryDetail({ openModals }) {
  const [error, setError] = useState(false); //,
  const [message, setMessage] = useState(""); //,
  const { state, setState } = useContext(ObjectContext);

  const Inventory = state.InventoryModule.selectedInventory;
  console.log("selected", Inventory);
  const handleSetPrice = async () => {
    const newInventoryModule = {
      selectedInventory: Inventory,
      show: "modify",
    };
    await setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
    //console.log(state)
    openModals("modify");
  };

  const handleReorder = async () => {
    const newInventoryModule = {
      selectedInventory: Inventory,
      show: "reorder",
    };
    await setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
    //console.log(state)
    openModals("reorder");
  };

  const handleBatch = async () => {
    const newInventoryModule = {
      selectedInventory: Inventory,
      show: "batch",
    };
    await setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
    //console.log(state)
    openModals("batch");
  };

  const handleAudit = async () => {
    const newInventoryModule = {
      selectedInventory: Inventory,
      show: "audit",
    };
    await setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));

    console.log(state);
    openModals("audit");
  };

  return (
    <>
      <Box
        container
        sx={{
          width: "500px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box item mb={2} pt={1}>
          <Input label="Inventory Name" value={Inventory.name} disabled />
        </Box>

        <Box
          item
          mb={3}
          sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <GlobalCustomButton
            onClick={handleSetPrice}
            sx={{ marginRight: "10px" }}
          >
            Set Price
          </GlobalCustomButton>

          <GlobalCustomButton
            sx={{
              textTransform: "capitalize",
              background: "#17935C",
              marginRight: "10px",
              "&:hover": {
                backgroundColor: "#17935C",
              },
            }}
            onClick={handleBatch}
          >
            Batches
          </GlobalCustomButton>

          <GlobalCustomButton
            onClick={handleReorder}
            sx={{ marginRight: "10px" }}
          >
            Reorder Level
          </GlobalCustomButton>

          <GlobalCustomButton variant="outlined" onClick={handleAudit}>
            Audit
          </GlobalCustomButton>
        </Box>

        {error && <Typography sx={{ color: "red" }}>{message}</Typography>}
      </Box>
    </>
  );
}

export function InventoryModify({ closeModal }) {
  const { register, handleSubmit, setValue, reset, errors } = useForm(); //watch, errors,

  const [success, setSuccess] = useState(false);
  const [billservice, setBillService] = useState();
  const { state, setState } = useContext(ObjectContext);
  const billServ = client.service("billing");

  const Inventory = state.InventoryModule.selectedInventory; // set inventory
  const handleSetPrice = async () => {
    const service = await billServ.get(Inventory.billingId); // get the service
    const contractSel = service.contracts.filter(
      (element) =>
        element.source_org === Inventory.facility &&
        element.dest_org === Inventory.facility
    );

    setValue("price", contractSel[0].price, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("oldprice", contractSel[0].price, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setBillService(service);
  };

  useEffect(() => {
    handleSetPrice();
    return () => { };
  }, []);

  const handleCancel = async () => {
    const newInventoryModule = {
      selectedInventory: {},
      show: "details",
    };
    await setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
    ////console.log(state)
    closeModal();
  };

  const changeState = () => {
    const newInventoryModule = {
      selectedInventory: {},
      show: "detail",
    };
    setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
  };

  const onSubmit = (data, e) => {
    e.preventDefault();
    setSuccess(false);
    const contractSel = billservice.contracts.filter(
      (element) =>
        element.source_org === Inventory.facility &&
        element.dest_org === Inventory.facility
    );
    contractSel[0].price = data.price;
    billServ
      .patch(billservice._id, billservice)
      .then((res) => {
        toast.success("Price updated succesfully");

        changeState();
        closeModal();
      })
      .catch((err) => {
        toast.error(`Error updating Price, probable network issues or ${err}`);
      });
  };

  return (
    <>
      <Box
        container
        sx={{
          width: "500px",
        }}
      >
        <Box
          item
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          mb={3}
        >
          <Typography>
            Set Price for {Inventory.name} per {Inventory.baseunit}
          </Typography>
        </Box>

        <Box item mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Input
                label="New Selling Price"
                register={register("price", { required: true })}
              />
            </Grid>

            <Grid item xs={6}>
              <Input
                label="Old Selling Price"
                register={register("oldprice", { required: true })}
                disabled
              />
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            display: "flex",
          }}
        >
          <GlobalCustomButton
            sx={{
              marginRight: "15px",
            }}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </GlobalCustomButton>

          <GlobalCustomButton
            variant="outlined"
            color="warning"
            onClick={handleCancel}
          >
            Cancel
          </GlobalCustomButton>
        </Box>
      </Box>
    </>
  );
}

export function InventoryReorder({ closeModal }) {
  const { register, handleSubmit, setValue, reset, errors } = useForm(); //watch, errors,

  const [success, setSuccess] = useState(false);

  const InventoryServ = client.service("inventory");
  const { state, setState } = useContext(ObjectContext);
  const Inventory = state.InventoryModule.selectedInventory; // set inventory

  useEffect(() => {
    setValue("reorder_level", Inventory.reorder_level, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("oldlevel", Inventory.reorder_level, {
      shouldValidate: true,
      shouldDirty: true,
    });

    return () => { };
  }, []);

  const handleCancel = async () => {
    const newInventoryModule = {
      selectedInventory: {},
      show: "detail",
    };
    await setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
    closeModal();
  };

  const changeState = () => {
    const newInventoryModule = {
      selectedInventory: {},
      show: "detail",
    };
    setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
  };

  const onSubmit = (data, e) => {
    e.preventDefault();
    setSuccess(false);
    InventoryServ.patch(Inventory._id, {
      reorder_level: data.reorder_level,
    })
      .then((res) => {
        toast.success("Reorder level updated succesfully");
        changeState();
        closeModal();
      })
      .catch((err) => {
        toast.error(
          `Error updating Reorder level, probable network issues or  ${err}`
        );
      });
  };

  return (
    <>
      <Box
        container
        sx={{
          width: "550px",
        }}
      >
        <Box
          item
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          mb={3}
        >
          <Typography>Set ReOrder Level for {Inventory.name}</Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box item mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Input
                  register={register("reorder_level", { required: true })}
                  name="reorder_level"
                  type="text"
                  label="New Reorder Level"
                />
              </Grid>

              <Grid item xs={6}>
                <Input
                  register={register("oldlevel")}
                  disabled
                  name="oldlevel"
                  type="text"
                  label="Old Reorder Level"
                />
              </Grid>
            </Grid>
          </Box>
        </form>

        <Box
          sx={{
            display: "flex",
          }}
        >
          <GlobalCustomButton
            sx={{
              marginRight: "15px",
            }}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </GlobalCustomButton>

          <GlobalCustomButton
            variant="outlined"
            onClick={handleCancel}
            color="warning"
          >
            Cancel
          </GlobalCustomButton>
        </Box>
      </Box>
    </>
  );
}

export function InventoryBatches({ closeModal }) {
  const { handleSubmit } = useForm(); //watch, errors,
  const [success, setSuccess] = useState(false);
  const InventoryServ = client.service("inventory");
  //const navigate=useNavigate()
  const { state, setState } = useContext(ObjectContext);
  const [batchNo, setBatchNo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expirydate, setExpiryDate] = useState("");
  const [productItem, setProductItem] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const Inventory = state.InventoryModule.selectedInventory;

  useEffect(() => {
    setProductItem(Inventory.batches);
    return () => { };
  }, []);

  const handleClickProd = async () => {
    if (!batchNo || !quantity || !expirydate) {
      toast({
        message: "Kindly enter Batch Number,expiry date and quantity",
        type: "is-danger",
        dismissible: true,
        pauseOnHover: true,
      });
      return;
    }
    let productItemI = {
      batchNo,
      expirydate,
      quantity,
    };
    //  await setSuccess(false)
    setProductItem((prevProd) => prevProd.concat(productItemI));
    setBatchNo("");
    setQuantity("");
    setExpiryDate("");
  };

  const handleCancel = async () => {
    const newInventoryModule = {
      selectedInventory: {},
      show: "details",
    };
    await setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
    ////console.log(state)
    closeModal();
  };

  const changeState = () => {
    const newInventoryModule = {
      selectedInventory: {},
      show: "details",
    };
    setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
  };

  const onSubmit = (data, e) => {
    e.preventDefault();

    setSuccess(false);
    InventoryServ.patch(Inventory._id, {
      batches: productItem,
    })
      .then((res) => {
        toast.success("Batch updated succesfully");

        changeState();
        closeModal();
      })
      .catch((err) => {
        toast.error(`Error updating Batch, probable network issues or ${err}`);
      });
  };

  const handleBatchdel = (obj, i) => {
    setProductItem((obj) => obj.filter((el, index) => index !== i));
    setConfirmDialog(false);
    //}
  };

  const batchesSchema = [
    {
      name: "S/NO",
      width: "70px",
      key: "sn",
      description: "Enter name of Disease",
      selector: (row, i) => i + 1,
      sortable: true,
      required: true,
      inputType: "HIDDEN",
    },
    {
      name: "Batch",
      key: "batchNo",
      description: "Enter Batch",
      selector: (row) => row.batchNo,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Quantity",
      key: "quantity",
      description: "Enter Quantity",
      selector: (row) => row.quantity,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Expiry Date",
      style: (row) => ({ color: row.expiry && "#ffffff" }),
      key: "expirydate",
      description: "Enter Date",
      selector: (row) =>
        row.expirydate
          ? format(new Date(row.expirydate), "dd-MM-yy")
          : "--------",
      sortable: true,
      required: true,
      inputType: "DATE",
    },
    {
      name: "Actions",
      key: "category",
      description: "Enter Category",
      selector: (row, i) => (
        <span
          style={{ color: "red", fontSize: "inherit" }}
          onClick={() => handleBatchdel(row, i)}
        >
          delete
        </span>
      ),
      sortable: true,
      required: true,
      inputType: "BUTTON",
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.expiry,
      style: {
        backgroundColor: "pink",
        color: "#ffffff !important",
      },
    },
  ];

  return (
    <Box
      container
      sx={{
        width: "600px",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={() => setConfirmDialog(false)}
        confirmationAction={handleBatchdel}
        type="danger"
        message="Are you sure you want to delete this batch?"
      />
      <Box
        container
        sx={{
          width: "100%",
        }}
      >
        <Box
          item
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          mb={1}
        >
          <Typography
            sx={{
              fontSize: ".9rem",
            }}
          >
            Batches for {Inventory.name}
          </Typography>
          <GlobalCustomButton onClick={handleClickProd}>
            <AddCircleOutlineIcon
              sx={{ marginRight: "5px" }}
              fontSize="small"
            />
            Add
          </GlobalCustomButton>
        </Box>

        <Box item mb={2}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Input
                name="batchNo"
                value={batchNo}
                type="text"
                onChange={(e) => setBatchNo(e.target.value)}
                label="Batch Number"
              />
            </Grid>
            <Grid item xs={4}>
              <MuiCustomDatePicker
                label="Expiry Date"
                value={expirydate}
                handleChange={(value) => setExpiryDate(value)}
                format="dd/MM/yyyy"
              />
            </Grid>
            <Grid item xs={4}>
              <Input
                name="quantity"
                value={quantity}
                type="text"
                onChange={(e) => setQuantity(e.target.value)}
                label="Quantity"
              />
            </Grid>
          </Grid>
        </Box>
      </Box>

      {productItem.length > 0 && (
        <Box
          sx={{
            width: "100%",
            overflowY: "auto",
          }}
          mb={2}
        >
          <CustomTable
            title={""}
            columns={batchesSchema}
            data={productItem}
            pointerOnHover
            highlightOnHover
            striped
            onRowClicked={(row, i) => onRowClicked(row, i)}
            progressPending={false}
            conditionalRowStyles={conditionalRowStyles}
          />
        </Box>
      )}

      <Box container>
        <GlobalCustomButton
          sx={{
            marginRight: "15px",
          }}
          onClick={handleSubmit(onSubmit)}
        >
          Save
        </GlobalCustomButton>

        <GlobalCustomButton
          variant="outlined"
          color="warning"
          onClick={handleCancel}
        >
          Cancel
        </GlobalCustomButton>
      </Box>
    </Box>
  );
}
