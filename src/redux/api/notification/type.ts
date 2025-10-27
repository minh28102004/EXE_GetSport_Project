import type { ApiEnvelope } from '@redux/api/auth/type';

export type NotificationFilterParams = {
  type?: string;
  isRead?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
};

export type NotificationResponseDto = {
  notificationId: number;
  userId: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type Notification = {
  id: number;
  userId: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type NotificationsEnvelope = ApiEnvelope<NotificationResponseDto[]>;