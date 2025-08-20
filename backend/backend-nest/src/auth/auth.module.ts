
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGateway } from './auth.gateway';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGateway],
  exports: [AuthService],
})
export class AuthModule {}
