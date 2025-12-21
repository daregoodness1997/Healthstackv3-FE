import React, { useEffect, useState, useContext } from 'react';
import { Layout, Space, Typography, Badge, Button, Tooltip } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { ObjectContext } from '../../context';
import { Models } from '../../hsmodules/app/Constants';
import Breadcrumbs from '../breadcrumb';
import useRepository from '../hooks/repository';
import LocationModal from '../inputs/LocationModal';
import LocationSelect from '../inputs/LocationSelect';
import ProfileMenu from '../profilemenu';

const { Header } = Layout;
const { Text } = Typography;

const defaultList = [{ code: 'NG', label: '', location: '' }];

const TopMenu = ({ isOpen, handleClick }) => {
  const [locationOptions, setLocationOptions] = useState(defaultList);
  const [locationsById, setLocationsById] = useState({});
  const { list, setFindQuery, facility, locationType, setLocation } =
    useRepository(Models.LOCATION);
  const [selectedLocation, setSelectedLocation] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);

  const { state, setState } = useContext(ObjectContext);

  /*                                                                                                                                                                                                                                          */

  /*  useEffect(() => {
    setSelectedLocation(null);
    setOpen(true);
    if (facility && locationType)
      setFindQuery({
        query: {
          facility: facility?._id,
          locationType,
          $sort: {
            name: 1,
          },
          $limit: 20,
        },
      });
  }, [facility, locationType]);
*/
  const handleSelectLocation = (locationId) => {
    setLocationOptions([]);
    setSelectedLocation(locationsById[locationId]);
    setLocation(locationsById[locationId]);
    setLocationOptions([
      ...locationOptions,
      { code: 'NG', label: 'No Location Selected', location: '' },
    ]);
  };

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        marginLeft: isOpen ? '260px' : '80px',
        transition: 'margin-left 0.2s ease',
        height: '64px',
      }}
    >
      {/* Left Section - Menu Toggle & Breadcrumbs */}
      <Space size="large" style={{ flex: 1 }}>
        <Button
          type="text"
          icon={isOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={handleClick}
          style={{
            fontSize: '18px',
            width: 40,
            height: 40,
          }}
        />
        <div className="breadcrumb">
          <Breadcrumbs />
        </div>
      </Space>

      {/* Right Section - Location & Actions */}
      <Space size="middle" align="center">
        {/* Current Location Display */}
        {state.employeeLocation.locationName && (
          <Tooltip title="Current Location">
            <Space
              size="small"
              style={{
                padding: '4px 12px',
                background: '#f0f5ff',
                borderRadius: '6px',
                border: '1px solid #d6e4ff',
              }}
            >
              <EnvironmentOutlined style={{ color: '#1890ff' }} />
              <Text style={{ fontSize: '13px', color: '#1890ff' }}>
                {state.employeeLocation.locationName}
                {state.employeeLocation.locationType && (
                  <Text
                    type="secondary"
                    style={{ fontSize: '12px', marginLeft: 4 }}
                  >
                    ({state.employeeLocation.locationType})
                  </Text>
                )}
              </Text>
            </Space>
          </Tooltip>
        )}

        {/* Location Selector - Hidden initially */}
        <div style={{ display: 'none' }}>
          <LocationSelect
            defaultLocationId={selectedLocation?._id || ''}
            locations={locationOptions}
            onChange={handleSelectLocation}
          />
          <LocationModal
            locations={locationOptions}
            onSelectLocation={handleSelectLocation}
            open={open}
            setOpen={setOpen}
          />
        </div>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <Badge count={0} showZero={false}>
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{
                fontSize: '18px',
                width: 40,
                height: 40,
              }}
            />
          </Badge>
        </Tooltip>

        {/* Profile Menu */}
        <ProfileMenu />
      </Space>
    </Header>
  );
};

export default TopMenu;
