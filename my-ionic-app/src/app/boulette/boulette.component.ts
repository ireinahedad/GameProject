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
      console.log('Round changed to:', this.currentStage);
      console.log('players are:', this.players);
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
    const currentRound = this.wordService.getCurrentRound();
    this.currentStage = `round${currentRound}-intro`;
    this.gotIt = false;
    this.calculateScores();
  }

  startRound() {
    this.gotIt = true;  // Set "GOT IT" to true when the user clicks it
    const currentRound = this.wordService.getCurrentRound();
    this.currentStage = `round${currentRound}-play`;  // Move to the play stage
  }
  

  calculateScores() {
    this.teamScores = this.playerService.calculateTeamScores(this.numberOfTeams);
  }



  resetGame(): void {
    this.wordService.resetRounds();
    this.gotIt = false;
    this.refreshRoundComponent();
  }
}
