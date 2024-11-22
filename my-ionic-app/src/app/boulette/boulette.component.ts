import { Component, OnInit, OnDestroy } from '@angular/core';
import { Player } from './../interfaces/player-interface';
import { PlayerService } from './../services/player.service';
import { WordsService } from './../services/words.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-boulette',
  templateUrl: './boulette.component.html',
  styleUrls: ['./boulette.component.scss', './../app.component.scss'],
})
export class BouletteComponent implements OnInit, OnDestroy {
  players: Player[] = [];
  words: string[] = [];
  numberOfTeams = 2;
  numberOfWords = 4;
  teamScores: { teamNumber: number; totalPoints: number }[] = [];
  currentStage: string = 'round0-intro';
  currentRound: number = 0;
  gotIt: boolean = false
  roundSubscription!: Subscription;

  constructor(
    private playerService: PlayerService,
    private wordService: WordsService
  ) {
  }

   async ngOnInit() {
    // Ensure the players are loaded before proceeding
    await this.playerService.init(); // Wait for initialization
    this.players = this.playerService.getPlayers();  // Now the players array should have data

    this.resetGame();
    this.roundSubscription = this.wordService.currentRound$.subscribe((round) => {
      this.refreshRoundComponent();
    });
  }

  ngOnDestroy() {
    // Unsubscribe from the observable to prevent memory leaks
    if (this.roundSubscription) {
      this.roundSubscription.unsubscribe();
    }
  }

  assignTeam(player: Player, team: number): void {
    player.team = team;
    this.playerService.assignTeam(player.name, team);
  }

  chooseWords(): void {
    this.wordService.setNumberOfWords(this.numberOfWords);
    this.wordService.setnumberOfTeams(this.numberOfTeams);
    this.currentStage = 'words';
  }

  refreshRoundComponent() {
    this.currentRound = this.wordService.getCurrentRound();
    this.calculateScores();
    if (this.currentRound > 1) {
      this.currentStage = 'result';
      return;
    }
    this.currentStage = `round${this.currentRound}-intro`;
  }

  toggleResultStage() {
    this.currentStage = `round${this.currentRound}-intro`;
    this.gotIt = false;
  }

  startRound() {
    this.gotIt = true;
    const currentRound = this.wordService.getCurrentRound();
    this.currentStage = `round${currentRound}-play`; 
  }
  

calculateScores() {
  const updatedPlayers = this.playerService.getPlayers();
  this.teamScores = this.playerService.calculateTeamScores(this.numberOfTeams);
}

  resetGame(): void {
    this.wordService.resetRounds();
    this.gotIt = false;
    this.refreshRoundComponent();
    this.playerService.resetPoints();
  }
}
