import { Module } from '@nestjs/common';
import { SalaryThingController } from './salary-thing.controller';
import { SalaryThingService } from './salary-thing.service';
import { User, UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SalaryNotification, SalaryNotificationSchema } from './salary.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  MongooseModule.forFeature([{ name: SalaryNotification.name, schema: SalaryNotificationSchema }])],
  controllers: [SalaryThingController],
  providers: [SalaryThingService]
})
export class SalaryThingModule {}
