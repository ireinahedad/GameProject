import { TestBed } from '@angular/core/testing';
import { WordsService } from './words.service';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

describe('WordsService', () => {
  let service: WordsService;
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(async () => {
    const storageSpyObj = jasmine.createSpyObj('Storage', ['create', 'get', 'set']);
    await TestBed.configureTestingModule({
      providers: [
        WordsService,
        { provide: Storage, useValue: storageSpyObj },
      ],
    }).compileComponents();

    service = TestBed.inject(WordsService);
    storageSpy = TestBed.inject(Storage) as jasmine.SpyObj<Storage>;

    storageSpy.create.and.returnValue(Promise.resolve(storageSpy));
    storageSpy.get.and.returnValue(Promise.resolve(null)); // Default no words saved
    storageSpy.set.and.returnValue(Promise.resolve());
     
  });

  it('should initialize the service and fetch words from storage', async () => {
    const savedWords = ['apple', 'banana', 'cherry'];
    storageSpy.get.and.returnValue(Promise.resolve(savedWords));

   await service.init();

    expect(storageSpy.get).toHaveBeenCalledWith('words');
    expect(service.get()).toEqual(savedWords);
  });

  it('should add a word and save it to storage', async () => {
    const newWord = 'dragonfruit';

    await service.addWord(newWord);

    expect(service.get()).toContain(newWord);
    expect(storageSpy.set).toHaveBeenCalledWith('words', jasmine.any(Array));
  });

  it('should remove a word and update storage', async () => {
    service['words'] = ['apple', 'banana', 'cherry']; // Set initial state

    await service.removeWord('banana');

    expect(service.get()).not.toContain('banana');
    expect(storageSpy.set).toHaveBeenCalledWith('words', ['apple', 'cherry']);
  });
  
  it('should remove all words and clear storage', () => {
    service['words'] = ['apple', 'banana', 'cherry'];

    service.removeAllWords();

    expect(service.get()).toEqual([]);
    expect(storageSpy.set).toHaveBeenCalledWith('words', []);
  });

  it('should set the number of words per person', () => {
    service.setNumberOfWords(5);

    expect(service.numberOfWordsPerPerson).toBe(5);
  });
  
  it('should set the number of teams', () => {
    service.setnumberOfTeams(3);

    expect(service.numberOfTeams).toBe(3);
  });

  it('should increment the current round and notify subscribers', () => {
    const currentRoundSpy = jasmine.createSpy('currentRoundSpy');
    service.currentRound$.subscribe(currentRoundSpy);

    service.setCurrentRound(1);

    expect(service.getCurrentRound()).toBe(1);
    expect(currentRoundSpy).toHaveBeenCalledWith(1);
  });
  
  it('should reset rounds to 0', () => {
    service['currentRound'] = 5; // Simulate an active round
    service.resetRounds();

    expect(service.getCurrentRound()).toBe(0);
  });

  it('should set the service to ready and start at round 1', () => {
    spyOn(service, 'setCurrentRound').and.callThrough();

    service.setReady();

    expect(service.setCurrentRound).toHaveBeenCalledWith(1);
    expect(service.getCurrentRound()).toBe(1);
  });
  
});
