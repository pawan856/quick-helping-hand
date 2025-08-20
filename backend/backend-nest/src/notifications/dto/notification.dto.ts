import { IsUUID, IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsUUID()
  userId: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  message: string;
}

export class MarkNotificationReadDto {
  @IsUUID()
  notificationId: string;

  @IsBoolean()
  @IsOptional()
  read?: boolean;
}
