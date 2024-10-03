// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from './orders.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { User } from './entities/order.entity';
// import { Repository, DataSource, DeleteResult } from 'typeorm';
// import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
// import { CreateUserDto } from './dto/create-order.dto';
// import { UpdateUserDto } from './dto/update-order.dto';
// import { ConflictException, NotFoundException } from '@nestjs/common';

// const payload: CreateUserDto = {
//   first_name: 'John',
//   last_name: 'Doe',
//   email: 'john@gmail.com',
//   password: 'qwertyuiop',
// };
// const mockId = 'test_id';

// const user: User = { id: mockId, ...payload };

// export const EXCLUDE_FIELDS = '-_id -__v';

// const mockRabbitmqService = {
//   connect: jest.fn(),
//   sendMessage: jest.fn(),
//   publishMessage: jest.fn(),
//   // Add other methods you use in UsersService
// };
// const mockDataSource = {
//   manager: {
//     transaction: jest.fn(),
//   },
//   transaction: jest.fn(),
//   findOneBy: jest.fn(),
//   // Add other DataSource methods you need
// };
// describe('UsersService', () => {
//   let service: UsersService;
//   let repository: Repository<User>;
//   let dataSource: DataSource;
//   let rabbitmqService: RabbitmqService;
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         {
//           provide: getRepositoryToken(User),
//           useValue: {
//             findOne: jest.fn(),
//             save: jest.fn(),
//             findAndCount: jest.fn(),
//             findOneBy: jest.fn(),
//             create: jest.fn(),
//             delete: jest.fn(),
//             // Add other methods you need to mock
//           },
//         },
//         {
//           provide: RabbitmqService,
//           useValue: mockRabbitmqService,
//         },
//         {
//           provide: DataSource,
//           useValue: mockDataSource,
//         },
//       ],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//     dataSource = module.get<DataSource>(DataSource);
//     rabbitmqService = module.get<RabbitmqService>(RabbitmqService);
//     repository = module.get<Repository<User>>(getRepositoryToken(User));
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   it('should create a user successfully', async () => {
//     const saveMock = jest.fn().mockResolvedValue(user);
//     const transactionMock = jest.fn().mockImplementation(async (callback) => {
//       return callback({ save: saveMock });
//     });
//     jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
//     jest.spyOn(repository, 'create').mockReturnValue(user);
//     jest.spyOn(dataSource, 'transaction').mockImplementation(transactionMock);
//     jest.spyOn(rabbitmqService, 'publishMessage').mockResolvedValue({});

//     const result = await service.create(payload);

//     expect(repository.findOneBy).toHaveBeenCalledWith({ email: payload.email });
//     expect(repository.create).toHaveBeenCalledWith(payload);
//     expect(saveMock).toHaveBeenCalledWith(user);
//     expect(rabbitmqService.publishMessage).toHaveBeenCalledWith([
//       {
//         worker: 'auth',
//         message: {
//           action: 'verify',
//           type: 'kyc_info',
//           data: {
//             ...user,
//           },
//         },
//       },
//     ]);
//     expect(result).toEqual(user);
//   });

//   it('should throw a conflict exception if user already exists during create user operation', async () => {
//     const saveMock = jest.fn().mockResolvedValue(user);
//     const transactionMock = jest.fn().mockImplementation(async (callback) => {
//       return callback({ save: saveMock });
//     });
//     jest.spyOn(dataSource, 'transaction').mockImplementation(transactionMock);
//     jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

//     await expect(service.create(payload)).rejects.toThrow(ConflictException);

//     expect(repository.findOneBy).toHaveBeenCalledWith({ email: payload.email });
//     expect(saveMock).not.toHaveBeenCalled();
//     expect(rabbitmqService.publishMessage).not.toHaveBeenCalled();
//   });

//   it('should update a user by id with payload', async () => {
//     const payload: UpdateUserDto = {
//       first_name: 'John',
//       last_name: 'Doe',
//     };
//     const saveMock = jest.fn().mockResolvedValue(user);
//     const transactionMock = jest.fn().mockImplementation(async (callback) => {
//       return callback({ save: saveMock });
//     });
//     jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);
//     jest.spyOn(dataSource, 'transaction').mockImplementation(transactionMock);
//     const result = await service.update(mockId, payload);
//     expect(repository.findOneBy).toHaveBeenCalledWith({ id: mockId });
//     expect(saveMock).toHaveBeenCalledWith(user);
//     expect(result).toEqual(user);
//   });

//   it("should throw a not found exception if user with the ID doesn't exist during update user operation", async () => {
//     const saveMock = jest.fn().mockResolvedValue(user);
//     const transactionMock = jest.fn().mockImplementation(async (callback) => {
//       return callback({ save: saveMock });
//     });
//     jest.spyOn(dataSource, 'transaction').mockImplementation(transactionMock);
//     jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

//     await expect(service.update(mockId, payload)).rejects.toThrow(
//       NotFoundException,
//     );
//     expect(repository.findOneBy).toHaveBeenCalledWith({ id: mockId });
//     expect(saveMock).not.toHaveBeenCalled();
//   });

//   it('should get all users', async () => {
//     const response = {
//       docs: [
//         {
//           email: 'john@gmail.com',
//           first_name: 'John',
//           id: 'test_id',
//           last_name: 'Doe',
//           password: 'qwertyuiop',
//         },
//       ],
//       pagination: {
//         count: 1,
//         current_page: 1,
//         next_page: null,
//         out_of_range: false,
//         prev_page: null,
//         total_count: 1,
//         total_pages: 1,
//       },
//     };
//     jest.spyOn(repository, 'findAndCount').mockResolvedValue([[user], 1]);
//     const result = await service.findAll({});
//     expect(repository.findAndCount).toHaveBeenCalledWith({ skip: 0, take: 20 });
//     expect(result).toEqual(response);
//   });

//   it('should get a user by id', async () => {
//     jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);
//     const result = await service.findOne(mockId);
//     expect(repository.findOneBy).toHaveBeenCalledWith({ id: mockId });
//     expect(result).toEqual(user);
//   });

//   it("should throw a not found exception if user with the ID doesn't exist during get user operation", async () => {
//     jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
//     await expect(service.findOne(mockId)).rejects.toThrow(NotFoundException);
//     expect(repository.findOneBy).toHaveBeenCalledWith({ id: mockId });
//   });

//   it('should remove a user by id', async () => {
//     const response: DeleteResult = {
//       affected: 1,
//       raw: '',
//     };
//     jest.spyOn(repository, 'delete').mockResolvedValue(response);
//     const result = await service.remove(mockId);
//     expect(repository.delete).toHaveBeenCalledWith(mockId);
//     expect(result).toEqual(response.affected);
//   });

//   it("should throw a not found exception if user with the ID doesn't exist during remove user operation", async () => {
//     const response: DeleteResult = {
//       affected: 0,
//       raw: '',
//     };
//     jest.spyOn(repository, 'delete').mockResolvedValue(response);
//     await expect(service.remove(mockId)).rejects.toThrow(NotFoundException);
//     expect(repository.delete).toHaveBeenCalledWith(mockId);
//   });
// });
