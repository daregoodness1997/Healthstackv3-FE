import React, { useState, useContext, useEffect, useRef } from 'react';
import client from '../../feathers';
import { UserContext, ObjectContext } from '../../context';
import { toast } from 'bulma-toast';
import { formatDistanceToNowStrict } from 'date-fns';
import { AutoComplete } from 'antd';
import ModalBox from './ui-components/modal';

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

export function ClientSearch({
  getSearchfacility = () => {},
  clear,
  label,
  id,
  patient,
  disabled,
  value,
  isPhone = false,
}) {
  const ClientServ = client.service('client');
  const [facilities, setFacilities] = useState([]);
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
  const { state, setState } = useContext(ObjectContext);
  const [productModal, setProductModal] = useState(false);

  const dropDownRef = useRef(null);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const getData = setTimeout(() => {
      handleSearch(search);
      // console.log(search);
    }, 1000);

    return () => clearTimeout(getData);
  }, [search]);

  const getInitial = async (id) => {
    //console.log("ID from client search", id);
    if (id) {
      //console.log(id);
      await ClientServ.get(id)
        .then((resp) => {
          // console.log(resp, 'client');
          handleRow(resp);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getInitial(id);
    return () => {};
  }, [id]);

  const handleRow = async (obj) => {
    await setChosen(true);
    getSearchfacility(obj);
    const newBandModule = {
      selectedClient: obj,
      show: 'modify',
    };
    await setState((prevstate) => ({
      ...prevstate,
      ClientModule: newBandModule,
    }));
    if (isPhone) {
      setSimpa(obj.phone);
    } else {
      setSimpa(obj.firstname + ' ' + obj.middlename + ' ' + obj.lastname);
    }
    setShowPanel(false);
    setCount(2);
    setShowPanel(false);
    await setCount(2);
  };
  // console.log(simpa,"oiuuiouiououo")
  useEffect(() => {
    if (!patient) return;

    handleRow(patient);
  }, [patient]);
  const handleSearch = async (value) => {
    setVal(value);
    if (value === '') {
      setShowPanel(false);
      return;
    }

    if (value.length >= 3) {
      ClientServ.find({
        query: {
          $or: [
            {
              firstname: {
                $regex: value,
                $options: 'i',
              },
            },
            {
              lastname: {
                $regex: value,
                $options: 'i',
              },
            },
            {
              middlename: {
                $regex: value,
                $options: 'i',
              },
            },
            {
              phone: {
                $regex: value,
                $options: 'i',
              },
            },
            {
              clientTags: {
                $regex: value,
                $options: 'i',
              },
            },
            {
              mrn: {
                $regex: value,
                $options: 'i',
              },
            },
            {
              specificDetails: {
                $regex: value,
                $options: 'i',
              },
            },
          ],
          'relatedfacilities.facility': user.currentEmployee.facilityDetail._id,
          $limit: 10,
        },
      })
        .then((res) => {
          // console.log(res.data);
          setFacilities(res.data);
          setSearchMessage(' product  fetched successfully');
          setShowPanel(true);
        })
        .catch((err) => {
          toast({
            message: 'Error creating ProductEntry ' + err,
            type: 'is-danger',
            dismissible: true,
            pauseOnHover: true,
          });
        });
    } else {
      setShowPanel(false);
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
      console.log('success has changed', clear);
      setSimpa('');
    }
    return () => {};
  }, [clear]);

  useOnClickOutside(dropDownRef, () => setShowPanel(false));

  const options = facilities.map((item) => {
    const age = item.dob ? formatDistanceToNowStrict(new Date(item.dob)) : '';
    const displayValue = isPhone
      ? item.phone
      : `${item?.firstname || ''} ${item?.lastname || ''} ${item?.gender || ''} ${age}`;
    return {
      value: item._id,
      label: displayValue,
      data: item,
    };
  });

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <AutoComplete
        disabled={disabled}
        value={
          value
            ? isPhone
              ? value.phone
              : `${value.firstname} ${value.lastname}`
            : simpa
        }
        options={options}
        onSearch={(val) => setSearch(val)}
        onSelect={(selectedValue, option) => {
          handleRow(option.data);
        }}
        onClear={() => {
          setSimpa('');
        }}
        placeholder={label || 'Search for Client'}
        allowClear
        notFoundContent={
          val === '' ? 'Type something...' : `${val} was not found`
        }
        style={{ width: '100%' }}
        ref={inputEl}
      />

      <ModalBox open={productModal} onClose={handlecloseModal}>
        <div className={`modal ${productModal ? 'is-active' : ''}`}>
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Choose Store</p>
              <button
                className="delete"
                aria-label="close"
                onClick={handlecloseModal}
              ></button>
            </header>
            <section className="modal-card-body">
              {/* <StoreList standalone="true" /> */}
              {/* <ProductCreate /> */}
            </section>
          </div>
        </div>
      </ModalBox>
    </div>
  );
}
