import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Mail, User, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

// Dynamic schema based on login type
const getSchema = (loginType) => {
  const baseSchema = {
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
  };

  if (loginType === 'email') {
    return yup.object({
      ...baseSchema,
      email: yup.string().email('Invalid email').required('Email is required')
    });
  } else {
    return yup.object({
      ...baseSchema,
      username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required')
    });
  }
};

const LoginForm = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('email');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(getSchema(loginType)),
    mode: 'onChange'
  });

  // Reset form when login type changes
  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    reset(); 
  };

  const onSubmit = async (data) => {
    
    const loginData = {
      password: data.password,
      ...(loginType === 'email' ? { email: data.email } : { username: data.username })
    };

    const result = await login(loginData);
    if (result.success) {
      toast.success('Login successful!');
      navigate('/test');
    }
  };

  // Get current form values
  const formValues = watch();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 mb-4">
            <KeyRound className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-center text-xl text-gray-900 dark:text-gray-100">
              Welcome Back
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Login Type Selector */}
              <div className="space-y-4">
                <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 p-1 bg-gray-50 dark:bg-gray-700/50">
                  <button
                    type="button"
                    onClick={() => handleLoginTypeChange('email')}
                    className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                      loginType === 'email'
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-600/50'
                    }`}
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoginTypeChange('username')}
                    className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                      loginType === 'username'
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-600/50'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Username</span>
                  </button>
                </div>

                {/* Dynamic Input Field */}
                {loginType === 'email' ? (
                  <div className="space-y-1">
                    <Input
                      label="Email address"
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                      placeholder="Enter your email"
                      autoComplete="email"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Input
                      label="Username"
                      type="text"
                      {...register('username')}
                      error={errors.username?.message}
                      placeholder="Enter your username"
                      autoComplete="username"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  {...register('password')}
                  error={errors.password?.message}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </form>

            {/* Forgot Password Link */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          By signing in, you agree to our{' '}
          <a href="#" className="underline hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;