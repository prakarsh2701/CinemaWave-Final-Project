import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { FavouriteService } from '../../Services/favourite.service';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthServiceService } from '../../Services/auth-service.service';
import { DesignUtilityService } from '../../Services/design-utility.service';


@Component({
  selector: 'app-fav-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatIconButton, NavbarComponent,NavbarComponent],
  templateUrl: './fav-list.component.html',
  styleUrl: './fav-list.component.css'
})
export class FavListComponent {
  Movie: any[] = [];
  constructor(private svc :FavouriteService  , private router : Router,private sc: AuthServiceService,private du: DesignUtilityService) {}

  email:string = this.sc.getEmail();
  openSnackBar(message: string, action: string) {
    this.du.openSnackBar(message,action)
  }
ngOnInit(){
  
      this.svc.getMoviebyEmail(this.email).subscribe({
        next: (response) => {
          console.log(response);
          this.Movie=response;
        },
          error: (err) => {
            console.log("error in getting movies");
          },
        });
    
  }

  deletePackage(id: string) {
  // Static email used for now
    this.svc. deletePackage(id, this.email).subscribe(
      (response: any) => {
        console.log('Movie deleted:', response);
        // Remove the deleted movie from the Movie array without reloading
        this.Movie = this.Movie.filter(movie => movie.id !== id);
        this.openSnackBar("Removed from favourites","ok");
      },
      (error: Error) => {
        console.error('Error in Deleting movie:', error);
      });
  }
}
