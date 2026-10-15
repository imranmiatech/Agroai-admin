import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const ResetSuccesfull: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#F4F4F4] text-[#0F172A] flex flex-col items-center justify-center p-4 sm:p-6 font-['Inter',sans-serif]">
      {/* Centered Modal / Card Container matching Figma node 25762:61826 */}
      <div className="w-full max-w-[601px] bg-white border border-[#E7EEEE] rounded-[16px] p-8 sm:p-10 shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03)] flex flex-col items-center text-center">
        {/* Celebration Checkmark Icon with Radiating Rays & Sparkles */}
        <div className="w-[120px] h-[120px] flex items-center justify-center relative select-none">
          <svg
            className="w-full h-full text-[#0B5460]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Radiating Ray 1 (Top) */}
            <line x1="50" y1="6" x2="50" y2="15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Radiating Ray 2 (Top Right) */}
            <line x1="78" y1="18" x2="72" y2="25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Radiating Ray 3 (Right) */}
            <line x1="94" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Radiating Ray 4 (Bottom Right) */}
            <line x1="82" y1="78" x2="74" y2="72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Radiating Ray 5 (Bottom) */}
            <line x1="50" y1="94" x2="50" y2="85" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Radiating Ray 6 (Bottom Left) */}
            <line x1="18" y1="78" x2="26" y2="72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Radiating Ray 7 (Left) */}
            <line x1="6" y1="50" x2="15" y2="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Radiating Ray 8 (Top Left) */}
            <line x1="22" y1="18" x2="28" y2="25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />

            {/* Sparkle 1 (Top Left) */}
            <path
              d="M17 32C17 32 18 34 20 34C18 34 17 36 17 36C17 36 16 34 14 34C16 34 17 32 17 32Z"
              fill="currentColor"
            />
            {/* Sparkle 2 (Top Right) */}
            <path
              d="M83 34C83 34 84 36 86 36C84 36 83 38 83 38C83 38 82 36 80 36C82 36 83 34 83 34Z"
              fill="currentColor"
            />
            {/* Sparkle 3 (Bottom Left) */}
            <path
              d="M20 66C20 66 21 68 23 68C21 68 20 70 20 70C20 70 19 68 17 68C19 68 20 66 20 66Z"
              fill="currentColor"
            />
            {/* Sparkle 4 (Bottom Right) */}
            <path
              d="M80 66C80 66 81 68 83 68C81 68 80 70 80 70C80 70 79 68 77 68C79 68 80 66 80 66Z"
              fill="currentColor"
            />

            {/* Main Central Circle */}
            <circle cx="50" cy="50" r="30" fill="currentColor" />

            {/* Checkmark inside circle */}
            <path
              d="M40 50.5L47 57.5L61.5 43"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Heading Section matching Figma node 25762:61849 */}
        <div className="mt-6 flex flex-col items-center">
          {/* Title matching Figma node 25762:61850 */}
          <h1 className="text-[26px] sm:text-[30px] font-bold leading-[34px] sm:leading-[38px] text-[#1F2A37] tracking-normal">
            Password successfully changed
          </h1>

          {/* Subtitle matching Figma node 25762:61851 */}
          <p className="mt-2 text-[15px] sm:text-[16px] font-normal leading-[24px] text-[#4B5563]">
            Please log in your account with new password
          </p>
        </div>

        {/* Log In Button matching Figma node 25762:61852 */}
        <div className="w-full mt-[43px]">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full h-[42px] bg-[#0B5460] hover:bg-[#08404A] text-white text-[14px] font-semibold rounded-[16px] transition-all flex items-center justify-center shadow-sm active:scale-[0.99] cursor-pointer"
          >
            Log in
          </button>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="mt-12 text-center text-xs text-slate-400 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-[#0B5460]" />
        <span>Protected by Evaturner Secure Enterprise Authentication</span>
      </div>
    </div>
  );
};

export default ResetSuccesfull;
