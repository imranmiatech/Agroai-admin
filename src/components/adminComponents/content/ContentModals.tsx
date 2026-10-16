import React from 'react';
import { Utensils, Trash2, X } from 'lucide-react';
import type { ContentItem } from '../../../pages/adminPages/ContentManagement';

interface ContentModalsProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  editingItem: ContentItem | null;
  setEditingItem: (item: ContentItem | null) => void;
  activeCategory: 'Recipes' | 'Activities';
  formTitle: string;
  setFormTitle: (t: string) => void;
  formDesc: string;
  setFormDesc: (d: string) => void;
  formMealType: ContentItem['mealType'];
  setFormMealType: (mt: ContentItem['mealType']) => void;
  formAgeGroup: ContentItem['ageGroup'];
  setFormAgeGroup: (ag: ContentItem['ageGroup']) => void;
  formStatus: 'Published' | 'Draft';
  setFormStatus: (st: 'Published' | 'Draft') => void;
  handleCreateItem: (e: React.FormEvent) => void;
  handleUpdateItem: (e: React.FormEvent) => void;
  viewingItem: ContentItem | null;
  setViewingItem: (item: ContentItem | null) => void;
  openEditModal: (item: ContentItem) => void;
  itemToDelete: ContentItem | null;
  setItemToDelete: (item: ContentItem | null) => void;
  handleConfirmDelete: () => void;
}

export const ContentModals: React.FC<ContentModalsProps> = ({
  isCreateOpen,
  setIsCreateOpen,
  editingItem,
  setEditingItem,
  activeCategory,
  formTitle,
  setFormTitle,
  formDesc,
  setFormDesc,
  formMealType,
  setFormMealType,
  formAgeGroup,
  setFormAgeGroup,
  formStatus,
  setFormStatus,
  handleCreateItem,
  handleUpdateItem,
  viewingItem,
  setViewingItem,
  openEditModal,
  itemToDelete,
  setItemToDelete,
  handleConfirmDelete
}) => {
  return (
    <>
      {/* Create / Edit Content Modal */}
      {(isCreateOpen || editingItem) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {isCreateOpen 
                  ? `Create New ${activeCategory === 'Recipes' ? 'Recipe' : 'Activity'}` 
                  : `Edit ${editingItem?.title}`
                }
              </h3>
              <button 
                type="button"
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingItem(null);
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isCreateOpen ? handleCreateItem : handleUpdateItem} className="flex flex-col gap-4 text-xs font-medium">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700">Title</label>
                <input
                  type="text"
                  required
                  placeholder={activeCategory === 'Recipes' ? "e.g., Blueberry Oat Porridge" : "e.g., Sensory Water Play"}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/15 transition-all"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700">Short Summary</label>
                <textarea
                  rows={2}
                  placeholder="Provide a brief, appetizing summary..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/15 transition-all resize-none"
                />
              </div>

              {/* Meal Type & Age Group */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700">Category / Type</label>
                  <select
                    value={formMealType}
                    onChange={(e) => setFormMealType(e.target.value as ContentItem['mealType'])}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-[#0E4F5A] cursor-pointer"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                    <option value="Craft">Craft</option>
                    <option value="Game">Game</option>
                    <option value="Story">Story</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700">Age Group</label>
                  <select
                    value={formAgeGroup}
                    onChange={(e) => setFormAgeGroup(e.target.value as ContentItem['ageGroup'])}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-[#0E4F5A] cursor-pointer"
                  >
                    <option value="0–6 months">0–6 months</option>
                    <option value="6–12 months">6–12 months</option>
                    <option value="1–2 years">1–2 years</option>
                    <option value="2–4 years">2–4 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
              </div>

              {/* Publish Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700">Publication Status</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === 'Published'}
                      onChange={() => setFormStatus('Published')}
                      className="accent-[#0E4F5A]"
                    />
                    <span className="text-slate-800 text-sm">Published Live</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === 'Draft'}
                      onChange={() => setFormStatus('Draft')}
                      className="accent-[#0E4F5A]"
                    />
                    <span className="text-slate-800 text-sm">Save as Draft</span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs"
                >
                  {isCreateOpen ? 'Create Item' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Details / Preview Modal */}
      {viewingItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E2ECEE] text-[#062E35] flex items-center justify-center font-bold">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {viewingItem.title}
                  </h3>
                  <span className="text-xs text-slate-400">{viewingItem.mealType} · {viewingItem.ageGroup}</span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setViewingItem(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {viewingItem.description}
            </p>

            {viewingItem.ingredientsOrMaterials && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex flex-col gap-2">
                <span className="font-semibold text-slate-800">Ingredients & Essentials:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {viewingItem.ingredientsOrMaterials.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
              <span className={`px-3 py-1 rounded-full font-semibold ${viewingItem.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                {viewingItem.status}
              </span>
              <button
                type="button"
                onClick={() => {
                  setViewingItem(null);
                  openEditModal(viewingItem);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors cursor-pointer"
              >
                Edit Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-3xl p-7 max-w-[380px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150"
            style={{ borderRadius: '24px' }}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#FEE4E2] flex items-center justify-center mb-5 shrink-0">
              <Trash2 className="w-6 h-6 text-[#D92D20]" strokeWidth={2.2} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              Delete {itemToDelete.title}?
            </h3>

            <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 px-2">
              Are you sure you want to delete this {itemToDelete.type}? This will permanently remove it from the mobile app catalog.
            </p>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                style={{ borderRadius: '16px' }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full py-3 px-4 rounded-2xl text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer hover:opacity-90 active:scale-95"
                style={{ 
                  backgroundColor: '#B42318', 
                  borderRadius: '16px' 
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
