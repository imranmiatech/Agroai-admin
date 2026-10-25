export type ProductStatus = 'ACTIVE' | 'SUSPENDED' | 'OUT_OF_STOCK';

export const AGRICULTURE_CATEGORIES = [
  'Seeds & Seedlings',
  'Fertilizers',
  'Garden Tools',
  'Pesticides',
  'Plant Pots',
  'Vegetables',
  'Fruits',
  'Agricultural Machinery',
  'Organic Products',
  'Herbs',
] as const;

export type AgricultureCategory = (typeof AGRICULTURE_CATEGORIES)[number];

export interface VendorInfo {
  id: string;
  businessName: string;
  logo?: string | null;
  category?: string | null;
  city?: string | null;
  country?: string | null;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  price: number;
  compareAtPrice?: number | null;
  deliveryCharge?: number;
  stock: number;
  status: ProductStatus;
  summary?: string | null;
  description?: string | null;
  highlights?: string[];
  badges?: string[];
  images?: string[];
  thumbnail?: string | null;
  specifications?: Record<string, string> | null;
  vendorId?: string | null;
  vendor?: VendorInfo | null;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  deliveryCharge?: number;
  stock?: number;
  sku?: string;
  slug?: string;
  status?: ProductStatus;
  summary?: string;
  description?: string;
  highlights?: string[];
  badges?: string[];
  images?: string[];
  thumbnail?: string;
  specifications?: Record<string, string>;
  vendorId?: string;
}

export interface UpdateProductPayload {
  id: string;
  name?: string;
  category?: string;
  price?: number;
  compareAtPrice?: number;
  stock?: number;
  sku?: string;
  slug?: string;
  status?: ProductStatus;
  summary?: string;
  description?: string;
  highlights?: string[];
  badges?: string[];
  images?: string[];
  thumbnail?: string;
  specifications?: Record<string, string>;
  vendorId?: string;
}

export interface UpdateProductStatusPayload {
  id: string;
  status: ProductStatus;
}

export interface QueryProductParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: ProductStatus | string;
  minPrice?: number;
  maxPrice?: number;
  vendorId?: string;
  sortBy?: 'createdAt' | 'price' | 'name' | 'stock';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductsPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetProductsResponse {
  statusCode?: number;
  message?: string;
  data: {
    products: ProductItem[];
    meta: ProductsPaginationMeta;
  };
}

export interface SingleProductResponse {
  statusCode?: number;
  message?: string;
  data: ProductItem;
}
