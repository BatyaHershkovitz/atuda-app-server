import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from './../prisma.service';

@Injectable()
export class RequestsStagesService {
  constructor(private prisma: PrismaService) {}

  async getRequestType(id: string) {
    const data = await this.getRequestTypeById(id);
    if (!data) {
      throw new BadRequestException('RequestType ID not found');
    }
    data.stagesFlow['options'] = data.stagesFlow['options'].map(
      (option: any) => ({
        name: option.name,
        displayName: option.displayName,
      }),
    );
    return data;
  }

  async getStages(id: string, stage: string) {
    const data = await this.getRequestTypeById(id);
    if (!data) {
      throw new BadRequestException('RequestType ID not found');
    }
    const stages = data.stagesFlow['options'].filter(
      (option) => option.name === stage,
    );
    if (!stages) {
      throw new BadRequestException('Stage name not found');
    }
    const stagesFlow = stages[0].stages.map((stage: string) =>
      this.getStageFlowByName(stage),
    );
    return await Promise.all(stagesFlow);
  }

  async getRequestTypeById(id: string) {
    try {
      return await this.prisma.requestType.findUnique({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getStageFlowByName(name: string) {
    try {
      return await this.prisma.stage.findUnique({
        where: { key: name },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
