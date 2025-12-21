import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { AutoComplete, Spin } from 'antd';
import { getPurelifeApiUrl } from '../../utils/env';
export function AllPureLifeSearch({
  getSearchfacility,
  label,
  searchCategory,
  prescription = false,
}) {
  const [facilities, setFacilities] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [val, setVal] = useState('');
  const [loading, setLoading] = useState(false);
  const inputEl = useRef(null);

  const handleRow = async (obj) => {
    getSearchfacility(obj);
    setInputValue(typeof obj === 'string' ? obj : obj?.name || '');
  };

  const handleSearch = async (value) => {
    setVal(value);
    if (value === '') {
      setFacilities([]);
      setLoading(false);
      return;
    }

    if (value.length >= 3) {
      setLoading(true);
      try {
        // ... in component
        const response = prescription
          ? await fetch(
              `${getPurelifeApiUrl()}/api/products/search?published=true&prescription=true&categoryId=12&fields=name&fields=lst_price&limit=50&offset=0&name=${encodeURIComponent(value)}`,
              {
                headers: {
                  Authorization: 'Bearer b6d7b2a6-ee6d-43fd-ac3b-fd0723747dd8',
                  'Content-Type': 'application/json',
                },
              },
            )
          : await fetch(
              `${getPurelifeApiUrl()}/api/products/search?published=true&categoryId=${searchCategory}&fields=name&fields=lst_price&limit=50&offset=0&name=${encodeURIComponent(value)}`,
              {
                headers: {
                  Authorization: 'Bearer b6d7b2a6-ee6d-43fd-ac3b-fd0723747dd8',
                  'Content-Type': 'application/json',
                },
              },
            );
        const data = await response.json();
        // console.log(data)
        setFacilities(data.data);
      } catch (err) {
        toast.error('Error fetching products: ' + err);
      } finally {
        setLoading(false);
      }
    } else {
      setFacilities([]);
      setLoading(false);
    }
  };

  // console.log(val, "FACILITIES")

  const options = facilities.map((item) => ({
    value: item.id,
    label: `${item.name} - ₦${item.lst_price?.toLocaleString()}`,
    data: item,
  }));

  return (
    <div>
      <AutoComplete
        value={inputValue}
        options={options}
        onSearch={handleSearch}
        onSelect={(selectedValue, option) => {
          handleRow(option.data);
        }}
        onClear={() => {
          setInputValue('');
        }}
        placeholder={label || 'Search for Product'}
        allowClear
        notFoundContent={
          loading ? (
            <Spin size="small" />
          ) : val !== '' ? (
            `${val} is not in your list`
          ) : (
            'Search for something'
          )
        }
        style={{ width: '100%' }}
        ref={inputEl}
      />
    </div>
  );
}
