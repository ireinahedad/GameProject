import { Component, OnInit } from '@angular/core';
import { PlayerService } from './../../services/player.service';
import { WordsService } from './../../services/words.service';
import { Player } from './../../interfaces/player-interface';

@Component({
  selector: 'app-words-boulette',
  templateUrl: './words-boulette.component.html',
  styleUrls: ['./words-boulette.component.scss', './../../app.component.scss'],
})
export class WordsBouletteComponent implements OnInit {
  words: string[] = [];
  players: Player[] = [];
  newWord: string = '';
  index: number = 0;
  currentPlayer: Player = {
    name: 'Default Player',
    points: 5000,
    team: 0,
    id: 0
  };

  constructor(private playerService: PlayerService, private wordService: WordsService) {
    
  }

  async ngOnInit() {
  await this.playerService.init();
  this.wordService.removeAllWords();
   this.words = this.wordService.get();
  
  console.log("this player 1", this.players)

  this.players = this.playerService.getPlayers() ;
  
  console.log("this player2", this.players)
  // Ensure there are players before accessing their data
  if (this.players.length > 0) {
    this.currentPlayer = this.players[0];
    
  } else {
    console.log("No players found after initialization--------------------------------------------");
    console.warn('No players found after initialization');
  }
}


  

addWord(): void {
    if (this.newWord.trim()) {
        this.wordService.addWord(this.newWord);
        this.words = this.wordService.get(); 
        this.newWord = ''; 
    }    
    this.index+=1;
    this.currentPlayer= this.players[(this.index)% this.players.length];
    this.getPlayerClass(this.currentPlayer.id);

    if (this.words.length === this.players.length * this.wordService.numberOfWordsPerPerson) {
        this.wordService.setReady(); 
    }
}


  removeWord(word: string): void {
    this.wordService.removeWord(word);
    this.words = this.wordService.get();
  }

  getPlayerClass(playerId: number): string {
    return this.players[playerId % this.players.length].name;
  }
}
