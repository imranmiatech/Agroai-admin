export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
  totalProducts?: number;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  image?: string;
  description?: string;
}

export interface GetCategoriesParams {
  includeCount?: boolean;
}

export interface GetCategoriesResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data: CategoryItem[] | { categories: CategoryItem[]; meta?: any };
}

export interface SingleCategoryResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data: CategoryItem;
}
