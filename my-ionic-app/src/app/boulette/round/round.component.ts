import { Component, OnInit, OnDestroy, EventEmitter, Output} from '@angular/core';
import { PlayerService } from './../../services/player.service';
import { WordsService } from './../../services/words.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss', './../../app.component.scss']
})
export class RoundComponent implements OnInit, OnDestroy {
  words: string[] = [];
  usedWords: Set<number> = new Set(); // Track indices of used words
  currentWord: string = '';
  currentTeam: number = 1;
  currentRound: number = 1;
  timeLeft: number = 60;
  teamScores: { teamNumber: number; totalPoints: number }[] = [];
  timerSubscription!: Subscription;

  guessedWords: string[] = []; // Words guessed correctly
  missedWords: string[] = []; // Words passed or missed

  @Output() roundEnded = new EventEmitter<void>();

  constructor(
    private wordsService: WordsService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.words = this.wordsService.get(); // Load all words once
    this.startRound();
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  startRound(): void {

    this.timeLeft = this.wordsService.NumberOfWordsPerPerson * 15;
    this.guessedWords = [];
    this.missedWords = [];
    this.loadNextWord();
    this.startTimer();
  }

  startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.endRound();
      }
    });
  }

  loadNextWord(): void {
    if (this.usedWords.size < this.words.length) {
      let index: number;
      do {
        index = Math.floor(Math.random() * this.words.length);
      } while (this.usedWords.has(index));

      this.currentWord = this.words[index];
      this.usedWords.add(index);
    } else {
      this.currentWord = 'All words used this round';
      this.endRound();
      //this.showResults =true; 
    }
  }
   

  gotWord(): void {
    this.guessedWords.push(this.currentWord); // Add to guessed words
    this.addPointsToTeam();
    this.loadNextWord();
  }

  passWord(): void {
    this.missedWords.push(this.currentWord); // Add to missed words
    this.loadNextWord();
  }

  async addPointsToTeam(): Promise<void> {
  const players = await this.playerService.getPlayers().filter(player => player.team === this.currentTeam);
  for (const player of players) {
    const newPoints = player.points + 2;
    await this.playerService.updatePoints(player.name, newPoints);
  }
}


  setnextRound(): void {
    this.wordsService.setCurrentRound(this.currentRound + 1);
  }

  endRound(): void {
    this.timerSubscription.unsubscribe();
    if (this.usedWords.size < this.words.length) {
      this.startRound();
      this.switchTeam();
    } else {
      this.usedWords.clear();
      this.setnextRound();
    }
  }


  switchTeam(): void {
    this.currentTeam = this.currentTeam % this.wordsService.numberOfTeams + 1;

  }
}
