import { Test, TestingModule } from '@nestjs/testing';
import { CandidateEntity } from 'src/entities/candidate.entity';
import { BaseService } from '../common/db/mysql/base.service';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './services/Candidate.service';

describe('CandidateController', () => {
    let candidateController: CandidateController;
    let candidateService: CandidateService;
    // const resultOk = {
    //     "statusCode": "200",
    //     "message": "成功"
    // }
    const base = <BaseService<CandidateEntity>>Object.getOwnPropertyNames(BaseService.prototype).filter(name => name !== 'constructor').reduce((obj, func) => {
        obj[func] = () => 'ok';
        return obj
    }, {});
    const mockService = <CandidateService>Object.getOwnPropertyNames(CandidateService.prototype).filter(name => name !== 'constructor').reduce((obj, func) => {
        obj[func] = () => 'ok';
        return obj
    }, base);
    // mockService.i
    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [CandidateController],
            providers: [
                {
                    provide: CandidateService,
                    useValue: mockService
                },
            ],
        }).compile();

        // candidateService = moduleRef.get<CandidateService>(CandidateService);
        candidateController = moduleRef.get<CandidateController>(CandidateController);

    });
    describe('userController', () => {
        it('Add candidates', async () => {
            jest.spyOn(mockService, 'insert').mockImplementation(() => Promise.resolve([]));
            expect(await candidateController.addCandidate({
                "username": "admin",
            })).toEqual(undefined);
        });

        it('Delete a candidate', async () => {
            jest.spyOn(mockService, 'update').mockImplementation(() => Promise.resolve({raw:{},generatedMaps:[]}));
            expect(await candidateController.delCandidateById({
                "id": 4,
            })).toEqual(undefined);
        });

        it('Find all candidates', async () => {
            jest.spyOn(mockService, 'findMany').mockImplementation(() => Promise.resolve([]));
            expect(await candidateController.findCandidate({
                username: 4,
            })).toEqual([]);
        });
    })
});
