import { Component, OnInit, OnDestroy, EventEmitter, Output} from '@angular/core';
import { PlayerService } from './../../services/player.service';
import { WordsService } from './../../services/words.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss', './../../app.component.scss']
})
export class FirstRoundComponent implements OnInit, OnDestroy {
  words: string[] = [];
  usedWords: Set<number> = new Set(); // Track indices of used words
  currentWord: string = '';
  currentTeam: number = 1;
  currentRound: number = 1;
  showResult: boolean = false;
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
    this.showResults = true;
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
      this.showResults =true; 
    }
  }
    noShowResults(){
      this.endRound();
      
  this.showResults = false;
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

  addPointsToTeam(): void {
    const players = this.playerService.getPlayers().filter(player => player.team === this.currentTeam);
    players.forEach(player => {
      const newPoints = player.points + 2;
      this.playerService.updatePoints(player.name, newPoints);
    });
  }

  setnextRound(): void {
    this.wordsService.setCurrentRound(this.currentRound + 1);
  }

  endRound(): void {
    this.timerSubscription.unsubscribe();
    this.switchTeam();
    if (this.usedWords.size < this.words.length) {
      this.startRound();
    } else {
      this.usedWords.clear();
      this.setnextRound();
    }
  }

  calculateScores() {
    this.teamScores = this.playerService.calculateTeamScores(this.numberOfTeams);
  }


  switchTeam(): void {
    this.currentTeam = this.currentTeam % this.wordsService.numberOfTeams + 1;
  }
}
