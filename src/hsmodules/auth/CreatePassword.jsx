import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Space, Typography } from 'antd';
import { LockOutlined, CheckOutlined } from '@ant-design/icons';
import AuthWrapper from '../../components/AuthWrapper';
import client from '../../feathers';
import { createPasswordSchema } from './schema';

const { Text } = Typography;

const CreatePassword = () => {
  const ClientServ = client.service('auth-management');

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createPasswordSchema),

    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  let token = '';

  let navigate = useNavigate();
  const submit = async (event, data) => {
    delete data.confirmPassword;
    event.preventDefault();
    setLoading(true);

    await ClientServ.create({
      action: 'passwordChange',
      value: { password: data.password, token: token },
      notifierOptions: {},
    })
      .then((res) => {
        toast.success(`You have succesfully created an new password`);
        navigate('/', { replace: true });
      })
      .catch((err) => {
        toast.error(`Sorry, Unable to create a new password. ${err}`);
      });
    setLoading(false);

    navigate('/create-password', { replace: true });
  };
  return (
    <AuthWrapper paragraph="Reset your Account Password">
      <form onSubmit={handleSubmit(submit)}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Input.Password
              placeholder="Enter new password"
              prefix={<LockOutlined />}
              size="large"
              {...register('password')}
              status={errors?.password ? 'error' : ''}
            />
            {errors?.password && (
              <Text type="danger" style={{ fontSize: 12, marginTop: 4 }}>
                {errors?.password?.message}
              </Text>
            )}
          </div>

          <div>
            <Input.Password
              placeholder="Confirm new password"
              prefix={<LockOutlined />}
              size="large"
              {...register('confirmPassword')}
              status={errors?.confirmPassword ? 'error' : ''}
            />
            {errors?.confirmPassword && (
              <Text type="danger" style={{ fontSize: 12, marginTop: 4 }}>
                {errors?.confirmPassword?.message}
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
            Reset Password
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

export default CreatePassword;
