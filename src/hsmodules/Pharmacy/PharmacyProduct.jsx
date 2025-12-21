/* eslint-disable */
import React, { useState, useContext, useEffect } from 'react';
import client from '../../feathers';
import { UserContext } from '../../context';
import { toast } from 'react-toastify';
import CustomTable from '../../components/customtable';
import ModalBox from '../../components/modal';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import { ProductCreate, ProductModify } from './Products';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, Tooltip } from '@mui/material';
import FilterMenu from '../../components/utilities/FilterMenu';
import { PageWrapper } from '../../ui/styled/styles';
import { TableMenu } from '../../ui/styled/global';
import CustomConfirmationDialog from '../../components/confirm-dialog/confirm-dialog';

export default function PharmacyProduct() {
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const { user } = useContext(UserContext);
  const ProductServ = client.service('products');

  // Fetch products
  const getProducts = async () => {
    setLoading(true);
    try {
      const result = await ProductServ.find({
        query: {
          // facility: user.currentEmployee.facilityDetail._id,
          $limit: limit,
          $skip: page * limit,
          $sort: { createdAt: -1 },
        },
      });
      setProducts(result.data);
      setTotal(result.total);
    } catch (err) {
      toast.error('Error fetching products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const handleSearch = async (val) => {
    if (!val || val.length < 2) {
      getProducts();
      return;
    }

    setLoading(true);
    try {
      const result = await ProductServ.find({
        query: {
          $or: [
            { name: { $regex: val, $options: 'i' } },
            { category: { $regex: val, $options: 'i' } },
            { classification: { $regex: val, $options: 'i' } },
          ],
          $limit: 100,
          $sort: { name: 1 },
        },
      });
      setProducts(result.data);
      setTotal(result.total);
    } catch (err) {
      toast.error('Error searching products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getProducts();
    }
    // Real-time updates
    ProductServ.on('created', () => getProducts());
    ProductServ.on('updated', () => getProducts());
    ProductServ.on('patched', () => getProducts());
    ProductServ.on('removed', () => getProducts());
    return () => { };
  }, [page, limit]);

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setEditModal(true);
  };

  const handleDelete = async () => {
    try {
      await ProductServ.remove(productToDelete._id);
      toast.success('Product deleted successfully');
      setConfirmDialog(false);
      setProductToDelete(null);
    } catch (err) {
      toast.error('Error deleting product: ' + err.message);
      setConfirmDialog(false);
    }
  };

  const handleConfirmDelete = (product) => {
    setProductToDelete(product);
    setConfirmDialog(true);
  };

  const handleCancelDelete = () => {
    setProductToDelete(null);
    setConfirmDialog(false);
  };

  const handleCloseCreateModal = () => {
    setCreateModal(false);
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    setSelectedProduct(null);
  };

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(0);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage - 1);
  };

  const columns = [
    {
      name: 'S/No',
      selector: (row, i) => i + 1 + page * limit,
      width: '70px',
      sortable: false,
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
      grow: 2,
    },
    {
      name: 'Base Unit',
      selector: (row) => row.baseunit,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Category',
      selector: (row) => row.category,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Classification',
      selector: (row) => row.classification || '-',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Generic',
      selector: (row) => row.generic || '-',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Actions',
      width: '120px',
      cell: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleConfirmDelete(row);
              }}
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      <PageWrapper style={{ flexDirection: 'column', padding: '0.6rem 1rem' }}>
        <TableMenu>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="inner-table">
              <FilterMenu onSearch={handleSearch} />
            </div>
            <h2 style={{ marginLeft: '10px', fontSize: '0.95rem' }}>
              Product
            </h2>
          </div>
          <GlobalCustomButton onClick={() => setCreateModal(true)}>
            <AddCircleOutline sx={{ marginRight: '5px' }} fontSize="small" />
            Add New Product
          </GlobalCustomButton>
        </TableMenu>

        <Box
          sx={{
            width: '100%',
            height: 'calc(100vh - 100px)',
            overflowY: 'auto',
          }}
        >
          <CustomTable
            title=""
            columns={columns}
            data={products}
            progressPending={loading}
            onRowClicked={handleRowClick}
            pointerOnHover
            highlightOnHover
            striped
            pagination
            paginationServer
            paginationTotalRows={total}
            onChangeRowsPerPage={onTableChangeRowsPerPage}
            onChangePage={onTablePageChange}
          />
        </Box>
      </PageWrapper>

      <ModalBox
        open={createModal}
        onClose={handleCloseCreateModal}
        header="Create New Product"
      >
        <ProductCreate closeModal={handleCloseCreateModal} />
      </ModalBox>

      <ModalBox
        open={editModal}
        onClose={handleCloseEditModal}
        header="Edit Product"
      >
        {selectedProduct && (
          <ProductModify
            product={selectedProduct}
            closeModal={handleCloseEditModal}
          />
        )}
      </ModalBox>

      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={handleCancelDelete}
        confirmationAction={handleDelete}
        message={`Are you sure you want to delete "${productToDelete?.name}"?`}
      />
    </>
  );
}
