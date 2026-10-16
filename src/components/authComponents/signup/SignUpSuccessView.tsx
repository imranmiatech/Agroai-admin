import React from 'react';
import partnerSubmittedBadge from '../../../assets/partner-submitted-badge.svg';

interface SignUpSuccessViewProps {
  onBackToWebsite: () => void;
}

export const SignUpSuccessView: React.FC<SignUpSuccessViewProps> = ({ onBackToWebsite }) => {
  return (
    <div className="w-full max-w-[688px] flex flex-col items-center text-center py-10 px-4 animate-in fade-in zoom-in-95 duration-300">
      {/* SVG Badge with sparkles from Figma Node 25762:61856 */}
      <div className="mb-6 flex items-center justify-center">
        <img
          src={partnerSubmittedBadge}
          alt="Request submitted"
          className="w-[150px] h-[131px] object-contain drop-shadow-sm select-none"
        />
      </div>

      {/* Title */}
      <h1 className="text-[26px] sm:text-[30px] font-semibold text-[#1F2A37] tracking-tight">
        Your partner request has been submitted!
      </h1>

      {/* Description */}
      <p className="text-[15px] sm:text-[16px] text-[#4B5563] mt-3.5 max-w-[560px] leading-relaxed">
        Our team will review your request and get in touch with you shortly. Please allow 3–5 business days for the review process.
      </p>

      {/* Back to Website Button */}
      <div className="mt-8">
        <button
          type="button"
          onClick={onBackToWebsite}
          className="bg-[#0B5460] hover:bg-[#08424C] text-white px-7 py-2.5 rounded-[16px] font-semibold text-[13.5px] transition-all shadow-sm active:scale-[0.99] cursor-pointer"
        >
          Back to website
        </button>
      </div>
    </div>
  );
};
