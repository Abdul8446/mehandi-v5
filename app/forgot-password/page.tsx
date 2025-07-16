// app/forgot-password/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, HelpCircle, Phone, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>(['', '']);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { getSecurityQuestions, resetPassword } = useAuth();
  const router = useRouter();

  const handleGetQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userQuestions = await getSecurityQuestions(phone);
      if (userQuestions) {
        setQuestions(userQuestions);
        setStep(2);
      } else {
        toast.error('User not found or no security questions set');
      }
    } catch (error) {
      toast.error('Failed to get security questions');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      const success = await resetPassword(phone, answers, newPassword);
      if (success) {
        toast.success('Password reset successfully!');
        router.push('/login');
      } else {
        toast.error('Password reset failed. Please check your answers.');
      }
    } catch (error) {
      toast.error('An error occurred during password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
        
        {step === 1 && (
          <form onSubmit={handleGetQuestions} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 w-full p-2 border rounded-md"
                  placeholder="Enter your registered phone"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Continue'}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-1">
                    {question}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HelpCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={answers[index] || ''}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[index] = e.target.value;
                        setAnswers(newAnswers);
                      }}
                      className="pl-10 w-full p-2 border rounded-md"
                      placeholder="Your answer"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 w-full p-2 border rounded-md"
                  placeholder="Enter new password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Resetting...' : (
                <>
                  Reset Password
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;