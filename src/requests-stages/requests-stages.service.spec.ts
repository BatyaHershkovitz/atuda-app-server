import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './../prisma.service';
import { RequestsStagesService } from './requests-stages.service';

describe('RequestsStagesService', () => {
  let service: RequestsStagesService;

  const flow = {
    id: 1,
    name: 'name',
    description: 'description',
    duration: '1',
    stagesFlow: {
      layout: 'squares',
      options: [
        {
          name: 'academic',
          stages: ['stage1'],
          displayName: 'אקדמית',
        },
      ],
      menuTitle: 'סיבת הבקשה',
    },
    declarationText: 'declarationText',
  };

  const stagesFlow = [
    {
      key: 'stage1',
      header: 'header',
      title: 'title',
      description: 'description',
      schema: {
        type: 'object',
        required: ['component'],
        properties: {
          component: {
            type: 'string',
            title: 'title',
            layout: {
              props: {
                data: ['1', '2'],
              },
              slots: {
                component: 'comp',
              },
            },
          },
        },
      },
      options: null,
    },
  ];

  const db = {
    requestType: {
      findUnique: jest
        .fn()
        .mockImplementation(({ where: { id } }) =>
          id === flow.id ? flow : null,
        ),
    },
    stage: {
      findUnique: jest
        .fn()
        .mockImplementation(({ where: { key } }) =>
          key === stagesFlow[0].key ? stagesFlow : null,
        ),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsStagesService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<RequestsStagesService>(RequestsStagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get stages by id and stage name', () => {
    it('should return stages flow based on ID and stage name', async () => {
      const result = await service.getStages('1', 'academic');
      expect(result[0]).toEqual(stagesFlow);
    });

    it('should throw BadRequestException if Id not found', async () => {
      await expect(service.getStages('2', 'academic')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if an error occurs with stage not found', async () => {
      await expect(service.getStages('2', 'medically')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('get requestType by id', () => {
    it('should successfully get requestType by id', async () => {
      const result = await service.getRequestType('1');
      expect(result).toEqual(flow);
    });

    it('should throw BadRequestException if an error occurs', async () => {
      await expect(service.getRequestType('2')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
