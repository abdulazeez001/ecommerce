import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './orders.controller';
import { UsersService } from './orders.service';
import { CreateUserDto } from './dto/create-order.dto';

const payload: CreateUserDto = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@gmail.com',
  password: 'qwertyuiop',
};
const mockId = 'test_id';
const user = {
  id: mockId,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@gmail.com',
};

const mockUserService = {
  create: jest.fn().mockReturnValue(user),
  findAll: jest.fn().mockReturnValue({
    docs: [user],
    pagination: {
      count: 1,
      current_page: 1,
      next_page: null,
      out_of_range: false,
      prev_page: null,
      total_count: 1,
      total_pages: 1,
    },
  }),
  findOne: jest.fn().mockReturnValue(user),
  update: jest.fn().mockReturnValue(user),
  remove: jest.fn().mockReturnValue(1),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user data', async () => {
    const mockedResponse = {
      message: 'User created successfully!',
      response: user,
    };
    const expectedOutput = await controller.create(payload);
    expect(service.create).toHaveBeenCalledTimes(1);
    expect(service.create).toHaveBeenCalledWith(payload);
    expect(expectedOutput).toEqual(mockedResponse);
  });

  it('should retrieve all users', async () => {
    const mockedResponse = {
      message: 'Users retrieved successfully!',
      response: {
        docs: [user],
        pagination: {
          count: 1,
          current_page: 1,
          next_page: null,
          out_of_range: false,
          prev_page: null,
          total_count: 1,
          total_pages: 1,
        },
      },
    };
    const expectedOutput = await controller.findAll({});
    expect(service.findAll).toHaveBeenCalledTimes(1);
    expect(expectedOutput).toEqual(mockedResponse);
  });

  it('should find user data by id', async () => {
    const mockedResponse = {
      message: 'User retrieved successfully!',
      response: user,
    };
    const expectedOutput = await controller.findOne(mockId);
    expect(service.findOne).toHaveBeenCalledTimes(1);
    expect(service.findOne).toHaveBeenCalledWith(mockId);
    expect(expectedOutput).toEqual(mockedResponse);
  });

  it('should update user data by id and payload', async () => {
    const mockedResponse = {
      message: 'User updated successfully!',
      response: user,
    };
    const expectedOutput = await controller.update(mockId, payload);
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(service.update).toHaveBeenCalledWith(mockId, payload);
    expect(expectedOutput).toEqual(mockedResponse);
  });

  it('should delete user data by id', async () => {
    const mockedResponse = {
      message: 'User removed successfully!',
      response: 1,
    };
    const expectedOutput = await controller.remove(mockId);
    expect(service.remove).toHaveBeenCalledTimes(1);
    expect(service.remove).toHaveBeenCalledWith(mockId);
    expect(expectedOutput).toEqual(mockedResponse);
  });
});
