import { Injectable } from '@angular/core';
import { Player } from './../interfaces/player-interface';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private players: Player[] = [];

  constructor(private storage: Storage) {
    this.init();  // Initialization should happen on service creation, no need to await here
  }

  // Initialize the storage and load players from it
  async init(): Promise<void> {
    await this.storage.create();
    const savedPlayers = await this.storage.get('players');
    if (savedPlayers) {
      this.players = savedPlayers;
    } else {
      // Default players if none are stored
      this.players = [
        { name: 'Player 1', points: 100, team: 1, id: 1 },
        { name: 'Player 2', points: 150, team: 2, id: 2 },
        { name: 'Player 3', points: 200, team: 1, id: 3 },
        { name: 'Player 4', points: 250, team: 2, id: 4 },
      ];
      await this.savePlayers();
    }
  }

  private async savePlayers() {
    await this.storage.set('players', this.players);
  }

  getPlayers(): Player[] {
    return this.players;
  }

  // Add a new player and save it to storage
  async addPlayer(player: Player): Promise<void> {
    this.players.push(player);
    await this.savePlayers();
  }

  // Remove a player by name and save the updated list
  async removePlayer(player_id: number): Promise<void> {
    this.players = this.players.filter(player => player.id !== player_id);
    await this.savePlayers();
  }

  // Update points for a player and save to storage
  async updatePoints(playername: string, points: number): Promise<void> {
    this.players = this.players.map(player => {
      if (player.name === playername) {
        player.points = points;
      }
      return player;
    });
    console.log("this player in uptade points player service", this.players)
    await this.savePlayers();
  }

  calculateTeamScores(numberOfTeams: number): { teamNumber: number; totalPoints: number }[] {
    const teamScores = Array.from({ length: numberOfTeams }, (_, i) => ({
      teamNumber: i + 1,
      totalPoints: 0,
    }));

    this.players.forEach(player => {
      if (player.team >= 1 && player.team <= numberOfTeams) {
        teamScores[player.team - 1].totalPoints += player.points;
      }
    });

    return teamScores;
  }

  // Assign a team to a player and save to storage
  async assignTeam(playername: string, team: any): Promise<void> {
    this.players = this.players.map(player => {
      if (player.name === playername) {
        player.team = Number(team);  // Ensure team is a number
      }
      return player;
    });
    await this.savePlayers();
  }

  // Reset all players to default points and save to storage
  async resetPoints(): Promise<void> {
    this.players = this.players.map(player => {
      player.points = 0;
      return player;
    });
    await this.savePlayers();
  }
}

