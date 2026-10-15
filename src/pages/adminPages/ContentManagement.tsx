import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Pencil, 
  Globe, 
  EyeOff, 
  Trash2, 
  X, 
  Utensils
} from 'lucide-react';

export interface ContentItem {
  id: string;
  type: 'recipe' | 'activity';
  title: string;
  description: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Craft' | 'Game' | 'Story';
  ageGroup: '0–6 months' | '6–12 months' | '1–2 years' | '2–4 years' | '5+ years';
  status: 'Published' | 'Draft';
  lastUpdated: string;
  ingredientsOrMaterials?: string[];
  instructions?: string;
}

export const ContentManagement = () => {
  // Main Category Tab (Recipes vs Activities)
  const [activeCategory, setActiveCategory] = useState<'Recipes' | 'Activities'>('Recipes');

  // Realistic sample items matching Figma node 28406:52152
  const [items, setItems] = useState<ContentItem[]>([
    {
      id: 'REC-101',
      type: 'recipe',
      title: 'Blueberry Oat Porridge',
      description: 'Nutritious oat porridge with fresh organic blueberries, chia seeds, and almond milk.',
      mealType: 'Breakfast',
      ageGroup: '6–12 months',
      status: 'Published',
      lastUpdated: 'Jul 6, 2025',
      ingredientsOrMaterials: ['1/2 cup rolled oats', '1 cup almond milk', '1/4 cup fresh blueberries', '1 tsp chia seeds'],
      instructions: 'Simmer oats and milk for 5-7 minutes until soft. Stir in mashed blueberries and chia seeds. Serve lukewarm.'
    },
    {
      id: 'REC-102',
      type: 'recipe',
      title: 'Steamed Sweet Potato & Carrot Mash',
      description: 'Nutritious oat porridge with silky pureed carrots, sweet potato, and olive oil drizzle.',
      mealType: 'Breakfast',
      ageGroup: '6–12 months',
      status: 'Published',
      lastUpdated: 'Jul 6, 2025',
      ingredientsOrMaterials: ['1 sweet potato', '2 carrots', '1 tsp virgin olive oil'],
      instructions: 'Steam sweet potato and carrots until tender. Blend with olive oil until creamy.'
    },
    {
      id: 'REC-103',
      type: 'recipe',
      title: 'Avocado Banana Smoothie Bowl',
      description: 'Nutritious oat porridge with wholesome healthy fats, ripe bananas, and baby spinach.',
      mealType: 'Breakfast',
      ageGroup: '6–12 months',
      status: 'Published',
      lastUpdated: 'Jul 6, 2025',
      ingredientsOrMaterials: ['1/2 ripe avocado', '1 ripe banana', 'Handful baby spinach', 'Breast milk or formula'],
      instructions: 'Blend avocado, banana, and greens with milk until velvety smooth.'
    },
    {
      id: 'REC-104',
      type: 'recipe',
      title: 'Zucchini & Pea Finger Bites',
      description: 'Nutritious oat porridge with gentle finger foods ideal for baby-led weaning exploration.',
      mealType: 'Breakfast',
      ageGroup: '6–12 months',
      status: 'Published',
      lastUpdated: 'Jul 6, 2025',
      ingredientsOrMaterials: ['1 zucchini grated', '1/2 cup garden peas', '1 egg', '2 tbsp oat flour'],
      instructions: 'Mix grated zucchini, peas, egg, and oat flour. Bake bite-sized dollops at 180°C for 15 mins.'
    },
    {
      id: 'REC-105',
      type: 'recipe',
      title: 'Apple Cinnamon Quinoa Flakes',
      description: 'Nutritious oat porridge with warm spiced quinoa porridge naturally sweetened with apple puree.',
      mealType: 'Breakfast',
      ageGroup: '6–12 months',
      status: 'Draft',
      lastUpdated: 'Jul 6, 2025',
      ingredientsOrMaterials: ['1/3 cup quinoa flakes', '3/4 cup water', '2 tbsp apple puree', 'Pinch cinnamon'],
      instructions: 'Cook quinoa flakes in water for 3 minutes. Stir in apple puree and cinnamon.'
    },
    {
      id: 'REC-106',
      type: 'recipe',
      title: 'Lentil & Butternut Squash Puree',
      description: 'Nutritious oat porridge with protein-packed red lentils simmered with aromatic squash.',
      mealType: 'Breakfast',
      ageGroup: '6–12 months',
      status: 'Draft',
      lastUpdated: 'Jul 6, 2025',
      ingredientsOrMaterials: ['1/4 cup red split lentils', '1 cup diced butternut squash', '1.5 cups vegetable broth'],
      instructions: 'Simmer lentils and squash together for 20 minutes until tender. Puree to preferred consistency.'
    },
    // Activities
    {
      id: 'ACT-201',
      type: 'activity',
      title: 'Sensory Water & Citrus Bowl',
      description: 'Tactile water exploration with sliced lemons, limes, and wooden spoons.',
      mealType: 'Game',
      ageGroup: '6–12 months',
      status: 'Published',
      lastUpdated: 'Jul 6, 2025',
      ingredientsOrMaterials: ['Shallow tray', 'Warm water', 'Lemon slices', 'Wooden spoons'],
      instructions: 'Fill a wide shallow bowl with lukewarm water and citrus slices. Let baby splash and explore textures.'
    },
    {
      id: 'ACT-202',
      type: 'activity',
      title: 'Cardboard Texture Discovery Board',
      description: 'DIY tactile sensory board with bubble wrap, corrugated cardboard, and felt.',
      mealType: 'Craft',
      ageGroup: '1–2 years',
      status: 'Published',
      lastUpdated: 'Jul 5, 2025',
      ingredientsOrMaterials: ['Sturdy cardboard', 'Felt scraps', 'Bubble wrap', 'Velvet ribbon', 'Non-toxic glue'],
      instructions: 'Glue different sensory textured fabrics onto cardboard. Guide toddler hands over the contrasting surfaces.'
    }
  ]);

  // Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');
  const [selectedMealType, setSelectedMealType] = useState<string>('All');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('All');

  // Modal States
  const [viewingItem, setViewingItem] = useState<ContentItem | null>(null);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ContentItem | null>(null);

  // New Item Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formMealType, setFormMealType] = useState<ContentItem['mealType']>('Breakfast');
  const [formAgeGroup, setFormAgeGroup] = useState<ContentItem['ageGroup']>('6–12 months');
  const [formStatus, setFormStatus] = useState<'Published' | 'Draft'>('Published');

  // Filter items by category (Recipes vs Activities)
  const currentCategoryType = activeCategory === 'Recipes' ? 'recipe' : 'activity';

  const filteredItems = items.filter((item) => {
    if (item.type !== currentCategoryType) return false;

    const term = search.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(term) || 
                          item.description.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesMeal = selectedMealType === 'All' || item.mealType === selectedMealType;
    const matchesAge = selectedAgeGroup === 'All' || item.ageGroup === selectedAgeGroup;

    return matchesSearch && matchesStatus && matchesMeal && matchesAge;
  });

  // Dynamic count for header
  const categoryTotalCount = items.filter(i => i.type === currentCategoryType).length;

  // Toggle publish status directly
  const handleTogglePublish = (id: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'Published' ? 'Draft' : 'Published',
          lastUpdated: 'Just now'
        };
      }
      return item;
    }));
  };

  // Confirm delete item
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setItems(items.filter(i => i.id !== itemToDelete.id));
    if (viewingItem?.id === itemToDelete.id) setViewingItem(null);
    setItemToDelete(null);
  };

  // Handle Save New Item
  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newItem: ContentItem = {
      id: `${activeCategory === 'Recipes' ? 'REC' : 'ACT'}-${Date.now().toString().slice(-4)}`,
      type: currentCategoryType,
      title: formTitle.trim(),
      description: formDesc.trim() || 'Nutritious and balanced recipe created for families.',
      mealType: formMealType,
      ageGroup: formAgeGroup,
      status: formStatus,
      lastUpdated: 'Just now'
    };

    setItems([newItem, ...items]);
    setFormTitle('');
    setFormDesc('');
    setIsCreateOpen(false);
  };

  // Handle Update Item
  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !formTitle.trim()) return;

    setItems(items.map(i => {
      if (i.id === editingItem.id) {
        return {
          ...i,
          title: formTitle.trim(),
          description: formDesc.trim() || i.description,
          mealType: formMealType,
          ageGroup: formAgeGroup,
          status: formStatus,
          lastUpdated: 'Just now'
        };
      }
      return i;
    }));

    setEditingItem(null);
  };

  const openEditModal = (item: ContentItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormDesc(item.description);
    setFormMealType(item.mealType);
    setFormAgeGroup(item.ageGroup);
    setFormStatus(item.status);
  };

  return (
    <div className="flex flex-col gap-6 font-['Inter'] pb-16">
      {/* 1. Header Section */}
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
            onClick={() => {
              setFormTitle('');
              setFormDesc('');
              setFormMealType(activeCategory === 'Recipes' ? 'Breakfast' : 'Game');
              setFormAgeGroup('6–12 months');
              setFormStatus('Published');
              setIsCreateOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>+ New {activeCategory === 'Recipes' ? 'Recipe' : 'Activity'}</span>
          </button>
        </div>
      </div>

      {/* 3. Filter Bar (Search + Status + Meal Type + Age Group) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:max-w-xs">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search items or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F1F5F9] border-none text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E4F5A]/20 transition-all font-medium"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap justify-between lg:justify-end">
          {/* Status Switcher (All / Published / Draft) */}
          <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-full text-xs font-semibold">
            {(['All', 'Published', 'Draft'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Meal Type Dropdown with Badge */}
          <div className="relative">
            <span className="absolute -top-1.5 -right-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-slate-300 z-10 pointer-events-none">
              12
            </span>
            <select
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#0E4F5A] cursor-pointer transition-colors"
            >
              <option value="All">Meal Type</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Age Group Dropdown with Badge */}
          <div className="relative">
            <span className="absolute -top-1.5 -right-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-slate-300 z-10 pointer-events-none">
              12
            </span>
            <select
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#0E4F5A] cursor-pointer transition-colors"
            >
              <option value="All">Age Group</option>
              <option value="0–6 months">0–6 months</option>
              <option value="6–12 months">6–12 months</option>
              <option value="1–2 years">1–2 years</option>
              <option value="2–4 years">2–4 years</option>
              <option value="5+ years">5+ years</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Content Table (Exact Figma Layout) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-600">
                <th className="py-4 px-6">{activeCategory === 'Recipes' ? 'Recipe' : 'Activity'}</th>
                <th className="py-4 px-6">Meal Type</th>
                <th className="py-4 px-6">Age Group</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Last updated</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No items found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Title & Description */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span 
                          className="font-semibold text-slate-900 text-sm leading-tight cursor-pointer hover:text-[#0E4F5A] transition-colors"
                          onClick={() => setViewingItem(item)}
                        >
                          {item.title}
                        </span>
                        <span className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-sm">
                          {item.description}
                        </span>
                      </div>
                    </td>

                    {/* Meal Type Pill */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E2ECEE] text-[#062E35]">
                        {item.mealType}
                      </span>
                    </td>

                    {/* Age Group */}
                    <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                      {item.ageGroup}
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-6">
                      {item.status === 'Published' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Last Updated */}
                    <td className="py-4 px-6 text-xs text-slate-500 font-normal">
                      {item.lastUpdated}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        {/* View Preview */}
                        <button
                          type="button"
                          onClick={() => setViewingItem(item)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="View preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Item */}
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit content"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle Publish State */}
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(item.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                            item.status === 'Published'
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                          }`}
                          title={item.status === 'Published' ? 'Unpublish to Draft' : 'Publish live'}
                        >
                          {item.status === 'Published' ? <Globe className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setItemToDelete(item)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Create / Edit Content Modal */}
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
                    onChange={(e) => setFormMealType(e.target.value as any)}
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
                    onChange={(e) => setFormAgeGroup(e.target.value as any)}
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

      {/* 6. Item Details / Preview Modal */}
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

      {/* 7. Figma Delete Confirmation Modal (Node 28406:50103 Style) */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-3xl p-7 max-w-[380px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150"
            style={{ borderRadius: '24px' }}
          >
            {/* Top Red Tint Squircle Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#FEE4E2] flex items-center justify-center mb-5 shrink-0">
              <Trash2 className="w-6 h-6 text-[#D92D20]" strokeWidth={2.2} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              Delete {itemToDelete.title}?
            </h3>

            {/* Subtitle */}
            <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 px-2">
              Are you sure you want to delete this {itemToDelete.type}? This will permanently remove it from the mobile app catalog.
            </p>

            {/* Action Buttons Row */}
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
    </div>
  );
};
