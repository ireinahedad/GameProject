import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerComponent } from './player.component';
import { PlayerService } from '../services/player.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Player } from '../interfaces/player-interface';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  let mockPlayerService: jasmine.SpyObj<PlayerService>;

  beforeEach(async () => {
    mockPlayerService = jasmine.createSpyObj('PlayerService', [
      'init',
      'getPlayers',
      'addPlayer',
      'removePlayer',
    ]);

    await TestBed.configureTestingModule({
      declarations: [PlayerComponent],
      imports: [FormsModule], 
      providers: [{ provide: PlayerService, useValue: mockPlayerService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize players on load', async () => {
      const mockPlayers: Player[] = [
        { id: 1, name: 'Alice', points: 0, team: 1 },
        { id: 2, name: 'Bob', points: 0, team: 2 },
      ];
      mockPlayerService.getPlayers.and.returnValue(mockPlayers);
      mockPlayerService.init.and.returnValue(Promise.resolve());

      await component.ngOnInit();

      expect(mockPlayerService.init).toHaveBeenCalled();
      expect(component.players).toEqual(mockPlayers);
    });
  });

  describe('validateName', () => {
    it('should return false if name is less than 3 characters', () => {
      const result = component.validateName('Jo');
      expect(result).toBeFalse();
      expect(component.errorMessage).toBe('Player name must be at least 3 characters long.');
    });

    it('should return true for valid name', () => {
      const result = component.validateName('John');
      expect(result).toBeTrue();
      expect(component.errorMessage).toBe('');
    });
  });

  describe('validateTeam', () => {
    it('should return false if team is out of range', () => {
      const result = component.validateTeam(0);
      expect(result).toBeFalse();
      expect(component.errorMessage).toBe('Team number must be between 1 and 4.');
    });

    it('should return true if team is valid', () => {
      const result = component.validateTeam(2);
      expect(result).toBeTrue();
      expect(component.errorMessage).toBe('');
    });
  });

  describe('addPlayer', () => {
    it('should add a valid player and reset newPlayer', async () => {
      const mockPlayer: Player = { id: 0, name: 'Alice', points: 0, team: 1 };
      component.newPlayer = mockPlayer;

      mockPlayerService.addPlayer.and.returnValue(Promise.resolve());
      mockPlayerService.getPlayers.and.returnValue([]);

      await component.addPlayer();

      expect(mockPlayerService.addPlayer).toHaveBeenCalledWith(mockPlayer);
      expect(component.newPlayer).toEqual({ id: 0, name: '', points: 0, team: 1 });
      expect(component.players).toEqual([]);
    });

    it('should not add a player if validation fails', async () => {
      component.newPlayer = { id: 0, name: 'A', points: 0, team: 1 };

      await component.addPlayer();

      expect(mockPlayerService.addPlayer).not.toHaveBeenCalled();
      expect(component.errorMessage).toBe('Player name must be at least 3 characters long.');
    });
  });

  describe('removePlayer', () => {
    it('should remove a player', async () => {
      const mockPlayer: Player = { id: 1, name: 'Alice', points: 0, team: 1 };

      mockPlayerService.removePlayer.and.returnValue(Promise.resolve());
      mockPlayerService.getPlayers.and.returnValue([]);

      await component.removePlayer(mockPlayer);

      expect(mockPlayerService.removePlayer).toHaveBeenCalledWith(mockPlayer.id);
      expect(component.players).toEqual([]);
    });
  });
});
