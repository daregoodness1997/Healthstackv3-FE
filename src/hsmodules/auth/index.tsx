import React, { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  Input,
  Checkbox,
  Space,
  Modal,
  Form,
  Typography,
  Divider,
} from 'antd';
import {
  LoginOutlined,
  GoogleOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  LockOutlined,
  MailOutlined,
} from '@ant-design/icons';

import AuthWrapper from '../../components/AuthWrapper';
import Preloader from '../../components/utilities/Preloader';
import { UserContext } from '../../context';
import client from '../../feathers';

const { Text, Link: AntLink } = Typography;

function Login() {
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm();
  const { setUser } = useContext(UserContext);
  const [keepMeIn, setKeepMeIn] = useState(false);
  const [loaderTimer, setLoaderTimer] = useState(true);
  const [loading, setLoading] = useState(false);
  const [chooseModal, setChooseModal] = useState(false);
  const [resp, setResp] = useState({});

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
    document.title = 'Health Stack - Login';
    setTimeout(() => setLoaderTimer(false), 1500);
  }, []);

  const onSubmit = async (data) => {
    const { email, password } = data;
    setLoading(true);

    console.log('Attempting login with email:', email);

    await client
      .authenticate({
        strategy: 'local',
        email,
        password,
      })
      .then(async (res) => {
        //user can have more than one org
        console.log('✅ Authentication successful:', res);
        setResp(res);
        if (res.user.employeeData.length > 1) {
          //open modal to choose facility
          setChooseModal(true);
        } else {
          const user = {
            ...res.user,
            currentEmployee: { ...res.user.employeeData[0] }, // need to make this a choice
          };
          loginprocess(res, user);
        }
      })
      .catch((err) => {
        console.error('❌ Login error:', err);
        console.error('Error details:', {
          message: err.message,
          code: err.code,
          name: err.name,
          data: err.data,
        });
        setLoading(false);
        toast.error(
          `Error logging in: ${err.message || 'Network or authentication error'}`,
        );
      });
  };

  const handlefacility = (fac) => {
    const user = {
      ...resp.user,
      currentEmployee: { ...fac }, // need to make this a choice
    };

    loginprocess(resp, user);
  };

  const loginprocess = async (res, user) => {
    const secureStorage = (await import('../../utils/secureStorage')).default;

    setUser(user);
    secureStorage.setUser(user);
    setLoading(false);

    //log user
    let logObj = {
      user: res.user,
      facility: user.currentEmployee.facilityDetail, // need to make this a choice
      type: 'login',
    };

    await client.service('logins').create(logObj);

    let onlineObj = {
      //lastLogin: new Date(),
      online: true,
    };
    await client.service('users').patch(user._id, onlineObj);
    toast.success('You successfully logged in');
    navigate('/app');
  };

  return (
    <>
      {loaderTimer ? (
        <Preloader />
      ) : (
        <AuthWrapper paragraph="Login here as an organization">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal
              open={chooseModal}
              title="Choose Facility"
              footer={null}
              closable={false}
            >
              <Space
                direction="vertical"
                style={{ width: '100%' }}
                size="small"
              >
                {resp?.user?.employeeData.map((fac: any, i: number) => (
                  <Button
                    key={i}
                    type="primary"
                    block
                    onClick={() => handlefacility(fac)}
                  >
                    {fac.facilityDetail.facilityName}
                  </Button>
                ))}
              </Space>
            </Modal>

            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Email"
                    prefix={<MailOutlined />}
                    size="large"
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    placeholder="Password"
                    prefix={<LockOutlined />}
                    size="large"
                  />
                )}
              />

              <Checkbox
                checked={keepMeIn}
                onChange={(e) => setKeepMeIn(e.target.checked)}
              >
                Keep me Logged in
              </Checkbox>

              <Button
                type="primary"
                htmlType="submit"
                icon={<LoginOutlined />}
                loading={loading}
                block
                size="large"
              >
                Login
              </Button>
            </Space>
          </form>

          <div
            style={{
              display: 'flex',
              height: '40px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '16px',
              borderRadius: '4px',
            }}
          >
            <Text>
              Forgot password?{' '}
              <Link
                to="/forgot-password"
                style={{
                  color: '#1890ff',
                  textDecoration: 'none',
                }}
              >
                Click here
              </Link>
            </Text>
          </div>

          <Divider>or continue with</Divider>

          <Space
            style={{
              width: '100%',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
            size="large"
          >
            <Button
              type="default"
              shape="circle"
              icon={<GoogleOutlined />}
              size="large"
            />
            <Button
              type="default"
              shape="circle"
              icon={<FacebookOutlined />}
              size="large"
            />
            <Button
              type="default"
              shape="circle"
              icon={<LinkedinOutlined />}
              size="large"
            />
          </Space>

          <div
            style={{
              display: 'flex',
              height: '40px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
            }}
          >
            <Text>
              Want to create organization?{' '}
              <Link
                to="/signup"
                style={{
                  color: '#1890ff',
                  textDecoration: 'none',
                }}
              >
                Click here
              </Link>
            </Text>
          </div>
        </AuthWrapper>
      )}
    </>
  );
}

export default Login;
