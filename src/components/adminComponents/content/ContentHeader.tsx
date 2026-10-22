import React from 'react';
import { Plus, BookOpen } from 'lucide-react';

interface ContentHeaderProps {
  totalCount: number;
  onOpenCreate: () => void;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
  totalCount,
  onOpenCreate
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* 1. Header Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#E2ECEE] text-[#062E35] flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            Content & Blog Management
          </h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Manage, write, and publish markdown articles, guides, and stories for KrishiKunjo.
        </p>
      </div>

      {/* 2. Counter & Create Article Action */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
          {totalCount} {totalCount === 1 ? 'Article' : 'Articles'}
        </span>
        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Create Article</span>
        </button>
      </div>
    </div>
  );
};
