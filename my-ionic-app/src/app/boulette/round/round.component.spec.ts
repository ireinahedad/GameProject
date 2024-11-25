import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoundComponent } from './round.component';
import { WordsService } from './../../services/words.service';
import { PlayerService } from './../../services/player.service';
import { Player } from './../../interfaces/player-interface';
import { of, Subject } from 'rxjs';

describe('RoundComponent', () => {
  let component: RoundComponent;
  let fixture: ComponentFixture<RoundComponent>;
  let wordsServiceSpy: jasmine.SpyObj<WordsService>;
  let playerServiceSpy: jasmine.SpyObj<PlayerService>;

  const mockPlayers: Player[]=[
      { name: 'Player 1', points: 100, team: 1, id: 1 },
      { name: 'Player 2', points: 150, team: 2, id: 2 }
    ];

  beforeEach(async () => {
    const wordsServiceMock = jasmine.createSpyObj('WordsService', [
      'get',
      'setCurrentRound',
      'NumberOfWordsPerPerson',
      'numberOfTeams',
    ]);
    const playerServiceMock = jasmine.createSpyObj('PlayerService', [
      'getPlayers',
      'updatePoints',
    ]);

    await TestBed.configureTestingModule({
      declarations: [RoundComponent],
      providers: [
        { provide: WordsService, useValue: wordsServiceMock },
        { provide: PlayerService, useValue: playerServiceMock },
      ],
    }).compileComponents();

    wordsServiceSpy = TestBed.inject(WordsService) as jasmine.SpyObj<WordsService>;
    playerServiceSpy = TestBed.inject(PlayerService) as jasmine.SpyObj<PlayerService>;

    // Mock return values
    wordsServiceSpy.get.and.returnValue(['word1', 'word2', 'word3', 'word4']);
    wordsServiceSpy.numberOfWordsPerPerson = 3;
    wordsServiceSpy.numberOfTeams = 2;
    playerServiceSpy.getPlayers.and.returnValue(mockPlayers);

    fixture = TestBed.createComponent(RoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  
  it('should initialize words and start the round on ngOnInit', () => {
    component.ngOnInit();
    expect(wordsServiceSpy.get).toHaveBeenCalled();
    expect(component.words.length).toBeGreaterThan(0);
    expect(component.timeLeft).toBe(45); //  NumberOfWordsPerPerson * 15
  });
  
  it('should decrement the timer and end the round when time runs out', () => {
  spyOn(component, 'endRound'); // Spy on endRound
  jasmine.clock().install(); 
  component.startTimer();
  component.timeLeft = 1; // Simulate 1 second left
  // Install fake clock

  jasmine.clock().tick(1000); // Advance clock by 1 second
  expect(component.timeLeft).toBe(0);
  expect(component.endRound).toHaveBeenCalled(); // Verify endRound was called

  jasmine.clock().uninstall(); // Uninstall fake clock
});

  
  it('should load the next word and track used words correctly', () => {
    component.usedWords = new Set();;
    component.loadNextWord();
    expect(component.currentWord).toBeTruthy();
    expect(component.usedWords.size).toBe(1);

    component.loadNextWord();
    expect(component.usedWords.size).toBe(2);
  });
  
  it('should mark the round as ended when all words are used', () => {
    component.usedWords = new Set([0, 1, 2, 3]); // Simulate all words being used
    component.loadNextWord();
    expect(component.currentWord).toBe('All words used this round');
  });
  

  it('should add points to the current team when a word is guessed', async () => {
    spyOn(component, 'addPointsToTeam').and.callThrough();
    await component.gotWord();
    expect(component.guessedWords.length).toBe(1);
    expect(component.addPointsToTeam).toHaveBeenCalled();
  });
  
  it('should switch teams correctly', () => {
    component.currentTeam = 1;
    component.switchTeam();
    expect(component.currentTeam).toBe(2);

    component.switchTeam();
    expect(component.currentTeam).toBe(1); // Wrap around
  });
  
  it('should go to next round  when the round ends', () => {
    spyOn(component, 'setnextRound');
    component.usedWords = new Set([1,2]);
    component.words= ['word1', 'word2'];
    component.endRound();
    expect(component.setnextRound).toHaveBeenCalled();
  });
  
  it('should reset used words and increment the round after all words are used', () => {
    component.usedWords = new Set([0, 1, 2, 3]); // Simulate all words being used
    component.endRound();
    expect(component.usedWords.size).toBe(0);
    expect(wordsServiceSpy.setCurrentRound).toHaveBeenCalledWith(2);
  });
  
  it('should unsubscribe from the timer on ngOnDestroy', () => {
    spyOn(component.timerSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.timerSubscription.unsubscribe).toHaveBeenCalled();
  });
  
});
