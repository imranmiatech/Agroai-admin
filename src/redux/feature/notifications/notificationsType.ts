export type NotificationRole = 'ADMIN' | 'VENDOR' | 'EXPERT' | 'CUSTOMER';

export type NotificationType =
  | 'ORDER'
  | 'PARTNER'
  | 'CONSULTATION'
  | 'SOIL_TEST'
  | 'SUPPORT'
  | 'CONTACT'
  | 'PRODUCT'
  | 'BILLING'
  | 'SYSTEM';

export interface NotificationItem {
  id: string;
  userId: string;
  role: NotificationRole;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string | null;
  referenceId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface QueryNotificationsParams {
  page?: number;
  limit?: number;
  isRead?: 'true' | 'false';
  type?: NotificationType;
}

export interface GetNotificationsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    notifications: NotificationItem[];
    unreadCount: number;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    role: NotificationRole;
  };
  timestamp: string;
}

export interface MarkNotificationReadResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    notification: NotificationItem;
    unreadCount: number;
  };
}

export interface MarkAllNotificationsReadResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    updatedCount: number;
    unreadCount: number;
  };
}

export interface DeleteNotificationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    deletedId: string;
    unreadCount: number;
  };
}

export interface DeleteAllNotificationsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    deletedCount: number;
    unreadCount: number;
  };
}
