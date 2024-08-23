import { Module } from '@nestjs/common';
import { UserThingsController } from './user-things.controller';
import { UserThingsService } from './user-things.service';
import {User, UserSchema} from './user.schema'
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserThingsController],
  providers: [UserThingsService]
})
export class UserThingsModule {}
