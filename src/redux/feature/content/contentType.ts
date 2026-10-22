export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  content: string;
  author: {
    name: string;
    role?: string;
    avatar?: string;
  };
  coverImage?: string;
  readTime: string;
  status: 'Published' | 'Draft' | 'Archived';
  rawStatus?: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export const CONTENT_CATEGORIES = [
  'Clean Energy',
  'Biomass Energy',
  'AgriTech',
  'Organic Farming',
  'Crop Care',
  'Livestock',
];

export interface GetArticlesParams {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface GetArticlesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: ContentItem[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface GetSingleArticleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ContentItem;
}

export interface CreateArticlePayload {
  title: string;
  category: string;
  description?: string;
  content: string;
  coverImage?: string;
  readTime?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  status?: 'Published' | 'Draft';
}

export interface UpdateArticlePayload {
  id: string;
  data: Partial<CreateArticlePayload>;
}

export interface UpdateArticleStatusPayload {
  id: string;
  status: 'Published' | 'Draft';
}

export interface DeleteArticleResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
    message: string;
    id: string;
  };
}
