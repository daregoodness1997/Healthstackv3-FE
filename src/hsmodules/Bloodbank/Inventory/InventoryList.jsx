/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import client from "../../../feathers";
import { ObjectContext, UserContext } from "../../../context";
import { PageWrapper } from "../../../ui/styled/styles";
import { TableMenu } from "../../../ui/styled/global";
import FilterMenu from "../../../components/utilities/FilterMenu";
import CustomTable from "../../../components/customtable";
import { InventoryStoreSchema } from "../../inventory/schema";

// eslint-disable-next-line react/prop-types
export function InventoryList({ openDetailModal }) {
  const InventoryServ = client.service("inventory");
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { state, setState } = useContext(ObjectContext);

  const { user } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const handleRow = async (Inventory) => {
    const newInventoryModule = {
      selectedInventory: Inventory,
      show: "detail",
    };
    await setState((prevstate) => ({
      ...prevstate,
      InventoryModule: newInventoryModule,
    }));
    openDetailModal();
  };

  const handleSearch = (val) => {
    const field = "name";
    InventoryServ.find({
      query: {
        [field]: {
          $regex: val,
          $options: "i",
        },
        facility: user.currentEmployee.facilityDetail._id || "",
        storeId: state.StoreModule.selectedStore._id,
        $limit: limit,
        $sort: {
          name: 1,
        },
      },
    })
      .then((res) => {
        setFacilities(res.data);
        setTotal(res.total);
      })
      .catch((err) => {
        return err;
      });
  };

  const getNewInventories = async () => {
    if (user.currentEmployee) {
      const allInventory = await InventoryServ.find({
        query: {
          facility: user.currentEmployee.facilityDetail._id,
          storeId: state.StoreModule.selectedStore._id,
          $limit: limit,
          $skip: (page - 1) * limit,
          $sort: {
            name: 1,
          },
        },
      });

      setTotal(allInventory.total);
      setFacilities(allInventory.data);

      if (allInventory.total > allInventory.data.length) {
        // setNext(true)
        setPage((page) => page + 1);
      } else {
        //setNext(false)
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
      }
    }
  };

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    getNewInventories();
    InventoryServ.on("created", () => getNewInventories());
    InventoryServ.on("updated", () => getNewInventories());
    InventoryServ.on("patched", () => getNewInventories());
    InventoryServ.on("removed", () => getNewInventories());
    return () => {};
  }, [limit, page, state.StoreModule.selectedStore]);

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
            style={{
              flexDirection: "column",
              padding: "0.6rem 1rem",
            }}
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
                <h2
                  style={{
                    marginLeft: "10px",
                    fontSize: "0.95rem",
                  }}
                >
                  BloodBank Inventory
                </h2>
              </div>
            </TableMenu>

            <div
              style={{
                width: "100%",
                height: "calc(100vh - 170px)",
              }}
            >
              <CustomTable
                title=""
                columns={InventoryStoreSchema.filter(
                  (obj) => obj.selector && obj.inputType
                )}
                data={facilities.map((obj, i) => ({
                  ...obj,
                  sn: i + 1,
                }))} //TODO: only add sn if it's in the schema, to improve performance here
                pointerOnHover
                highlightOnHover
                striped
                onRowClicked={handleRow}
                conditionalRowStyles={conditionalRowStyles}
                progressPending={loading}
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
