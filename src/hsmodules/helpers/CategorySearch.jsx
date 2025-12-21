import React, { useState, useContext, useEffect, useRef } from 'react';
import client from '../../feathers';
import { UserContext, ObjectContext } from '../../context';
import { toast } from 'bulma-toast';
import { AutoComplete } from 'antd';

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

export default function CategorySearch({
  id,
  getSearchfacility,
  clear,
  disable = false,
  label,
}) {
  const ClientServ = client.service('billing');
  const [facilities, setFacilities] = useState([]);
  // eslint-disable-next-line
  const [searchError, setSearchError] = useState(false);
  // eslint-disable-next-line
  const [showPanel, setShowPanel] = useState(false);
  // eslint-disable-next-line
  const [searchMessage, setSearchMessage] = useState('');

  const [simpa, setSimpa] = useState('');
  // eslint-disable-next-line
  const [chosen, setChosen] = useState(false);
  // eslint-disable-next-line
  const [count, setCount] = useState(0);
  const inputEl = useRef(null);
  const [val, setVal] = useState('');
  const { user } = useContext(UserContext);
  const { state } = useContext(ObjectContext);
  const [productModal, setProductModal] = useState(false);

  const dropDownRef = useRef(null);

  const getInitial = async (id) => {
    //console.log(id);
    if (id) {
      let obj = {
        categoryname: id,
      };
      console.log(obj);
      handleRow(obj);
    }
  };

  useEffect(() => {
    getInitial(id);
    return () => {};
  }, []);

  const handleRow = async (obj) => {
    // console.log(obj);
    setChosen(true);
    //alert("something is chaning")

    setSimpa(obj.categoryname);
    getSearchfacility(obj);
    // setSelectedFacility(obj)
    setShowPanel(false);
    setCount(2);
  };

  const handleSearch = async (val) => {
    setVal(val);
    if (val === '') {
      setShowPanel(false);
      getSearchfacility(false);
      return;
    }

    if (val.length >= 3) {
      ClientServ.find({
        query: {
          category: {
            $regex: val,
            $options: 'i',
          },

          $limit: 1000,
          $sort: {
            category: 1,
          },
        },
      })
        .then((res) => {
          setFacilities(res.groupedOrder);
          setSearchMessage('Service category fetched successfully');
          setShowPanel(true);
        })
        .catch((err) => {
          toast({
            message: 'Error searching Service category  ' + err,
            type: 'is-danger',
            dismissible: true,
            pauseOnHover: true,
          });
        });
    } else {
      // console.log("less than 3 ");
      // console.log(val);
      setShowPanel(false);
      await setFacilities([]);
      //console.log(facilities);
    }
  };

  const handleAddproduct = () => {
    let obj = {
      categoryname: val,
    };
    //console.log(obj);
    setSimpa(val);
    handleRow(obj);

    // setProductModal(true)
  };

  const handlecloseModal = () => {
    setProductModal(false);
    handleSearch(val);
  };

  useEffect(() => {
    if (clear) {
      // console.log("success has changed", clear);
      setSimpa('');
    }
    return () => {};
  }, [clear]);

  useOnClickOutside(dropDownRef, () => setShowPanel(false));

  const options = facilities.map((item) => ({
    value: item.categoryname,
    label: item.categoryname,
    data: item,
  }));

  if (
    val &&
    val.length >= 3 &&
    !facilities.find((f) => f.categoryname.toLowerCase() === val.toLowerCase())
  ) {
    options.push({
      value: 'create-new',
      label: `Create category: "${val}"`,
      data: null,
    });
  }

  return (
    <div>
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
        }}
        placeholder={label || 'Search for Category'}
        allowClear
        disabled={disable}
        style={{ width: '100%' }}
        ref={inputEl}
      />
    </div>
  );
}
