// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Phone, User, Lock, Mail, Edit, Check, X, ArrowRight, LogOut } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { useAuth } from '@/contexts/AuthContext';
// import Button from '@/components/ui/Button';

// // Indian phone number validation regex
// const isValidIndianPhone = (phone: string) => {
//   const indianPhoneRegex = /^[6-9]\d{9}$/;
//   return indianPhoneRegex.test(phone);
// };

// export default function ProfilePage() {
//   const { user, updateUser, logout } = useAuth();
//   const router = useRouter();
  
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     // email: ''
//   });
  
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
  
//   const [phoneError, setPhoneError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || '',
//         phone: user.phone || '',
//         // email: user.email || ''
//       });
//     }
//   }, [user]);

//   const validatePhone = (phoneNumber: string) => {
//     if (!phoneNumber) {
//       setPhoneError('');
//       return false;
//     }
    
//     if (phoneNumber.length !== 10) {
//       setPhoneError('Phone number must be 10 digits');
//       return false;
//     }
    
//     if (!isValidIndianPhone(phoneNumber)) {
//       setPhoneError('Please enter a valid Indian phone number');
//       return false;
//     }
    
//     setPhoneError('');
//     return true;
//   };

//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, '').slice(0, 10);
//     setFormData({ ...formData, phone: value });
//     validatePhone(value);
//   };

//   const handleProfileUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validatePhone(formData.phone)) return;
    
//     if (!formData.name.trim()) {
//       toast.error('Please enter your name');
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       const success = await updateUser({
//         name: formData.name,
//         phone: formData.phone
//       });
      
//       if (success) {
//         toast.success('Profile updated successfully!');
//         setIsEditing(false);
//       } else {
//         toast.error('Failed to update profile. Please try again.');
//       }
//     } catch (error) {
//       toast.error('An error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePasswordUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!passwordData.currentPassword) {
//       toast.error('Please enter your current password');
//       return;
//     }
    
//     if (passwordData.newPassword.length < 6) {
//       toast.error('Password must be at least 6 characters');
//       return;
//     }
    
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       // Here you would call your API to update the password
//       // await updatePassword(passwordData.currentPassword, passwordData.newPassword);
//       toast.success('Password updated successfully!');
//       setPasswordData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//     } catch (error) {
//       toast.error('Failed to update password. Please check your current password.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     router.push('/');
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//       <div className="container mx-auto">
//         <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="p-6 sm:p-8">
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-white font-bold text-xl">MM</span>
//               </div>
//               <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
//               <p className="text-gray-600 mt-2">
//                 {user?.name || 'Mehandi Mansion Member'}
//               </p>
//             </div>

//             {/* Tabs */}
//             <div className="flex border-b border-gray-200 mb-6">
//               <button
//                 onClick={() => setActiveTab('profile')}
//                 className={`flex-1 py-2 font-medium text-sm ${
//                   activeTab === 'profile'
//                     ? 'text-brown-600 border-b-2 border-brown-600'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Profile
//               </button>
//               <button
//                 onClick={() => setActiveTab('password')}
//                 className={`flex-1 py-2 font-medium text-sm ${
//                   activeTab === 'password'
//                     ? 'text-brown-600 border-b-2 border-brown-600'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Password
//               </button>
//             </div>

//             {/* Profile Tab */}
//             {activeTab === 'profile' && (
//               <form onSubmit={handleProfileUpdate}>
//                 <div className="mb-4">
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                     Your Name
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                       <User size={18} className="text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       id="name"
//                       className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
//                       placeholder="Enter your name"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       readOnly={!isEditing}
//                     />
//                     {!isEditing && (
//                       <button
//                         type="button"
//                         onClick={() => setIsEditing(true)}
//                         className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
//                       >
//                         <Edit size={16} />
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 <div className="mb-4">
//                   <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                       <Phone size={18} className="text-gray-400" />
//                     </div>
//                     <input
//                       type="tel"
//                       id="phone"
//                       className={`input-field pl-10 w-full border ${
//                         phoneError ? 'border-red-500' : 'border-gray-400'
//                       } rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent`}
//                       placeholder="Enter your 10-digit number"
//                       value={formData.phone}
//                       onChange={handlePhoneChange}
//                       readOnly={!isEditing}
//                     />
//                   </div>
//                   {phoneError && (
//                     <p className="text-xs text-red-500 mt-1">{phoneError}</p>
//                   )}
//                   {!phoneError && formData.phone.length > 0 && isValidIndianPhone(formData.phone) && (
//                     <p className="text-xs text-green-500 mt-1">Valid Indian phone number</p>
//                   )}
//                 </div>

//                 {/* <div className="mb-6">
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                       <Mail size={18} className="text-gray-400" />
//                     </div>
//                     <input
//                       type="email"
//                       id="email"
//                       className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 bg-gray-100 cursor-not-allowed"
//                       value={formData.email}
//                       readOnly
//                     />
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
//                 </div> */}

//                 {isEditing ? (
//                   <div className="flex gap-2">
//                     <Button
//                       variant="secondary"
//                       type="button"
//                       className="flex-1"
//                       onClick={() => {
//                         setIsEditing(false);
//                         setFormData({
//                           name: user?.name || '',
//                           phone: user?.phone || '',
//                         //   email: user?.email || ''
//                         });
//                         setPhoneError('');
//                       }}
//                     >
//                       <X size={16} className="mr-2" />
//                       Cancel
//                     </Button>
//                     <Button
//                       variant="primary"
//                       type="submit"
//                       className="flex-1"
//                       disabled={isLoading || !!phoneError}
//                     >
//                       {isLoading ? 'Saving...' : (
//                         <>
//                           <Check size={16} className="mr-2" />
//                           Save
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 ) : (
//                   <Button
//                     variant="primary"
//                     type="button"
//                     className="w-full"
//                     onClick={() => setIsEditing(true)}
//                   >
//                     <Edit size={16} className="mr-2" />
//                     Edit Profile
//                   </Button>
//                 )}
//               </form>
//             )}

//             {/* Password Tab */}
//             {activeTab === 'password' && (
//               <form onSubmit={handlePasswordUpdate}>
//                 <div className="mb-4">
//                   <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                     Current Password
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                       <Lock size={18} className="text-gray-400" />
//                     </div>
//                     <input
//                       type="password"
//                       id="currentPassword"
//                       className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
//                       placeholder="Enter current password"
//                       value={passwordData.currentPassword}
//                       onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
//                     />
//                   </div>
//                 </div>

//                 <div className="mb-4">
//                   <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                     New Password
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                       <Lock size={18} className="text-gray-400" />
//                     </div>
//                     <input
//                       type="password"
//                       id="newPassword"
//                       className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
//                       placeholder="Enter new password"
//                       value={passwordData.newPassword}
//                       onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
//                     />
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
//                 </div>

//                 <div className="mb-6">
//                   <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                     Confirm New Password
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                       <Lock size={18} className="text-gray-400" />
//                     </div>
//                     <input
//                       type="password"
//                       id="confirmPassword"
//                       className={`input-field pl-10 w-full border ${
//                         passwordError ? 'border-red-500' : 'border-gray-400'
//                       } rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent`}
//                       placeholder="Confirm new password"
//                       value={passwordData.confirmPassword}
//                       onChange={(e) => {
//                         setPasswordData({ ...passwordData, confirmPassword: e.target.value });
//                         if (passwordData.newPassword !== e.target.value) {
//                           setPasswordError('Passwords do not match');
//                         } else {
//                           setPasswordError('');
//                         }
//                       }}
//                     />
//                   </div>
//                   {passwordError && (
//                     <p className="text-xs text-red-500 mt-1">{passwordError}</p>
//                   )}
//                 </div>

//                 <Button
//                   variant="primary"
//                   type="submit"
//                   className="w-full"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Updating...' : (
//                     <>
//                       <ArrowRight size={16} className="mr-2" />
//                       Update Password
//                     </>
//                   )}
//                 </Button>
//               </form>
//             )}

//             <div className="mt-6 pt-6 border-t border-gray-200">
//               <Button
//                 variant="secondary"
//                 className="w-full"
//                 onClick={handleLogout}
//               >
//                 <LogOut size={16} className="mr-2" />
//                 Logout
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, User, Lock, Mail, Edit, Check, X, ArrowRight, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

// Indian phone number validation regex
const isValidIndianPhone = (phone: string) => {
  const indianPhoneRegex = /^[6-9]\d{9}$/;
  return indianPhoneRegex.test(phone);
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const validatePhone = (phoneNumber: string) => {
    if (!phoneNumber) {
      setPhoneError('');
      return false;
    }
    
    if (phoneNumber.length !== 10) {
      setPhoneError('Phone number must be 10 digits');
      return false;
    }
    
    if (!isValidIndianPhone(phoneNumber)) {
      setPhoneError('Please enter a valid Indian phone number');
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, phone: value });
    if (isEditing) validatePhone(value);
  };

//   const handleProfileUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validatePhone(formData.phone)) return;
    
//     if (!formData.name.trim()) {
//       toast.error('Please enter your name');
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       const success = await updateUser({
//         name: formData.name,
//         phone: formData.phone
//       });
      
//       if (success) {
//         toast.success('Profile updated successfully!');
//         setIsEditing(false);
//       } else {
//         toast.error('Failed to update profile. Please try again.');
//       }
//     } catch (error) {
//       toast.error('An error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      // Here you would call your API to update the password
      // await updatePassword(passwordData.newPassword);
      toast.success('Password updated successfully!');
      setPasswordData({
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">MM</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
              <p className="text-gray-600 mt-2">
                {user?.name || 'Mehandi Mansion Member'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'text-brown-600 border-b-2 border-brown-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 py-2 font-medium text-sm ${
                  activeTab === 'password'
                    ? 'text-brown-600 border-b-2 border-brown-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Password
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form 
            //   onSubmit={handleProfileUpdate}
              >
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      readOnly={!isEditing}
                    />
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      className={`input-field pl-10 w-full border ${
                        phoneError ? 'border-red-500' : 'border-gray-400'
                      } rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent`}
                      placeholder="Enter your 10-digit number"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      readOnly={!isEditing}
                    />
                  </div>
                  {isEditing && phoneError && (
                    <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      type="button"
                      className="flex-1"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user?.name || '',
                          phone: user?.phone || '',
                        });
                        setPhoneError('');
                      }}
                    >
                      <X size={16} className="mr-2" />
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      className="flex-1"
                      disabled={isLoading || !!phoneError}
                    >
                      {isLoading ? 'Saving...' : (
                        <>
                          <Check size={16} className="mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    type="button"
                    className="w-full"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                )}
              </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordUpdate}>
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="newPassword"
                      className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      className={`input-field pl-10 w-full border ${
                        passwordError ? 'border-red-500' : 'border-gray-400'
                      } rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent`}
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                        if (passwordData.newPassword !== e.target.value) {
                          setPasswordError('Passwords do not match');
                        } else {
                          setPasswordError('');
                        }
                      }}
                    />
                  </div>
                  {passwordError && (
                    <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                  )}
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : (
                    <>
                      <ArrowRight size={16} className="mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}