/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import client from '../../feathers';
import { toast } from 'react-toastify';
import { ProductCreate } from '../../hsmodules/Pharmacy/Products';
import 'react-datepicker/dist/react-datepicker.css';
import ModalBox from '../../components/modal';
import { AutoComplete } from 'antd';

export default function ProductSearchHelper({
  getSearchfacility,
  clear,
  label,
}) {
  const productServ = client.service('products');
  const [facilities, setFacilities] = useState([]);
  const [simpa, setSimpa] = useState('');
  const inputEl = useRef(null);
  const [val, setVal] = useState('');
  const [productModal, setProductModal] = useState(false);

  const handleRow = async (obj) => {
    getSearchfacility(obj);
    setSimpa(obj?.name);
  };

  const handleSearch = async (value) => {
    setVal(value);
    if (value === '') {
      return;
    }
    const field = 'name';

    if (value.length >= 3) {
      productServ
        .find({
          query: {
            [field]: {
              $regex: value,
              $options: 'i',
            },
            $limit: 10,
            $sort: {
              createdAt: -1,
            },
          },
        })
        .then((res) => {
          setFacilities(res.data);
        })
        .catch((err) => {
          toast.error('Error creating ProductEntry ' + err);
        });
    } else {
      setFacilities([]);
    }
  };

  const handleAddproduct = () => {
    setProductModal(true);
  };
  const handlecloseModal = () => {
    setProductModal(false);
    handleSearch(val);
  };
  useEffect(() => {
    if (clear) {
      setSimpa('');
    }
    return () => {};
  }, [clear]);

  const options = facilities.map((item) => ({
    value: item._id,
    label: `${item.name} - ${item.category}`,
    data: item,
  }));

  // Add "Create new" option if user is typing
  if (val && val.length >= 3) {
    options.push({
      value: 'create-new',
      label: `Add "${val}" to Products`,
      data: null,
    });
  }

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <AutoComplete
        value={simpa}
        options={options}
        onSearch={handleSearch}
        onSelect={(selectedValue, option) => {
          if (selectedValue === 'create-new') {
            handleAddproduct();
          } else {
            handleRow(option.data);
          }
        }}
        onClear={() => {
          setSimpa('');
          setVal('');
        }}
        placeholder={label || 'Search for Product'}
        allowClear
        style={{ width: '100%' }}
        ref={inputEl}
      />

      <ModalBox
        open={productModal}
        onClose={handlecloseModal}
        header="Create New Product"
      >
        <ProductCreate closeModal={handlecloseModal} />
      </ModalBox>
    </div>
  );
}
