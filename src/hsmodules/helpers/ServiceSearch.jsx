/* eslint-disable */
import React, { useState, useContext, useEffect, useRef } from 'react';
import client from '../../feathers';
import { UserContext, ObjectContext } from '../../context';
import { toast } from 'bulma-toast';
import { ServicesCreate } from '../Finance/Services';
import { AutoComplete, Button } from 'antd';
import ModalBox from '../../components/modal';

const searchfacility = {};

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

export default function ServiceSearch({
  getSearchfacility,
  clear,
  mode,
  label,
}) {
  const { user } = useContext(UserContext);
  const productServ = client.service('billing');
  const [facilities, setFacilities] = useState([]);

  const [searchError, setSearchError] = useState(false);

  const [showPanel, setShowPanel] = useState(false);

  const [searchMessage, setSearchMessage] = useState('');

  const [simpa, setSimpa] = useState('');

  const [chosen, setChosen] = useState(false);

  const [count, setCount] = useState(0);
  const inputEl = useRef(null);
  const [val, setVal] = useState('');
  const [productModal, setProductModal] = useState(false);

  const dropDownRef = useRef(null);

  const handleRow = async (obj) => {
    setChosen(true);
    //alert("something is chaning")
    setSimpa(obj.name);
    getSearchfacility(obj);

    // setSelectedFacility(obj)
    setShowPanel(false);
  };
  const handleBlur = async (e) => {};
  const handleSearch = async (value) => {
    // console.log(mode);
    setVal(value);
    if (value === '') {
      setShowPanel(false);
      getSearchfacility(false);
      setFacilities([]);
      return;
    }
    const field = 'name'; //field variable

    if (value.length >= 3) {
      console.log(mode);
      if (mode.value === 'Cash' || mode.value === 'Family Cover') {
        productServ
          .find({
            query: {
              //service
              name: {
                $regex: value,
                $options: 'i',
              },
              facility: user.currentEmployee.facilityDetail._id,
              $limit: 10,
              $sort: {
                createdAt: -1,
              },
            },
          })
          .then((res) => {
            // console.log("product  fetched successfully")
            console.log(res.data, 'services');
            res.data.map((obj, index) => {
              return console.log(obj.contracts.length);
            });
            setFacilities(res.data);
            setSearchMessage(' product  fetched successfully');
            setShowPanel(true);
          })
          .catch((err) => {
            toast({
              message: 'Error creating Services ' + err,
              type: 'is-danger',
              dismissible: true,
              pauseOnHover: true,
            });
          });
      }
      if (mode.value === 'CompanyCover') {
        //if it is hmo or company cover
        //band of hospital
        //hmo facility Id
        productServ
          .find({
            query: {
              //service
              name: {
                $regex: value,
                $options: 'i',
              },
              facility: user.currentEmployee.facilityDetail._id,
              $limit: 10,
              $sort: {
                createdAt: -1,
              },
            },
          })
          .then((res) => {
            // console.log("product  fetched successfully")
            //console.log(res.data)
            setFacilities(res.data);
            setSearchMessage(' product  fetched successfully');
            setShowPanel(true);
          })
          .catch((err) => {
            toast({
              message: 'Error creating Services ' + err,
              type: 'is-danger',
              dismissible: true,
              pauseOnHover: true,
            });
          });
      }
      if (mode.value === 'HMOCover') {
        //if it is hmo or company cover
        //band of hospital
        //hmo facility Id
        //check if the hmo is a state hmo or not
        // console.log(mode);
        if (true) {
          productServ
            .find({
              query: {
                //service
                name: {
                  $regex: value,
                  $options: 'i',
                },
                /*  facility: mode.detail.organizationId,
                mode: "HMOCover",
                dest_org: user.currentEmployee.facilityDetail._id, */
                facility: user.currentEmployee.facilityDetail._id,
                $limit: 10,
                $sort: {
                  createdAt: -1,
                },
              },
            })
            .then((res) => {
              // console.log("product  fetched successfully")
              //console.log(res.data)
              setFacilities(res.data);
              setSearchMessage(' product  fetched successfully');
              setShowPanel(true);
            })
            .catch((err) => {
              toast({
                message: 'Error creating Services ' + err,
                type: 'is-danger',
                dismissible: true,
                pauseOnHover: true,
              });
            });
        }
      }
    } else {
      // console.log("less than 3 ")
      //console.log(val)
      setShowPanel(false);
      await setFacilities([]);
      //console.log(facilities)
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
      //console.log("success has changed",clear)
      setSimpa('');
    }
    return () => {};
  }, [clear]);

  useOnClickOutside(dropDownRef, () => setShowPanel(false));

  const options = facilities.map((item) => ({
    value: item._id,
    label: `${item.name} - ${item.category}`,
    data: item,
  }));

  // Add "Create new" option if user is typing
  if (val && val.length >= 3) {
    options.push({
      value: 'create-new',
      label: `Add "${val}" to Services`,
      data: null,
    });
  }

  return (
    <div style={{ width: '100%' }}>
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
        placeholder={label || 'Search for Service'}
        allowClear
        notFoundContent={val !== '' ? `${val} Not Found` : 'Type something'}
        style={{ width: '100%' }}
        ref={inputEl}
      />

      <ModalBox
        open={productModal}
        onClose={handlecloseModal}
        header="Create Service"
      >
        <ServicesCreate />
      </ModalBox>
    </div>
  );
}
