import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from '@prisma/client';
import { PrismaService } from './../prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { Status } from './enum/status.enum';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async create(requestDTO: CreateRequestDto): Promise<Request> {
    const { userIdentity, requestTypeId } = requestDTO;
    if (await this.isExist(userIdentity, requestTypeId)) {
      throw new BadRequestException(
        'You already have an active request of this type.',
      );
    }
    if (!this.isValid(userIdentity)) {
      throw new BadRequestException('Invalid userIdentity.');
    }
    return this.insert(requestDTO);
  }

  private insert(requestDTO: CreateRequestDto): Promise<Request> {
    const { userIdentity, requestTypeId, requestDetails } = requestDTO;
    try {
      return this.prisma.request.create({
        data: {
          createdOn: new Date(),
          lastChangeStatus: new Date(),
          status: Status.ACTIVE,
          userIdentity: userIdentity,
          requestTypeId: requestTypeId,
          requestDetails: {
            create: this.convertJsonToRequestDeatils(requestDetails),
          },
        },
        include: {
          requestDetails: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private convertJsonToRequestDeatils(requestDetails: JSON) {
    return Object.keys(requestDetails).map((detail) => {
      return {
        fieldName: detail,
        fieldType: typeof requestDetails[detail],
        data: requestDetails[detail].toString(),
      };
    });
  }

  private async isExist(userIdentity: string, requestTypeId: number) {
    try {
      return this.prisma.request.findFirst({
        where: {
          userIdentity,
          requestTypeId,
          status: Status.ACTIVE,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private isValid(identity: string): boolean {
    if (identity.length > 9 || identity.length < 5) return false;
    identity = identity.length < 9 ? ('0000' + identity).slice(-9) : identity;
    return (
      Array.from(identity, Number).reduce((counter, digit, i) => {
        const step = digit * ((i % 2) + 1);
        return counter + (step > 9 ? step - 9 : step);
      }) %
        10 ===
      0
    );
  }
}
