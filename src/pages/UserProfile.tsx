import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/Button.tsx';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  User, Mail, Phone, ShieldCheck, Key, Lock, LogOut, Camera, 
  AlertCircle, CheckCircle, Heart, BookOpen, Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  newPassword: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must include at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must include at least one number' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const UserProfile = () => {
  const { user, isAuthenticated, isLoading, updateProfile, logout } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });
  
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  const handleUpdateProfile = async (data: ProfileFormValues) => {
    setIsUpdating(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Update profile error:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleUpdatePassword = async (data: PasswordFormValues) => {
    setIsChangingPassword(true);
    try {
      // In a real app, you would call an API to update the password
      // This is just a mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      resetPassword();
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error('Failed to update password');
      console.error('Update password error:', error);
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const handleLogout = () => {
    logout();
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-16 h-16 border-4 border-theuyir-yellow border-t-theuyir-pink rounded-full animate-spin"></div>
        <p className="mt-4 text-theuyir-darkgrey font-medium">Loading your profile...</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'volunteer':
        return 'bg-green-100 text-green-800';
      case 'beneficiary':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'admin':
        return <ShieldCheck size={14} className="mr-1" />;
      case 'volunteer':
        return <Heart size={14} className="mr-1" />;
      case 'beneficiary':
        return <BookOpen size={14} className="mr-1" />;
      default:
        return <Users size={14} className="mr-1" />;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-theuyir-yellow text-theuyir-darkgrey text-xl">
                {getInitials(user?.name || 'User')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-theuyir-darkgrey">{user?.name}</h1>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.role || 'user')}`}>
                  {getRoleIcon(user?.role || 'user')}
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}
                </span>
                <span className="text-gray-500 text-sm ml-3">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="flex items-center" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile" className="flex items-center">
              <User size={16} className="mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Lock size={16} className="mr-2" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow">
              <h2 className="text-xl font-bold text-theuyir-darkgrey mb-6">Personal Information</h2>
              
              <form onSubmit={handleProfileSubmit(handleUpdateProfile)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center">
                    <User size={16} className="mr-2" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    {...registerProfile('name')}
                    className={profileErrors.name ? 'border-red-500' : ''}
                  />
                  {profileErrors.name && (
                    <p className="text-sm text-red-500">{profileErrors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail size={16} className="mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...registerProfile('email')}
                    className={profileErrors.email ? 'border-red-500' : ''}
                  />
                  {profileErrors.email && (
                    <p className="text-sm text-red-500">{profileErrors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone size={16} className="mr-2" />
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...registerProfile('phone')}
                    className={profileErrors.phone ? 'border-red-500' : ''}
                  />
                  {profileErrors.phone && (
                    <p className="text-sm text-red-500">{profileErrors.phone.message}</p>
                  )}
                </div>
                
                <div className="pt-4">
                  <Button type="submit" disabled={isUpdating} className="flex items-center">
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow">
              <h2 className="text-xl font-bold text-theuyir-darkgrey mb-6">Profile Picture</h2>
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-theuyir-yellow text-theuyir-darkgrey text-2xl">
                    {getInitials(user?.name || 'User')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <p className="text-gray-600">
                    Upload a new profile picture. The image should be at least 200x200 pixels.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="flex items-center">
                      <Camera size={16} className="mr-2" />
                      Upload New Picture
                    </Button>
                    <Button variant="outline" className="text-red-500 hover:text-red-600">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow">
              <h2 className="text-xl font-bold text-theuyir-darkgrey mb-6">Change Password</h2>
              
              <form onSubmit={handlePasswordSubmit(handleUpdatePassword)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="flex items-center">
                    <Key size={16} className="mr-2" />
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...registerPassword('currentPassword')}
                    className={passwordErrors.currentPassword ? 'border-red-500' : ''}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="flex items-center">
                    <Lock size={16} className="mr-2" />
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...registerPassword('newPassword')}
                    className={passwordErrors.newPassword ? 'border-red-500' : ''}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.newPassword.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center">
                    <Lock size={16} className="mr-2" />
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...registerPassword('confirmPassword')}
                    className={passwordErrors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>
                
                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg flex items-start">
                  <AlertCircle size={20} className="text-yellow-600 mr-3 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    Password should be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" disabled={isChangingPassword} className="flex items-center">
                    {isChangingPassword ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} className="mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow">
              <h2 className="text-xl font-bold text-theuyir-darkgrey mb-6">Account Security</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-4">
                      <ShieldCheck size={20} className="text-theuyir-darkgrey" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-theuyir-darkgrey">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold text-theuyir-darkgrey mb-4">Recent Login Activities</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-theuyir-darkgrey">Chennai, India</p>
                        <p className="text-sm text-gray-600">Today, 12:15 PM</p>
                      </div>
                      <span className="text-green-600 text-sm font-medium">Current Session</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-theuyir-darkgrey">Coimbatore, India</p>
                        <p className="text-sm text-gray-600">Yesterday, 3:45 PM</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">Report</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile; 