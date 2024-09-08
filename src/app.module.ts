import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestsStagesController } from './requests-stages/requests-stages.controller';
import { RequestsStagesService } from './requests-stages/requests-stages.service';
import { RequestsController } from './requests/requests.controller';
import { RequestsService } from './requests/requests.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [AppController, RequestsStagesController, RequestsController],
  providers: [
    AppService,
    RequestsStagesService,
    RequestsService,
    PrismaService,
  ],
})
export class AppModule {}
