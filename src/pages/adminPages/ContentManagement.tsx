import { useState } from 'react';
import { 
  ContentHeader, 
  ContentFilters, 
  ContentTable, 
  ContentModals 
} from '../../components/adminComponents/content';

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

  // Realistic sample items
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
      ingredientsOrMaterials: ['1/4 cup red lentils', '1 cup diced butternut squash', '1.5 cups vegetable broth'],
      instructions: 'Simmer lentils and squash in broth until completely soft, about 20 mins. Puree.'
    },
    {
      id: 'ACT-201',
      type: 'activity',
      title: 'Sensory Water Play & Floating Objects',
      description: 'Promote tactile motor development and hand-eye coordination with splashing textures.',
      mealType: 'Game',
      ageGroup: '6–12 months',
      status: 'Published',
      lastUpdated: 'Jul 5, 2025',
      ingredientsOrMaterials: ['Shallow tray with warm water', 'Soft rubber floating ducks', 'Small measuring cups'],
      instructions: 'Place baby supported near tray. Demonstrate dipping hands and scooping water.'
    },
    {
      id: 'ACT-202',
      type: 'activity',
      title: 'Mess-Free Finger Painting with Ziploc',
      description: 'Safe sensory color mixing using non-toxic washable tempura in sealed clear pouches.',
      mealType: 'Craft',
      ageGroup: '1–2 years',
      status: 'Published',
      lastUpdated: 'Jul 4, 2025',
      ingredientsOrMaterials: ['Gallon Ziploc bag', 'Primary color paints', 'Painter tape', 'Heavy cardstock'],
      instructions: 'Squirt paint dots inside bag, tape securely to highchair tray or sliding door. Let toddler squish.'
    }
  ]);

  // Filtering states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');
  const [selectedMealType, setSelectedMealType] = useState<string>('All');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('All');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [viewingItem, setViewingItem] = useState<ContentItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ContentItem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formMealType, setFormMealType] = useState<ContentItem['mealType']>('Breakfast');
  const [formAgeGroup, setFormAgeGroup] = useState<ContentItem['ageGroup']>('6–12 months');
  const [formStatus, setFormStatus] = useState<'Published' | 'Draft'>('Published');

  // Derived filter logic
  const currentCategoryType = activeCategory === 'Recipes' ? 'recipe' : 'activity';

  const categoryItems = items.filter(i => i.type === currentCategoryType);
  const categoryTotalCount = categoryItems.length;

  const filteredItems = categoryItems.filter(item => {
    const term = search.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(term) ||
                          item.description.toLowerCase().includes(term) ||
                          item.mealType.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesMeal = selectedMealType === 'All' || item.mealType === selectedMealType;
    const matchesAge = selectedAgeGroup === 'All' || item.ageGroup === selectedAgeGroup;

    return matchesSearch && matchesStatus && matchesMeal && matchesAge;
  });

  // Action handlers
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

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setItems(items.filter(i => i.id !== itemToDelete.id));
    setItemToDelete(null);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newItem: ContentItem = {
      id: `${currentCategoryType === 'recipe' ? 'REC' : 'ACT'}-${Date.now().toString().slice(-3)}`,
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
      {/* 1 & 2. Header and Category Tabs */}
      <ContentHeader
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categoryTotalCount={categoryTotalCount}
        onOpenCreate={() => {
          setFormTitle('');
          setFormDesc('');
          setFormMealType(activeCategory === 'Recipes' ? 'Breakfast' : 'Game');
          setFormAgeGroup('6–12 months');
          setFormStatus('Published');
          setIsCreateOpen(true);
        }}
      />

      {/* 3. Filter Bar */}
      <ContentFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        selectedMealType={selectedMealType}
        setSelectedMealType={setSelectedMealType}
        selectedAgeGroup={selectedAgeGroup}
        setSelectedAgeGroup={setSelectedAgeGroup}
      />

      {/* 4. Content Table */}
      <ContentTable
        items={filteredItems}
        activeCategory={activeCategory}
        onView={(item) => setViewingItem(item)}
        onEdit={(item) => openEditModal(item)}
        onTogglePublish={handleTogglePublish}
        onDelete={(item) => setItemToDelete(item)}
      />

      {/* 5, 6, 7. Modals */}
      <ContentModals
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        activeCategory={activeCategory}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        formDesc={formDesc}
        setFormDesc={setFormDesc}
        formMealType={formMealType}
        setFormMealType={setFormMealType}
        formAgeGroup={formAgeGroup}
        setFormAgeGroup={setFormAgeGroup}
        formStatus={formStatus}
        setFormStatus={setFormStatus}
        handleCreateItem={handleCreateItem}
        handleUpdateItem={handleUpdateItem}
        viewingItem={viewingItem}
        setViewingItem={setViewingItem}
        openEditModal={openEditModal}
        itemToDelete={itemToDelete}
        setItemToDelete={setItemToDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};
