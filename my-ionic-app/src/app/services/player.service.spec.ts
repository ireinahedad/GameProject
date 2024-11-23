import { TestBed } from '@angular/core/testing';
import { PlayerService } from './player.service';
import { Player } from './../interfaces/player-interface';
import { Storage } from '@ionic/storage-angular';
import { of } from 'rxjs';

describe('PlayerService', () => {
  let service: PlayerService;
  let storageSpy: jasmine.SpyObj<Storage>;

  const mockPlayers: Player[] = [
    { id: 1, name: 'Player 1', points: 100, team: 1 },
    { id: 2, name: 'Player 2', points: 150, team: 2 },
    { id: 3, name: 'Player 3', points: 200, team: 1 },
    { id: 4, name: 'Player 4', points: 250, team: 2 },
  ];

  beforeEach(async () => {
    // Mock the Storage service
    const storageMock = jasmine.createSpyObj('Storage', ['create', 'get', 'set']);

    await TestBed.configureTestingModule({
      providers: [
        PlayerService,
        { provide: Storage, useValue: storageMock },
      ],
    }).compileComponents();

    service = TestBed.inject(PlayerService);
    storageSpy = TestBed.inject(Storage) as jasmine.SpyObj<Storage>;
    await service.init(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  describe('init', () => {
    it('should load players from storage if available', async () => {
      storageSpy.get.and.returnValue(Promise.resolve(mockPlayers));
      await service.init();
      expect(storageSpy.get).toHaveBeenCalledWith('players');
      expect(service.getPlayers()).toEqual(mockPlayers);
    });

    it('should set default players if no players are in storage', async () => {
      storageSpy.get.and.returnValue(Promise.resolve(null));
      storageSpy.set.and.returnValue(Promise.resolve());
      await service.init();
      expect(service.getPlayers().length).toBeGreaterThan(0);
      expect(storageSpy.set).toHaveBeenCalledWith('players', jasmine.any(Array));
    });
  });
  

 it('should add a player and save to storage', async () => {
  const newPlayer: Player = { id: 5, name: 'Player 5', points: 50, team: 1 };

  storageSpy.get.and.returnValue(Promise.resolve([]));
 
  await service.addPlayer(newPlayer);
  expect(service.getPlayers()).toContain(newPlayer);
  expect(storageSpy.set).toHaveBeenCalledWith('players', jasmine.any(Array));
});

  
  describe('removePlayer', () => {
    it('should remove a player by id and save to storage', async () => {
      storageSpy.set.and.returnValue(Promise.resolve());

      await service.removePlayer(1); // Remove Player with id 1
      expect(await service.getPlayers().find(player => player.id === 1)).toBeUndefined();
      expect(storageSpy.set).toHaveBeenCalledWith('players', jasmine.any(Array));
    });
  });
  

  describe('updatePoints', () => {
    it('should update points for the specified player and save to storage', async () => {
      storageSpy.set.and.returnValue(Promise.resolve());
      await service.updatePoints(service['players'][0], 300);
      const updatedPlayer = service.getPlayers().find(player => player === service['players'][0]);
      expect(updatedPlayer?.points).toBe(300);
      expect(storageSpy.set).toHaveBeenCalledWith('players', jasmine.any(Array));
    });
  });
  
  describe('assignTeam', () => {
    it('should assign a team to the specified player and save to storage', async () => {
      storageSpy.set.and.returnValue(Promise.resolve());
      await service.assignTeam( service['players'][0], 3);
      const updatedPlayer = service.getPlayers().find(player => player === service['players'][0]);
      expect(updatedPlayer?.team).toBe(3);
      expect(storageSpy.set).toHaveBeenCalledWith('players', jasmine.any(Array));
    });
  });

  describe('resetPoints', () => {
    it('should reset points for all players and save to storage', async () => {
      storageSpy.set.and.returnValue(Promise.resolve());
 
      await service.resetPoints();
      const players = await service.getPlayers();
      players.forEach(player => {
        expect(player.points).toBe(0);
      });
      expect(storageSpy.set).toHaveBeenCalledWith('players', jasmine.any(Array));
    });
  });

  describe('calculateTeamScores', () => {
    it('should calculate team scores correctly', () => {
      service['players'] = [...mockPlayers];

      const scores = service.calculateTeamScores(2);
      expect(scores).toEqual([
        { teamNumber: 1, totalPoints: 300 }, // Player 1 + Player 3
        { teamNumber: 2, totalPoints: 400 }, // Player 2 + Player 4
      ]);
    });
  });
  
});

