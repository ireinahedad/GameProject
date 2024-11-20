import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../services/player.service';
import { Player } from '../interfaces/player-interface';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss', './../app.component.scss'],
})
export class PlayerComponent implements OnInit {
  newPlayer: Player = { id: 0, name: '', points: 0, team: 0 };
  players: Player[] = [];
  numberOfTeams: number = 4; // Example: Adjust dynamically if needed
  errorMessage: string = ''; // For validation feedback

  constructor(private playerService: PlayerService) {}

  async ngOnInit() {
    await this.playerService.init();
    this.loadPlayers();
  }

  async loadPlayers() {
    this.players = this.playerService.getPlayers();
  }

  validateName(name: string): boolean {
    if (name.trim().length < 3) {
      this.errorMessage = 'Player name must be at least 3 characters long.';
      return false;
    }
    return true;
  }

  validateTeam(team: number): boolean {
    if (team < 1 || team > this.numberOfTeams) {
      this.errorMessage = `Team number must be between 1 and ${this.numberOfTeams}.`;
      return false;
    }
    return true;
  }

  async savePlayer(player: Player) {
    const highestId = this.players.reduce(
      (maxId, p) => Math.max(maxId, p.id),
      0
    );
    player.id = highestId + 1;
    await this.playerService.addPlayer(player);
  }

  resetNewPlayer() {
    this.newPlayer = { id: 0, name: '', points: 0, team: 1 };
    this.errorMessage = '';
  }

  async addPlayer() {
    const isNameValid = this.validateName(this.newPlayer.name);
    const isTeamValid = this.validateTeam(this.newPlayer.team);

    if (isNameValid && isTeamValid) {
      await this.savePlayer(this.newPlayer);
      this.resetNewPlayer();
      await this.loadPlayers();
    }
  }

  selectTeam(team: number) {
  this.newPlayer.team = team;
  this.errorMessage = ''; // Clear any previous error
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

  async removePlayer(player: Player) {
    await this.playerService.removePlayer(player.id);
    await this.loadPlayers();
  }
}
