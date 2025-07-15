// // app/auth/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Phone, ArrowRight, User, LogIn, UserPlus } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { useAuth } from '@/contexts/AuthContext';
// import Button from '@/components/ui/Button';

// export default function AuthPage() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [step, setStep] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [resendTimer, setResendTimer] = useState(60);

//   const { login, register, verifyOtp } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (step === 2 && resendTimer > 0) {
//       const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [step, resendTimer]);

//   const handlePhoneSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!isLogin && !name.trim()) {
//       toast.error('Please enter your name');
//       return;
//     }
    
//     if (!phone || phone.length !== 10) {
//       toast.error('Please enter a valid 10-digit phone number');
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       const success = isLogin 
//         ? await login(phone) 
//         : await register(phone, name);
      
//       if (success) {
//         setStep(2);
//         setResendTimer(60);
//         toast.success(`OTP sent to ${phone}! For demo, use 1234`);
//       } else {
//         toast.error('Failed to send OTP. Please try again.');
//       }
//     } catch (error) {
//       toast.error('An error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOtpSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!otp || otp.length !== 4) {
//       toast.error('Please enter a valid 4-digit OTP');
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       const user = await verifyOtp(phone, otp, isLogin, isLogin ? undefined : name);
      
//       if (user) {
//         toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
//         router.push('/');
//       } else {
//         toast.error('Invalid OTP. Please try again.');
//       }
//     } catch (error:any) {
//       toast.error(error);     
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     if (resendTimer === 0) {
//       try {
//         const success = isLogin 
//           ? await login(phone) 
//           : await register(phone, name);
        
//         if (success) {
//           setResendTimer(60);
//           toast.success('OTP resent! For demo, use 1234');
//         } else {
//           toast.error('Failed to resend OTP. Please try again.');
//         }
//       } catch (error) {
//         toast.error('An error occurred. Please try again.');
//       }
//     }
//   };

//   const toggleAuthMode = () => {
//     setIsLogin(!isLogin);
//     setName('');
//     setPhone('');
//     setOtp('');
//     setStep(1);
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen py-20">
//       <div className="container mx-auto px-4">
//         <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="p-6 sm:p-8">
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-white font-bold text-xl">MM</span>
//               </div>
//               <h1 className="text-2xl font-bold text-gray-800">
//                 {isLogin ? 'Welcome Back' : 'Create an Account'}
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 {isLogin ? 'Login with your phone number' : 'Register with your phone number'}
//               </p>
//             </div>

//             {step === 1 ? (
//               <form onSubmit={handlePhoneSubmit}>
//                 {!isLogin && (
//                   <div className="mb-4">
//                     <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                       Your Name
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                         <User size={18} className="text-gray-400" />
//                       </div>
//                       <input
//                         type="text"
//                         id="name"
//                         className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
//                         placeholder="Enter your name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         required={!isLogin}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 <div className="mb-6">
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
//                       className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
//                       placeholder="Enter your 10-digit number"
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
//                       required
//                     />
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">
//                     We'll send you a one-time password to verify your number
//                   </p>
//                 </div>
//                 <Button
//                   variant='primary'
//                   type="submit"
//                   className="w-full btn-primary flex items-center justify-center"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Sending OTP...' : (
//                     <>
//                       {isLogin ? 'Login' : 'Register'} with OTP
//                       <ArrowRight size={16} className="ml-2" />
//                     </>
//                   )}
//                 </Button>
//               </form>
//             ) : (
//               <form onSubmit={handleOtpSubmit}>
//                 <div className="mb-6">
//                   <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
//                     Enter OTP
//                   </label>
//                   <input
//                     type="text"
//                     id="otp"
//                     className="input-field text-center text-2xl tracking-widest w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
//                     placeholder="• • • •"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
//                     required
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     OTP sent to +91 {phone}.
//                     <button
//                       type="button"
//                       className="text-red-900 hover:text-red-700 ml-1"
//                       onClick={() => setStep(1)}
//                     >
//                       Change?
//                     </button>
//                   </p>
//                 </div>
//                 <Button
//                   variant='primary'
//                   type="submit"
//                   className="w-full btn-primary flex items-center justify-center"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Verifying...' : `Verify & ${isLogin ? 'Login' : 'Register'}`}
//                   {!isLoading && <ArrowRight size={16} className="ml-2" />}
//                 </Button>
//                 <div className="mt-4 text-center">
//                   <button
//                     type="button"
//                     className={`text-sm ${resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-red-900 hover:text-red-700'}`}
//                     onClick={handleResendOtp}
//                     disabled={resendTimer > 0}
//                   >
//                     {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
//                   </button>
//                 </div>
//               </form>
//             )}

//             <div className="mt-6 text-center">
//               <button
//                 onClick={toggleAuthMode}
//                 className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-1 mx-auto"
//               >
//                 {isLogin ? (
//                   <>
//                     <UserPlus size={14} />
//                     Don't have an account? Register
//                   </>
//                 ) : (
//                   <>
//                     <LogIn size={14} />
//                     Already have an account? Login
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ArrowRight, User, LogIn, UserPlus, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

// Indian phone number validation regex
const isValidIndianPhone = (phone: string) => {
  const indianPhoneRegex = /^[6-9]\d{9}$/;
  return indianPhoneRegex.test(phone);
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const { login, register } = useAuth();
  const router = useRouter();

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
    setPhone(value);
    validatePhone(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(phone)) {
      return;
    }
    
    if (!isLogin) {
      if (!name.trim()) {
        toast.error('Please enter your name');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }
    
    if (!password) {
      toast.error('Please enter your password');
      return;
    }
    
    setIsLoading(true);
    try {
      let success = false;
      if (isLogin) {
        success = await login(phone, password);
      } else {
        success = await register(phone, name, password);
      }
      
      if (success) {
        toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
        router.push('/');
      } else {
        toast.error(isLogin ? 'Invalid credentials' : 'Registration failed. Phone may already be registered.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setName('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setPhoneError('');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">MM</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                {isLogin ? 'Welcome Back' : 'Create an Account'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isLogin ? 'Login with your phone number' : 'Register with your phone number'}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
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
                    className={`input-field pl-10 w-full border ${phoneError ? 'border-red-500' : 'border-gray-400'} rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent`}
                    placeholder="Enter your 10-digit number"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                  />
                </div>
                {phoneError && (
                  <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                )}
                {!phoneError && phone.length > 0 && isValidIndianPhone(phone) && (
                  <p className="text-xs text-green-500 mt-1">Valid Indian phone number</p>
                )}
                {!phoneError && phone.length > 0 && !isValidIndianPhone(phone) && (
                  <p className="text-xs text-gray-500 mt-1">Must be a valid Indian phone number (starts with 6-9)</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                {!isLogin && (
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                )}
              </div>

              {!isLogin && (
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={!isLogin}
                      minLength={6}
                    />
                  </div>
                </div>
              )}

              <Button
                variant='primary'
                type="submit"
                className="w-full btn-primary flex items-center justify-center"
                disabled={isLoading || !!phoneError}
              >
                {isLoading ? (
                  isLogin ? 'Logging in...' : 'Registering...'
                ) : (
                  <>
                    {isLogin ? 'Login' : 'Register'}
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={toggleAuthMode}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-1 mx-auto"
              >
                {isLogin ? (
                  <>
                    <UserPlus size={14} />
                    Don't have an account? Register
                  </>
                ) : (
                  <>
                    <LogIn size={14} />
                    Already have an account? Login
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}