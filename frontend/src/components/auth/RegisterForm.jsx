import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { UserPlus, User, Mail, Lock, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = yup.object({
  fullName: yup.string().required('Full name is required'),
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
});

const RegisterForm = () => {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;
    const result = await registerUser(userData);
    
    if (result.success) {
      toast.success('Registration successful! Please login.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30 mb-4">
            <UserPlus className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Register Card */}
        <Card className="shadow-xl border-0 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-center text-xl text-gray-900 dark:text-gray-100">
              Get Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name Field */}
              <div className="space-y-1">
                <Input
                  label="Full Name"
                  type="text"
                  {...register('fullName')}
                  error={errors.fullName?.message}
                  placeholder="Enter your full name"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Username Field */}
              <div className="space-y-1">
                <Input
                  label="Username"
                  type="text"
                  {...register('username')}
                  error={errors.username?.message}
                  placeholder="Choose a username"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <Input
                  label="Email address"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  {...register('password')}
                  error={errors.password?.message}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1">
                <Input
                  label="Confirm Password"
                  type="password"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full py-3 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>

            
          </CardContent>
        </Card>

        
      </div>
    </div>
  );
};

export default RegisterForm;