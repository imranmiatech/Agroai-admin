import React from 'react';
import { Plus } from 'lucide-react';

interface ContentHeaderProps {
  activeCategory: 'Recipes' | 'Activities';
  setActiveCategory: (cat: 'Recipes' | 'Activities') => void;
  categoryTotalCount: number;
  onOpenCreate: () => void;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
  activeCategory,
  setActiveCategory,
  categoryTotalCount,
  onOpenCreate
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* 1. Header Title */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            Content Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, edit, and publish recipes and activities for the app.
          </p>
        </div>
      </div>

      {/* 2. Top Capsule Tabs & Action Button Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Recipes vs Activities Big Capsule */}
        <div className="flex items-center bg-[#F1F5F9] p-1 rounded-full">
          <button
            type="button"
            onClick={() => setActiveCategory('Recipes')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              activeCategory === 'Recipes'
                ? 'bg-[#062E35] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Recipes
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('Activities')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              activeCategory === 'Activities'
                ? 'bg-[#062E35] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Activities
          </button>
        </div>

        {/* Counter & New Button */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-sm font-medium text-slate-500">
            {categoryTotalCount} {activeCategory}
          </span>
          <button
            type="button"
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>+ New {activeCategory === 'Recipes' ? 'Recipe' : 'Activity'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
