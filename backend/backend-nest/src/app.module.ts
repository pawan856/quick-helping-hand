import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorm.config';

import { AuthModule } from './auth/auth.module';
import { ClinicalModule } from './clinical/clinical.module';
import { SystemModule } from './system/system.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ThrottlerModule } from '@nestjs/throttler';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    ThrottlerModule.forRoot({
      limit: 20,
      ttl: 60,
    }),
    AuthModule,
    ClinicalModule,
    SystemModule,
    NotificationsModule,
  ],
})
export class AppModule {}
