import type { NotificationResponseDto } from './type';
import type { Notification } from './type';

export const mapNotificationResponseToUi = (dto: NotificationResponseDto): Notification => ({
  id: dto.notificationId,
  userId: dto.userId,
  type: dto.type,
  message: dto.message,
  isRead: dto.isRead,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});