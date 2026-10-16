import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface AuthSuccessCardProps {
  message: string;
  email: string;
}

export const AuthSuccessCard: React.FC<AuthSuccessCardProps> = ({ message, email }) => {
  return (
    <div className="w-full max-w-[420px] bg-white border border-[#E7EEEE] rounded-[20px] p-8 shadow-xl text-center animate-in fade-in zoom-in-95 duration-200">
      <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">{message}</h2>
      <p className="text-xs text-slate-500 mb-4">
        Redirecting to {email.toLowerCase().includes('admin') ? 'Admin Portal' : 'Vendor Portal'}...
      </p>
      <div className="w-8 h-1 bg-emerald-500 rounded-full mx-auto animate-pulse" />
    </div>
  );
};
