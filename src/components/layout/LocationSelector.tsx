// @ts-nocheck
import React, { useState, useEffect, useContext } from 'react';
import { Dropdown, Button, Space, Typography, Empty, Spin, Input } from 'antd';
import {
  EnvironmentOutlined,
  SearchOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { ObjectContext, UserContext } from '../../context';
import client from '../../feathers';

const { Text } = Typography;

interface Location {
  _id: string;
  name: string;
  locationType: string;
  facility: string;
  description?: string;
}

const LocationSelector: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const { state, setState } = useContext(ObjectContext);
  const { user } = useContext(UserContext);

  const currentLocation = state.employeeLocation;

  useEffect(() => {
    if (open && user?.currentEmployee) {
      fetchLocations();
    }
  }, [open, user]);

  useEffect(() => {
    if (searchText) {
      const filtered = locations.filter(
        (loc) =>
          loc.name.toLowerCase().includes(searchText.toLowerCase()) ||
          loc.locationType.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations);
    }
  }, [searchText, locations]);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const locationService = client.service('location');
      const response = await locationService.find({
        query: {
          facility: user.currentEmployee.facilityDetail._id,
          $sort: { name: 1 },
          $limit: 50,
        },
      });

      setLocations(response.data);
      setFilteredLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setState((prev: any) => ({
      ...prev,
      employeeLocation: {
        locationName: location.name,
        locationType: location.locationType,
        locationId: location._id,
        facilityId: location.facility,
        case: 'selected',
      },
    }));
    setOpen(false);
    setSearchText('');
  };

  const clearLocation = () => {
    setState((prev: any) => ({
      ...prev,
      employeeLocation: {
        locationName: '',
        locationType: '',
        locationId: '',
        facilityId: '',
        case: '',
      },
    }));
    setOpen(false);
  };

  const locationContent = (
    <div style={{ width: 320, maxHeight: 400, overflow: 'auto' }}>
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Text strong style={{ fontSize: 16 }}>
          Select Location
        </Text>
      </div>

      {/* Search */}
      <div style={{ padding: '8px 16px' }}>
        <Input
          placeholder="Search locations..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      {/* Locations List */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <Spin />
        </div>
      ) : filteredLocations.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            searchText ? 'No matching locations' : 'No locations available'
          }
          style={{ padding: 40 }}
        />
      ) : (
        <div>
          {filteredLocations.map((location) => {
            const isSelected = currentLocation.locationId === location._id;
            return (
              <div
                key={location._id}
                onClick={() => handleLocationSelect(location)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  background: isSelected ? '#e6f7ff' : 'transparent',
                  borderLeft: isSelected
                    ? '3px solid #1890ff'
                    : '3px solid transparent',
                  transition: 'all 0.3s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = '#fafafa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Space direction="vertical" size={0}>
                  <Text strong style={{ fontSize: 14 }}>
                    {location.name}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {location.locationType}
                  </Text>
                </Space>
                {isSelected && (
                  <CheckOutlined style={{ color: '#1890ff', fontSize: 16 }} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer - Clear Selection */}
      {currentLocation.locationId && (
        <>
          <div style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />
          <div style={{ padding: '8px 16px', textAlign: 'center' }}>
            <Button type="link" danger onClick={clearLocation}>
              Clear Location
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      dropdownRender={() => locationContent}
      trigger={['click']}
      placement="bottomRight"
    >
      <Button
        type={currentLocation.locationName ? 'default' : 'text'}
        style={{
          padding: currentLocation.locationName ? '4px 12px' : '4px 8px',
          height: 'auto',
          background: currentLocation.locationName ? '#f0f5ff' : 'transparent',
          border: currentLocation.locationName ? '1px solid #d6e4ff' : 'none',
          borderRadius: 6,
        }}
      >
        <Space size="small">
          <EnvironmentOutlined
            style={{
              color: currentLocation.locationName ? '#1890ff' : '#8c8c8c',
              fontSize: 16,
            }}
          />
          {currentLocation.locationName ? (
            <Space direction="vertical" size={0} style={{ lineHeight: 1.2 }}>
              <Text
                style={{
                  fontSize: 13,
                  color: '#1890ff',
                  fontWeight: 500,
                }}
              >
                {currentLocation.locationName}
              </Text>
              {currentLocation.locationType && (
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {currentLocation.locationType}
                </Text>
              )}
            </Space>
          ) : (
            <Text type="secondary" style={{ fontSize: 13 }}>
              Select Location
            </Text>
          )}
        </Space>
      </Button>
    </Dropdown>
  );
};

export default LocationSelector;
