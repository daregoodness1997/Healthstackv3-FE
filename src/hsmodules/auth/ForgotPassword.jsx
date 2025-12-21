import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Space, Typography } from 'antd';
import { MailOutlined, CheckOutlined } from '@ant-design/icons';
import AuthWrapper from '../../components/AuthWrapper';
import client from '../../feathers';
import { forgotPasswordSchema } from './schema';
import { getApiUrl } from '../../utils/env';

const { Text } = Typography;

const ForgotPassword = () => {
  const ClientServ = client.service('auth-management');
  const baseuRL = getApiUrl();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  let navigate = useNavigate();

  const submit = async (data, event) => {
    event.preventDefault();
    setLoading(true);

    let body = {
      action: 'sendResetPwd',
      value: {
        email: data.email,
      },
    };

    /*  axios
      .post(`${baseuRL}/auth-management`, body, {
        headers: {"Content-Type": "application/json"},
      }) */

    ClientServ.create({
      action: 'sendResetPwd',
      value: {
        email: data.email,
        notifierOptions: {},
      },
    })
      .then((response) => {
        toast.success(
          `An email has been sent to you for your account password reset`,
        );
        navigate('/', { replace: true });
      })
      .catch((err) => {
        toast.error(
          `Sorry, An error occured trying to reset your account password ${err}`,
        );
        console.log(err);
      });

    setLoading(false);
  };
  return (
    <AuthWrapper paragraph="Forgot your password">
      <form onSubmit={handleSubmit(submit)}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Input
              placeholder="Enter your email address"
              prefix={<MailOutlined />}
              size="large"
              {...register('email')}
              status={errors?.email ? 'error' : ''}
            />
            {errors?.email && (
              <Text type="danger" style={{ fontSize: 12, marginTop: 4 }}>
                {errors?.email?.message}
              </Text>
            )}
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            icon={<CheckOutlined />}
          >
            Confirm Email
          </Button>

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
              Remember your password?
              <Link
                to="/"
                style={{
                  padding: 0,
                  background: 'transparent',
                  color: '#1890ff',
                  marginLeft: '0.6rem',
                  textDecoration: 'none',
                }}
              >
                Login
              </Link>
            </Text>
          </div>
        </Space>
      </form>
    </AuthWrapper>
  );
};

export default ForgotPassword;
