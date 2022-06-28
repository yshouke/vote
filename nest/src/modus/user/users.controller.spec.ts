import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './services/Users.service';

describe('UsersController', () => {
    let usersController: UsersController;
    // let usersService: UsersService;
    // const resultOk = {
    //     "statusCode": "200",
    //     "message": "成功"
    // }
    const mockService = <UsersService>Object.getOwnPropertyNames(UsersService.prototype).filter(name => name !== 'constructor').reduce((obj, func) => {
        obj[func] = () => 'ok';
        return obj
    }, {});
    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockService
                },
            ],
        }).compile();

        // usersService = moduleRef.get<UsersService>(UsersService);
        usersController = moduleRef.get<UsersController>(UsersController);

    });

    describe('userController', () => {
        it('should return an info of Users', async () => {
            const result = ['test'];

            expect(await usersController.userLogin({
                "username": "admin",
                "password": "666666"
            }, {user:{}})).toEqual({});
        });

        it('Edit (delete) user table information based on ID', async () => {
            jest.spyOn(mockService, 'updateUserById').mockImplementation(() => Promise.resolve({raw:{},generatedMaps:[]}));
            expect(await usersController.updateUsers({
                "id": 444,
                "idCard": "444",
                "email": "4545@qq.com"
            })).toEqual({"generatedMaps": [], "raw": {}});
        });

        it('Add an admin user', async () => {
            // let result:Promise<any>;
            // jest.spyOn(mockService, 'insertUsers').mockImplementation(() => 4);
            expect(await usersController.addAdminUser({
                "username": "jest1",
                "password": "123456",
                "idCard": "444",
                "email": "4545@qq.com"
            })).toBe('ok');
        });

        it('Add regular user voting', async () => {
            // let result:Promise<any>;
            jest.spyOn(mockService, 'insertNormalUsers').mockImplementation(() => Promise.resolve('ok'));
            expect(await usersController.addNormalUser({
                "idCard": "444",
                "email": "4545@qq.com"
            })).toBe('ok');
        });

        it('Find all users', async () => {
            jest.spyOn(mockService, 'updateUserById').mockImplementation(() => Promise.resolve({raw:{},generatedMaps:[]}));
            expect(await usersController.findUsers({
                "id": 444,
                "idCard": "444",
                "pageNum": 1,
                "pageSize": 1
            })).toBe('ok');
        });
    });
});
