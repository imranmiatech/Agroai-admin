import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  X,
  Trash2,
  CheckCheck,
  ShoppingBag,
  Store,
  MessageSquare,
  FlaskConical,
  Headphones,
  Mail,
  Package,
  CreditCard,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';
import type {
  NotificationItem,
  NotificationType,
} from '../redux/feature/notifications/notificationsType';
import {
  useDeleteAllNotificationsMutation,
  useDeleteNotificationMutation,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from '../redux/feature/notifications/notificationsApi';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  unreadCount: number;
  role?: string;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
}

const formatRelativeTime = (dateStr: string): string => {
  const timestamp = new Date(dateStr).getTime();
  if (Number.isNaN(timestamp)) return '';
  const diffSec = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });
};

const getTypeMeta = (type: NotificationType) => {
  switch (type) {
    case 'ORDER':
      return {
        icon: ShoppingBag,
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
        label: 'Order',
      };
    case 'PARTNER':
      return {
        icon: Store,
        bg: 'bg-teal-50 text-teal-700 border-teal-200/70',
        label: 'Partner',
      };
    case 'CONSULTATION':
      return {
        icon: MessageSquare,
        bg: 'bg-sky-50 text-sky-700 border-sky-200/70',
        label: 'Consultation',
      };
    case 'SOIL_TEST':
      return {
        icon: FlaskConical,
        bg: 'bg-amber-50 text-amber-700 border-amber-200/70',
        label: 'Soil Lab',
      };
    case 'SUPPORT':
      return {
        icon: Headphones,
        bg: 'bg-violet-50 text-violet-700 border-violet-200/70',
        label: 'Support',
      };
    case 'CONTACT':
      return {
        icon: Mail,
        bg: 'bg-blue-50 text-blue-700 border-blue-200/70',
        label: 'Inquiry',
      };
    case 'PRODUCT':
      return {
        icon: Package,
        bg: 'bg-lime-50 text-lime-700 border-lime-200/70',
        label: 'Product',
      };
    case 'BILLING':
      return {
        icon: CreditCard,
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
        label: 'Billing',
      };
    default:
      return {
        icon: Sparkles,
        bg: 'bg-slate-100 text-slate-700 border-slate-200/70',
        label: 'System',
      };
  }
};

const getRoleBadgeLabel = (role?: string) => {
  switch ((role || '').toUpperCase()) {
    case 'ADMIN':
      return 'Admin Panel';
    case 'VENDOR':
      return 'Vendor Portal';
    case 'EXPERT':
      return 'Expert Desk';
    default:
      return 'Account';
  }
};

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  role,
  isLoading,
  isFetching,
  isError,
  onRetry,
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications, { isLoading: isDeletingAll }] =
    useDeleteAllNotificationsMutation();

  const handleClose = () => {
    setConfirmDeleteAll(false);
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConfirmDeleteAll(false);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter((item) => !item.isRead);
    }
    return notifications;
  }, [notifications, filter]);

  if (!isOpen) return null;

  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      try {
        await markAsRead(item.id).unwrap();
      } catch (err) {
        console.warn('Failed to mark notification as read:', err);
      }
    }

    if (item.link) {
      navigate(item.link);
      handleClose();
    }
  };

  const handleDeleteSingle = async (
    e: React.MouseEvent,
    notificationId: string,
  ) => {
    e.stopPropagation();
    setDeletingId(notificationId);
    try {
      await deleteNotification(notificationId).unwrap();
    } catch (err) {
      console.error('Failed to delete notification:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications().unwrap();
      setConfirmDeleteAll(false);
    } catch (err) {
      console.error('Failed to delete all notifications:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end p-3 sm:p-5 sm:pt-[76px] bg-slate-900/35 backdrop-blur-[2px] animate-in fade-in duration-150"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Notifications"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#062E35] to-[#0E4F5A] text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Bell className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight truncate">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-teal-100/90 font-medium">
                {getRoleBadgeLabel(role)} • Role-based updates
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0"
            title="Close notifications"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Filter & Bulk Action Toolbar */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2">
          {/* Tabs */}
          <div className="inline-flex rounded-lg bg-slate-200/70 p-0.5">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-[#062E35] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                filter === 'unread'
                  ? 'bg-white text-[#062E35] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={isMarkingAll}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-[#0E4F5A] hover:bg-teal-50 transition-colors cursor-pointer disabled:opacity-50"
                title="Mark all as read"
              >
                {isMarkingAll ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCheck className="w-3.5 h-3.5" />
                )}
                <span>Mark read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmDeleteAll(true)}
                disabled={isDeletingAll}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                title="Delete all notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete all</span>
              </button>
            )}
          </div>
        </div>

        {/* Inline Confirm Delete All Bar */}
        {confirmDeleteAll && notifications.length > 0 && (
          <div className="px-4 py-2.5 bg-rose-50 border-b border-rose-100 flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-rose-800">
              Delete all {notifications.length} notifications?
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setConfirmDeleteAll(false)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAll}
                disabled={isDeletingAll}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer disabled:opacity-60"
              >
                {isDeletingAll && <Loader2 className="w-3 h-3 animate-spin" />}
                <span>Yes, Delete All</span>
              </button>
            </div>
          </div>
        )}

        {/* Notification List Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Could not load notifications
              </p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Please check your connection and try again.
              </p>
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0E4F5A] text-white text-xs font-semibold hover:bg-[#062E35] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-12 px-6 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {filter === 'unread'
                  ? 'No unread notifications'
                  : 'No notifications yet'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-[260px]">
                {filter === 'unread'
                  ? 'You have read all of your role notifications.'
                  : 'New alerts for your role will appear here automatically.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const meta = getTypeMeta(item.type);
              const Icon = meta.icon;
              const isDeletingThis = deletingId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`group relative px-4 py-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    item.isRead
                      ? 'bg-white hover:bg-slate-50/80'
                      : 'bg-teal-50/40 hover:bg-teal-50/70'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${meta.bg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-7">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {meta.label}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-slate-400">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#0E4F5A] shrink-0" />
                      )}
                    </div>

                    <p
                      className={`text-sm leading-snug truncate ${
                        item.isRead
                          ? 'font-medium text-slate-700'
                          : 'font-semibold text-slate-900'
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    {item.link && (
                      <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#0E4F5A] mt-1.5 opacity-80 group-hover:opacity-100">
                        <span>View details</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Individual Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteSingle(e, item.id)}
                    disabled={isDeletingThis}
                    className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete notification"
                    aria-label={`Delete notification ${item.title}`}
                  >
                    {isDeletingThis ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            {isFetching ? 'Syncing notifications...' : `${notifications.length} total`}
          </span>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1 font-medium text-[#0E4F5A] hover:underline cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
