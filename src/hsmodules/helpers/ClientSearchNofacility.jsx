import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import client from '../../feathers';
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
  getSearchfacility,
  clear,
  label,
  id,
  disabled = false,
}) {
  const ClientServ = client.service('client');
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
  const [productModal, setProductModal] = useState(false);

  const dropDownRef = useRef(null);

  const handleRow = async (obj) => {
    // console.log(obj);
    await setChosen(true);
    //alert("something is chaning")
    getSearchfacility(obj);

    await setSimpa(
      obj.firstname +
        ' ' +
        obj.middlename +
        ' ' +
        obj.lastname +
        ' ' +
        obj.gender +
        ' ' +
        obj.phone,
    );

    // setSelectedFacility(obj)
    setShowPanel(false);
    await setCount(2);
    /* const    newfacilityModule={
            selectedFacility:facility,
            show :'detail'
        }
   await setState((prevstate)=>({...prevstate, facilityModule:newfacilityModule})) */
    //console.log(state)
  };

  useEffect(() => {
    const getInitial = async () => {
      if (id) {
        try {
          const resp = await ClientServ.get(id);
          console.log(resp);
          handleRow(resp);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSearch = async (val) => {
    setVal(val);
    if (val === '') {
      getSearchfacility(false);
      return;
    }

    if (val.length >= 3) {
      ClientServ.find({
        query: {
          $or: [
            {
              firstname: {
                $regex: val,
                $options: 'i',
              },
            },
            {
              lastname: {
                $regex: val,
                $options: 'i',
              },
            },
            {
              middlename: {
                $regex: val,
                $options: 'i',
              },
            },
            {
              phone: {
                $regex: val,
                $options: 'i',
              },
            },
            {
              clientTags: {
                $regex: val,
                $options: 'i',
              },
            },
            {
              mrn: {
                $regex: val,
                $options: 'i',
              },
            },
            {
              specificDetails: {
                $regex: val,
                $options: 'i',
              },
            },
          ],

          //facility: user.currentEmployee.facilityDetail._id,
          // "relatedfacilities.facility": user.currentEmployee.facilityDetail._id,
          //storeId: state.StoreModule.selectedStore._id,
          $limit: 50,
          $sort: {
            firstname: 1,
          },
        },
      })
        .then((res) => {
          console.log('product  fetched successfully');
          console.log(res.data);
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
      console.log('less than 3 ');
      console.log(val);
      setShowPanel(false);
      await setFacilities([]);
      console.log(facilities);
    }
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
    return {
      value: item._id,
      label: `${item.firstname || ''} ${item.middlename || ''} ${item.lastname || ''} - ${item.gender || ''} ${age} - ${item.phone || ''}`,
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
        value={simpa}
        options={options}
        onSearch={handleSearch}
        onSelect={(selectedValue, option) => {
          handleRow(option.data);
        }}
        onClear={() => {
          setSimpa('');
          getSearchfacility(false);
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

ClientSearch.propTypes = {
  getSearchfacility: PropTypes.func.isRequired,
  clear: PropTypes.bool,
  label: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
};
