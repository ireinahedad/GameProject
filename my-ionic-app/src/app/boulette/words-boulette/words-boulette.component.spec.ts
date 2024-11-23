import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WordsBouletteComponent } from './words-boulette.component';
import { PlayerService } from './../../services/player.service';
import { WordsService } from './../../services/words.service';
import { of } from 'rxjs';

describe('WordsBouletteComponent', () => {
  let component: WordsBouletteComponent;
  let fixture: ComponentFixture<WordsBouletteComponent>;
  let mockPlayerService: jasmine.SpyObj<PlayerService>;
  let mockWordsService: jasmine.SpyObj<WordsService>;

  beforeEach(async () => {
    mockPlayerService = jasmine.createSpyObj('PlayerService', ['init', 'getPlayers']);
    mockWordsService = jasmine.createSpyObj('WordsService', [
      'get',
      'addWord',
      'removeWord',
      'removeAllWords',
      'setReady'
    ]);

    await TestBed.configureTestingModule({
      declarations: [WordsBouletteComponent],
      providers: [
        { provide: PlayerService, useValue: mockPlayerService },
        { provide: WordsService, useValue: mockWordsService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordsBouletteComponent);
    component = fixture.componentInstance;

    // Mock initial state
    mockPlayerService.getPlayers.and.returnValue([
      { name: 'Player 1', points: 100, team: 1, id: 0 },
      { name: 'Player 2', points: 150, team: 2, id: 1 }
    ]);

    mockWordsService.get.and.returnValue([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
  it('should initialize players on ngOnInit', async () => {
    await component.ngOnInit();
    expect(mockPlayerService.init).toHaveBeenCalled();
    expect(component.players.length).toBe(2);
    expect(component.currentPlayer).toEqual({ name: 'Player 1', points: 100, team: 1, id: 0 });
  });
  /*
  it('should add a word and update current player', async () => {
  mockWordsService.addWord.and.callFake(async (word: string) => {
    mockWordsService.get.and.returnValue([word]);
  });

  component.newWord = 'TestWord';
  await component.addWord(); // Ensure to await since `addWord` is async

  expect(mockWordsService.addWord).toHaveBeenCalledWith('TestWord');
  expect(component.words).toContain('TestWord');
  expect(component.currentPlayer.name).toBe('Player 2'); // Next player in the list
});

  
  it('should remove a word', () => {
    mockWordsService.get.and.returnValue(['TestWord']);
    component.words = ['TestWord'];

    component.removeWord('TestWord');

    expect(mockWordsService.removeWord).toHaveBeenCalledWith('TestWord');
    expect(component.words).not.toContain('TestWord');
  });

  it('should correctly get the player class based on ID', () => {
    const playerClass = component.getPlayerClass(1);
    expect(playerClass).toBe('Player 2');
  });

  it('should set ready when all words are added', () => {
    component.players = [
      { name: 'Player 1', points: 100, team: 1, id: 0 },
      { name: 'Player 2', points: 150, team: 2, id: 1 }
    ];
    mockWordsService.numberOfWordsPerPerson = 2;

    mockWordsService.get.and.returnValue(['Word1', 'Word2', 'Word3', 'Word4']);
    component.words = mockWordsService.get();

    component.addWord();

    expect(mockWordsService.setReady).toHaveBeenCalled();
  });
  */
});
