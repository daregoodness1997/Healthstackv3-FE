import React, { useState, useContext, useEffect, useRef } from 'react';
import client from '../../feathers';
import { UserContext, ObjectContext } from '../../context';
import { toast } from 'bulma-toast';
import { AutoComplete } from 'antd';

export default function EmployeeSearch({
  id,
  getSearchfacility,
  clear,
  label,
  value,
  disabled,
  setParentState,
}) {
  const ClientServ = client.service('employee');
  const [facilities, setFacilities] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const [simpa, setSimpa] = useState('');
  const [chosen, setChosen] = useState(false);
  const [count, setCount] = useState(0);
  const inputEl = useRef(null);
  const [val, setVal] = useState('');
  const { user } = useContext(UserContext);

  const getInitial = async (id) => {
    if (id) {
      await ClientServ.get(id)
        .then((resp) => {
          handleRow(resp);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getInitial(id);
    // eslint-disable-next-line
  }, [id]);

  const handleRow = async (obj) => {
    await setChosen(true);
    //alert("something is chaning")

    await setSimpa(
      obj.firstname +
        ' ' +
        obj.lastname +
        '  (' +
        obj.profession +
        ', ' +
        obj.department +
        ' Department )',
    );
    getSearchfacility(obj);
    setShowPanel(false);
    await setCount(2);
  };

  const handleSearch = async (val) => {
    setVal(val);
    if (val === '') {
      setShowPanel(false);
      getSearchfacility(false);
      return;
    }

    if (val.length >= 3) {
      // console.log("about to start")
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
              profession: {
                $regex: val,
                $options: 'i',
              },
            },
            {
              department: {
                $regex: val,
                $options: 'i',
              },
            },
            /* { clientTags: {
                        $regex:val,
                        $options:'i' 
                    }},
                    { mrn: {
                        $regex:val,
                        $options:'i' 
                    }},
                    { specificDetails: {
                        $regex:val,
                        $options:'i' 
                    }}, */
          ],

          facility: user.currentEmployee.facilityDetail._id,
          //storeId: state.StoreModule.selectedStore._id,
          $limit: 20,
          $sort: {
            lastname: 1,
          },
        },
      })
        .then((res) => {
          // console.log("employees  fetched successfully");
          // console.log(res.data);
          setFacilities(res.data);
          setSearchMessage(' Employees  fetched successfully');
          setShowPanel(true);
        })
        .catch((err) => {
          toast({
            message: 'Error searching Employees ' + err,
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
      // console.log(facilities);
    }
  };

  useEffect(() => {
    if (clear) {
      setSimpa('');
    }
    return () => {};
  }, [clear]);

  const options = facilities.map((item) => ({
    value: item._id,
    label: `${item.firstname} ${item.lastname} (${item.profession}, ${item.department} Department)`,
    data: item,
  }));

  return (
    <div style={{ width: '100%' }}>
      <AutoComplete
        value={value ? `${value.firstname} ${value.lastname}` : simpa}
        disabled={disabled}
        options={options}
        onSearch={handleSearch}
        onSelect={(selectedValue, option) => {
          handleRow(option.data);
        }}
        onClear={() => {
          setSimpa('');
          setParentState && setParentState(null);
        }}
        placeholder={label || 'Search for Employee'}
        allowClear
        notFoundContent={
          val === '' ? 'Type something..' : `${val} is not an Employee`
        }
        style={{ width: '100%' }}
        ref={inputEl}
      />
    </div>
  );
}
