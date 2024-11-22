import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';

import { VoltageTableComponent } from './voltage-table/voltage-table.component';
import { BouletteComponent } from './boulette/boulette.component';
import { WordsBouletteComponent } from './boulette/words-boulette/words-boulette.component';
import { FirstRoundComponent } from './boulette/round/round.component';
import { PlayerComponent } from './player/player.component';
import {ExplanationComponent } from './boulette/explanation/explanation.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [AppComponent, VoltageTableComponent, BouletteComponent, WordsBouletteComponent, PlayerComponent, FirstRoundComponent, ExplanationComponent],
  imports: [BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule, FormsModule, CommonModule],
  providers: [ { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class AppModule {}
