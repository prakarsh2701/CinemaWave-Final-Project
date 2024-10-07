import { Component, inject, signal } from '@angular/core';
import { MovieService } from '../../Services/movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthServiceService } from '../../Services/auth-service.service';
import { DesignUtilityService } from '../../Services/design-utility.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatDialogModule, MatCardModule, MatExpansionModule, NavbarComponent, NavbarComponent],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent {
  allMovies: any[] = [];
  searchQuery: any;
  movies: any[] = [];
  favMovies: any[] = [];
  moviesByGenre: any[] = [];
  selectedGenre:any = "All";
  genres = ['All', 'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History', 'Horror', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'];

  readonly panelOpenState = signal(false);
  readonly dialog = inject(MatDialog);
  openSnackBar(message: string, action: string) {
    this.du.openSnackBar(message, action)
  }


  constructor(private movieService: MovieService, private svc: AuthServiceService, private du: DesignUtilityService) { }
  email: string = this.svc.getEmail();

  ngOnInit(): void {
    const temp = this.svc.getToken();
    this.movieService.getMovies().subscribe(
      (movies) => {
        this.allMovies = movies;
        this.movies= movies;
        this.moviesByGenre = this.allMovies;
  
        if (temp !== null) {
          this.movieService.getFavMovies(this.email).subscribe(
            (favMovies) => {
              this.favMovies = favMovies || [];
              this.mapWithFavMovies(this.allMovies);
            },
            (error) => {
              //console.error('Error fetching favorite movies', error);
              this.openSnackBar("Failed to fetch favorite movies", "ok");
            }
          );
        } else {
          this.openSnackBar("Please Login to enjoy full features", "ok");
        }
  
      },
      (error) => {
        console.error('Error fetching movies', error);
        this.openSnackBar("Failed to fetch movies", "ok");
      }
    );
  }

  mapWithFavMovies(movies: any[]): void {
    this.movies = movies.map((movie: any) => ({
      ...movie,
      favourite: this.favMovies.some((favMovie: any) => favMovie.id === movie.movieId),
    }));
  }

  searchMovies(): void {
    if (this.searchQuery.trim()) {
      console.log(this.searchQuery);
      console.log(this.moviesByGenre);
      this.movieService.searchMovies(this.searchQuery).subscribe(
        (response: any) => {

          const searchResults = response.filter((searchedMovie: any) =>
          this.moviesByGenre.some((movie) => movie.title.toLowerCase() === searchedMovie.title.toLowerCase())
          );
          this.mapWithFavMovies(searchResults);
          this.movies = searchResults;
        },
        (error) => {
          if (error.status === 404) {
            // Handle the case where no movies are found
           // this.errorMessage = `No movies found for query: ${this.searchQuery}`;
           this.openSnackBar(`No movies found for query: ${this.searchQuery}`,"ok");
        } else if (error.status === 500) {
            // Handle server error
           this.openSnackBar('An error occurred while searching for movies. Please try again later.',"ok");
        } else {
            // Handle other errors
            this.openSnackBar('An unexpected error occurred. Please try again later.',"ok")
        }
        }
      );
    }
  }


  getMoviesByGenre(genre: string): void {
    this.selectedGenre = genre;
    if (genre === 'All') {
      this.moviesByGenre=this.allMovies;
      this.mapWithFavMovies(this.allMovies);
    } else {
      this.movieService.getMoviesByGenre(genre).subscribe(
        (response: any) => {
          this.moviesByGenre = response;
          this.mapWithFavMovies(response);
        },
        (error) => {
          console.error('Error fetching movies by genre', error);
        }
      );
    }
  }

  toggleFavorite(movie: any, event: Event): void {
    const temp = this.svc.getToken();

    if (temp == null) {
      this.openSnackBar("Login First!!!!", "ok");
    } else {
      event.stopPropagation();
  
      const favMovieDetails = {
        "favId": 0,
        "id": movie.movieId,
        "title": movie.title,
        "description": movie.description,
        "image": movie.image,
        "thumbnail": movie.thumbnail,
        "rating": movie.rating,
        "year": movie.year,
        "email": this.email,
        "big_image": movie.bigImage
      };

      console.log(favMovieDetails);
  
      if (!movie.favourite) { 
        this.movieService.addToFavMovie(favMovieDetails).subscribe(
          (response) => {
            //console.log('Movie added to favorites');
            movie.favourite = true; 
            this.openSnackBar("Added to Favourites", "ok");
          },
          (error) => {
            //console.error('Error adding movie to favorites', error);
            this.openSnackBar("Failed to add to Favourites", "ok"); 
          }
        );
      } else {
        this.movieService.removeFavMovie(movie.movieId, this.email).subscribe(
          () => {
            //console.log('Movie removed from favorites');
            movie.favourite = false; 
            this.openSnackBar("Removed from Favourites", "ok");
          },
          (error) => {
            //console.error('Error removing movie from favorites', error);
            this.openSnackBar("Failed to remove from Favourites", "ok");
          }
        );
      }
    }
  }
  
  

  openDialog(movie: any): void {

    if(this.email){
      const dialogRef = this.dialog.open(MovieDialogComponent, {
        data: movie,
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
    }
    
  }
}
