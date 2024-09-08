import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './../prisma.service';
import { RequestsService } from './requests.service';

const request = {
  id: 18,
  requestTypeId: 1,
  userIdentity: '233080019',
  createdOn: new Date(),
  status: 'ACTIVE',
  lastChangeStatus: new Date(),
  requestDetails: [
    {
      id: 35,
      requestId: 18,
      fieldName: 'name',
      fieldType: 'string',
      data: 'Bob',
    },
    {
      id: 36,
      requestId: 18,
      fieldName: 'age',
      fieldType: 'number',
      data: '15',
    },
  ],
};

const db = {
  request: {
    findFirst: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockReturnValue(request),
  },
};

describe('RequestsService', () => {
  let service: RequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully insert a request', () => {
    expect(
      service.create({
        userIdentity: '233080019',
        requestTypeId: 1,
        requestDetails: Object.assign({
          name: 'Bob',
          age: 15,
        }),
      }),
    ).resolves.toEqual(request);
  });

  it('should failed on insert a request with invalid identity', () => {
    const request2 = request;
    request2.userIdentity = '123456789';
    expect(
      service.create({
        userIdentity: '123456789',
        requestTypeId: 1,
        requestDetails: Object.assign({
          name: 'Bob',
          age: 15,
        }),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should failed on insert an exists request', () => {
    const db2 = db;
    db2.request.findFirst = jest.fn().mockResolvedValue(request);
    expect(
      service.create({
        userIdentity: '233080019',
        requestTypeId: 1,
        requestDetails: Object.assign({
          name: 'Bob',
          age: 15,
        }),
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
