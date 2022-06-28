import { Test, TestingModule } from '@nestjs/testing';
import { ElectionService } from './services/Election.service';
import { ElectionController } from './election.controller';

describe('ElectionController', () => {
    let electionController: ElectionController;

    const mockService = <ElectionService>Object.getOwnPropertyNames(ElectionService.prototype).filter(name => name !== 'constructor').reduce((obj, func) => {
        obj[func] = () => 'ok';
        return obj
    }, {});
    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [ElectionController],
            providers: [
                {
                    provide: ElectionService,
                    useValue: mockService
                },
            ],
        }).compile();

        // electionService = moduleRef.get<ElectionService>(ElectionService);
        electionController = moduleRef.get<ElectionController>(ElectionController);

    });

    describe('ElectionController', () => {

        it('Add an election record', async () => {
            jest.spyOn(mockService, 'insertItem').mockImplementation(() => Promise.resolve([]));
            expect(await electionController.addElection({
                "name": "1111t8t3",
                "candidateIds": [1,2]
            })).toEqual([]);
        });

        it('Delete the election record', async () => {
            jest.spyOn(mockService, 'deleteVoting').mockImplementation(() => Promise.resolve({"generatedMaps": [], "raw": {}}));
            expect(await electionController.deleteVoting({
                "id":0
            })).toEqual({"generatedMaps": [], "raw": {}});
        });

        it('Modify the status of an election record', async () => {
            jest.spyOn(mockService, 'changeVotingStatus').mockImplementation(() => Promise.resolve());
            expect(await electionController.changeVotingStatus({
                "id":"0",
                "status":0
            })).toBe(undefined);
        });

        it('Find election list information by pagination based on criteria', async () => {
            jest.spyOn(mockService, 'findElection').mockImplementation(() => Promise.resolve({ list: [], count: 0, pageSize: 0, pageNum: 0, }));
            expect(await electionController.findElection({
                "pageSize":0,
                "pageNum": 1,
                "status":0
            })).toEqual({ list: [], count: 0, pageSize: 0, pageNum: 0, });
        });

        it('Query all candidates and the corresponding total number of votes', async () => {
            jest.spyOn(mockService, 'queryCandidateNumByElectionId').mockImplementation(() => Promise.resolve([]));
            expect(await electionController.queryCandidateAndNumber({
                "id":0,
            })).toEqual([]);
        });

        it('Ordinary user voting', async () => {
            jest.spyOn(mockService, 'userVoting').mockImplementation(() => Promise.resolve({isVoted: true, msg:'', userId:'1'}));
            expect(await electionController.userVoting({
                "id":0,
                "electionId": 0,
                token: ''
            })).toEqual({isVoted: true, msg:'', userId:'1'});
        });

    });
});
