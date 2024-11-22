import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { VoltageTableComponent } from './voltage-table/voltage-table.component';
import { BouletteComponent } from './boulette/boulette.component';
import { PlayerComponent } from './player/player.component' 
import { HomePage } from './home/home.page'; // Import the component

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'voltage-table',
    component: VoltageTableComponent,
  },
  {
    path: 'boulette',
    component: BouletteComponent,
  },
  

  {
    path:'player',
    component:PlayerComponent,
    }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
