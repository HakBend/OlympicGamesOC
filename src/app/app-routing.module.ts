import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CountryComponent } from './pages/country/country.component';

const routes: Routes = [
  { path: '',component: HomeComponent },
  { path: 'country/:countryName', component: CountryComponent },
  { path: '**', component: NotFoundComponent }// gestion de l'erreur de saisie
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
