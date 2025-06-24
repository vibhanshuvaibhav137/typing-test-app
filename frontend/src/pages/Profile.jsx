import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { User, Lock, Mail, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const profileSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required')
});

const passwordSchema = yup.object({
  oldPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password')
});

const Profile = () => {
  const { user, updateProfile, changePassword, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const profileForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || ''
    }
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema)
  });

  const onProfileSubmit = async (data) => {
    const result = await updateProfile(data);
    if (result.success) {
      toast.success('Profile updated successfully!');
    }
  };

  const onPasswordSubmit = async (data) => {
    const { confirmPassword, ...passwordData } = data;
    const result = await changePassword(passwordData);
    if (result.success) {
      toast.success('Password changed successfully!');
      passwordForm.reset();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Profile Info</span>
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'password'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Lock className="h-4 w-4" />
                  <span>Password</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      {...profileForm.register('fullName')}
                      error={profileForm.formState.errors.fullName?.message}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      {...profileForm.register('email')}
                      error={profileForm.formState.errors.email?.message}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      type="submit"
                      loading={loading}
                      className="flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'password' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Change Password</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <Input
                    label="Current Password"
                    type="password"
                    {...passwordForm.register('oldPassword')}
                    error={passwordForm.formState.errors.oldPassword?.message}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="New Password"
                      type="password"
                      {...passwordForm.register('newPassword')}
                      error={passwordForm.formState.errors.newPassword?.message}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      {...passwordForm.register('confirmPassword')}
                      error={passwordForm.formState.errors.confirmPassword?.message}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      type="submit"
                      loading={loading}
                      className="flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Update Password</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;