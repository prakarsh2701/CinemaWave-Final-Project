import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegistrationComponent } from './Components/registration/registration.component';
import { HomeComponent } from './Components/home/home.component';
import { FavListComponent } from './Components/fav-list/fav-list.component';
import { MovieListComponent } from './Components/movie-list/movie-list.component';
import { authGuard } from './Guards/auth.guard';
export const routes: Routes = [
    { path: '', redirectTo:'home', pathMatch:'full'},
    { path: 'login', component:LoginComponent},
    { path: 'signup', component:RegistrationComponent},
    { path: 'landingpage', component:HomeComponent},
    { path: 'favourites', component:FavListComponent,canActivate:[authGuard]},
    { path: 'home', component:MovieListComponent},
];
