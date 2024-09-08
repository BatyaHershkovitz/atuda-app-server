import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

describe('RequestsController', () => {
  let controller: RequestsController;
  let service: RequestsService;

  const mockRequestsService = {
    create: jest.fn().mockResolvedValue(undefined),
  };

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestsController],
      providers: [
        {
          provide: RequestsService,
          useValue: mockRequestsService,
        },
      ],
    }).compile();

    controller = module.get<RequestsController>(RequestsController);
    service = module.get<RequestsService>(RequestsService);
  });

  describe('create', () => {
    it('should return 201 CREATED', async () => {
      const createRequestDto: CreateRequestDto = {
        userIdentity: '233080019',
        requestTypeId: 1,
        requestDetails: Object.assign({
          name: 'Bob',
          age: 15,
        }),
      };

      const res = mockResponse();

      await controller.create(createRequestDto, res);

      expect(service.create).toHaveBeenCalledWith(createRequestDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
