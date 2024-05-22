import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatsComponent } from './components/stats/stats.component';
import { HomeComponent } from './components/home/home.component';

export enum RoutePath {
  HOME = 'home',
  STATS = 'stats',
}

const routes: Routes = [
  { path: '', redirectTo: RoutePath.HOME, pathMatch: 'full' },
  {
    path: RoutePath.HOME,
    component: HomeComponent,
  },
  { path: RoutePath.STATS, component: StatsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
