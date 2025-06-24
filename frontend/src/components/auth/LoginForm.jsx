import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import toast from 'react-hot-toast';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

const LoginForm = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('email');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="flex rounded-lg border border-gray-300 p-1 mb-4">
                  <button
                    type="button"
                    onClick={() => setLoginType('email')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      loginType === 'email'
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginType('username')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      loginType === 'username'
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Username
                  </button>
                </div>

                {loginType === 'email' ? (
                  <Input
                    label="Email address"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    placeholder="Enter your email"
                  />
                ) : (
                  <Input
                    label="Username"
                    type="text"
                    {...register('username')}
                    error={errors.username?.message}
                    placeholder="Enter your username"
                  />
                )}
              </div>

              <Input
                label="Password"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                placeholder="Enter your password"
              />

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
                
              >
                Sign in
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;