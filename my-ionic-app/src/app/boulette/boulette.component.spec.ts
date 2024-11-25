import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { BouletteComponent } from './boulette.component';
import { PlayerService } from './../services/player.service';
import { Player } from './../interfaces/player-interface';
import { WordsService } from './../services/words.service';
import{ FormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';

describe('BouletteComponent', () => {
  let component: BouletteComponent;
  let fixture: ComponentFixture<BouletteComponent>;
  let playerServiceSpy: jasmine.SpyObj<PlayerService>;
  let wordServiceSpy: jasmine.SpyObj<WordsService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  const mockplayers: Player[]= [
      { name: 'Player 1', points: 100, team: 1, id: 1 },
      { name: 'Player 2', points: 150, team: 2, id: 2 },
      { name: 'Player 3', points: 200, team: 1, id: 3 },
      { name: 'Player 4', points: 250, team: 2, id: 4 }
    ];

  beforeEach(async () => {
    const playerServiceMock = jasmine.createSpyObj('PlayerService', ['init', 'getPlayers', 'assignTeam', 'resetPoints', 'calculateTeamScores']);
    const wordServiceMock = jasmine.createSpyObj('WordsService', ['currentRound$', 'getCurrentRound', 'setNumberOfWords', 'setnumberOfTeams', 'resetRounds']);
    const modalControllerMock = jasmine.createSpyObj('ModalController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [BouletteComponent],
      imports: [IonicModule.forRoot(), FormsModule],

      providers: [
        { provide: PlayerService, useValue: playerServiceMock },
        { provide: WordsService, useValue: wordServiceMock },
        { provide: ModalController, useValue: modalControllerMock },
      ],
    }).compileComponents();

    playerServiceSpy = TestBed.inject(PlayerService) as jasmine.SpyObj<PlayerService>;
    wordServiceSpy = TestBed.inject(WordsService) as jasmine.SpyObj<WordsService>;
    modalControllerSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;

    fixture = TestBed.createComponent(BouletteComponent);
    component = fixture.componentInstance;

    // Mock observables
    wordServiceSpy.currentRound$ = new Subject<number>();
    wordServiceSpy.getCurrentRound.and.returnValue(0);
    playerServiceSpy.getPlayers.and.returnValue([mockplayers[0], mockplayers[0]]);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize players and reset the game on ngOnInit', async () => {
    playerServiceSpy.init.and.resolveTo();
    await component.ngOnInit();
    expect(playerServiceSpy.init).toHaveBeenCalled();
    expect(component.players.length).toBeGreaterThan(0);
    expect(component.currentStage).toBe('round0-intro');
  });

  it('should toggle the explanation modal', () => {
    component.showExplanation = false;
    component.openModal();
    expect(component.showExplanation).toBeTrue();
  });

  it('should unsubscribe from roundSubscription on ngOnDestroy', () => {
    const unsubscribeSpy = spyOn(component.roundSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should assign a team to a player', () => {
    const player = mockplayers[0];
    component.assignTeam(player, 1);
    expect(player.team).toBe(1);
    expect(playerServiceSpy.assignTeam).toHaveBeenCalledWith(player, 1);
  });

  it('should validate team assignment correctly', () => {
    component.players = [mockplayers[0], mockplayers[1]
    ];
    expect(component.validateTeamAssignment()).toBeFalse();
    expect(component.errorMessage).toBe('Each team must have at least 2 players.');

    component.players = mockplayers
    expect(component.validateTeamAssignment()).toBeTrue();
    expect(component.errorMessage).toBe('');
  });

  it('should update the current stage on refreshRoundComponent', () => {
    wordServiceSpy.getCurrentRound.and.returnValue(1);
    component.refreshRoundComponent();
    expect(component.currentRound).toBe(1);
    expect(component.currentStage).toBe('round1-intro');
  });

  it('should reset the game state', () => {
    component.resetGame();
    expect(wordServiceSpy.resetRounds).toHaveBeenCalled();
    expect(playerServiceSpy.resetPoints).toHaveBeenCalled();
    expect(component.currentStage).toBe('round0-intro');
  });

  it('should start a round and set the correct stage', () => {
    wordServiceSpy.getCurrentRound.and.returnValue(1);
    component.startRound();
    expect(component.gotIt).toBeTrue();
    expect(component.currentStage).toBe('round1-play');
  });
});
