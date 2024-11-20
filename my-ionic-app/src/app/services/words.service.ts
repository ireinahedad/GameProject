import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Player } from './../interfaces/player-interface';

@Injectable({
  providedIn: 'root'
})
export class WordsService {
  private words: string[] = [];
  NumberOfWordsPerPerson= 4;
  numberOfTeams = 2;
  currentRound = 0;
   private currentRoundSubject = new BehaviorSubject<number>(this.currentRound);
  currentRound$ = this.currentRoundSubject.asObservable();
  

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const savedWords = await this.storage.get('words');
    if (savedWords) {
      this.words = savedWords;
    }
  }

  get(): string[] {
    return this.words;
  }

  async addWord(word: string): Promise<void> {
    this.words.push(word);
    await this.saveWords(); // Save to Ionic Storage
  }

  async removeWord(word: string): Promise<void> {
    this.words = this.words.filter(w => w !== word);
    await this.saveWords(); // Update Ionic Storage
  }

  removeAllWords(): void {
    this.words = [];
    this.saveWords();
  }

  setNumberOfWords(numberOfWords: number): void {
    this.NumberOfWordsPerPerson = numberOfWords;
  }
  setnumberOfTeams(numberOfTeams: number): void{
    this.numberOfTeams = this.numberOfTeams;
  }

  setReady(): void {
    this.setCurrentRound(1);
  }

  setCurrentRound(round: number) {
    this.currentRound +=1;
    this.currentRoundSubject.next(this.currentRound);
    console.log('current round service', this.currentRound)
  }

  getCurrentRound(): number {
    return this.currentRound;
  }
  resetRounds(): void{
    this.currentRound=0;
  }

  private async saveWords(): Promise<void> {
    await this.storage.set('words', this.words);
  }
}
