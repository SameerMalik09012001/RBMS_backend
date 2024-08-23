import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './auth/user.module';
import { UserThingsModule } from './user-things/user-things.module';
import { SalaryThingModule } from './salary-thing/salary-thing.module';
import { Middleware } from './Middlewares/middleware';
import { ConfigModule } from '@nestjs/config';


// Importing the Module allows us to use the Controller and Service in our AppModule.
@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI,
      {
        dbName: process.env.DB_NAME,
        onConnectionCreate: () => {
          console.log('MongoDB is connected successfully!!');
        }
      }
    ),
    UserThingsModule,
    SalaryThingModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Middleware)
      .forRoutes(
        {
          path: 'user-things/getAllUser/:page/:limit',
          method: RequestMethod.GET
        },
        {
          path: 'salary-things/getAllUser/:page/:limit',
          method: RequestMethod.GET
        },
        {
          path: 'salary-things/updateSalary',
          method: RequestMethod.POST
        },
        {
          path: 'salary-things/approveSalary',
          method: RequestMethod.POST
        },
        {
          path: 'salary-things/getSalaryNotification',
          method: RequestMethod.GET
        },
        {
          path: 'salary-things/rejectSalary',
          method: RequestMethod.DELETE
        },
        {
          path: 'user/cookiecheck',
          method: RequestMethod.GET
        },
        {
          path: 'user-things/getAllUser/:page/:limit',
          method: RequestMethod.GET
        },
        {
          path: 'user-things/getAllUserBySearch/:keyword/:page/:limit',
          method: RequestMethod.GET
        },
        {
          path: 'salary-things/getAllUserSalaryByRole/:page/:limit',
          method: RequestMethod.GET
        },
        {
          path: 'user/logout',
          method: RequestMethod.GET
        },
        {
          path: 'user/:email',
          method: RequestMethod.GET
        },
        {
          path: 'user-things/getbyrole/:role/:keyword/:page/:limit',
          method: RequestMethod.GET
        },
        {
          path: 'user-things/getByColumnFilter/:keyword/:page/:limit',
          method: RequestMethod.POST
        },
        {
          path: 'user-things/addUser',
          method: RequestMethod.POST
        },
        {
          path: 'user-things/getbyroleAddUser/:role',
          method: RequestMethod.GET
        },
        {
          path: 'salary-things/getUserSalaryByRoleSearchDefault/:role/:search/:page/:limit',
          method: RequestMethod.GET
        }
      )
  }
}
