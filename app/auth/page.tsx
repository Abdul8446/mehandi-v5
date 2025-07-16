

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Phone, ArrowRight, User, LogIn, UserPlus, Lock } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { useAuth } from '@/contexts/AuthContext';
// import Button from '@/components/ui/Button';

// // Indian phone number validation regex
// const isValidIndianPhone = (phone: string) => {
//   const indianPhoneRegex = /^[6-9]\d{9}$/;
//   return indianPhoneRegex.test(phone);
// };

// export default function AuthPage() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [phoneError, setPhoneError] = useState('');

//   const { login, register } = useAuth();
//   const router = useRouter();

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
//     setPhone(value);
//     validatePhone(value);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validatePhone(phone)) {
//       return;
//     }
    
//     if (!isLogin) {
//       if (!name.trim()) {
//         toast.error('Please enter your name');
//         return;
//       }
//       if (password !== confirmPassword) {
//         toast.error('Passwords do not match');
//         return;
//       }
//       if (password.length < 6) {
//         toast.error('Password must be at least 6 characters');
//         return;
//       }
//     }
    
//     if (!password) {
//       toast.error('Please enter your password');
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       let success = false;
//       if (isLogin) {
//         success = await login(phone, password);
//       } else {
//         success = await register(phone, name, password);
//       }
      
//       if (success) {
//         toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
//         router.push('/');
//       } else {
//         toast.error(isLogin ? 'Invalid credentials' : 'Registration failed. Phone may already be registered.');
//       }
//     } catch (error) {
//       toast.error('An error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleAuthMode = () => {
//     setIsLogin(!isLogin);
//     setName('');
//     setPhone('');
//     setPassword('');
//     setConfirmPassword('');
//     setPhoneError('');
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

//             <form onSubmit={handleSubmit}>
//               {!isLogin && (
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
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       required={!isLogin}
//                     />
//                   </div>
//                 </div>
//               )}

//               <div className="mb-4">
//                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone Number
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <Phone size={18} className="text-gray-400" />
//                   </div>
//                   <input
//                     type="tel"
//                     id="phone"
//                     className={`input-field pl-10 w-full border ${phoneError ? 'border-red-500' : 'border-gray-400'} rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent`}
//                     placeholder="Enter your 10-digit number"
//                     value={phone}
//                     onChange={handlePhoneChange}
//                     required
//                   />
//                 </div>
//                 {phoneError && (
//                   <p className="text-xs text-red-500 mt-1">{phoneError}</p>
//                 )}
//                 {!phoneError && phone.length > 0 && isValidIndianPhone(phone) && (
//                   <p className="text-xs text-green-500 mt-1">Valid Indian phone number</p>
//                 )}
//                 {!phoneError && phone.length > 0 && !isValidIndianPhone(phone) && (
//                   <p className="text-xs text-gray-500 mt-1">Must be a valid Indian phone number (starts with 6-9)</p>
//                 )}
//               </div>

//               <div className="mb-4">
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <Lock size={18} className="text-gray-400" />
//                   </div>
//                   <input
//                     type="password"
//                     id="password"
//                     className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     minLength={6}
//                   />
//                 </div>
//                 {!isLogin && (
//                   <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
//                 )}
//               </div>

//               {!isLogin && (
//                 <div className="mb-6">
//                   <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                     Confirm Password
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                       <Lock size={18} className="text-gray-400" />
//                     </div>
//                     <input
//                       type="password"
//                       id="confirmPassword"
//                       className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
//                       placeholder="Confirm your password"
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       required={!isLogin}
//                       minLength={6}
//                     />
//                   </div>
//                 </div>
//               )}

//               <Button
//                 variant='primary'
//                 type="submit"
//                 className="w-full btn-primary flex items-center justify-center"
//                 disabled={isLoading || !!phoneError}
//               >
//                 {isLoading ? (
//                   isLogin ? 'Logging in...' : 'Registering...'
//                 ) : (
//                   <>
//                     {isLogin ? 'Login' : 'Register'}
//                     <ArrowRight size={16} className="ml-2" />
//                   </>
//                 )}
//               </Button>
//             </form>

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
import { Phone, ArrowRight, User, LogIn, UserPlus, Lock, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

// Indian phone number validation regex
const isValidIndianPhone = (phone: string) => {
  const indianPhoneRegex = /^[6-9]\d{9}$/;
  return indianPhoneRegex.test(phone);
};

// Security questions
const SECURITY_QUESTIONS = [
  "What was your first pet's name?",
  "What city were you born in?",
  "What's your mother's maiden name?",
  "What was your first school's name?"
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [securityQuestion1, setSecurityQuestion1] = useState(SECURITY_QUESTIONS[0]);
  const [securityAnswer1, setSecurityAnswer1] = useState('');
  const [securityQuestion2, setSecurityQuestion2] = useState(SECURITY_QUESTIONS[1]);
  const [securityAnswer2, setSecurityAnswer2] = useState('');

  const { login, register, resetPassword } = useAuth();
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
      if (securityAnswer1.length < 2 || securityAnswer2.length < 2) {
        toast.error('Please answer both security questions');
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
        success = await register(
          phone,
          name,
          password,
          securityQuestion1,
          securityAnswer1,
          securityQuestion2,
          securityAnswer2
        );
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(phone)) return;

    setIsLoading(true);
    try {
      const answers = [securityAnswer1, securityAnswer2];
      const success = await resetPassword(phone, answers, password);
      if (success) {
        toast.success('Password reset successfully!');
        setShowForgotPassword(false);
        setIsLogin(true);
      } else {
        toast.error('Incorrect answers to security questions');
      }
    } catch (error) {
      toast.error('Failed to reset password');
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
    setShowForgotPassword(false);
    setSecurityQuestion1(SECURITY_QUESTIONS[0]);
    setSecurityAnswer1('');
    setSecurityQuestion2(SECURITY_QUESTIONS[1]);
    setSecurityAnswer2('');
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
                {showForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create an Account'}
              </h1>
              <p className="text-gray-600 mt-2">
                {showForgotPassword ? 'Answer your security questions' : 
                 isLogin ? 'Login with your phone number' : 'Register with your phone number'}
              </p>
            </div>

            {showForgotPassword ? (
              <form onSubmit={handleForgotPassword}>
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
                  {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {securityQuestion1}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <HelpCircle size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                      placeholder="Your answer"
                      value={securityAnswer1}
                      onChange={(e) => setSecurityAnswer1(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {securityQuestion2}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <HelpCircle size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                      placeholder="Your answer"
                      value={securityAnswer2}
                      onChange={(e) => setSecurityAnswer2(e.target.value)}
                      required
                    />
                  </div>
                </div>

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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button
                  variant='primary'
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center"
                  disabled={isLoading || !!phoneError}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="mt-4 text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-1 mx-auto"
                >
                  Back to login
                </button>
              </form>
            ) : (
              <>
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
                  </div>

                    {!isLogin && (
                    <div className="space-y-4 mb-5">
                      <h3 className="text-lg font-medium text-gray-700">Security Questions</h3>
                      
                      <div>
                        <label className="block text-sm text-gray-700 font-medium mb-1">Question 1</label>
                        <select
                          value={securityQuestion1}
                          onChange={(e) => setSecurityQuestion1(e.target.value)}
                          className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 mb-3 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                          required
                        >
                          <option value="">Select a question</option>
                          {SECURITY_QUESTIONS.map((q) => (
                            <option key={q} value={q}>{q}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={securityAnswer1}
                          onChange={(e) => setSecurityAnswer1(e.target.value)}
                          className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                          placeholder="Your answer"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 font-medium mb-1">Question 2</label>
                        <select
                          value={securityQuestion2}
                          onChange={(e) => setSecurityQuestion2(e.target.value)}
                          className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 mb-3 focus:outline-none focus:border-transparent"
                          required
                        >
                          <option value="">Select a question</option>
                          {SECURITY_QUESTIONS.filter(q => q !== securityQuestion1).map((q) => (
                            <option key={q} value={q}>{q}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={securityAnswer2}
                          onChange={(e) => setSecurityAnswer2(e.target.value)}
                          className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                          placeholder="Your answer"
                          required
                        />
                      </div>
                    </div>
                    )}


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
                    <>
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

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Security Question 1
                        </label>
                        <select
                          value={securityQuestion1}
                          onChange={(e) => setSecurityQuestion1(e.target.value)}
                          className="w-full p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                        >
                          {SECURITY_QUESTIONS.map((q) => (
                            <option key={q} value={q}>{q}</option>
                          ))}
                        </select>
                        <div className="relative mt-2">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <HelpCircle size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                            placeholder="Your answer"
                            value={securityAnswer1}
                            onChange={(e) => setSecurityAnswer1(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Security Question 2
                        </label>
                        <select
                          value={securityQuestion2}
                          onChange={(e) => setSecurityQuestion2(e.target.value)}
                          className="w-full p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                        >
                          {SECURITY_QUESTIONS.map((q) => (
                            <option key={q} value={q}>{q}</option>
                          ))}
                        </select>
                        <div className="relative mt-2">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <HelpCircle size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            className="input-field pl-10 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                            placeholder="Your answer"
                            value={securityAnswer2}
                            onChange={(e) => setSecurityAnswer2(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </>
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

                {isLogin && (
                  <button
                    onClick={() => setShowForgotPassword(true)}
                    className="mt-4 text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-1 mx-auto"
                  >
                    <HelpCircle size={14} />
                    Forgot password?
                  </button>
                )}

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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}