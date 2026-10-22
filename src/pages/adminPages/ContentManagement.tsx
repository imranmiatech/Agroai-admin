import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ContentHeader, 
  ContentFilters, 
  ContentTable, 
  ContentModals 
} from '../../components/adminComponents/content';
import {
  useGetArticlesQuery,
  useUpdateArticleStatusMutation,
  useDeleteArticleMutation,
  CONTENT_CATEGORIES,
  type ContentItem,
} from '../../redux';

export type { ContentItem };

export const ContentManagement = () => {
  const navigate = useNavigate();

  // Filtering states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // RTK Query: Dynamic Database Endpoints
  const { data: response, isLoading } = useGetArticlesQuery({
    search: search.trim() || undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    status: statusFilter !== 'All' ? statusFilter : undefined,
  });

  const [updateArticleStatus] = useUpdateArticleStatusMutation();
  const [deleteArticle] = useDeleteArticleMutation();

  const items: ContentItem[] = response?.data?.data || [];
  const totalCount = response?.data?.meta?.total ?? items.length;

  // Extract categories dynamically from actual database articles merged with standard categories
  const categories = useMemo(() => {
    const fromArticles = items.map((i) => i.category).filter(Boolean);
    return Array.from(new Set([...CONTENT_CATEGORIES, ...fromArticles]));
  }, [items]);

  // Preview & Delete Modals state
  const [viewingItem, setViewingItem] = useState<ContentItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ContentItem | null>(null);

  // Action handlers - Live Database Mutations
  const handleTogglePublish = async (id: string) => {
    const target = items.find(i => i.id === id);
    if (!target) return;
    const nextStatus = target.status === 'Published' ? 'Draft' : 'Published';
    try {
      await updateArticleStatus({ id, status: nextStatus }).unwrap();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteArticle(itemToDelete.id).unwrap();
      setItemToDelete(null);
    } catch (err) {
      console.error('Failed to delete article:', err);
    }
  };

  const handleEdit = (item: ContentItem) => {
    navigate(`/admin/content/edit/${item.id}`);
  };

  const handleCreate = () => {
    navigate('/admin/content/create');
  };

  return (
    <div className="flex flex-col gap-6 font-['Inter'] pb-16">
      {/* 1. Header (Title, Total count & + Create Article button which navigates to /admin/content/create) */}
      <ContentHeader
        totalCount={totalCount}
        onOpenCreate={handleCreate}
      />

      {/* 2. Filter Bar (Search, Status switcher, Category dropdown) */}
      <ContentFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* 3. Articles Table */}
      <ContentTable
        items={items}
        isLoading={isLoading}
        onView={(item) => setViewingItem(item)}
        onEdit={handleEdit}
        onTogglePublish={handleTogglePublish}
        onDelete={(item) => setItemToDelete(item)}
      />

      {/* 4. Preview & Delete Modals */}
      <ContentModals
        viewingItem={viewingItem}
        setViewingItem={setViewingItem}
        onEdit={handleEdit}
        itemToDelete={itemToDelete}
        setItemToDelete={setItemToDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};
